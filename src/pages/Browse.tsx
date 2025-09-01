import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import MobileHeader from "@/components/layout/MobileHeader";
import Header from "@/components/Header";
import ListingGrid from "@/components/ListingGrid";
import MapCluster from "@/components/MapCluster";
import CitySearchBar from "@/components/CitySearchBar";
import LanguageToggle from "@/components/LanguageToggle";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { setParams, getParam } from "@/lib/url";
import { TAXONOMY, CategoryKey, LABELS } from "@/lib/taxonomy";
import { t, Lang } from "@/lib/i18n";
import type { Listing, SearchFilters, AppState } from "@/types";
import { getAppState, saveAppState } from "@/utils/storage";
import { fetchListings } from "@/repo/listings";
import { Grid3X3, Map, ChevronDown } from "lucide-react";
import { toast } from "sonner";

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [appState, setAppState] = useState<AppState>(() => getAppState());
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem("hn.lang") as Lang) || "EN");
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

  // Initialize filters from URL params
  const [filters, setFilters] = useState<SearchFilters>(() => ({
    city: searchParams.get("city") || appState.city || undefined,
    category: searchParams.get("category") || undefined,
    subcategory: getParam(searchParams, "sub"),
    query: searchParams.get("q") || "",
    minPrice: searchParams.get("min") ? Number(searchParams.get("min")) : undefined,
    maxPrice: searchParams.get("max") ? Number(searchParams.get("max")) : undefined,
    jobKind: undefined as "regular"|"gig"|undefined,
  }));

  // Update URL when filters change
  useEffect(() => {
    const params = setParams(new URLSearchParams(), {
      city: filters.city,
      category: filters.category,
      sub: filters.subcategory,
      q: filters.query,
      min: filters.minPrice?.toString(),
      max: filters.maxPrice?.toString(),
    });
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  // Update app state when city changes
  useEffect(() => {
    if (filters.city && filters.city !== appState.city) {
      const next = { ...appState, city: filters.city };
      setAppState(next);
      saveAppState(next);
    }
  }, [filters.city, appState]);

  // Load data when filters change
  useEffect(() => {
    const loadListings = async () => {
      setLoading(true);
      try {
        const data = await fetchListings({
          city: filters.city,
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
  }, [filters.city, filters.category, filters.query, filters.minPrice, filters.maxPrice, filters.subcategory]);

  // Filter listings
  const filteredListings = useMemo(() => {
    let filtered = [...listings];

    if (filters.category) {
      filtered = filtered.filter(listing => listing.category === filters.category);
    }

    if (filters.subcategory) {
      filtered = filtered.filter(listing => listing.subcategory === filters.subcategory);
    }

    if (filters.query) {
      const q = filters.query.toLowerCase();
      filtered = filtered.filter(listing =>
        listing.title.toLowerCase().includes(q) ||
        listing.description.toLowerCase().includes(q) ||
        listing.tags.some(tag => tag.toLowerCase().includes(q))
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

  const handleCityChange = (city: string, lat?: number, lon?: number) => {
    setFilters({ ...filters, city });
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

  const handleClearAll = () => {
    setFilters({
      city: filters.city, // Keep city
      category: undefined,
      subcategory: undefined,
      query: "",
      minPrice: undefined,
      maxPrice: undefined,
      jobKind: undefined,
    });
  };

  const handleListingSelect = (listing: Listing) => {
    navigate(`/l/${listing.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Header */}
      <div className="hidden md:block">
        <Header
          currentCity={filters.city || ""}
          onCityChange={handleCityChange}
          onAccountClick={() => {}}
          onLogoClick={() => navigate("/")}
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

      {/* Mobile City Search Bar */}
      <div className="md:hidden px-4 py-2 border-b bg-background">
        <CitySearchBar 
          value={filters.city}
          onCitySelect={handleCityChange}
        />
      </div>

      {/* Filter Controls */}
      <div className="border-b bg-background">
        <div className="px-4 py-3">
          <div className="flex items-center gap-2 mb-3">
            {/* Category Filter */}
            <Popover modal={false}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  {filters.category 
                    ? TAXONOMY[filters.category as CategoryKey]?.name.en || "Category"
                    : "All categories"
                  }
                  <ChevronDown className="w-3 h-3 text-primary" />
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                side="bottom" 
                align="start" 
                className="w-56 p-1"
                collisionPadding={8}
              >
                <div className="space-y-1">
                  <button
                    className="w-full text-left px-3 py-2 text-sm hover:bg-accent rounded-sm"
                    onClick={() => setFilters({ ...filters, category: undefined, subcategory: undefined })}
                  >
                    All categories
                  </button>
                  {Object.entries(TAXONOMY).map(([key, value]) => (
                    <button
                      key={key}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-accent rounded-sm"
                      onClick={() => setFilters({ ...filters, category: key, subcategory: undefined })}
                    >
                      {value.name.en}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* Subcategory Filter */}
            <Popover modal={false}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1"
                  disabled={!filters.category}
                >
                  {filters.subcategory 
                    ? LABELS[filters.subcategory]?.en || filters.subcategory
                    : filters.category ? "Subcategory" : "Select category first"
                  }
                  <ChevronDown className="w-3 h-3 text-primary" />
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                side="bottom" 
                align="start" 
                className="w-56 p-1 max-h-64 overflow-y-auto"
                collisionPadding={8}
              >
                {filters.category && (
                  <div className="space-y-1">
                    <button
                      className="w-full text-left px-3 py-2 text-sm hover:bg-accent rounded-sm"
                      onClick={() => setFilters({ ...filters, subcategory: undefined })}
                    >
                      All {TAXONOMY[filters.category as CategoryKey]?.name.en.toLowerCase()}
                    </button>
                    {TAXONOMY[filters.category as CategoryKey]?.sub.map((sub) => (
                      <button
                        key={sub}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-accent rounded-sm text-primary"
                        onClick={() => setFilters({ ...filters, subcategory: sub })}
                      >
                        {LABELS[sub]?.en || sub}
                      </button>
                    ))}
                  </div>
                )}
              </PopoverContent>
            </Popover>

            {/* Clear All */}
            <Button variant="ghost" size="sm" onClick={handleClearAll}>
              Clear all
            </Button>
          </div>
          
          {/* View Mode Toggle & Results Count */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {filteredListings.length} results
              {filters.city && ` in ${filters.city}`}
            </div>
            
            <div className="flex gap-1">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "map" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("map")}
              >
                <Map className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {viewMode === "grid" ? (
          <ListingGrid
            listings={filteredListings}
            onListingSelect={handleListingSelect}
            loading={loading}
            onPostFirst={() => {}}
            newlyPostedId={null}
          />
        ) : (
          <MapCluster
            center={filters.city ? undefined : undefined}
            listings={filteredListings}
            height={480}
          />
        )}
      </main>
    </div>
  );
}