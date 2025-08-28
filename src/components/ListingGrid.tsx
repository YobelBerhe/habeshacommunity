import { Listing } from "@/types";
import ListingCard from "./ListingCard";

export default function ListingGrid({
  listings, onListingSelect, loading, onPostFirst, newlyPostedId
}: {
  listings: Listing[];
  onListingSelect: (l: Listing) => void;
  loading?: boolean;
  onPostFirst?: () => void;
  newlyPostedId?: string;
}) {
  if (loading) return <div className="py-12 text-center text-muted-foreground">Loading…</div>;
  if (!listings.length) {
    return (
      <div className="py-16 text-center">
        <div className="text-2xl font-semibold mb-2">No listings found</div>
        <div className="text-muted-foreground mb-6">
          Try adjusting your search or be the first to post in this category!
        </div>
        <button className="btn btn-primary" onClick={onPostFirst}>Post First Listing</button>
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