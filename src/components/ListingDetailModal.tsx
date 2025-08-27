import { Listing } from "@/types";
import { t, Lang } from "@/lib/i18n";

export default function ListingDetailModal({
  open, onOpenChange, listing, lang = "EN"
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  listing: Listing | null;
  lang?: Lang;
}) {
  if (!open || !listing) return null;

  const formatDate = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
      
      {/* Modal */}
      <div className="absolute inset-4 md:inset-8 lg:inset-16 bg-background rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-background/90 backdrop-blur border-b px-4 py-3 flex items-center justify-between">
          <h3 className="font-semibold text-lg line-clamp-1">{listing.title}</h3>
          <button className="btn" onClick={() => onOpenChange(false)}>✕</button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-[calc(100%-60px)] p-4 space-y-4">
          {/* Image */}
          <div className="aspect-[16/9] rounded-lg overflow-hidden border">
            {listing.images?.[0] ? (
              <img 
                src={listing.images[0]} 
                alt={listing.title}
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="w-full h-full bg-muted grid place-items-center text-muted-foreground">
                No image available
              </div>
            )}
          </div>

          {/* Price & Meta */}
          <div className="flex items-start justify-between gap-4">
            <div>
              {listing.price && (
                <div className="text-3xl font-bold text-primary mb-1">
                  ${listing.price.toLocaleString()}
                </div>
              )}
              <div className="text-sm text-muted-foreground">
                {listing.categoryLabel}
                {listing.jobSubcategoryLabel && ` • ${listing.jobSubcategoryLabel}`}
              </div>
              <div className="text-sm text-muted-foreground">
                Posted {formatDate(listing.createdAt)}
              </div>
            </div>
          </div>

          {/* Description */}
          {listing.description && (
            <div>
              <h4 className="font-semibold mb-2">Description</h4>
              <p className="whitespace-pre-wrap text-foreground">{listing.description}</p>
            </div>
          )}

          {/* Tags */}
          {listing.tags?.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {listing.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 text-sm rounded-full bg-muted text-muted-foreground">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Contact */}
          <div className="bg-gradient-card border rounded-lg p-4">
            <h4 className="font-semibold mb-2">Contact Information</h4>
            <div className="text-foreground">
              {typeof listing.contact === 'string' 
                ? listing.contact 
                : listing.contact 
                  ? Object.entries(listing.contact)
                      .filter(([, v]) => v)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(', ') || "No contact information provided"
                  : "No contact information provided"
              }
            </div>
          </div>

          {/* Location */}
          {(listing.lat && listing.lon) && (
            <div>
              <h4 className="font-semibold mb-2">Location</h4>
              <div className="rounded-lg border overflow-hidden">
                <iframe
                  title="listing-location"
                  src={`https://www.openstreetmap.org/export/embed.html?marker=${listing.lat},${listing.lon}&layers=mapnik&zoom=15`}
                  width="100%"
                  height="240"
                  style={{ border: 0 }}
                />
              </div>
            </div>
          )}

          {/* Additional images */}
          {listing.images && listing.images.length > 1 && (
            <div>
              <h4 className="font-semibold mb-2">More Photos</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {listing.images.slice(1).map((img, i) => (
                  <div key={i} className="aspect-square rounded-lg overflow-hidden border">
                    <img src={img} alt={`${listing.title} ${i + 2}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}