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
import LanguageToggle from "@/components/LanguageToggle";
import HomeDigest from "@/components/HomeDigest";
import DonationButton from "@/components/DonationButton";
import GlobalMap from "@/components/GlobalMap";
import StickyPostCTA from "@/components/StickyPostCTA";
import Footer from "@/components/Footer";
import { getStarPoints } from "@/services/activeUsers";
import CitySearchBar from "@/components/CitySearchBar";
import { setParams, getParam } from "@/lib/url";
import { TAXONOMY, CategoryKey } from "@/lib/taxonomy";
import { t, Lang } from "@/lib/i18n";
import type { Listing, SearchFilters, AppState } from "@/types";
import { getAppState, saveAppState } from "@/utils/storage";
import { fetchListings, fetchListingById } from "@/repo/listings";
import { onAuthChange, getUserId, signOut } from "@/repo/auth";
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
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem("hn.lang") as Lang) || "EN");
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
      
      // If user just signed in, close login modal and show success
      if (session?.user) {
        setLoginOpen(false);
        if (session.access_token) {
          toast.success('Successfully signed in!');
        }
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
        const data = await fetchListings({
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
          contact_phone: row.contact_method === 'phone' ? row.contact_value : null,
          contact_whatsapp: row.contact_method === 'whatsapp' ? row.contact_value : null,
          contact_telegram: row.contact_method === 'telegram' ? row.contact_value : null,
          contact_email: row.contact_method === 'email' ? row.contact_value : null,
          website_url: row.website_url,
          tags: row.tags || [],
          images: row.images || [],
          lat: row.location_lat,
          lng: row.location_lng,
          created_at: row.created_at,
          // Legacy compatibility
          contact: { phone: row.contact_value || "" },
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
  }, [appState.city, filters.category, filters.query, filters.minPrice, filters.maxPrice, filters.subcategory]);

  // Deep-link: if /l/:id, fetch and open
  useEffect(() => {
    const id = params.id;
    if (!id) return;

    const loadListingById = async () => {
      try {
        const row = await fetchListingById(id);
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
          contact_phone: row.contact_method === 'phone' ? row.contact_value : null,
          contact_whatsapp: row.contact_method === 'whatsapp' ? row.contact_value : null,
          contact_telegram: row.contact_method === 'telegram' ? row.contact_value : null,
          contact_email: row.contact_method === 'email' ? row.contact_value : null,
          website_url: row.website_url,
          tags: row.tags || [],
          images: row.images || [],
          lat: row.location_lat,
          lng: row.location_lng,
          created_at: row.created_at,
          // Legacy compatibility
          contact: { phone: row.contact_value || "" },
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

  // Filter listings
  const filteredListings = useMemo(() => {
    let filtered = [...listings];

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

    if (filters.query) {
      const q = filters.query.toLowerCase();
      filtered = filtered.filter(
        (listing) =>
          listing.title.toLowerCase().includes(q) ||
          listing.description.toLowerCase().includes(q) ||
          listing.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    if (filters.category === "housing") {
      if (filters.minPrice != null) filtered = filtered.filter(l => l.price != null && (l.price as number) >= filters.minPrice!);
      if (filters.maxPrice != null) filtered = filtered.filter(l => l.price != null && (l.price as number) <= filters.maxPrice!);
    }

    if (filters.category === "jobs" && filters.jobKind) {
      filtered = filtered.filter(l => (l as any).jobKind === filters.jobKind);
    }

    return filtered.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  }, [listings, filters]);

  // Event handlers
  const setLanguage = (newLang: string) => {
    setLang(newLang as Lang);
    localStorage.setItem("hn.lang", newLang);
  };

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

  // Navigation helpers
  const openCat = (category: CategoryKey, sub?: string) => {
    handleFiltersChange({ ...filters, category, subcategory: sub });
    // Optionally scroll to results
    setTimeout(() => {
      document.getElementById("listing-root")?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  const handleViewModeChange = (mode: "grid" | "map") => {
    const next = { ...appState, viewMode: mode };
    setAppState(next);
    saveAppState(next);
  };

  const handleListingSelect = (listing: Listing) => {
    setSelectedListing(listing);
    setDetailOpen(true);
    navigate(`/l/${listing.id}`, { replace: false });
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

  const shouldShowCityIndex =
    !!appState.city && !filters.query && !filters.subcategory;

  return (
    <>
      <BootstrapAuth />
      <div className="min-h-screen bg-background">
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
              onChange={(newLang) => {
                setLang(newLang as Lang);
                localStorage.setItem("hn.lang", newLang);
              }}
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
          <div className="flex flex-col md:flex-row gap-3 items-stretch mb-2">
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

            <div className="flex gap-2">
              <button
                className={`btn ${appState.viewMode === "grid" ? "btn-primary" : ""}`}
                onClick={() => handleViewModeChange("grid")}
              >
                {t(lang, "grid")}
              </button>
              <button
                className={`btn ${appState.viewMode === "map" ? "btn-primary" : ""}`}
                onClick={() => handleViewModeChange("map")}
              >
                {t(lang, "map")}
              </button>
              <button className="btn text-xs" onClick={() => setFilters({ category: filters.category })}>
                {t(lang, "clear_all")}
              </button>
            </div>
          </div>

          <QuickFilters
            lang={lang}
            category={filters.category}
            minPrice={filters.minPrice}
            maxPrice={filters.maxPrice}
            jobKind={filters.jobKind as any}
            onChange={(next) => setFilters({ ...filters, ...next })}
          />

          <div className="text-sm text-muted-foreground mb-4">
            {filteredListings.length} {t(lang, "results")}
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
        <>
          {/* City Search Bar Above Hero */}
          <div className="container mx-auto px-4 py-4">
          <CitySearchBar 
            placeholder="City (e.g. Asmara, Oakland, Frankfurt)" 
            onCitySelect={handleCityChange}
          />
          </div>
          
          <section className="w-screen relative left-1/2 right-1/2 -mx-[50vw] py-8 md:py-12 bg-background/70 backdrop-blur">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
              <div className="text-center space-y-6 mb-8">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  {t(lang, "connect_headline_1")}
                  <br />
                  <span className="text-primary">{t(lang, "connect_headline_2")}</span>
                </h1>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 text-lg">
                    <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                    <span className="font-semibold">
                      Live now: <strong>{isLoading ? '...' : total.toLocaleString()}</strong> people
                    </span>
                  </div>
                  {demo && (
                    <p className="text-xs text-muted-foreground">
                      demo data until accounts go live
                    </p>
                  )}
                </div>

                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  {t(lang, "connect_sub")}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    className="px-5 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-semibold transition-colors"
                    onClick={() => navigate('/browse?category=housing')}
                  >
                    {t(lang, "housing")}
                  </button>
                  <button 
                    className="px-5 py-3 rounded-lg bg-muted hover:bg-muted/80 font-semibold transition-colors"
                    onClick={() => navigate('/browse?category=jobs')}
                  >
                    {t(lang, "jobs")}
                  </button>
                </div>
              </div>
            </div>
          </section>
        </>
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
            
            {appState.viewMode === "grid" ? (
              <ListingGrid
                listings={filteredListings}
                onListingSelect={handleListingSelect}
                loading={loading}
                onPostFirst={() => setPostOpen(true)}
                newlyPostedId={newlyPostedId}
              />
            ) : (
              <MapCluster
                center={appState.cityLat && appState.cityLon ? { lat: Number(appState.cityLat), lon: Number(appState.cityLon) } : undefined}
                listings={filteredListings}
                height={480}
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
    </>
  );
}