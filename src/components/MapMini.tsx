import { useEffect, useRef } from "react";
import L from "leaflet";

type Props = { lat: number; lng: number; height?: number };

export default function MapMini({ lat, lng, height = 220 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    if (!mapRef.current) {
      mapRef.current = L.map(ref.current, {
        attributionControl: false,
        zoomControl: false,
      }).setView([lat, lng], 12);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(mapRef.current);

      L.marker([lat, lng]).addTo(mapRef.current);
    } else {
      mapRef.current.setView([lat, lng], 12);
    }

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [lat, lng]);

  return <div ref={ref} style={{ height }} className="w-full rounded-md overflow-hidden" />;
}