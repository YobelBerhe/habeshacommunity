import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import StarFieldLayer from '@/components/StarFieldLayer';
import { getStarPoints } from '@/services/activeUsers';
import { t, Lang } from '@/lib/i18n';
import 'leaflet/dist/leaflet.css';

type Props = {
  lang?: Lang;
  onBrowseHousing?: () => void;
  onFindJobs?: () => void;
};

export default function WorldMapHero({ 
  lang = 'EN',
  onBrowseHousing,
  onFindJobs 
}: Props) {
  const mapRef = useRef<L.Map | null>(null);
  const [points, setPoints] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [demo, setDemo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // init map once
    if (!mapRef.current) {
      const map = L.map("worldmap", {
        center: [15, 30],
        zoom: 2,
        zoomControl: false,
        minZoom: 2,
        worldCopyJump: true,
      });
      mapRef.current = map;

      const theme = document.documentElement.classList.contains("dark")
        ? "dark"
        : "light";

      const tileUrl =
        theme === "dark"
          ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

      L.tileLayer(tileUrl, {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors',
      }).addTo(map);
    }

    // load points
    (async () => {
      const res = await getStarPoints();
      if (!mounted) return;
      setPoints(res.points);
      setTotal(res.total);
      setDemo(res.demo);
      setIsLoading(false);
    })();

    // refresh to keep it lively
    const id = setInterval(async () => {
      const res = await getStarPoints();
      if (!mounted) return;
      setPoints(res.points);
      setTotal(res.total);
    }, 15000);

    return () => {
      mounted = false;
      clearInterval(id);
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // Zoom to city helper (can be called from CitySearch)
  (window as any).zoomToCity = (lat: number, lon: number) => {
    const map = mapRef.current;
    if (!map) return;
    map.setView([lat, lon], 11, { animate: true });
  };

  return (
    <section className="w-full py-10 md:py-14">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              {t(lang, "connect_headline_1")}
              <br />
              <span className="text-primary">{t(lang, "connect_headline_2")}</span>
            </h1>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-lg">
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                <span className="font-semibold">
                  Live now: <strong>{isLoading ? '...' : total.toLocaleString()}</strong> people
                </span>
              </div>
              {demo && (
                <p className="text-xs text-muted-foreground">
                  demo data until accounts go live
                </p>
              )}
            </div>

            <p className="text-lg text-muted-foreground max-w-lg">
              {t(lang, "connect_sub")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                className="px-5 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-semibold transition-colors"
                onClick={onBrowseHousing}
              >
                {t(lang, "housing")}
              </button>
              <button 
                className="px-5 py-3 rounded-lg bg-muted hover:bg-muted/80 font-semibold transition-colors"
                onClick={onFindJobs}
              >
                {t(lang, "jobs")}
              </button>
            </div>
          </div>

          <div className="relative h-[360px] md:h-[460px] rounded-2xl overflow-hidden shadow-sm bg-muted/30">
            <div id="worldmap" className="absolute inset-0" />
            {mapRef.current && (
              <StarFieldLayer map={mapRef.current} points={points} />
            )}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/20 backdrop-blur-sm">
                <div className="text-muted-foreground">Loading live data...</div>
              </div>
            )}
            <div className="absolute right-3 bottom-2 text-[11px] text-muted-foreground">
              Dots show approximate city-level activity
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}