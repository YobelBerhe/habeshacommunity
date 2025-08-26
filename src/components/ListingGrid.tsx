import { Listing } from "@/types";

export default function ListingGrid({
  listings, onListingSelect, onFavorite, favoritedListings, loading, onPostFirst
}: {
  listings: Listing[];
  onListingSelect: (l: Listing) => void;
  onFavorite: (id: string) => void;
  favoritedListings: string[];
  loading?: boolean;
  onPostFirst?: () => void;
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
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {listings.map(card => (
        <div key={card.id} className="rounded-xl bg-gradient-card border p-3">
          <div className="aspect-[4/3] rounded-lg bg-muted grid place-items-center text-muted-foreground">
            {card.images?.[0] ? <img src={card.images[0]} className="w-full h-full object-cover rounded-lg" /> : "No image"}
          </div>
          <div className="mt-3">
            <div className="font-semibold line-clamp-1">{card.title}</div>
            <div className="text-xs text-muted-foreground mb-2">
              {card.categoryLabel}{card.jobSubcategoryLabel ? ` • ${card.jobSubcategoryLabel}` : ""}
            </div>
            {card.tags?.length ? (
              <div className="flex flex-wrap gap-1">
                {card.tags.slice(0,3).map((t,i)=>(
                  <span key={i} className="px-2 py-0.5 rounded bg-muted text-xs">#{t}</span>
                ))}
              </div>
            ): null}
            <div className="mt-3 flex items-center justify-between">
              {card.price ? <div className="font-semibold">${card.price}</div> : <div />}
              <div className="flex items-center gap-2">
                <button className="btn" onClick={()=>onFavorite(card.id)} aria-label="favorite">♡</button>
                <button className="btn btn-primary" onClick={()=>onListingSelect(card)}>View</button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}