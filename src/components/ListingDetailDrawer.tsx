import { useEffect, useState } from "react";
import { Listing } from "@/types";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function ListingDetailDrawer({
  open, onOpenChange, listing
}: { open: boolean; onOpenChange: (v: boolean) => void; listing: Listing | null; }) {
  const [currentMap, setCurrentMap] = useState<L.Map | null>(null);
  const [currentTileLayer, setCurrentTileLayer] = useState<L.TileLayer | null>(null);

  const getTileLayerUrl = () => {
    const isDark = document.documentElement.classList.contains("dark");
    return isDark 
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  };

  const getTileLayerAttribution = () => {
    const isDark = document.documentElement.classList.contains("dark");
    return isDark
      ? "&copy; OpenStreetMap contributors &copy; CARTO"
      : "&copy; OpenStreetMap contributors";
  };

  useEffect(() => {
    if (!open || !listing) return;
    
    setTimeout(() => {
      const el = document.getElementById("detail-map");
      if (!el) return;
      
      // Clear existing map
      if (currentMap) {
        currentMap.remove();
      }
      
      const map = L.map(el, { scrollWheelZoom: true });
      const tile = L.tileLayer(getTileLayerUrl(), { 
        maxZoom: 19,
        attribution: getTileLayerAttribution()
      }).addTo(map);
      
      setCurrentMap(map);
      setCurrentTileLayer(tile);
      
      const lat = Number(listing.lat), lon = Number(listing.lon);
      if (Number.isFinite(lat) && Number.isFinite(lon)) {
        map.setView([lat, lon], 13);
        L.marker([lat, lon]).addTo(map);
      }
    }, 0);
  }, [open, listing]);

  // Theme change listener
  useEffect(() => {
    if (!currentMap || !currentTileLayer) return;

    const observer = new MutationObserver(() => {
      if (currentMap && currentTileLayer) {
        currentMap.removeLayer(currentTileLayer);
        const newTile = L.tileLayer(getTileLayerUrl(), {
          attribution: getTileLayerAttribution(),
          maxZoom: 19,
        }).addTo(currentMap);
        setCurrentTileLayer(newTile);
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, [currentMap, currentTileLayer]);

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
              <div className="text-sm">
                {typeof listing.contact === 'string' 
                  ? listing.contact 
                  : listing.contact 
                    ? Object.entries(listing.contact)
                        .filter(([, v]) => v)
                        .map(([k, v]) => `${k}: ${v}`)
                        .join(', ') || "—"
                    : "—"
                }
              </div>
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