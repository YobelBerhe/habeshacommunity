import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ChevronDown, X } from 'lucide-react';
import MapCluster from '@/components/MapCluster';
import ListingGrid from '@/components/ListingGrid';
import { DesktopHeader } from './DesktopHeader';
import { TAXONOMY, CategoryKey, LABELS } from '@/lib/taxonomy';
import { setParams, getParam } from '@/lib/url';
import type { Listing, SearchFilters } from '@/types';
import { fetchListings } from '@/repo/listings';
import { fetchListingsWithContacts } from '@/repo/listingsWithContacts';
import { useAuth } from '@/store/auth';
import { getContactValue, hasContactAccess } from '@/utils/contactHelpers';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DesktopBrowse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  // Initialize filters from URL params
  const [filters, setFilters] = useState<SearchFilters>(() => ({
    city: searchParams.get("city") || undefined,
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

  // Load data when filters change
  useEffect(() => {
    const loadListings = async () => {
      setLoading(true);
      try {
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
          price_cents: row.price_cents,
          currency: row.currency,
          images: row.images || [],
          lat: row.location_lat,
          lng: row.location_lng,
          location_lat: row.location_lat,
          location_lng: row.location_lng,
          created_at: row.created_at,
          updated_at: row.updated_at,
          status: row.status,
          website_url: row.website_url,
          tags: row.tags || [],
          contact: hasContactAccess(user, row.user_id) 
            ? {
                phone: (row as any).contact_phone,
                email: (row as any).contact_email,
                whatsapp: (row as any).contact_whatsapp,
                telegram: (row as any).contact_telegram,
              }
            : undefined,
        })));
      } catch (error) {
        console.error('Failed to load listings:', error);
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    loadListings();
  }, [filters, user]);

  const handleCitySelect = (city: string) => {
    setFilters(prev => ({ ...prev, city }));
  };

  const handleCategoryChange = (category: string) => {
    setFilters(prev => ({ 
      ...prev, 
      category: category || undefined,
      subcategory: undefined // Reset subcategory when category changes
    }));
  };

  const handleSubcategoryChange = (subcategory: string) => {
    setFilters(prev => ({ ...prev, subcategory: subcategory || undefined }));
  };

  const handleClearAll = () => {
    setFilters({
      city: undefined,
      category: undefined,
      subcategory: undefined,
      query: "",
      minPrice: undefined,
      maxPrice: undefined,
      jobKind: undefined,
    });
    navigate('/browse');
  };

  const handleListingSelect = (listing: Listing) => {
    setSelectedListing(listing);
  };

  // Get subcategories for the current category
  const subcategories = filters.category && TAXONOMY[filters.category as CategoryKey] 
    ? TAXONOMY[filters.category as CategoryKey].sub 
    : [];

  return (
    <div className="hidden md:flex h-screen flex-col">
      <DesktopHeader onCitySelect={handleCitySelect} />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Fixed Map - Left 40% */}
        <div className="w-2/5 relative">
          <MapCluster
            listings={listings}
          />
        </div>

        {/* Filters + Listings - Right 60% */}
        <div className="w-3/5 flex flex-col">
          {/* Filters Bar */}
          <div className="border-b bg-background/95 backdrop-blur p-4">
            <div className="flex items-center gap-4">
              {/* Category Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-2 px-4 py-2 text-sm border rounded-lg hover:bg-muted transition-colors">
                    <span>{filters.category ? TAXONOMY[filters.category as CategoryKey]?.name.en : 'All categories'}</span>
                    <ChevronDown className="w-4 h-4 text-primary" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-0" align="start" side="bottom">
                  <div className="p-1">
                    <button
                      onClick={() => handleCategoryChange('')}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-muted rounded ${!filters.category ? 'bg-muted' : ''}`}
                    >
                      All categories
                    </button>
                    {Object.entries(TAXONOMY).map(([key, category]) => (
                      <button
                        key={key}
                        onClick={() => handleCategoryChange(key)}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-muted rounded ${filters.category === key ? 'bg-muted' : ''}`}
                      >
                        {category.name.en}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Subcategory Filter */}
              {filters.category && subcategories.length > 0 && (
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm border rounded-lg hover:bg-muted transition-colors">
                      <span>
                        {filters.subcategory 
                          ? LABELS[filters.subcategory]?.en || filters.subcategory.replace(/_/g, ' ')
                          : `All ${TAXONOMY[filters.category as CategoryKey]?.name.en}`
                        }
                      </span>
                      <ChevronDown className="w-4 h-4 text-primary" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-0" align="start" side="bottom">
                    <div className="p-1 max-h-64 overflow-y-auto">
                      <button
                        onClick={() => handleSubcategoryChange('')}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-muted rounded ${!filters.subcategory ? 'bg-muted' : ''}`}
                      >
                        All {TAXONOMY[filters.category as CategoryKey]?.name.en}
                      </button>
                      {subcategories.map(sub => (
                        <button
                          key={sub}
                          onClick={() => handleSubcategoryChange(sub)}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-muted rounded ${filters.subcategory === sub ? 'bg-muted' : ''}`}
                        >
                          <span className="text-primary">
                            {LABELS[sub]?.en || sub.replace(/_/g, ' ')}
                          </span>
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              )}

              {/* Clear All */}
              <button
                onClick={handleClearAll}
                className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors ml-auto"
              >
                <X className="w-4 h-4" />
                Clear all
              </button>

              {/* Results Count */}
              <span className="text-sm text-muted-foreground">
                {listings.length} results
              </span>
            </div>
          </div>

          {/* Listings Grid */}
          <div className="flex-1 overflow-y-auto p-4">
            <ListingGrid
              listings={listings}
              loading={loading}
              onListingSelect={handleListingSelect}
              onPostFirst={() => {}}
              newlyPostedId={null}
            />
          </div>
        </div>
      </div>
    </div>
  );
}