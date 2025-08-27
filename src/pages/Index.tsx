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
import { Listing, SearchFilters } from "@/types";
import { getListings, seedDemoData, getAppState, saveAppState, getFavorites, toggleFavorite, saveListing } from "@/utils/storage";
import { t, Lang } from "@/lib/i18n";
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
    query: searchParams.get("q") || undefined,
  }));

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.category) params.set("category", filters.category);
    if (filters.query) params.set("q", filters.query);
    if (filters.minPrice) params.set("min", String(filters.minPrice));
    if (filters.maxPrice) params.set("max", String(filters.maxPrice));
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  // Load data on mount & city change
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      seedDemoData(appState.city);
      const cityListings = getListings(appState.city);
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
    if (filters.jobSubcategory) filtered = filtered.filter(l => l.jobSubcategory === filters.jobSubcategory);
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
    setFilters(nf);
    if (nf.category !== filters.category) {
      const next = { ...appState, category: nf.category || "" };
      setAppState(next); saveAppState(next);
    }
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

          <div className="flex items-center gap-2">
            <button className="btn btn-primary" onClick={()=>setPostOpen(true)}>+ {t(lang,"post")}</button>
          </div>
        </div>
      </div>

      {/* Hero */}
      {!filters.category && !filters.query && (
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
      )}

      <main className="container mx-auto px-4 pb-8">
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
      </main>

      <footer className="border-t border-border/50 bg-gradient-card/50">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>{t(lang,"footer_line1")}</p>
          <p className="text-sm mt-2">{t(lang,"footer_line2")}</p>
        </div>
      </footer>

      {/* Modals */}
      <PostModal
        open={postOpen}
        onOpenChange={setPostOpen}
        defaultCategory={filters.category || "housing"}
        cityFallback={{ lat: Number(appState.cityLat), lon: Number(appState.cityLon) }}
        onSave={async (l) => {
          const res = await saveListing(appState.city || "Asmara", l);
          if (res.ok) {
            setListings(getListings(appState.city || "Asmara"));
            toast({ title: res.note ? "Posted (images skipped)" : "Posted", description: res.note });
          } else {
            toast({ title: "Save failed", description: "Browser storage quota exceeded. Add fewer/smaller photos." });
          }
          return res;
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
