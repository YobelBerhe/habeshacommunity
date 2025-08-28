import { useEffect, useMemo, useState } from "react";
import type { Listing } from "@/types";
import MapMini from "@/components/MapMini";
import { toggleFavorite, fetchFavorites } from "@/repo/favorites";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Props = {
  open: boolean;
  listing: Listing | null;
  onClose: () => void;
  onSavedChange?: (saved: boolean) => void;
};

async function reportListing(listingId: string, reason: string) {
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user?.id ?? null;
  const { error } = await supabase.from("reports").insert({
    listing_id: listingId,
    reporter_id: userId,
    reason,
    details: null,
  });
  if (error) throw error;
}

export default function ListingDetail({ open, listing, onClose, onSavedChange }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [saved, setSaved] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportText, setReportText] = useState("");

  useEffect(() => {
    if (!listing) return;
    setActiveIdx(0);
    
    // Check if favorited
    (async () => {
      try {
        const { data: auth } = await supabase.auth.getUser();
        if (auth.user) {
          const favorites = await fetchFavorites(auth.user.id);
          setSaved(favorites.has(listing.id));
        }
      } catch (e) {
        console.error("Error checking favorites:", e);
      }
    })();
  }, [listing]);

  const images = listing?.images ?? [];
  const primary = images[activeIdx];

  if (!open || !listing) return null;

  const handleSave = async () => {
    try {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) {
        toast.error("Please sign in to save favorites");
        return;
      }
      
      const newSavedState = await toggleFavorite(listing.id, auth.user.id);
      setSaved(newSavedState);
      onSavedChange?.(newSavedState);
      toast.success(newSavedState ? "Added to favorites" : "Removed from favorites");
    } catch (e: any) {
      toast.error(e.message ?? "Please sign in to save");
    }
  };

  const handleReport = async () => {
    if (!reportText.trim()) return;
    try {
      await reportListing(listing.id, reportText.trim());
      setReportOpen(false);
      setReportText("");
      toast.success("Thanks, your report was submitted.");
    } catch (e: any) {
      toast.error("Error submitting report: " + (e.message || "Unknown error"));
    }
  };

  const contactHref = useMemo(() => {
    if (listing.contact) {
      if (listing.contact.email) return `mailto:${listing.contact.email}`;
      if (listing.contact.phone) return `tel:${listing.contact.phone}`;
    }
    return null;
  }, [listing]);

  const contactDisplay = useMemo(() => {
    if (listing.contact) {
      return Object.entries(listing.contact)
        .filter(([, v]) => v)
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ') || "—";
    }
    return "—";
  }, [listing]);

  return (
    <div className="fixed inset-0 z-50">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* drawer (right on desktop, fullscreen on mobile) */}
      <div className="absolute right-0 top-0 h-full w-full md:w-[560px] bg-background shadow-2xl">
        {/* header */}
        <div className="sticky top-0 z-10 bg-background border-b p-4 flex items-center justify-between">
          <div className="pr-3">
            <h3 className="font-semibold text-lg">{listing.title}</h3>
            <p className="text-sm text-muted-foreground">
              {listing.city || "—"} {listing.createdAt ? `• ${new Date(listing.createdAt).toLocaleDateString()}` : ""}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className={`px-3 py-1 rounded-md border ${saved ? "bg-red-500 text-white border-red-500" : "bg-background"}`}
              title={saved ? "Saved" : "Save"}
            >
              {saved ? "♥" : "♡"}
            </button>
            <button onClick={onClose} className="px-3 py-1 rounded-md border">
              ✕
            </button>
          </div>
        </div>

        {/* body */}
        <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-80px)]">
          {/* gallery */}
          {primary ? (
            <div className="space-y-2">
              <div className="aspect-video w-full overflow-hidden rounded-md border">
                <img src={primary} className="w-full h-full object-cover" alt={listing.title} />
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-6 gap-2">
                  {images.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveIdx(i)}
                      className={`aspect-square rounded-md overflow-hidden border ${i === activeIdx ? "ring-2 ring-primary" : ""}`}
                    >
                      <img src={src} className="w-full h-full object-cover" alt={`Image ${i + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-video w-full rounded-md border grid place-items-center text-muted-foreground">
              No image
            </div>
          )}

          {/* price + tags */}
          <div className="flex flex-wrap items-center gap-2">
            {listing.price != null && (
              <span className="px-3 py-1 rounded-md bg-amber-100 text-amber-900 border">
                {listing.currency ?? "USD"} {listing.price.toLocaleString()}
              </span>
            )}
            {(listing.tags ?? []).map((t) => (
              <span key={t} className="px-2 py-1 text-xs rounded-full bg-muted">
                #{t}
              </span>
            ))}
          </div>

          {/* description */}
          {listing.description && (
            <div>
              <h4 className="font-semibold mb-1">Description</h4>
              <p className="whitespace-pre-wrap leading-relaxed">{listing.description}</p>
            </div>
          )}

          {/* contact */}
          {contactDisplay !== "—" && (
            <div className="flex items-center gap-3">
              <h4 className="font-semibold">Contact</h4>
              {contactHref ? (
                <a
                  href={contactHref}
                  className="px-3 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {contactHref.startsWith("tel:") ? "Call" : "Email"}
                </a>
              ) : (
                <span className="text-sm text-muted-foreground">{contactDisplay}</span>
              )}
            </div>
          )}

          {/* map */}
          {listing.lat && listing.lon ? (
            <div>
              <h4 className="font-semibold mb-2">Location</h4>
              <MapMini lat={listing.lat} lng={listing.lon} />
              <p className="text-xs text-muted-foreground mt-1">Approximate location shown.</p>
            </div>
          ) : null}

          {/* report */}
          <div className="pt-2">
            {!reportOpen ? (
              <button onClick={() => setReportOpen(true)} className="text-sm underline text-muted-foreground">
                Report listing
              </button>
            ) : (
              <div className="space-y-2">
                <textarea
                  className="w-full min-h-[90px] rounded-md border p-2"
                  placeholder="Why is this inappropriate or misleading?"
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                />
                <div className="flex gap-2">
                  <button onClick={handleReport} className="px-3 py-2 rounded-md bg-destructive text-destructive-foreground">
                    Submit report
                  </button>
                  <button onClick={() => setReportOpen(false)} className="px-3 py-2 rounded-md border">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}