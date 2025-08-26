import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import FilterBar from "@/components/FilterBar";
import ListingGrid from "@/components/ListingGrid";
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
  
  // Filters from URL or state
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
    if (filters.minPrice) params.set("min", filters.minPrice.toString());
    if (filters.maxPrice) params.set("max", filters.maxPrice.toString());
    
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  // Load data on mount and city change
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      // Seed demo data if needed
      seedDemoData(appState.city);
      
      // Load listings for current city
      const cityListings = getListings(appState.city);
      setListings(cityListings);
      
      // Load favorites
      setFavorites(getFavorites());
      
      setLoading(false);
    };

    loadData();
  }, [appState.city]);

  // Filter listings based on current filters
  const filteredListings = useMemo(() => {
    let filtered = [...listings];

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(listing => listing.category === filters.category);
    }

    // Job subcategory filter
    if (filters.jobSubcategory) {
      filtered = filtered.filter(listing => listing.jobSubcategory === filters.jobSubcategory);
    }

    // Search query filter
    if (filters.query) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(listing => 
        listing.title.toLowerCase().includes(query) ||
        listing.description.toLowerCase().includes(query) ||
        listing.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Price filters
    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(listing => 
        listing.price !== undefined && listing.price >= filters.minPrice!
      );
    }

    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(listing => 
        listing.price !== undefined && listing.price <= filters.maxPrice!
      );
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(listing => 
        filters.tags!.some(filterTag => 
          listing.tags.some(listingTag => 
            listingTag.toLowerCase().includes(filterTag.toLowerCase())
          )
        )
      );
    }

    // Sort by creation date (newest first)
    return filtered.sort((a, b) => b.createdAt - a.createdAt);
  }, [listings, filters]);

  const handleCityChange = (city: string) => {
    const newState = { ...appState, city };
    setAppState(newState);
    saveAppState(newState);
    
    toast({
      title: "City changed",
      description: `Now browsing listings in ${city}`,
    });
  };

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    
    // Save category to app state for persistence
    if (newFilters.category !== filters.category) {
      const newState = { ...appState, category: newFilters.category || "" };
      setAppState(newState);
      saveAppState(newState);
    }
  };

  const handleViewModeChange = (mode: "grid" | "map") => {
    const newState = { ...appState, viewMode: mode };
    setAppState(newState);
    saveAppState(newState);
  };

  const handleListingSelect = (listing: Listing) => {
    // In a real app, this would navigate to a detailed view
    toast({
      title: listing.title,
      description: "Listing details would open here",
    });
  };

  const handleFavorite = (listingId: string) => {
    const isNowFavorited = toggleFavorite(listingId);
    setFavorites(getFavorites());
    
    toast({
      title: isNowFavorited ? "Added to favorites" : "Removed from favorites",
      description: isNowFavorited ? "You can find this listing in your favorites" : "Listing removed from your favorites",
    });
  };

  const handleAccountClick = () => {
    toast({
      title: "Account",
      description: "Account modal would open here",
    });
  };

  const handlePostClick = () => {
    toast({
      title: "Post Listing",
      description: "Post modal would open here",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        currentCity={appState.city}
        onCityChange={handleCityChange}
        onAccountClick={handleAccountClick}
        onPostClick={handlePostClick}
      />
      
      <FilterBar
        filters={filters}
        onFiltersChange={handleFiltersChange}
        viewMode={appState.viewMode}
        onViewModeChange={handleViewModeChange}
        resultsCount={filteredListings.length}
      />

      <main className="container mx-auto px-4 py-6">
        {/* Hero Section - Only show when no filters are active */}
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

        {/* Listings */}
        {appState.viewMode === "grid" ? (
          <ListingGrid
            listings={filteredListings}
            onListingSelect={handleListingSelect}
            onFavorite={handleFavorite}
            favoritedListings={favorites}
            loading={loading}
          />
        ) : (
          <div className="bg-gradient-card rounded-lg border border-border/50 p-8 text-center">
            <h3 className="text-xl font-semibold mb-4">Map View</h3>
            <p className="text-muted-foreground mb-6">
              Interactive map with listing locations would be displayed here.
              <br />
              This requires Mapbox API integration.
            </p>
            <button
              onClick={() => handleViewModeChange("grid")}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Switch to Grid View
            </button>
          </div>
        )}
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
    </div>
  );
};

export default Index;
