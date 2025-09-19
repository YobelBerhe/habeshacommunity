import { Listing } from "@/types";
import ListingCard from "./ListingCard";

export interface ListingGridProps {
  listings: Listing[];
  loading?: boolean;
  onListingClick: (listing: Listing) => void;
  currentUserId?: string;
  newlyPostedId?: string | null;
  favorites?: string[];
  onFavorite?: (listingId: string) => void;
  viewMode?: "list" | "grid" | "gallery" | "map" | "compact";
}

export default function ListingGrid({
  listings,
  loading = false,
  onListingClick,
  currentUserId,
  newlyPostedId,
  favorites = [],
  onFavorite,
  viewMode = "list",
}: ListingGridProps) {
  const getGridClass = () => {
    switch (viewMode) {
      case "gallery":
        return "grid grid-cols-1 md:grid-cols-3 gap-4";
      case "list":
        return "grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-1";
      case "compact":
        return "grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-1";
      case "grid":
        return "grid grid-cols-2 gap-1 md:grid-cols-3 md:gap-1";
      default:
        return "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3";
    }
  };

  return (
    <div id="listing-root" className="space-y-4">
      {listings.length === 0 && !loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No listings found</p>
          <p className="text-sm text-muted-foreground">Try adjusting your search or category</p>
        </div>
      ) : (
        <div className={getGridClass()}>
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onSelect={onListingClick}
              showJustPosted={listing.id === newlyPostedId}
              viewMode={viewMode}
            />
          ))}
          {loading && (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-video bg-muted rounded-lg mb-3"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}