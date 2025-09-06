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
  const [viewMode, setViewMode] = useState<ViewMode>(() =>
    (localStorage.getItem('hn.viewMode') as ViewMode) || 'grid'
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
      } catch (error) {
        console.error("Failed to load listings:", error);
        toast("Failed to load listings");
      } finally {
        setLoading(false);
      }
    };

    loadListings();
  }, [filters.city, filters.category, filters.query, filters.minPrice, filters.maxPrice, filters.subcategory, user]);

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

  const handleCityChange = (city: string, lat?: number, lon?: number) => {
    setFilters({ ...filters, city });
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
  };

  const handleListingSelect = (listing: Listing) => {
    navigate(`/l/${listing.id}`);
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
                    false ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100'
                  }`}
                  onClick={() => navigate('/mentor')}
                >
                  Mentor
                </button>
                <button 
                  className={`pb-1 border-b-2 font-medium text-sm ${
                    false ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100'
                  }`}
                  onClick={() => navigate('/match')}
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
                    filters.category === 'marketplace' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100'
                  }`}
                  onClick={() => setFilters({ ...filters, category: 'marketplace' })}
                >
                  Marketplace
                </button>
                <button 
                  className={`pb-1 border-b-2 font-medium text-sm ${
                    false ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100'
                  }`}
                  onClick={() => {
                    // Create donation dialog similar to DonateButton
                    const dialog = document.createElement('div');
                    dialog.innerHTML = `
                      <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
                          <h3 class="text-lg font-semibold mb-4 dark:text-white">Support HabeshaCommunity</h3>
                          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Help us maintain and improve our community platform.</p>
                          <div class="flex gap-2 mb-4">
                            <button onclick="window.open('https://donate.stripe.com/test_28o4iy2NK41ydTG9AA', '_blank')" class="bg-blue-600 text-white px-4 py-2 rounded flex-1">$5</button>
                            <button onclick="window.open('https://donate.stripe.com/test_28o4iy2NK41ydTG9AA', '_blank')" class="bg-blue-600 text-white px-4 py-2 rounded flex-1">$10</button>
                            <button onclick="window.open('https://donate.stripe.com/test_28o4iy2NK41ydTG9AA', '_blank')" class="bg-blue-600 text-white px-4 py-2 rounded flex-1">$20</button>
                          </div>
                          <button onclick="this.parentElement.parentElement.remove()" class="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded">Close</button>
                        </div>
                      </div>
                    `;
                    document.body.appendChild(dialog);
                  }}
                >
                  <Heart className="w-4 h-4 inline mr-1" />
                  Support HabeshaCommunity
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-background border-b border-border">
          <div className="container mx-auto px-4 py-3">
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
              {filters.category && (
                filters.category === 'mentor' ? (
                  <Button 
                    size="sm" 
                    className="gap-1"
                    onClick={() => navigate('/mentor/onboarding')}
                  >
                    Become a Mentor
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-1"
                  >
                    More Filters
                    <ChevronDown className="w-3 h-3 text-primary" />
                  </Button>
                )
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAll}
              >
                Clear All
              </Button>
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
              center={filters.city ? undefined : { lat: 51.505, lng: -0.09 }}
              zoom={filters.city ? 12 : 6}
              height="100%"
            />
          </div>

          {/* Listings Section - Right Side */}
          <div className="w-1/2 bg-background overflow-y-auto">
            <div className="p-6">
              {/* Results Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {processedListings.length} listings
                    {filters.city && ` in ${filters.city}`}
                  </div>
                  <div className="flex items-center gap-2">
                    <ViewToggle viewMode={viewMode} onChange={setViewMode} />
                    <SortDropdown sortKey={sortKey} onChange={setSortKey} />
                  </div>
                </div>
              </div>

              {/* Full-Width Listings Grid */}
              <div className="grid grid-cols-2 gap-4">
                {processedListings.map((listing) => (
                  <div
                    key={listing.id}
                    className="border dark:border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer bg-card"
                    onClick={() => handleListingSelect(listing)}
                  >
                    {listing.images?.[0] && (
                      <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <h3 className="font-medium text-sm mb-2 line-clamp-2 text-card-foreground">{listing.title}</h3>
                      {listing.price && (
                        <p className="text-lg font-semibold text-green-600 dark:text-green-400 mb-1">
                          ${listing.price.toLocaleString()}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mb-2">
                        {listing.city}, {listing.country}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {listing.description}
                      </p>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="col-span-2 text-center py-8 text-muted-foreground">
                    Loading listings...
                  </div>
                )}
                {!loading && processedListings.length === 0 && (
                  <div className="col-span-2 text-center py-8 text-muted-foreground">
                    No listings found. Try adjusting your filters.
                  </div>
                )}
              </div>
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
          <ListingGrid
            listings={processedListings}
            onListingClick={handleListingSelect}
            loading={loading}
            newlyPostedId={null}
            viewMode={viewMode}
          />
        </main>
      </div>

      
        <Footer />
        <StickyPostCTA />
        
        {/* Modals */}
        <AuthModal />
        <PostModal city={filters.city || "Select a city"} />
    </div>
  );
}