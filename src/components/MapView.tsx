/* ======================================================================
   FILE: /components/MapView.tsx
   Simple OpenStreetMap embed with theme support
   ====================================================================== */
import { useEffect, useState } from "react";

export default function MapView({
  lat, lon, zoom = 11, height = 440
}: { lat?: number; lon?: number; zoom?: number; height?: number }) {
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  if (lat == null || lon == null) {
    return (
      <div className="bg-gradient-card rounded-lg border border-border/50 p-8 text-center">
        <div className="text-muted-foreground">Map will appear here once a city with coordinates is selected.</div>
      </div>
    );
  }

  // Use different tile layers for light/dark theme
  const tileLayer = isDark ? "cartodb_dark_matter" : "mapnik";
  const src = `https://www.openstreetmap.org/export/embed.html?&marker=${lat},${lon}&layers=${tileLayer}&zoom=${zoom}`;
  
  return (
    <div className="overflow-hidden rounded-xl border border-border/50">
      <iframe
        key={`${lat}-${lon}-${isDark}`} // Force re-render on theme change
        title="map"
        src={src}
        width="100%"
        height={height}
        className="block"
        style={{ border: 0 }}
      />
    </div>
  );
}