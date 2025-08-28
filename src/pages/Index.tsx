import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import FilterBar from "@/components/FilterBar";
import ListingGrid from "@/components/ListingGrid";
import PostModal from "@/components/PostModal";
import AccountModal from "@/components/AccountModal";
import ListingDetailModal from "@/components/ListingDetailModal";
import CityIndex from "@/components/CityIndex";
import MapCluster from "@/components/MapCluster";
import SearchBox from "@/components/SearchBox";
import QuickFilters from "@/components/QuickFilters";
import LanguageToggle from "@/components/LanguageToggle";
import HomeDigest from "@/components/HomeDigest";
import DonationButton from "@/components/DonationButton";
import { setParams, getParam } from "@/lib/url";
import { TAXONOMY, CategoryKey } from "@/lib/taxonomy";
import { t, Lang } from "@/lib/i18n";
import type { Listing, SearchFilters, AppState } from "@/types";
import { getAppState, saveAppState, getListingsByCity } from "@/utils/storage";
import { toast } from "sonner";

export default function Index() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [appState, setAppState] = useState<AppState>(() => getAppState());
  const [listings, setListings] = useState<Listing[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [postOpen, setPostOpen] = useState(false);
  const [acctOpen, setAcctOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [newlyPostedId, setNewlyPostedId] = useState<string | null>(null);
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem("hn.lang") as Lang) || "EN");

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

  // Load data when city changes
  useEffect(() => {
    if (!appState.city) return;
    setLoading(true);
    setListings(getListingsByCity(appState.city));
    setLoading(false);
  }, [appState.city]);

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
        onAccountClick={() => setAcctOpen(true)}
        onPostClick={() => setPostOpen(true)}
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
            </div>

            <button className="btn btn-primary" onClick={() => setPostOpen(true)}>
              + {t(lang, "post")}
            </button>
          </div>

          <QuickFilters
            lang={lang}
            category={filters.category}
            minPrice={filters.minPrice}
            maxPrice={filters.maxPrice}
            jobKind={filters.jobKind as any}
            onChange={(next) => setFilters({ ...filters, ...next })}
            onClearAll={() => setFilters({ category: filters.category })}
          />

          <div className="text-sm text-muted-foreground mb-4">
            {filteredListings.length} {t(lang, "results")}
          </div>
        </div>
      )}

      {/* Hero section when no city is selected */}
      {!appState.city && (
        <section className="container mx-auto px-4 py-20">
          <div className="text-center py-20 bg-gradient-hero rounded-2xl text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10 max-w-4xl mx-auto px-6">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                {t(lang, "connect_headline_1")}
                <br />
                <span className="text-primary-glow">{t(lang, "connect_headline_2")}</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90">
                {t(lang, "connect_sub")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  className="px-8 py-3 bg-white/20 rounded-lg hover:bg-white/30 font-semibold"
                  onClick={() => setFilters({ ...filters, category: "housing" })}
                >
                  {t(lang, "housing")}
                </button>
                <button 
                  className="px-8 py-3 bg-white/20 rounded-lg hover:bg-white/30 font-semibold"
                  onClick={() => setFilters({ ...filters, category: "jobs" })}
                >
                  {t(lang, "jobs")}
                </button>
              </div>
            </div>
          </div>
        </section>
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

      <AccountModal 
        open={acctOpen} 
        onOpenChange={(open) => setAcctOpen(open)}
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