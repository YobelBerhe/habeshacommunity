import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import FilterBar from "@/components/FilterBar";
import ListingGrid from "@/components/ListingGrid";
import PostModal from "@/components/PostModal";
import AccountModal from "@/components/AccountModal";
import LoginModal from "@/components/LoginModal";
import ListingDetailModal from "@/components/ListingDetailModal";
import CityIndex from "@/components/CityIndex";
import MapCluster from "@/components/MapCluster";
import SearchBox from "@/components/SearchBox";
import QuickFilters from "@/components/QuickFilters";
import LanguageToggle from "@/components/LanguageToggle";
import HomeDigest from "@/components/HomeDigest";
import DonationButton from "@/components/DonationButton";
import WorldMapHero from "@/components/WorldMapHero";
import { setParams, getParam } from "@/lib/url";
import { TAXONOMY, CategoryKey } from "@/lib/taxonomy";
import { t, Lang } from "@/lib/i18n";
import type { Listing, SearchFilters, AppState } from "@/types";
import { getAppState, saveAppState } from "@/utils/storage";
import { fetchListings } from "@/repo/listings";
import { onAuthChange, getUserId, signOut } from "@/repo/auth";
import { toast } from "sonner";

export default function Index() {
  const [searchParams, setSearchParams] = useSearchParams();
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
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
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
          city: row.city,
          category: row.category as CategoryKey,
          subcategory: row.subcategory || undefined,
          title: row.title,
          description: row.description || "",
          price: row.price_cents ? row.price_cents / 100 : undefined,
          currency: row.currency || "USD",
          contact: { phone: row.contact_value || "" },
          tags: row.tags || [],
          photos: row.images || [],
          images: row.images || [],
          lat: row.location_lat,
          lon: row.location_lng,
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

    return filtered.sort((a, b) => b.createdAt - a.createdAt);
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
    const userId = await getUserId();
    if (!userId) {
      setLoginOpen(true);
      toast("Please sign in to post a listing");
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
    <div className="min-h-screen bg-background">
      <Header
        currentCity={appState.city}
        onCityChange={handleCityChange}
        onAccountClick={handleAccountClick}
        onPostClick={handlePostClick}
        onLogoClick={handleLogoClick}
        user={user}
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

      {!shouldShowCityIndex && (
        <div className="container mx-auto px-4 pt-4">
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

      {/* Hero section when no city is selected */}
      {!appState.city && (
        <WorldMapHero 
          lang={lang}
          onBrowseHousing={() => setFilters({ ...filters, category: "housing" })}
          onFindJobs={() => setFilters({ ...filters, category: "jobs" })}
        />
      )}

      <main className="container mx-auto px-4 py-6">
        {shouldShowCityIndex ? (
          <>
            <HomeDigest city={appState.city} />
            <CityIndex
              city={appState.city}
              lang={lang.toLowerCase() as "en" | "ti"}
              onOpen={({ category, sub }) => openCat(category, sub)}
            />
          </>
        ) : (
          <div id="listing-root">
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

      <footer className="bg-muted/30 mt-12 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            {t(lang, "footer_line1")}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {t(lang, "footer_line2")}
          </p>
          <div className="mt-3 flex justify-center">
            <DonationButton />
          </div>
        </div>
      </footer>

      {/* Modals */}
      <PostModal
        city={appState.city || "Select a city"}
        open={postOpen}
        onClose={() => setPostOpen(false)}
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
        onOpenChange={(open) => setDetailOpen(open)}
        listing={selectedListing}
        lang={lang}
      />
    </div>
  );
}