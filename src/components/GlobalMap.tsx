import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import StarFieldLayer from '@/components/StarFieldLayer';
import { getStarPoints } from '@/services/activeUsers';
import 'leaflet/dist/leaflet.css';

type Props = {
  onMapReady?: (map: L.Map) => void;
  focusCity?: { lat: number; lng: number; name: string } | null;
  viewMode?: 'grid' | 'map';
  modalOpen?: boolean;
};

export default function GlobalMap({ onMapReady, focusCity, viewMode, modalOpen }: Props) {
  const mapRef = useRef<L.Map | null>(null);
  const [points, setPoints] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;
    let handleResize: (() => void) | null = null;
    let lightTileLayer: L.TileLayer | null = null;
    let darkTileLayer: L.TileLayer | null = null;

    // init map once
    if (!mapRef.current && containerRef.current) {
      const map = L.map(containerRef.current, {
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
      
      // Notify parent
      if (onMapReady) {
        onMapReady(map);
      }
    }

    // load points
    (async () => {
      const res = await getStarPoints();
      if (!mounted) return;
      setPoints(res.points);
    })();

    // refresh to keep it lively
    const id = setInterval(async () => {
      const res = await getStarPoints();
      if (!mounted) return;
      setPoints(res.points);
    }, 15000);

    return () => {
      mounted = false;
      clearInterval(id);
      if (handleResize) {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, [onMapReady]);

  // Focus on city when focusCity changes
  useEffect(() => {
    if (focusCity && mapRef.current) {
      mapRef.current.flyTo([focusCity.lat, focusCity.lng], 12, { animate: true });
    }
  }, [focusCity]);

  // Handle pointer events based on modal state and view mode
  useEffect(() => {
    if (containerRef.current) {
      const shouldDisablePointer = modalOpen || (viewMode && viewMode !== 'map');
      containerRef.current.style.pointerEvents = shouldDisablePointer ? 'none' : 'auto';
    }
  }, [modalOpen, viewMode]);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 -z-50 transition-all duration-300"
    >
      {mapRef.current && (
        <StarFieldLayer map={mapRef.current} points={points} />
      )}
    </div>
  );
}
