import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import MobileHeader from "@/components/layout/MobileHeader";
import Header from "@/components/Header";
import ListingGrid from "@/components/ListingGrid";
import InteractiveListingMap from "@/components/InteractiveListingMap";
import GlobalMap from "@/components/GlobalMap";
import StickyPostCTA from "@/components/StickyPostCTA";
import Footer from "@/components/Footer";
import CitySearchBar from "@/components/CitySearchBar";
import LanguageToggle from "@/components/LanguageToggle";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { setParams, getParam } from "@/lib/url";
import { TAXONOMY, CategoryKey, LABELS } from "@/lib/taxonomy";
import { t, Lang } from "@/lib/i18n";
import { useLanguage } from "@/store/language";
import type { Listing, SearchFilters, AppState } from "@/types";
import { getAppState, saveAppState } from "@/utils/storage";
import { fetchListings } from "@/repo/listings";
import { fetchListingsWithContacts } from "@/repo/listingsWithContacts";
import { useAuth } from '@/store/auth';
import { getContactValue, hasContactAccess } from "@/utils/contactHelpers";
import { Grid3X3, Map, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import AuthModal from "@/components/AuthModal";
import PostModal from "@/components/PostModal";
import ViewToggle from "@/components/ViewToggle";
import SortDropdown from "@/components/SortDropdown";

import type { ViewMode, SortKey } from "@/components/ViewToggle";
import { sortListings, applyQuickFilters } from "@/utils/ui";

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, openAuth, openPost } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [appState, setAppState] = useState<AppState>(() => getAppState());
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  
  // View and sorting state with localStorage persistence
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

  // Persist view and filter states
  useEffect(() => localStorage.setItem('hn.viewMode', viewMode), [viewMode]);
  useEffect(() => localStorage.setItem('hn.sort', sortKey), [sortKey]);
  useEffect(() => localStorage.setItem('hn.filter.hasImage', hasImageFilter.toString()), [hasImageFilter]);
  useEffect(() => localStorage.setItem('hn.filter.postedToday', postedTodayFilter.toString()), [postedTodayFilter]);

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
        // Use contact-aware fetch if user is authenticated, otherwise regular fetch
        const data = user 
          ? await fetchListingsWithContacts({
              city: filters.city,
              category: filters.category,
              q: filters.query,
              minPrice: filters.minPrice,
              maxPrice: filters.maxPrice,
              subcategory: filters.subcategory,
            })
          : await fetchListings({
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
  }, [filters.city, filters.category, filters.query, filters.minPrice, filters.maxPrice, filters.subcategory, user]);

  // Filter and sort listings
  const processedListings = useMemo(() => {
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

    // Apply quick filters
    filtered = applyQuickFilters(filtered, { 
      hasImage: hasImageFilter || sortKey === "has_image", 
      postedToday: postedTodayFilter 
    });

    // Apply sorting
    return sortListings(filtered, sortKey);
  }, [listings, filters, hasImageFilter, postedTodayFilter, sortKey]);

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
              value={language}
              onChange={setLanguage}
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

      {/* Filter Controls - Sticky */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b">
        <div className="px-4 py-3">
          <div className="flex items-center gap-1 mb-3 overflow-x-auto">
            {/* Category Filter */}
            <Popover modal={false}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1 flex-shrink-0">
                  {filters.category 
                    ? TAXONOMY[filters.category as CategoryKey]?.name[language.toLowerCase() as 'en' | 'ti'] || "Category"
                    : language === 'EN' ? "All categories" : "ኩሉ ምድብታት"
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
                      {value.name[language.toLowerCase() as 'en' | 'ti']}
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
                  className="gap-1 flex-shrink-0"
                  disabled={!filters.category}
                >
                  {filters.subcategory 
                    ? LABELS[filters.subcategory]?.[language.toLowerCase() as 'en' | 'ti'] || filters.subcategory
                    : filters.category ? (language === 'EN' ? "Subcategory" : "ንኣብ ምድብ") : (language === 'EN' ? "Select category first" : "ቀዳማይ ምድብ ምረጽ")
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
                      {language === 'EN' ? 'All' : 'ኩሉ'} {TAXONOMY[filters.category as CategoryKey]?.name[language.toLowerCase() as 'en' | 'ti']?.toLowerCase()}
                    </button>
                    {TAXONOMY[filters.category as CategoryKey]?.sub.map((sub) => (
                      <button
                        key={sub}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-accent rounded-sm text-primary"
                        onClick={() => setFilters({ ...filters, subcategory: sub })}
                      >
                        {LABELS[sub]?.[language.toLowerCase() as 'en' | 'ti'] || sub}
                      </button>
                    ))}
                  </div>
                )}
              </PopoverContent>
            </Popover>

            {/* Clear All */}
            <Button variant="ghost" size="sm" className="flex-shrink-0" onClick={handleClearAll}>
              {language === 'EN' ? 'Clear' : 'ኣጽዓን'}
            </Button>
          </div>
          
          {/* Results and controls */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {processedListings.length} {language === 'EN' ? 'results' : 'ውጽኢታት'}
              {filters.city && ` ${language === 'EN' ? 'in' : 'ኣብ'} ${filters.city}`}
            </div>
            
            <div className="text-sm text-muted-foreground">
              Sorted by {sortKey === 'relevance' ? 'Recommended' : 
                        sortKey === 'price_asc' ? 'Price (Low to High)' : 
                        sortKey === 'price_desc' ? 'Price (High to Low)' :
                        sortKey === 'newest' ? 'Newest' :
                        sortKey === 'oldest' ? 'Oldest' : 
                        sortKey === 'has_image' ? 'Has Image' : 'Upcoming'}
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <div></div>
            <div className="flex items-center gap-2">
              <ViewToggle viewMode={viewMode} onChange={setViewMode} />
              <SortDropdown sortKey={sortKey} onChange={setSortKey} />
            </div>
          </div>
        </div>
      </div>

      {/* Background Map for city focusing */}
      {filters.city && (
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <GlobalMap 
            focusCity={{
              lat: 0, lng: 0, // Will be updated when we have city coordinates
              name: filters.city
            }}
            modalOpen={false}
            viewMode="grid"
          />
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 mb-20">
        {viewMode === "grid" ? (
          <ListingGrid
            listings={processedListings}
            onListingClick={handleListingSelect}
            loading={loading}
            newlyPostedId={null}
          />
        ) : viewMode === "list" ? (
          <div className="space-y-4">
            {processedListings.map((listing) => (
              <div key={listing.id} className="border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                   onClick={() => handleListingSelect(listing)}>
                <h3 className="font-semibold">{listing.title}</h3>
                <p className="text-sm text-muted-foreground">{listing.description}</p>
                {listing.price && <p className="font-medium">${listing.price}</p>}
              </div>
            ))}
          </div>
        ) : viewMode === "gallery" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {processedListings.map((listing) => (
              <div key={listing.id} className="aspect-square cursor-pointer" onClick={() => handleListingSelect(listing)}>
                {listing.images?.length > 0 ? (
                  <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                    No image
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <InteractiveListingMap
            listings={processedListings}
            onListingClick={handleListingSelect}
            center={
              processedListings.length > 0 && processedListings[0].lat && processedListings[0].lng
                ? { lat: processedListings[0].lat, lng: processedListings[0].lng }
                : { lat: 40.7128, lng: -74.0060 }
            }
            height="calc(100vh - 250px)"
          />
        )}
      </main>
      
      <Footer />
      <StickyPostCTA />
      
      {/* Modals */}
      <AuthModal />
      <PostModal city={filters.city || "Select a city"} />
    </div>
  );
}