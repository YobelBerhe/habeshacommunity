import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import Header from "@/components/Header";
import MobileHeader from "@/components/layout/MobileHeader";
import FilterBar from "@/components/FilterBar";
import { FiltersBar } from "@/components/search/FiltersBar";
import { RecentCarousel } from "@/components/home/RecentCarousel";
import ListingGrid from "@/components/ListingGrid";
import PostModal from "@/components/PostModal";
import AccountModal from "@/components/AccountModal";
import LoginModal from "@/components/LoginModal";
import ListingDetailModal from "@/components/ListingDetailModal";
import AuthModal from "@/components/AuthModal";
import BootstrapAuth from "@/components/BootstrapAuth";
import CityIndex from "@/components/CityIndex";
import MapCluster from "@/components/MapCluster";
import SearchBox from "@/components/SearchBox";
import QuickFilters from "@/components/QuickFilters";
import ViewToggle from "@/components/ViewToggle";
import SortDropdown from "@/components/SortDropdown";
import WorldActivityHero from "@/components/WorldActivityHero";
import TrendingRail from "@/components/TrendingRail";
import CitySearchBar from "@/components/CitySearchBar";

import LanguageToggle from "@/components/LanguageToggle";
import HomeDigest from "@/components/HomeDigest";
import DonationButton from "@/components/DonationButton";
import GlobalMap from "@/components/GlobalMap";
import StickyPostCTA from "@/components/StickyPostCTA";
import Footer from "@/components/Footer";
import AiAssistant from "@/components/AiAssistant";
import { Parallax } from "@/components/Parallax";
import { useSEO } from "@/hooks/useSEO";
import { OrganizationSchema, WebSiteSchema } from "@/components/StructuredData";
import { getStarPoints } from "@/services/activeUsers";
import { setParams, getParam } from "@/lib/url";
import { TAXONOMY, CategoryKey } from "@/lib/taxonomy";
import { t, Lang } from "@/lib/i18n";
import { useLanguage } from "@/store/language";
import type { Listing, SearchFilters, AppState } from "@/types";
import type { ViewMode, SortKey } from "@/components/ViewToggle";
import type { SortKey as SortDropdownKey } from "@/components/SortDropdown";
import { getAppState, saveAppState } from "@/utils/storage";
import { fetchListings, fetchListingById } from "@/repo/listings";
import { fetchListingsWithContacts } from "@/repo/listingsWithContacts";
import { getListingContact } from "@/repo/contacts";
import { onAuthChange, getUserId, signOut } from "@/repo/auth";
import { getContactValue, hasContactAccess } from "@/utils/contactHelpers";
import { sortListings, applyQuickFilters } from "@/utils/ui";
import { toast } from "sonner";

