import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import MapCluster from '@/components/MapCluster';
import ListingGrid from '@/components/ListingGrid';
import { DesktopHeader } from './DesktopHeader';
import { TAXONOMY, CategoryKey, LABELS } from '@/lib/taxonomy';
import type { Listing, SearchFilters } from '@/types';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
  listings: Listing[];
  filters: SearchFilters;
  onFiltersChange: (newFilters: SearchFilters) => void;
  onClearAll: () => void;
  onListingSelect: (listing: Listing) => void;
  loading: boolean;
};

export function DesktopBrowse({ 
  listings, 
  filters, 
  onFiltersChange, 
  onClearAll, 
  onListingSelect,
  loading 
}: Props) {
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  const handleCitySelect = (city: string) => {
    onFiltersChange({ ...filters, city });
  };

  const handleCategoryChange = (category: string) => {
    onFiltersChange({ 
      ...filters, 
      category: category || undefined,
      subcategory: undefined // Reset subcategory when category changes
    });
  };

  const handleSubcategoryChange = (subcategory: string) => {
    onFiltersChange({ ...filters, subcategory: subcategory || undefined });
  };

  const handleListingSelect = (listing: Listing) => {
    setSelectedListing(listing);
    onListingSelect(listing);
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
                onClick={onClearAll}
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