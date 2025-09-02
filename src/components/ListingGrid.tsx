import ListingCard from "@/components/ListingCard";
import LiveUserMap from "@/components/LiveUserMap";
import { Listing } from "@/types";
import { useLocation } from "react-router-dom";

interface ListingGridProps {
  listings: Listing[];
  onListingSelect: (listing: Listing) => void;
  loading?: boolean;
  onPostFirst: () => void;
  newlyPostedId: string | null;
}

export default function ListingGrid({
  listings,
  onListingSelect,
  loading,
  onPostFirst,
  newlyPostedId
}: ListingGridProps) {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-lg">Loading listings...</div>
      </div>
    );
  }

  if (listings.length === 0) {
    // Show live user map only on homepage
    if (isHomePage) {
      return (
        <div className="mx-auto max-w-4xl">
          <LiveUserMap />
        </div>
      );
    }
    
    // Show regular empty state on other pages
    return (
      <div className="text-center space-y-4 py-12">
        <div className="text-6xl">📝</div>
        <h3 className="text-xl font-semibold">No listings found</h3>
        <p className="text-muted-foreground">Be the first to post in this area!</p>
        <button
          onClick={onPostFirst}
          className="inline-block py-3 px-6 border border-primary text-primary bg-white hover:bg-primary/5 rounded-lg transition-colors font-medium"
        >
          Post First Listing
        </button>
      </div>
    );
  }

  return (
    <div id="listing-root" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {listings.map(listing => (
        <ListingCard
          key={listing.id}
          listing={listing}
          onSelect={onListingSelect}
          showJustPosted={listing.id === newlyPostedId}
        />
      ))}
    </div>
  );
}