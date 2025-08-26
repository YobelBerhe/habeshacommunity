import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import FilterBar from "@/components/FilterBar";
import ListingGrid from "@/components/ListingGrid";
import LanguageToggle from "@/components/LanguageToggle";
import PostModal from "@/components/PostModal";
import AccountModal from "@/components/AccountModal";
import { Listing, SearchFilters } from "@/types";
import { getListings, seedDemoData, getAppState, saveAppState, getFavorites, toggleFavorite } from "@/utils/storage";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();

  // App state
  const [appState, setAppState] = useState(() => getAppState());
  const [listings, setListings] = useState<Listing[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Detail / modals
  const [postOpen, setPostOpen] = useState(false);
  const [acctOpen, setAcctOpen] = useState(false);
  const [selected, setSelected] = useState<Listing | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // Language
  const [lang, setLang] = useState<string>(() => localStorage.getItem("hn.lang") || "EN");
  const setLanguage = (v:string) => { setLang(v); localStorage.setItem("hn.lang", v); };

  // Filters
  const [filters, setFilters] = useState<SearchFilters>(() => ({
    category: searchParams.get("category") || appState.category || undefined,
    query: searchParams.get("q") || undefined,
    minPrice: searchParams.get("min") ? Number(searchParams.get("min")) : undefined,
    maxPrice: searchParams.get("max") ? Number(searchParams.get("max")) : undefined,
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
    setSelected(listing);
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

      <FilterBar
        filters={filters}
        onFiltersChange={handleFiltersChange}
        viewMode={appState.viewMode}
        onViewModeChange={handleViewModeChange}
        resultsCount={filteredListings.length}
      />

      <main className="container mx-auto px-4 py-6">
        {!filters.category && !filters.query && (
          <section className="mb-12 text-center py-16 bg-gradient-hero rounded-2xl text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10 max-w-3xl mx-auto px-6">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Connect with the
                <br />
                <span className="text-primary-glow">Habesha Community</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90">
                Find rentals, jobs, services, and opportunities in your city
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => handleFiltersChange({ category: "housing" })}
                  className="px-8 py-3 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all font-semibold"
                >
                  Browse Housing
                </button>
                <button
                  onClick={() => handleFiltersChange({ category: "jobs" })}
                  className="px-8 py-3 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all font-semibold"
                >
                  Find Jobs
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Grid */}
        <ListingGrid
          listings={filteredListings}
          onListingSelect={handleListingSelect}
          onFavorite={handleFavorite}
          favoritedListings={favorites}
          loading={loading}
          onPostFirst={() => setPostOpen(true)}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-gradient-card/50 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>© 2025 HabeshaNetwork — Connecting the global Habesha community</p>
            <p className="text-sm mt-2">Rentals • Jobs • Services • Community</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <PostModal
        open={postOpen}
        onOpenChange={setPostOpen}
        defaultCategory={filters.category || "housing"}
        cityFallback={{ lat: Number(appState.cityLat), lon: Number(appState.cityLon) }}
        onSave={(newListing) => {
          try {
            const key = `hn.posts.${appState.city}`;
            const arr = Array.isArray(getListings(appState.city)) ? getListings(appState.city) : [];
            const next = [newListing, ...arr];
            localStorage.setItem(key, JSON.stringify(next));
            setListings(next);
            setSelected(newListing);
            setDetailOpen(true);
            toast({ title: "Posted", description: "Your listing is live." });
          } catch (e: any) {
            toast({ title: "Save failed", description: String(e?.message || e) });
            console.error(e);
          }
        }}
      />
      <AccountModal open={acctOpen} onOpenChange={setAcctOpen} />
    </div>
  );
};

export default Index;
