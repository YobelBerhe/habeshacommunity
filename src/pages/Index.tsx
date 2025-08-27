/* ======================================================================
   FILE: /pages/Index.tsx
   Uses i18n + MapView + fixed modals + safe storage
   ====================================================================== */
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import FilterBar from "@/components/FilterBar";
import ListingGrid from "@/components/ListingGrid";
import LanguageToggle from "@/components/LanguageToggle";
import PostModal from "@/components/PostModal";
import AccountModal from "@/components/AccountModal";
import ListingDetailModal from "@/components/ListingDetailModal";
import MapView from "@/components/MapView";
import CityIndex from "@/components/CityIndex";
import { Listing, SearchFilters } from "@/types";
import { getListingsByCity, seedDemoData, getAppState, saveAppState, getFavorites, toggleFavorite, addListing } from "@/utils/storage";
import { t, Lang } from "@/lib/i18n";
import { setParams, getParam } from "@/lib/url";
import { TAXONOMY, CategoryKey } from "@/lib/taxonomy";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();

  const [appState, setAppState] = useState(() => getAppState());
  const [listings, setListings] = useState<Listing[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [postOpen, setPostOpen] = useState(false);
  const [acctOpen, setAcctOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem("hn.lang") as Lang) || "EN");
  const setLanguage = (v: string) => { setLang((v as Lang) || "EN"); localStorage.setItem("hn.lang", v); };

  const [filters, setFilters] = useState<SearchFilters>(() => ({
    category: searchParams.get("category") || appState.category || undefined,
    subcategory: getParam(searchParams, "sub"),
    query: searchParams.get("q") || undefined,
    minPrice: searchParams.get("min") ? Number(searchParams.get("min")) : undefined,
    maxPrice: searchParams.get("max") ? Number(searchParams.get("max")) : undefined,
  }));

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

  // Load data on mount & city change
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      seedDemoData(appState.city);
      const cityListings = getListingsByCity(appState.city);
      setListings(cityListings);
      setFavorites(getFavorites());
      setLoading(false);
    };
    loadData();
  }, [appState.city]);

  // Filtered
  const filteredListings = useMemo(() => {
    let filtered = [...listings];
    if (filters.category) filtered = filtered.filter(l => l.category === filters.category);
    if (filters.subcategory) filtered = filtered.filter(l => l.subcategory === filters.subcategory);
    if (filters.jobSubcategory) filtered = filtered.filter(l => l.subcategory === filters.jobSubcategory);
    if (filters.query) {
      const q = filters.query.toLowerCase();
      filtered = filtered.filter(l =>
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    if (filters.minPrice !== undefined) filtered = filtered.filter(l => l.price !== undefined && l.price >= filters.minPrice!);
    if (filters.maxPrice !== undefined) filtered = filtered.filter(l => l.price !== undefined && l.price <= filters.maxPrice!);
    if (filters.tags?.length) {
      filtered = filtered.filter(l => filters.tags!.some(ft => l.tags.some(t => t.toLowerCase().includes(ft.toLowerCase()))));
    }
    return filtered.sort((a,b)=>b.createdAt - a.createdAt);
  }, [listings, filters]);

  // Handlers
  const handleCityChange = (city: string, lat?: number, lon?: number) => {
    const next = { ...appState, city, cityLat: lat?.toString() || appState.cityLat, cityLon: lon?.toString() || appState.cityLon };
    setAppState(next); saveAppState(next);
    toast({ title: "City changed", description: `Now browsing ${city}` });
  };

  const handleFiltersChange = (nf: SearchFilters) => {
    // Clear subcategory if it doesn't belong to the new category
    if (nf.category !== filters.category && nf.subcategory) {
      const categorySubcategories = TAXONOMY[nf.category as CategoryKey]?.sub || [];
      if (!categorySubcategories.includes(nf.subcategory)) {
        nf.subcategory = undefined;
      }
    }
    setFilters(nf);
    if (nf.category !== filters.category) {
      const next = { ...appState, category: nf.category || "" };
      setAppState(next); saveAppState(next);
    }
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
    setAppState(next); saveAppState(next);
  };

  const handleListingSelect = (listing: Listing) => {
    setSelectedListing(listing);
    setDetailOpen(true);
  };

  const handleFavorite = (listingId: string) => {
    const on = toggleFavorite(listingId);
    setFavorites(getFavorites());
    toast({
      title: on ? "Added to favorites" : "Removed from favorites",
      description: on ? "Saved to your favorites" : "Removed from your favorites",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        currentCity={appState.city}
        onCityChange={handleCityChange}
        onAccountClick={() => setAcctOpen(true)}
        onPostClick={() => setPostOpen(true)}
        rightExtra={<LanguageToggle value={lang} onChange={setLanguage} />}
      />

      <div className="container mx-auto px-4 pt-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch">
          <select
            className="field md:max-w-[220px]"
            value={filters.category || ""}
            onChange={e => setFilters({ ...filters, category: e.target.value || undefined })}
          >
            <option value="">{t(lang,"all_categories")}</option>
            <option value="housing">{t(lang,"housing")}</option>
            <option value="jobs">{t(lang,"jobs")}</option>
            <option value="forsale">{t(lang,"forsale")}</option>
            <option value="services">{t(lang,"services")}</option>
            <option value="community">{t(lang,"community")}</option>
          </select>

          <input
            className="field flex-1"
            placeholder="Search listings…"
            value={filters.query || ""}
            onChange={e=>setFilters({ ...filters, query: e.target.value || undefined })}
          />

        </div>
      </div>

      {/* Hero or City Index */}
      {!appState.city ? (
        <section className="container mx-auto px-4 mb-10 mt-6">
          <div className="text-center py-14 bg-gradient-hero rounded-2xl text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10 max-w-3xl mx-auto px-6">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                {t(lang,"connect_headline_1")}
                <br />
                <span className="text-primary-glow">{t(lang,"connect_headline_2")}</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90">
                {t(lang,"connect_sub")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-3 bg-white/20 rounded-lg hover:bg-white/30 font-semibold"
                        onClick={()=>setFilters({ ...filters, category: "housing" })}>
                  {t(lang,"browse_housing")}
                </button>
                <button className="px-8 py-3 bg-white/20 rounded-lg hover:bg-white/30 font-semibold"
                        onClick={()=>setFilters({ ...filters, category: "jobs" })}>
                  {t(lang,"find_jobs")}
                </button>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <main className="container mx-auto px-4 pb-8">
        {/* Show City Index or Listings */}
        {appState.city && !filters.query && !filters.subcategory && !filters.tags?.length ? (
          <CityIndex
            city={appState.city}
            lang={lang.toLowerCase() as "en" | "ti"}
            onOpen={({ category, sub }) => openCat(category, sub)}
          />
        ) : (
          <div id="listing-root">
            {/* Map toggle */}
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-muted-foreground">
                {filteredListings.length} {t(lang,"results")}
              </div>
              <div className="flex gap-2">
                <button className="btn">{t(lang,"grid")}</button>
                <button className="btn" onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}>{t(lang,"map")}</button>
              </div>
            </div>

            <ListingGrid
              listings={filteredListings}
              onListingSelect={handleListingSelect}
              onFavorite={handleFavorite}
              favoritedListings={favorites}
              loading={loading}
              onPostFirst={()=>setPostOpen(true)}
            />

            <div className="mt-10">
              <MapView lat={appState.cityLat} lon={appState.cityLon} />
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-border/50 bg-gradient-card/50">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>{t(lang,"footer_line1")}</p>
          <p className="text-sm mt-2">{t(lang,"footer_line2")}</p>
        </div>
      </footer>

      {/* Modals */}
      <PostModal
        city={appState.city || "Asmara"}
        open={postOpen}
        onClose={() => setPostOpen(false)}
        onPosted={(listing) => {
          setListings(getListingsByCity(appState.city || "Asmara"));
          toast({ title: "Posted successfully", description: "Your listing is now live!" });
        }}
      />
      <AccountModal open={acctOpen} onOpenChange={setAcctOpen} />
      <ListingDetailModal 
        open={detailOpen} 
        onOpenChange={setDetailOpen} 
        listing={selectedListing}
        lang={lang}
      />
    </div>
  );
};

export default Index;
