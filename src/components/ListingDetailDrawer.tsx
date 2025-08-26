import { useEffect } from "react";
import { Listing } from "@/types";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function ListingDetailDrawer({
  open, onOpenChange, listing
}: { open: boolean; onOpenChange: (v: boolean) => void; listing: Listing | null; }) {
  useEffect(() => {
    if (!open || !listing) return;
    setTimeout(() => {
      const el = document.getElementById("detail-map");
      if (!el) return;
      const map = L.map(el, { scrollWheelZoom: true });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(map);
      const lat = Number(listing.lat), lon = Number(listing.lon);
      if (Number.isFinite(lat) && Number.isFinite(lon)) {
        map.setView([lat, lon], 13);
        L.marker([lat, lon]).addTo(map);
      }
    }, 0);
  }, [open, listing]);

  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}>
      <div className={`absolute inset-0 bg-black/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
           onClick={() => onOpenChange(false)} />
      <div className={`absolute right-0 top-0 h-full w-full md:w-[520px] bg-background border-l transition-transform
                       ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold">{listing?.title ?? "Listing"}</h3>
          <button className="btn" onClick={() => onOpenChange(false)}>✕</button>
        </div>

        {listing ? (
          <div className="p-4 space-y-4 overflow-auto h-[calc(100%-60px)]">
            {listing.images?.length ? (
              <img src={listing.images[0]} className="w-full aspect-video object-cover rounded-lg border" />
            ) : (
              <div className="w-full aspect-video grid place-items-center rounded-lg border text-muted-foreground">No image</div>
            )}
            <div className="text-2xl font-bold">{listing.price != null ? `$${(listing.price as number).toLocaleString()}` : ""}</div>
            <div className="text-sm text-muted-foreground">
              {listing.categoryLabel}{listing.jobSubcategoryLabel ? ` • ${listing.jobSubcategoryLabel}` : ""}
            </div>
            <p className="whitespace-pre-wrap">{listing.description}</p>
            <div className="flex flex-wrap gap-2">
              {listing.tags.map((t, i) => <span key={i} className="px-2 py-1 text-xs rounded-full bg-muted">#{t}</span>)}
            </div>
            <div className="p-3 rounded-lg border">
              <div className="font-semibold mb-1">Contact</div>
              <div className="text-sm">{listing.contact || "—"}</div>
            </div>
            <div id="detail-map" className="w-full h-64 rounded-lg border" />
          </div>
        ) : (
          <div className="p-4">No listing selected.</div>
        )}
      </div>
    </div>
  );
}