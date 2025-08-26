/* ======================================================================
   FILE: /components/MapView.tsx
   Simple OpenStreetMap embed (no extra libs)
   ====================================================================== */
export default function MapView({
  lat, lon, zoom = 11, height = 440
}: { lat?: number; lon?: number; zoom?: number; height?: number }) {
  if (lat == null || lon == null) {
    return (
      <div className="bg-gradient-card rounded-lg border border-border/50 p-8 text-center">
        <div className="text-muted-foreground">Map will appear here once a city with coordinates is selected.</div>
      </div>
    );
  }
  const src = `https://www.openstreetmap.org/export/embed.html?&marker=${lat},${lon}&layers=mapnik&zoom=${zoom}`;
  return (
    <div className="overflow-hidden rounded-xl border border-border/50">
      <iframe
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