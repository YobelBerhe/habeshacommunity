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
    let handleResize: (() => void) | null = null;
    let lightTileLayer: L.TileLayer | null = null;
    let darkTileLayer: L.TileLayer | null = null;

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

      // Create both tile layers
      lightTileLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© OpenStreetMap',
      });
      
      darkTileLayer = L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: '© OpenStreetMap, © Carto',
      });

      // Add the appropriate layer based on current theme
      const isDark = document.documentElement.classList.contains("dark");
      if (isDark) {
        darkTileLayer.addTo(map);
      } else {
        lightTileLayer.addTo(map);
      }

      // Fit the whole world in view
      map.fitWorld({ animate: false, padding: [20, 20] });
      map.setMinZoom(2);

      // Handle resize to maintain world view
      handleResize = () => map.invalidateSize();
      window.addEventListener("resize", handleResize);

      // Listen for theme changes
      const observer = new MutationObserver(() => {
        if (!map) return;
        
        const isNowDark = document.documentElement.classList.contains("dark");
        
        // Remove current layer and add new one
        if (isNowDark) {
          if (lightTileLayer && map.hasLayer(lightTileLayer)) {
            map.removeLayer(lightTileLayer);
          }
          if (darkTileLayer && !map.hasLayer(darkTileLayer)) {
            darkTileLayer.addTo(map);
          }
        } else {
          if (darkTileLayer && map.hasLayer(darkTileLayer)) {
            map.removeLayer(darkTileLayer);
          }
          if (lightTileLayer && !map.hasLayer(lightTileLayer)) {
            lightTileLayer.addTo(map);
          }
        }
      });

      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
      });

      // Store observer for cleanup
      (map as any)._themeObserver = observer;
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
      if (handleResize) {
        window.removeEventListener("resize", handleResize);
      }
      if (mapRef.current) {
        // Cleanup theme observer
        const observer = (mapRef.current as any)._themeObserver;
        if (observer) {
          observer.disconnect();
        }
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Zoom to city helper (can be called from CitySearch)
  (window as any).zoomToCity = (lat: number, lon: number) => {
    const map = mapRef.current;
    if (!map) return;
    map.setView([lat, lon], 11, { animate: true });
  };

  return (
    <section className="w-screen relative left-1/2 right-1/2 -mx-[50vw] py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center space-y-6 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            {t(lang, "connect_headline_1")}
            <br />
            <span className="text-primary">{t(lang, "connect_headline_2")}</span>
          </h1>
          
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 text-lg">
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

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t(lang, "connect_sub")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
      </div>

      <div className="relative h-[420px] md:h-[520px] lg:h-[620px]">
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
    </section>
  );
}