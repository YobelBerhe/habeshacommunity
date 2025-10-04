import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import MobileHeader from "@/components/layout/MobileHeader";
import Header from "@/components/Header";
import ListingGrid from "@/components/ListingGrid";
import InteractiveListingMap from "@/components/InteractiveListingMap";
import GlobalMap from "@/components/GlobalMap";
import StickyPostCTA from "@/components/StickyPostCTA";
import Footer from "@/components/Footer";
import CitySearchBar from "@/components/CitySearchBar";
import LanguageToggle from "@/components/LanguageToggle";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { setParams, getParam } from "@/lib/url";
import { TAXONOMY, CategoryKey, LABELS } from "@/lib/taxonomy";
import { t, Lang } from "@/lib/i18n";
import { useLanguage } from "@/store/language";
import type { Listing, SearchFilters, AppState } from "@/types";
import { getAppState, saveAppState } from "@/utils/storage";
import { fetchListings } from "@/repo/listings";
import { supabase } from "@/integrations/supabase/client";
import { fetchListingsWithContacts } from "@/repo/listingsWithContacts";
import { useAuth } from '@/store/auth';
import { getContactValue, hasContactAccess } from "@/utils/contactHelpers";
import { Grid3X3, Map, ChevronDown, MessageCircle, Plus, Heart } from "lucide-react";
import { toast } from "sonner";
import AuthModal from "@/components/AuthModal";
import PostModal from "@/components/PostModal";
import ViewToggle from "@/components/ViewToggle";
import ThemeToggle from "@/components/ThemeToggle";
import NotifyBell from "@/components/NotifyBell";
import AuthButtons from "@/components/AuthButtons";
import SortDropdown from "@/components/SortDropdown";
import MentorFilters from "@/components/search/MentorFilters";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { ViewMode, SortKey } from "@/components/ViewToggle";
import { sortListings, applyQuickFilters } from "@/utils/ui";