export default function Index() {
  useSEO({
    title: 'HabeshaCommunity - Connect with Habesha Worldwide',
    description: 'Find housing, jobs, mentors, and connect with the Habesha community across the globe. Browse listings in Asmara, Addis Ababa, Oakland, and more.',
    keywords: ['habesha', 'eritrean', 'ethiopian', 'community', 'housing', 'jobs', 'mentors'],
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const params = useParams<{ id?: string }>();
  const [appState, setAppState] = useState<AppState>(() => getAppState());
  const [listings, setListings] = useState<Listing[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [postOpen, setPostOpen] = useState(false);
  const [acctOpen, setAcctOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [newlyPostedId, setNewlyPostedId] = useState<string | null>(null);
  const { language: lang, setLanguage } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [demo, setDemo] = useState(false);
  
  // Track theme mode from the <html> class and pass to map hero
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const el = document.documentElement;
    const update = () => setThemeMode(el.classList.contains('dark') ? 'dark' : 'light');
    update();
    const observer = new MutationObserver(update);
    observer.observe(el, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const [filters, setFilters] = useState<SearchFilters>(() => {
    const initialAppState = getAppState();
    return {
      category: searchParams.get("category") || initialAppState.category || undefined,
      subcategory: getParam(searchParams, "sub"),
      query: searchParams.get("q") || "",
      minPrice: searchParams.get("min") ? Number(searchParams.get("min")) : undefined,
      maxPrice: searchParams.get("max") ? Number(searchParams.get("max")) : undefined,
      jobKind: undefined as "regular"|"gig"|undefined,
    };
  });

  // View and sorting state
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

  // Persist view and filter states
  useEffect(() => localStorage.setItem('hn.viewMode', viewMode), [viewMode]);
  useEffect(() => localStorage.setItem('hn.sort', sortKey), [sortKey]);
  useEffect(() => localStorage.setItem('hn.filter.hasImage', hasImageFilter.toString()), [hasImageFilter]);
  useEffect(() => localStorage.setItem('hn.filter.postedToday', postedTodayFilter.toString()), [postedTodayFilter]);

  // Update URL when filters change
  useEffect(() => {
    const params = setParams(new URLSearchParams(), {
      category: filters.category,
      sub: filters.subcategory,
      q: filters.query,
      min: filters.minPrice?.toString(),
      max: filters.maxPrice?.toString(),
    });
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  // Setup auth listener
  useEffect(() => {
    const { data: { subscription } } = onAuthChange((session) => {
      console.log("Auth state changed:", session?.user?.id || 'null');
      setSession(session);
      setUser(session?.user ?? null);
      
      // Close login modal when user signs in
      if (session?.user) {
        setLoginOpen(false);
      }
    });

    // Also check for existing session on mount
    const checkInitialSession = async () => {
      const { getSession } = await import("@/repo/auth");
      const session = await getSession();
      console.log("Initial session check:", session?.user?.id || 'null');
      setSession(session);
      setUser(session?.user ?? null);
    };

    checkInitialSession();

    return () => subscription.unsubscribe();
  }, []);

  // Load live data for hero section
  useEffect(() => {
    const loadLiveData = async () => {
      const res = await getStarPoints();
      setTotal(res.total);
      setDemo(res.demo);
      setIsLoading(false);
    };

    loadLiveData();
    
    // Refresh periodically
    const interval = setInterval(loadLiveData, 15000);
    return () => clearInterval(interval);
  }, []);

  // Load data when city or filters change
  useEffect(() => {
    if (!appState.city) return;
    
      const loadListings = async () => {
        setLoading(true);
        try {
          const data = user 
            ? await fetchListingsWithContacts({
                city: appState.city,
                category: filters.category,
                q: filters.query,
                minPrice: filters.minPrice,
                maxPrice: filters.maxPrice,
                subcategory: filters.subcategory,
              })
            : await fetchListings({
                city: appState.city,
                category: filters.category,
                q: filters.query,
                minPrice: filters.minPrice,
                maxPrice: filters.maxPrice,
                subcategory: filters.subcategory,
              });
              
          setListings(data.map(row => ({
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
          })));
        } catch (error) {
          console.error("Failed to load listings:", error);
          toast("Failed to load listings");
        } finally {
          setLoading(false);
        }
      };

    loadListings();
  }, [appState.city, filters.category, filters.query, filters.minPrice, filters.maxPrice, filters.subcategory, user]);

  // Deep-link: if /l/:id, fetch and open
  useEffect(() => {
    const id = params.id;
    if (!id) return;

    const loadListingById = async () => {
      try {
        const row = await fetchListingById(id);
        const contact = user ? await getListingContact(id) : null;
        
        const listing: Listing = {
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
          contact_phone: (contact?.contact_method === 'phone') ? contact.contact_value : null,
          contact_whatsapp: (contact?.contact_method === 'whatsapp') ? contact.contact_value : null,
          contact_telegram: (contact?.contact_method === 'telegram') ? contact.contact_value : null,
          contact_email: (contact?.contact_method === 'email') ? contact.contact_value : null,
          website_url: row.website_url,
          tags: row.tags || [],
          images: row.images || [],
          lat: row.location_lat,
          lng: row.location_lng,
          created_at: row.created_at,
          // Legacy compatibility
          contact: { phone: contact?.contact_value || "" },
          photos: row.images || [],
          lon: row.location_lng || undefined,
          createdAt: new Date(row.created_at).getTime(),
          updatedAt: new Date(row.updated_at).getTime(),
          hasImage: !!(row.images?.length),
        };
        setSelectedListing(listing);
        setDetailOpen(true);
      } catch (error) {
        console.error("Failed to load listing:", error);
        toast.error("Listing not found");
        navigate('/', { replace: true });
      }
    };

    loadListingById();
  }, [params.id, navigate]);

  // Filter and sort listings
  const processedListings = useMemo(() => {
    let filtered = [...listings];

    // Apply category filters
    if (filters.category) {
      filtered = filtered.filter(
        (listing) => listing.category === filters.category
      );
    }

    if (filters.subcategory) {
      filtered = filtered.filter(
        (listing) => listing.subcategory === filters.subcategory
      );
    }

    // Apply search query
    if (filters.query) {
      const q = filters.query.toLowerCase();
      filtered = filtered.filter(
        (listing) =>
          listing.title.toLowerCase().includes(q) ||
          listing.description.toLowerCase().includes(q) ||
          listing.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    // Apply price filters for housing
    if (filters.category === "housing") {
      if (filters.minPrice != null) filtered = filtered.filter(l => l.price != null && (l.price as number) >= filters.minPrice!);
      if (filters.maxPrice != null) filtered = filtered.filter(l => l.price != null && (l.price as number) <= filters.maxPrice!);
    }

    // Apply job kind filter
    if (filters.category === "jobs" && filters.jobKind) {
      filtered = filtered.filter(l => (l as any).jobKind === filters.jobKind);
    }

    // Apply quick filters
    filtered = applyQuickFilters(filtered, { 
      hasImage: hasImageFilter, 
      postedToday: postedTodayFilter 
    });

    // Apply sorting
    return sortListings(filtered, sortKey);
  }, [listings, filters, hasImageFilter, postedTodayFilter, sortKey]);

  // Event handlers

  const handleCityChange = (city: string, lat?: number, lon?: number) => {
    const next = { ...appState, city, cityLat: lat?.toString(), cityLon: lon?.toString() };
    setAppState(next);
    saveAppState(next);
    toast("City changed to " + city);
  };

  const handleAccountClick = () => {
    if (user) {
      setAcctOpen(true);
    } else {
      setLoginOpen(true);
    }
  };

  const handlePostClick = async () => {
    console.log("Post button clicked, user:", user);
    console.log("Session:", session);
    
    const userId = await getUserId();
    console.log("getUserId result:", userId);
    
    if (!userId) {
      setLoginOpen(true);
      toast.error("Please sign in to post a listing");
      return;
    }
    setPostOpen(true);
  };

  const handleSignOut = async () => {
    await signOut();
    setAcctOpen(false);
    toast("Signed out successfully");
  };

  const handleLogoClick = () => {
    // Clear city and reset to fresh home state
    const next = { ...appState, city: "", cityLat: undefined, cityLon: undefined, viewMode: "list" as const };
    setAppState(next);
    saveAppState(next);
    setFilters({ category: undefined, subcategory: undefined, query: "", minPrice: undefined, maxPrice: undefined, jobKind: undefined });
    window.history.pushState({}, '', '/');
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

  // Handle URL city parameter on initial load
  useEffect(() => {
    const urlCity = searchParams.get('city');
    if (urlCity && urlCity !== appState.city) {
      handleCityChange(urlCity);
      // Scroll to results after city loads
      setTimeout(() => {
        const resultsElement = document.getElementById('listing-root');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 500);
    }
  }, [searchParams, appState.city]);

  // Navigation helpers
  const openCat = (category: CategoryKey, sub?: string) => {
    const params = new URLSearchParams();
    params.set('category', category);
    if (sub) params.set('subcategory', sub);
    if (appState.city) params.set('city', appState.city);
    navigate(`/browse?${params.toString()}`);
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    // Also store scroll position for listings page
    sessionStorage.setItem('hn.index.scrollY', String(window.scrollY));
    sessionStorage.setItem('hn.lastSearchUrl', location.pathname + location.search);
  };

  const handleListingSelect = (listing: Listing) => {
    // Store current position and URL for back navigation
    sessionStorage.setItem('hn.index.scrollY', String(window.scrollY));
    sessionStorage.setItem('hn.lastSearchUrl', location.pathname + location.search);
    navigate(`/l/${listing.id}`);
  };

  const handleDetailClose = () => {
    setDetailOpen(false);
    setSelectedListing(null);
    navigate(`/`, { replace: true });
  };

  const handleFavorite = (listingId: string) => {
    // Toggle favorite logic here
    const newFavorites = favorites.includes(listingId)
      ? favorites.filter(id => id !== listingId)
      : [...favorites, listingId];
    setFavorites(newFavorites);
    toast(favorites.includes(listingId) ? "Removed from favorites" : "Added to favorites");
  };

  // Hero action handlers
  const handleHousingClick = () => {
    navigate('/browse?category=housing');
  };

  const handleJobsClick = () => {
    navigate('/browse?category=jobs');
  };

  const handleCityClick = (city: string) => {
    navigate(`/browse?city=${encodeURIComponent(city)}`);
    
    // Smooth scroll to results
    setTimeout(() => {
      const resultsElement = document.getElementById('listing-root');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Always show world map on homepage, only show city index when filtering
  const shouldShowCityIndex = false; // Disable city index to always show world map

  return (
    <div className="min-h-screen bg-background">
      <OrganizationSchema />
      <WebSiteSchema />
      <BootstrapAuth />
      {/* Desktop Header */}
      <div className="hidden md:block">
        <Header
          currentCity={appState.city}
          onCityChange={handleCityChange}
          onAccountClick={handleAccountClick}
          onLogoClick={handleLogoClick}
          rightExtra={
            <LanguageToggle
              value={lang}
              onChange={setLanguage}
            />
          }
        />
      </div>
      
      {/* Mobile Header */}
      <MobileHeader />
      
      {/* Mobile Filters Bar - only show when we have listings and a category */}
      {filters.category && appState.city && (
        <FiltersBar
          topCategory={filters.category as CategoryKey}
          selectedSubcategory={filters.subcategory}
          onPickSub={(sub) => setFilters({ ...filters, subcategory: sub || undefined })}
          onClear={() => setFilters({ category: undefined, subcategory: undefined, query: "", minPrice: undefined, maxPrice: undefined, jobKind: undefined })}
        />
      )}


      {/* Background Map */}
      <Parallax speed={0.3} className="fixed inset-0 -z-10 pointer-events-none">
        <div id="bg-map" className="w-full h-full">
          <GlobalMap 
            focusCity={appState.cityLat && appState.cityLon ? {
              lat: parseFloat(appState.cityLat),
              lng: parseFloat(appState.cityLon),
              name: appState.city
            } : null}
            modalOpen={postOpen || acctOpen || loginOpen || detailOpen}
            viewMode={appState.viewMode}
          />
        </div>
      </Parallax>

      {/* Hero section - moved up directly after header */}
      <div className="relative">
        <WorldActivityHero
          mode={themeMode}
          SearchBar={() => <CitySearchBar 
            placeholder="City (e.g. Asmara, Oakland, Frankfurt)" 
          />}
          onPrimary={handleHousingClick}
          onSecondary={handleJobsClick}
          onCityClick={handleCityClick}
          onNavigate={(path) => navigate(path)}
        />
      </div>

      <main className="container mx-auto px-4 py-4">
        {/* Trending Rails Section */}
        <div className="space-y-4 mb-8">
          <TrendingRail 
            label="Featured Picks" 
            featured={true}
            link="/browse?featured=true"
          />
          
          <TrendingRail 
            label="Trending in Community" 
            category="community"
            link="/browse?category=community"
          />
          
          <TrendingRail 
            label="Trending in Housing" 
            category="housing"
            link="/browse?category=housing"
          />
          
          <TrendingRail 
            label="Trending in Jobs" 
            category="jobs"
            link="/browse?category=jobs"
          />
          
          <TrendingRail 
            label="Find a Mentor" 
            category="mentor"
            link="/mentor"
          />
          
          <TrendingRail 
            label="Trending in Services" 
            category="services"
            link="/browse?category=services"
          />
          
          <TrendingRail 
            label="Trending in Marketplace" 
            category="forsale"
            link="/browse?category=forsale"
          />
        </div>

        {/* Social Media Links */}
        <div className="text-center py-8 border-t bg-muted/30 rounded-lg mb-8">
          <h3 className="text-lg font-semibold mb-4">Follow us:</h3>
          <div className="flex justify-center gap-6 flex-wrap">
            {/* Email */}
            <a href="mailto:habeshacommunityofficial@gmail.com" className="text-muted-foreground hover:text-primary transition-colors" title="Email">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
            </a>
            
            {/* YouTube */}
            <a href="https://youtube.com/@HabeshaComm" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" title="YouTube">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            
            {/* Instagram */}
            <a href="https://instagram.com/habeshacomm" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" title="Instagram">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            
            {/* TikTok */}
            <a href="https://www.tiktok.com/@habeshacomm" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" title="TikTok">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
            </a>
            
            {/* X (Twitter) */}
            <a href="https://x.com/HabeshaComm" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" title="X">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            
            {/* Facebook */}
            <a href="https://facebook.com/Habeshacomm" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" title="Facebook">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
          </div>
        </div>
      </main>

      <StickyPostCTA />
      <Footer />

      {/* Modals */}
      <AuthModal />
      <PostModal
        city={appState.city || "Select a city"}
        onPosted={(listing) => {
          // Optimistic update - prepend new listing immediately
          setListings(prev => [listing, ...prev]);
          setNewlyPostedId(listing.id);
          // Clear the "just posted" indicator after 60 seconds
          setTimeout(() => {
            setNewlyPostedId(null);
          }, 60000);
          toast("Posted successfully!");
        }}
      />

      <LoginModal 
        open={loginOpen} 
        onOpenChange={(open) => setLoginOpen(open)}
      />

      <AccountModal 
        open={acctOpen} 
        onOpenChange={(open) => setAcctOpen(open)}
        user={user}
        onSignOut={handleSignOut}
      />

      <ListingDetailModal
        open={detailOpen}
        listing={selectedListing}
        onClose={handleDetailClose}
        onSavedChange={(id, saved) => {
          // Handle favorite state change if needed
          if (saved) {
            setFavorites(prev => [...prev, id]);
          } else {
            setFavorites(prev => prev.filter(fId => fId !== id));
          }
        }}
      />

      <AiAssistant />
    </div>
  );
}