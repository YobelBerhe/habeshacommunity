import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Listing } from "@/types";

export default function MapView({
  items, fallback, onMarkerClick
}: {
  items: Listing[];
  fallback?: { lat?: number; lon?: number };
  onMarkerClick?: (id: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (!mapRef.current) {
      mapRef.current = L.map(ref.current, { scrollWheelZoom: true });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(mapRef.current);
      layerRef.current = L.layerGroup().addTo(mapRef.current);
    }
    const map = mapRef.current!;
    const layer = layerRef.current!;
    layer.clearLayers();

    const bounds: [number, number][] = [];
    items.forEach((l) => {
      const lat = Number(l.lat), lon = Number(l.lon);
      if (Number.isFinite(lat) && Number.isFinite(lon)) {
        const m = L.marker([lat, lon]).addTo(layer);
        m.on("click", () => onMarkerClick?.(l.id));
        bounds.push([lat, lon]);
      }
    });
    if (bounds.length) map.fitBounds(bounds as any, { padding: [20, 20] });
    else if (fallback?.lat && fallback?.lon) map.setView([fallback.lat, fallback.lon], 11);
    else map.setView([9.03, 38.74], 5);
  }, [items, fallback?.lat, fallback?.lon, onMarkerClick]);

  return <div ref={ref} className="w-full h-[460px] rounded-xl border" />;
}