export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, openAuth, openPost } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [appState, setAppState] = useState<AppState>(() => getAppState());
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  
  // View and sorting state with localStorage persistence
  // Donation dialog state
  const [donateDialogOpen, setDonateDialogOpen] = useState(false);
  const [donateAmount, setDonateAmount] = useState<number>(500); // $5
  const [customAmount, setCustomAmount] = useState<string>("");
  const [donateEmail, setDonateEmail] = useState<string>("");
  const [donateLoading, setDonateLoading] = useState(false);
  
  const [viewMode, setViewMode] = useState<ViewMode>(() =>
    (localStorage.getItem('hn.viewMode') as ViewMode) || 'list'
  );
  
  const [sortKey, setSortKey] = useState<SortKey>(() =>
    (localStorage.getItem('hn.sort') as SortKey) || 'relevance'
  );
  
  // Quick filters state
  const [hasImageFilter, setHasImageFilter] = useState(() =>
    localStorage.getItem('hn.filter.hasImage') === 'true'
  );
  
  const [postedTodayFilter, setPostedTodayFilter] = useState(() =>
    localStorage.getItem('hn.filter.postedToday') === 'true'
  );

  // Mentor-specific filters
  const [mentorVerifiedOnly, setMentorVerifiedOnly] = useState(() =>
    localStorage.getItem('hn.mentor.verifiedOnly') === 'true'
  );
  const [mentorMinRating, setMentorMinRating] = useState(() =>
    localStorage.getItem('hn.mentor.minRating') || '0'
  );
  const [mentorSortBy, setMentorSortBy] = useState(() =>
    localStorage.getItem('hn.mentor.sortBy') || 'verified'
  );

  // Initialize filters from URL params (don't pre-select cities)
  const [filters, setFilters] = useState<SearchFilters>(() => ({
    city: searchParams.get("city") || undefined,
    category: searchParams.get("category") || undefined,
    subcategory: getParam(searchParams, "sub"),
    query: searchParams.get("q") || "",
    minPrice: searchParams.get("min") ? Number(searchParams.get("min")) : undefined,
    maxPrice: searchParams.get("max") ? Number(searchParams.get("max")) : undefined,
    jobKind: undefined as "regular"|"gig"|undefined,
  }));

  // Persist view and filter states
  useEffect(() => localStorage.setItem('hn.viewMode', viewMode), [viewMode]);
  useEffect(() => localStorage.setItem('hn.sort', sortKey), [sortKey]);
  useEffect(() => localStorage.setItem('hn.filter.hasImage', hasImageFilter.toString()), [hasImageFilter]);
  useEffect(() => localStorage.setItem('hn.filter.postedToday', postedTodayFilter.toString()), [postedTodayFilter]);
  useEffect(() => localStorage.setItem('hn.mentor.verifiedOnly', mentorVerifiedOnly.toString()), [mentorVerifiedOnly]);
  useEffect(() => localStorage.setItem('hn.mentor.minRating', mentorMinRating), [mentorMinRating]);
  useEffect(() => localStorage.setItem('hn.mentor.sortBy', mentorSortBy), [mentorSortBy]);

  // Update URL when filters change
  useEffect(() => {
    const params = setParams(new URLSearchParams(), {
      city: filters.city,
      category: filters.category,
      sub: filters.subcategory,
      q: filters.query,
      min: filters.minPrice?.toString(),
      max: filters.maxPrice?.toString(),
    });
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  // Update app state when city changes
  useEffect(() => {
    if (filters.city && filters.city !== appState.city) {
      const next = { ...appState, city: filters.city };
      setAppState(next);
      saveAppState(next);
    }
  }, [filters.city, appState]);

  // Load data when filters change
  useEffect(() => {
    const loadListings = async () => {
      setLoading(true);
      console.log('🔍 Fetching listings with filters:', filters);
      try {
        // Handle mentor category specially
        if (filters.category === 'mentor') {
          let query = supabase
            .from('mentors')
            .select(`
              *,
              mentor_skills(skill)
            `);

          // Apply filters
          if (mentorVerifiedOnly) {
            query = query.eq('is_verified', true);
          }

          if (parseFloat(mentorMinRating) > 0) {
            query = query.gte('rating_avg', parseFloat(mentorMinRating));
          }

          // Apply subcategory filter (topics)
          if (filters.subcategory) {
            query = query.contains('topics', [filters.subcategory]);
          }

          // Apply sorting
          switch (mentorSortBy) {
            case 'rating':
              query = query.order('rating_avg', { ascending: false, nullsFirst: false });
              break;
            case 'newest':
              query = query.order('created_at', { ascending: false });
              break;
            case 'price_low':
              query = query.order('price_cents', { ascending: true, nullsFirst: false });
              break;
            case 'price_high':
              query = query.order('price_cents', { ascending: false, nullsFirst: false });
              break;
            case 'verified':
            default:
              query = query
                .order('is_verified', { ascending: false })
                .order('rating_avg', { ascending: false, nullsFirst: false })
                .order('created_at', { ascending: false });
              break;
          }

          const { data, error } = await query;
            
          if (error) throw error;

          // Filter by search query (including skills)
          let filteredData = data;
          if (filters.query) {
            const lowerQ = filters.query.toLowerCase();
            filteredData = data?.filter((mentor: any) => {
              const skills = mentor.mentor_skills?.map((s: any) => s.skill.toLowerCase()) || [];
              return (
                mentor.display_name?.toLowerCase().includes(lowerQ) ||
                mentor.bio?.toLowerCase().includes(lowerQ) ||
                mentor.topics?.some((t: string) => t.toLowerCase().includes(lowerQ)) ||
                skills.some((s: string) => s.includes(lowerQ))
              );
            });
          }
          
          // Convert mentor data to listing format
          const mentorListings = (filteredData || []).map(mentor => ({
            id: mentor.id,
            user_id: mentor.user_id,
            city: mentor.city,
            country: mentor.country,
            category: 'mentor',
            subcategory: 'mentor',
            title: mentor.display_name,
            description: mentor.bio || "",
            price: mentor.price_cents ? mentor.price_cents / 100 : null,
            currency: mentor.currency,
            contact_phone: null,
            contact_whatsapp: null,
            contact_telegram: null,
            contact_email: null,
            website_url: mentor.website_url,
            tags: mentor.topics || [],
            images: mentor.photos || [],
            lat: null,
            lng: null,
            created_at: mentor.created_at,
            // Legacy compatibility
            contact: { phone: "" },
            photos: mentor.photos || [],
            lon: undefined,
            createdAt: new Date(mentor.created_at).getTime(),
            updatedAt: new Date(mentor.created_at).getTime(),
            hasImage: !!(mentor.photos?.length),
          }));
          
          console.log('✅ Processed mentor listings:', mentorListings.length);
          setListings(mentorListings);
        } else if (filters.category === 'match') {
          const { data, error } = await supabase
            .from('match_profiles')
            .select('*')
            .order('created_at', { ascending: false });
            
          if (error) throw error;
          
          // Convert match profile data to listing format
          const matchListings = (data || []).map(profile => ({
            id: profile.user_id, // Use user_id as the listing ID for match profiles
            user_id: profile.user_id,
            city: profile.city,
            country: profile.country,
            category: 'match',
            subcategory: 'networking',
            title: profile.display_name || 'Anonymous',
            description: profile.bio || "",
            price: null,
            currency: 'USD',
            contact_phone: null,
            contact_whatsapp: null,
            contact_telegram: null,
            contact_email: null,
            website_url: null,
            tags: profile.seeking ? [profile.seeking] : [],
            images: profile.photos || [],
            lat: null,
            lng: null,
            created_at: profile.created_at,
            // Legacy compatibility
            contact: { phone: "" },
            photos: profile.photos || [],
            lon: undefined,
            createdAt: new Date(profile.created_at).getTime(),
            updatedAt: new Date(profile.created_at).getTime(),
            hasImage: !!(profile.photos?.length),
          }));
          
          console.log('✅ Processed match listings:', matchListings.length);
          setListings(matchListings);
        } else {
          // Use contact-aware fetch if user is authenticated, otherwise regular fetch
          const data = user 
            ? await fetchListingsWithContacts({
                city: filters.city,
                category: filters.category,
                q: filters.query,
                minPrice: filters.minPrice,
                maxPrice: filters.maxPrice,
                subcategory: filters.subcategory,
              })
            : await fetchListings({
                city: filters.city,
                category: filters.category,
                q: filters.query,
                minPrice: filters.minPrice,
                maxPrice: filters.maxPrice,
                subcategory: filters.subcategory,
              });
              
          console.log('📦 Raw data from database:', data.length, 'listings');
          console.log('🏙️ Requested city:', filters.city);
          
          const processedListings = data.map(row => ({
            id: row.id,
            user_id: row.user_id || "",
            city: row.city,
            country: row.country,
            category: row.category as string,
            subcategory: row.subcategory,
            title: row.title,
            description: row.description || "",
            price: row.price_cents ? row.price_cents / 100 : null,
            currency: row.currency,
            contact_phone: hasContactAccess(user, row) ? getContactValue(row.contact, 'phone') : null,
            contact_whatsapp: hasContactAccess(user, row) ? getContactValue(row.contact, 'whatsapp') : null,
            contact_telegram: hasContactAccess(user, row) ? getContactValue(row.contact, 'telegram') : null,
            contact_email: hasContactAccess(user, row) ? getContactValue(row.contact, 'email') : null,
            website_url: row.website_url,
            tags: row.tags || [],
            images: row.images || [],
            lat: row.location_lat,
            lng: row.location_lng,
            created_at: row.created_at,
            // Legacy compatibility
            contact: { phone: hasContactAccess(user, row) ? (row.contact.contact_value || "") : "" },
            photos: row.images || [],
            lon: row.location_lng || undefined,
            createdAt: new Date(row.created_at).getTime(),
            updatedAt: new Date(row.updated_at).getTime(),
            hasImage: !!(row.images?.length),
          }));
          
          console.log('✅ Processed listings:', processedListings.length);
          setListings(processedListings);
        }
      } catch (error) {
        console.error("Failed to load listings:", error);
        toast("Failed to load listings");
      } finally {
        setLoading(false);
      }
    };

    loadListings();
  }, [filters.city, filters.category, filters.query, filters.minPrice, filters.maxPrice, filters.subcategory, user, mentorVerifiedOnly, mentorMinRating, mentorSortBy]);

  // Filter and sort listings
  const processedListings = useMemo(() => {
    let filtered = [...listings];

    if (filters.category) {
      filtered = filtered.filter(listing => listing.category === filters.category);
    }

    if (filters.subcategory) {
      filtered = filtered.filter(listing => listing.subcategory === filters.subcategory);
    }

    if (filters.query) {
      const q = filters.query.toLowerCase();
      filtered = filtered.filter(listing =>
        listing.title.toLowerCase().includes(q) ||
        listing.description.toLowerCase().includes(q) ||
        listing.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }

    if (filters.category === "housing") {
      if (filters.minPrice != null) filtered = filtered.filter(l => l.price != null && (l.price as number) >= filters.minPrice!);
      if (filters.maxPrice != null) filtered = filtered.filter(l => l.price != null && (l.price as number) <= filters.maxPrice!);
    }

    if (filters.category === "jobs" && filters.jobKind) {
      filtered = filtered.filter(l => (l as any).jobKind === filters.jobKind);
    }

    // Apply quick filters
    filtered = applyQuickFilters(filtered, { 
      hasImage: hasImageFilter || sortKey === "has_image", 
      postedToday: postedTodayFilter 
    });

    // Apply sorting
    return sortListings(filtered, sortKey);
  }, [listings, filters, hasImageFilter, postedTodayFilter, sortKey]);

  const [cityCoords, setCityCoords] = useState<{ lat: number; lng: number } | undefined>();

  const handleCityChange = (city: string, lat?: number, lon?: number) => {
    setFilters({ ...filters, city });
    if (lat && lon) {
      setCityCoords({ lat, lng: lon });
    } else {
      setCityCoords(undefined);
    }
  };

  const handleFiltersChange = (newFilters: SearchFilters) => {
    // Clear subcategory if it doesn't belong to the new category
    if (newFilters.category !== filters.category && newFilters.subcategory) {
      const categorySubcategories = TAXONOMY[newFilters.category as CategoryKey]?.sub || [];
      if (!categorySubcategories.includes(newFilters.subcategory)) {
        newFilters.subcategory = undefined;
      }
    }
    setFilters(newFilters);
  };

  const handleClearAll = () => {
    setFilters({
      city: undefined,
      category: undefined,
      subcategory: undefined,
      query: "",
      minPrice: undefined,
      maxPrice: undefined,
      jobKind: undefined,
    });
    // Also clear app state city
    const next = { ...appState, city: undefined };
    setAppState(next);
    saveAppState(next);
  };

  const handleListingSelect = (listing: Listing) => {
    // Handle different categories with their specific routes
    if (listing.category === 'mentor') {
      navigate(`/mentor/${listing.id}`);
    } else if (listing.category === 'match') {
      navigate(`/match/profile/${listing.id}`);
    } else {
      navigate(`/l/${listing.id}`);
    }
  };

  // Donation handlers
  const DONATE_PRESETS = [500, 1000, 2000]; // $5, $10, $20
  
  const donateDisplayAmount = useMemo(() => {
    const v = customAmount.trim();
    if (!v) return donateAmount;
    const n = Math.round(parseFloat(v) * 100);
    if (Number.isFinite(n)) return n;
    return donateAmount;
  }, [customAmount, donateAmount]);

  const isValidDonateAmount = donateDisplayAmount >= 200 && donateDisplayAmount <= 50000;
  const donateAmountError = customAmount.trim() && !isValidDonateAmount 
    ? donateDisplayAmount < 200 
      ? "Minimum donation is $2" 
      : "Maximum donation is $500"
    : "";

  const startDonationCheckout = async () => {
    try {
      setDonateLoading(true);
      const { data, error } = await supabase.functions.invoke('create-donation', {
        body: { amount: donateDisplayAmount, email: donateEmail }
      });

      if (error) throw error;

      if (data?.url) {
        try {
          if (window.top && window.top !== window.self) {
            (window.top as Window).location.href = data.url;
          } else {
            window.location.href = data.url;
          }
        } catch {
          window.open(data.url, "_blank", "noopener,noreferrer");
        }
      } else {
        toast.error("Unable to start checkout");
      }
    } catch (err) {
      console.error('Donation error:', err);
      toast.error("Network error. Please try again.");
    } finally {
      setDonateLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop View - Reorganized Layout */}
      <div className="hidden md:block">
        {/* Top Bar with Search and Controls */}
        <div className="border-b bg-background/70 backdrop-blur">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              {/* Left: Logo and City Search */}
              <div className="flex items-center gap-4">
                <button 
                  className="flex items-center gap-2 font-bold hover:opacity-80 transition-opacity cursor-pointer"
                  onClick={() => navigate('/')}
                  title="Go to Homepage"
                >
                  <img 
                    src="/lovable-uploads/d2261896-ec85-45d6-8ecf-9928fb132004.png" 
                    alt="HabeshaCommunity Logo" 
                    className="w-8 h-8 rounded-lg"
                  />
                  <span className="hover:text-primary transition-colors">HabeshaCommunity</span>
                </button>
                
                <CitySearchBar 
                  value={filters.city}
                  onCitySelect={handleCityChange}
                  placeholder="Enter city or location"
                  className="w-80"
                />
              </div>

              {/* Right: Controls */}
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <LanguageToggle value={language} onChange={setLanguage} />
                <NotifyBell />
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2"
                  onClick={() => navigate('/chat')}
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat
                </Button>
                <Button
                  size="sm"
                  className="gap-2"
                  onClick={openPost}
                >
                  <Plus className="w-4 h-4" />
                  Post
                </Button>
                <AuthButtons />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Line */}
        <div className="bg-background border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-4">
              {/* Left: All Navigation Items */}
              <div className="flex space-x-6">
                <button 
                  className={`pb-1 border-b-2 font-medium text-sm ${
                    filters.category === 'community' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100'
                  }`}
                  onClick={() => setFilters({ ...filters, category: 'community', subcategory: undefined })}
                >
                  Community
                </button>
                <button 
                  className={`pb-1 border-b-2 font-medium text-sm ${
                    filters.category === 'mentor' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100'
                  }`}
                  onClick={() => setFilters({ ...filters, category: 'mentor', subcategory: undefined })}
                >
                  Mentor
                </button>
                <button 
                  className={`pb-1 border-b-2 font-medium text-sm ${
                    filters.category === 'match' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100'
                  }`}
                  onClick={() => setFilters({ ...filters, category: 'match', subcategory: undefined })}
                >
                  Match
                </button>
                <button 
                  className={`pb-1 border-b-2 font-medium text-sm ${
                    filters.category === 'housing' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100'
                  }`}
                  onClick={() => setFilters({ ...filters, category: 'housing' })}
                >
                  Housing
                </button>
                <button 
                  className={`pb-1 border-b-2 font-medium text-sm ${
                    filters.category === 'jobs' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100'
                  }`}
                  onClick={() => setFilters({ ...filters, category: 'jobs' })}
                >
                  Jobs
                </button>
                <button 
                  className={`pb-1 border-b-2 font-medium text-sm ${
                    filters.category === 'services' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100'
                  }`}
                  onClick={() => setFilters({ ...filters, category: 'services' })}
                >
                  Services
                </button>
                <button 
                  className={`pb-1 border-b-2 font-medium text-sm ${
                    filters.category === 'forsale' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100'
                  }`}
                  onClick={() => setFilters({ ...filters, category: 'forsale' })}
                >
                  Marketplace
                </button>
                <button 
                  className={`pb-1 border-b-2 font-medium text-sm ${
                    false ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100'
                  }`}
                  onClick={() => setDonateDialogOpen(true)}
                >
                  <Heart className="w-4 h-4 inline mr-1" />
                  Support HabeshaCommunity
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-background border-b border-border sticky top-0 z-10 hidden md:block">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Category Toggle */}
                <Popover modal={false}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1">
                      {filters.category 
                        ? TAXONOMY[filters.category as CategoryKey]?.name[language.toLowerCase() as 'en' | 'ti'] || "Category"
                        : language === 'EN' ? "All categories" : "ኩሉ ምድብታት"
                      }
                      <ChevronDown className="w-3 h-3 text-primary" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent 
                    side="bottom" 
                    align="start" 
                    className="w-56 p-1"
                    collisionPadding={8}
                  >
                    <div className="space-y-1">
                      <button
                        className="w-full text-left px-3 py-2 text-sm hover:bg-accent rounded-sm"
                        onClick={() => setFilters({ ...filters, category: undefined, subcategory: undefined })}
                      >
                        All categories
                      </button>
                      {Object.entries(TAXONOMY).map(([key, value]) => (
                        <button
                          key={key}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-accent rounded-sm"
                          onClick={() => setFilters({ ...filters, category: key, subcategory: undefined })}
                        >
                          {value.name[language.toLowerCase() as 'en' | 'ti']}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Subcategory Toggle */}
                <Popover modal={false}>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-1"
                      disabled={!filters.category}
                    >
                      {filters.subcategory 
                        ? LABELS[filters.subcategory]?.[language.toLowerCase() as 'en' | 'ti'] || filters.subcategory
                        : filters.category ? (language === 'EN' ? "Subcategory" : "ንኣብ ምድብ") : (language === 'EN' ? "Select category first" : "ቀዳማይ ምድብ ምረጽ")
                      }
                      <ChevronDown className="w-3 h-3 text-primary" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent 
                    side="bottom" 
                    align="start" 
                    className="w-56 p-1"
                    collisionPadding={8}
                  >
                    <div className="space-y-1">
                      <button
                        className="w-full text-left px-3 py-2 text-sm hover:bg-accent rounded-sm"
                        onClick={() => setFilters({ ...filters, subcategory: undefined })}
                      >
                        All subcategories
                      </button>
                      {filters.category && TAXONOMY[filters.category as CategoryKey]?.sub.map((sub) => (
                        <button
                          key={sub}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-accent rounded-sm"
                          onClick={() => setFilters({ ...filters, subcategory: sub })}
                        >
                          {LABELS[sub]?.[language.toLowerCase() as 'en' | 'ti'] || sub}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Additional Filters based on category */}
                {filters.category === 'mentor' && (
                  <>
                    <MentorFilters
                      verifiedOnly={mentorVerifiedOnly}
                      minRating={mentorMinRating}
                      sortBy={mentorSortBy}
                      onVerifiedOnlyChange={setMentorVerifiedOnly}
                      onMinRatingChange={setMentorMinRating}
                      onSortByChange={setMentorSortBy}
                    />
                    <Button 
                      size="sm" 
                      className="gap-1"
                      onClick={() => navigate('/mentor/onboarding')}
                    >
                      Become a Mentor
                    </Button>
                  </>
                )}
                
                {filters.category && filters.category !== 'mentor' && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-1"
                  >
                    More Filters
                    <ChevronDown className="w-3 h-3 text-primary" />
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAll}
                >
                  Clear All
                </Button>
              </div>

              {/* View and Sort Controls - Right Side */}
              <div className="flex items-center gap-2">
                <div className="text-sm text-muted-foreground">
                  {processedListings.length} listings
                  {filters.city && ` in ${filters.city}`}
                </div>
                <ViewToggle viewMode={viewMode} onChange={setViewMode} />
                <SortDropdown sortKey={sortKey} onChange={setSortKey} />
              </div>
            </div>
          </div>
        </div>


        {/* Split View: Map on Left, Listings on Right */}
        <div className="flex h-[calc(100vh-200px)]">
          {/* Map Section - Left Side */}
          <div className="w-1/2 relative">
            <InteractiveListingMap
              listings={processedListings}
              onListingClick={handleListingSelect}
              center={filters.city ? undefined : { lat: 20, lng: 0 }}
              zoom={filters.city ? 12 : 2}
              height="100%"
              searchCity={filters.city}
              searchCityCoords={cityCoords}
              searchCountry={filters.city}
            />
          </div>

          {/* Listings Section - Right Side */}
          <div className="w-1/2 bg-background overflow-y-auto">
            <div className="p-6">

              {/* Full-Width Listings Grid */}
              <ListingGrid
                listings={processedListings}
                onListingClick={handleListingSelect}
                loading={loading}
                newlyPostedId={null}
                viewMode={viewMode}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View - Keep Existing Layout */}
      <div className="md:hidden">
        {/* Mobile Header */}
        <MobileHeader />

        {/* Mobile City Search Bar with Clear Button */}
        <div className="px-4 py-2 border-b bg-background">
          <div className="flex gap-2">
            <div className="flex-1">
              <CitySearchBar 
                value={filters.city}
                onCitySelect={handleCityChange}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              className="px-3 py-2 h-auto text-xs"
            >
              Clear
            </Button>
          </div>
        </div>

        {/* Filter Controls - Sticky */}
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b">
          <div className="px-4 py-3">
            <div className="flex items-center gap-1 mb-3 overflow-x-auto">
              {/* Category Filter */}
              <Popover modal={false}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1 flex-shrink-0">
                    {filters.category 
                      ? TAXONOMY[filters.category as CategoryKey]?.name[language.toLowerCase() as 'en' | 'ti'] || "Category"
                      : language === 'EN' ? "All categories" : "ኩሉ ምድብታት"
                    }
                    <ChevronDown className="w-3 h-3 text-primary" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent 
                  side="bottom" 
                  align="start" 
                  className="w-56 p-1"
                  collisionPadding={8}
                >
                  <div className="space-y-1">
                    <button
                      className="w-full text-left px-3 py-2 text-sm hover:bg-accent rounded-sm"
                      onClick={() => setFilters({ ...filters, category: undefined, subcategory: undefined })}
                    >
                      All categories
                    </button>
                    {Object.entries(TAXONOMY).map(([key, value]) => (
                      <button
                        key={key}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-accent rounded-sm"
                        onClick={() => setFilters({ ...filters, category: key, subcategory: undefined })}
                      >
                        {value.name[language.toLowerCase() as 'en' | 'ti']}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Subcategory Filter */}
              <Popover modal={false}>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-1 flex-shrink-0"
                    disabled={!filters.category}
                  >
                    {filters.subcategory 
                      ? LABELS[filters.subcategory]?.[language.toLowerCase() as 'en' | 'ti'] || filters.subcategory
                      : filters.category ? (language === 'EN' ? "Subcategory" : "ንኣብ ምድብ") : (language === 'EN' ? "Select category first" : "ቀዳማይ ምድብ ምረጽ")
                    }
                    <ChevronDown className="w-3 h-3 text-primary" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent 
                  side="bottom" 
                  align="start" 
                  className="w-56 p-1 max-h-64 overflow-y-auto"
                  collisionPadding={8}
                >
                  {filters.category && (
                    <div className="space-y-1">
                      <button
                        className="w-full text-left px-3 py-2 text-sm hover:bg-accent rounded-sm"
                        onClick={() => setFilters({ ...filters, subcategory: undefined })}
                      >
                        {language === 'EN' ? 'All' : 'ኩሉ'} {TAXONOMY[filters.category as CategoryKey]?.name[language.toLowerCase() as 'en' | 'ti']?.toLowerCase()}
                      </button>
                      {TAXONOMY[filters.category as CategoryKey]?.sub.map((sub) => (
                        <button
                          key={sub}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-accent rounded-sm text-primary"
                          onClick={() => setFilters({ ...filters, subcategory: sub })}
                        >
                          {LABELS[sub]?.[language.toLowerCase() as 'en' | 'ti'] || sub}
                        </button>
                      ))}
                    </div>
                  )}
                </PopoverContent>
              </Popover>

              {/* Clear All */}
              <Button variant="ghost" size="sm" className="flex-shrink-0" onClick={handleClearAll}>
                {language === 'EN' ? 'Clear' : 'ኣጽዓን'}
              </Button>
            </div>

            {/* Mentor-specific filters for mobile */}
            {filters.category === 'mentor' && (
              <div className="mt-3 pt-3 border-t border-border">
                <MentorFilters
                  verifiedOnly={mentorVerifiedOnly}
                  minRating={mentorMinRating}
                  sortBy={mentorSortBy}
                  onVerifiedOnlyChange={setMentorVerifiedOnly}
                  onMinRatingChange={setMentorMinRating}
                  onSortByChange={setMentorSortBy}
                />
              </div>
            )}
            
            {/* Results and controls */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {processedListings.length} {language === 'EN' ? 'results' : 'ውጽኢታት'}
                {filters.city && ` ${language === 'EN' ? 'in' : 'ኣብ'} ${filters.city}`}
              </div>
              
              <div className="text-sm text-muted-foreground">
                Sorted by {sortKey === 'relevance' ? 'Recommended' : 
                          sortKey === 'price_asc' ? 'Price (Low to High)' : 
                          sortKey === 'price_desc' ? 'Price (High to Low)' :
                          sortKey === 'newest' ? 'Newest' :
                          sortKey === 'oldest' ? 'Oldest' : 
                          sortKey === 'has_image' ? 'Has Image' : 'Upcoming'}
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <div></div>
              <div className="flex items-center gap-2">
                <ViewToggle viewMode={viewMode} onChange={setViewMode} />
                <SortDropdown sortKey={sortKey} onChange={setSortKey} />
              </div>
            </div>
          </div>
        </div>


        {/* Main Content - Mobile */}
        <main className="px-4 py-6 mb-20">
          {viewMode === "map" ? (
            <div className="h-[70vh] w-full">
              <InteractiveListingMap
                listings={processedListings}
                onListingClick={handleListingSelect}
                center={filters.city ? undefined : { lat: 20, lng: 0 }}
                zoom={filters.city ? 12 : 2}
                height="100%"
                searchCity={filters.city}
                searchCityCoords={cityCoords}
                searchCountry={filters.city}
              />
            </div>
          ) : (
            <ListingGrid
              listings={processedListings}
              onListingClick={handleListingSelect}
              loading={loading}
              newlyPostedId={null}
              viewMode={viewMode}
            />
          )}
        </main>
      </div>

      
        <Footer />
        <StickyPostCTA />
        
        {/* Modals */}
        <AuthModal />
        <PostModal city={filters.city || "Select a city"} />
        
        {/* Donation Dialog */}
        <Dialog open={donateDialogOpen} onOpenChange={setDonateDialogOpen}>
          <DialogContent className="w-full max-w-md">
            <DialogHeader>
              <DialogTitle>Support HabeshaCommunity</DialogTitle>
            </DialogHeader>

            <p className="text-sm text-muted-foreground mb-4">
              Choose an amount or enter a custom donation ($2 - $500).
            </p>

            <div className="flex gap-2 mb-4">
              {DONATE_PRESETS.map((cents) => (
                <Button
                  key={cents}
                  variant={(!customAmount && donateAmount === cents) ? "default" : "outline"}
                  onClick={() => { setDonateAmount(cents); setCustomAmount(""); }}
                  className="flex-1"
                >
                  ${(cents / 100).toFixed(0)}
                </Button>
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="custom-amount">Custom amount (USD)</Label>
                <Input
                  id="custom-amount"
                  inputMode="decimal"
                  placeholder="e.g. 7.50"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className={donateAmountError ? "border-destructive" : ""}
                />
                {donateAmountError && (
                  <p className="text-xs text-destructive mt-1">{donateAmountError}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email (optional for receipt)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={donateEmail}
                  onChange={(e) => setDonateEmail(e.target.value)}
                />
              </div>

              <Button
                onClick={startDonationCheckout}
                disabled={donateLoading || !isValidDonateAmount}
                className="w-full"
              >
                {donateLoading ? "Processing..." : `Donate $${(donateDisplayAmount / 100).toFixed(2)}`}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                Powered by Stripe • Test mode enabled
              </p>
            </div>
          </DialogContent>
        </Dialog>
    </div>
  );
}