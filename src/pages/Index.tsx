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
    const next = { ...appState, city: "", cityLat: undefined, cityLon: undefined, viewMode: "grid" as const };
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

  const shouldShowCityIndex =
    !!appState.city && !filters.query && !filters.subcategory;

  return (
    <div className="min-h-screen bg-background">
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

      {!shouldShowCityIndex && (
        <div className="container mx-auto px-4 pt-4 hidden md:block">
          <div className="flex flex-col gap-4 mb-4">
            <div className="flex flex-col md:flex-row gap-3 items-stretch">
              <select
                className="field min-w-[160px]"
                value={filters.category || ""}
                onChange={(e) => handleFiltersChange({ ...filters, category: e.target.value || undefined, subcategory: undefined })}
              >
                <option value="">{t(lang, "all_categories")}</option>
                {Object.entries(TAXONOMY).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.name[lang.toLowerCase() as "en" | "ti"]}
                  </option>
                ))}
              </select>

              <SearchBox
                lang={lang}
                value={filters.query || ""}
                onChange={(v) => setFilters({ ...filters, query: v })}
                onPickCategory={(slug) => setFilters({ ...filters, category: slug, subcategory: undefined })}
                onPickSubcategory={(slug) => setFilters({ ...filters, subcategory: slug })}
                onPickTag={(tag) => setFilters({ ...filters, query: `${(filters.query || "").trim()} #${tag}`.trim() })}
              />

              <div className="flex items-center gap-3">
                <ViewToggle viewMode={viewMode} onChange={handleViewModeChange} />
                <SortDropdown sortKey={sortKey} onChange={setSortKey} />
                <button className="btn text-xs" onClick={() => setFilters({ category: filters.category })}>
                  {t(lang, "clear_all")}
                </button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-3 items-start justify-between">
              <QuickFilters
                lang={lang}
                category={filters.category}
                minPrice={filters.minPrice}
                maxPrice={filters.maxPrice}
                jobKind={filters.jobKind as any}
                onChange={(next) => setFilters({ ...filters, ...next })}
              />
              
            </div>

            <div className="text-sm text-muted-foreground mb-4">
              {processedListings.length} {t(lang, "results")}
            </div>
          </div>
        </div>
      )}

      {/* Background Map */}
      <div id="bg-map" className="fixed inset-0 -z-10 pointer-events-none">
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

      {/* Hero section when no city is selected */}
      {!appState.city && (
        <WorldActivityHero
          mode="dark"
          SearchBar={() => <CitySearchBar 
            placeholder="City (e.g. Asmara, Oakland, Frankfurt)" 
            onCitySelect={handleCityChange}
          />}
          onPrimary={handleHousingClick}
          onSecondary={handleJobsClick}
          onCityClick={handleCityClick}
        />
      )}

      {/* Trending Rails Section */}
      {!appState.city && (
        <div className="space-y-6 mb-12">
          <TrendingRail 
            label="Featured Picks" 
            featured 
            link="/browse?featured=true" 
          />
          <TrendingRail 
            label="Housing & Rentals" 
            category="housing" 
            link="/browse?category=housing" 
          />
          <TrendingRail 
            label="Jobs" 
            category="jobs" 
            link="/browse?category=jobs" 
          />
          <TrendingRail 
            label="Services" 
            category="services" 
            link="/browse?category=services" 
          />
          <TrendingRail 
            label="Marketplace" 
            category="marketplace" 
            link="/browse?category=marketplace" 
          />
        </div>
      )}

      <main className="container mx-auto px-4 py-6">
        {shouldShowCityIndex ? (
          <>
            <HomeDigest city={appState.city} />
            <CityIndex
              city={appState.city}
              lang={lang.toLowerCase() as "en" | "ti"}
              listings={listings}
              onOpen={({ category, sub }) => openCat(category, sub)}
            />
          </>
        ) : (
          <div id="listing-root">
            {/* Mobile Recent Carousel */}
            <div className="md:hidden mb-4">
              <RecentCarousel />
            </div>
            
            {viewMode === "map" ? (
              <div className="h-[70vh] rounded-lg overflow-hidden">
                <MapCluster
                  listings={processedListings}
                  height={480}
                  center={appState.cityLat && appState.cityLon ? {
                    lat: Number(appState.cityLat),
                    lon: Number(appState.cityLon)
                  } : undefined}
                />
              </div>
            ) : (
              <ListingGrid
                listings={processedListings}
                loading={loading}
                onListingClick={handleListingSelect}
                currentUserId={user?.id}
                newlyPostedId={newlyPostedId}
                favorites={favorites}
                onFavorite={handleFavorite}
                viewMode={viewMode}
              />
            )}
          </div>
        )}
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
    </div>
  );
}