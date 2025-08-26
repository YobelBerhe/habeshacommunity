import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import FilterBar from "@/components/FilterBar";
import ListingGrid from "@/components/ListingGrid";
import { Listing, SearchFilters } from "@/types";
import {
  getListings, seedDemoData, getAppState, saveAppState,
  getFavorites, toggleFavorite
} from "@/utils/storage";
import ListingDetailDrawer from "@/components/ListingDetailDrawer";
import AccountModal from "@/components/AccountModal";
import PostModal from "@/components/PostModal";
import MapView from "@/components/MapView";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();

  // App state
  const [appState, setAppState] = useState(() => getAppState());
  const [listings, setListings] = useState<Listing[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // UI state
  const [detailOpen, setDetailOpen] = useState(false);
  const [selected, setSelected] = useState<Listing | null>(null);
  const [acctOpen, setAcctOpen] = useState(false);
  const [postOpen, setPostOpen] = useState(false);

  // Filters from URL or state
  const [filters, setFilters] = useState<SearchFilters>(() => ({
    category: searchParams.get("category") || appState.category || undefined,
    jobSubcategory: searchParams.get("job") || undefined,
    query: searchParams.get("q") || undefined,
    minPrice: searchParams.get("min") ? Number(searchParams.get("min")) : undefined,
    maxPrice: searchParams.get("max") ? Number(searchParams.get("max")) : undefined,
  }));

  // Sync URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.category) params.set("category", filters.category);
    if (filters.jobSubcategory) params.set("job", filters.jobSubcategory);
    if (filters.query) params.set("q", filters.query);
    if (filters.minPrice != null) params.set("min", String(filters.minPrice));
    if (filters.maxPrice != null) params.set("max", String(filters.maxPrice));
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  // Load data
  useEffect(() => {
    setLoading(true);
    seedDemoData(appState.city);
    setListings(getListings(appState.city));
    setFavorites(getFavorites());
    setLoading(false);
  }, [appState.city]);

  // Filtering
  const filteredListings = useMemo(() => {
    let arr = [...listings];
    if (filters.category) arr = arr.filter(l => l.category === filters.category);
    if (filters.jobSubcategory) arr = arr.filter(l => l.jobSubcategory === filters.jobSubcategory);
    if (filters.query) {
      const q = filters.query.toLowerCase();
      arr = arr.filter(l =>
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    if (filters.minPrice !== undefined) arr = arr.filter(l => l.price != null && (l.price as number) >= filters.minPrice!);
    if (filters.maxPrice !== undefined) arr = arr.filter(l => l.price != null && (l.price as number) <= filters.maxPrice!);
    if (filters.tags?.length) {
      arr = arr.filter(l => filters.tags!.some(t => l.tags.some(x => x.toLowerCase().includes(t.toLowerCase()))));
    }
    return arr.sort((a, b) => b.createdAt - a.createdAt);
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
        onCityChange={handleCityChange}     // gets (city, lat, lon)
        onAccountClick={() => setAcctOpen(true)}
        onPostClick={() => setPostOpen(true)}
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
          <section className="mb-8 text-center py-12 md:py-16 bg-gradient-hero rounded-2xl text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10 max-w-3xl mx-auto px-6">
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                Connect with the <span className="text-primary-glow">Habesha Community</span>
              </h1>
              <p className="text-lg md:text-xl mb-6 text-white/90">
                Find rentals, jobs, services, and opportunities in your city
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button onClick={() => handleFiltersChange({ category: "housing" })}
                        className="px-6 py-3 bg-white/20 rounded-lg hover:bg-white/30 font-semibold">
                  Browse Housing
                </button>
                <button onClick={() => handleFiltersChange({ category: "jobs" })}
                        className="px-6 py-3 bg-white/20 rounded-lg hover:bg-white/30 font-semibold">
                  Find Jobs
                </button>
              </div>
            </div>
          </section>
        )}

        {appState.viewMode === "grid" ? (
          <ListingGrid
            listings={filteredListings}
            onListingSelect={handleListingSelect}
            onFavorite={handleFavorite}
            favoritedListings={favorites}
            loading={loading}
          />
        ) : (
          <MapView
            items={filteredListings}
            fallback={{ lat: Number(appState.cityLat) || undefined, lon: Number(appState.cityLon) || undefined }}
            onMarkerClick={(id) => {
              const l = filteredListings.find(x => x.id === id);
              if (l) { setSelected(l); setDetailOpen(true); }
            }}
          />
        )}
      </main>

      <footer className="border-t border-border/50 bg-gradient-card/50 mt-12">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>© 2025 HabeshaNetwork — Connecting the global Habesha community</p>
          <p className="text-sm mt-2">Rentals • Jobs • Services • Community</p>
        </div>
      </footer>

      {/* DRAWERS / MODALS */}
      <ListingDetailDrawer open={detailOpen} onOpenChange={setDetailOpen} listing={selected} />
      <AccountModal open={acctOpen} onOpenChange={setAcctOpen} />
      <PostModal
        open={postOpen}
        onOpenChange={setPostOpen}
        defaultCategory={filters.category || "housing"}
        cityFallback={{ lat: Number(appState.cityLat), lon: Number(appState.cityLon) }}
        onSave={(newListing) => {
          const arr = getListings(appState.city);
          arr.unshift(newListing);
          localStorage.setItem(`hn.posts.${appState.city}`, JSON.stringify(arr));
          setListings(arr);
        }}
      />
    </div>
  );
};

export default Index;
