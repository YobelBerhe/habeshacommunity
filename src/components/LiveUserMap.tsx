import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { getStarPoints } from '@/services/activeUsers';
import 'leaflet/dist/leaflet.css';

export default function LiveUserMap() {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [points, setPoints] = useState<any[]>([]);
  const markersRef = useRef<L.Marker[]>([]);
  const lightTileLayerRef = useRef<L.TileLayer | null>(null);
  const darkTileLayerRef = useRef<L.TileLayer | null>(null);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [20, 0],
      zoom: 2,
      minZoom: 2,
      maxZoom: 18,
      zoomControl: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      dragging: true,
      touchZoom: true,
      boxZoom: true,
      keyboard: true,
      worldCopyJump: true,
    });

    // Position zoom controls on mobile
    map.zoomControl.setPosition('bottomright');

    mapRef.current = map;

    // Create tile layers with custom styling similar to reference image
    lightTileLayerRef.current = L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: '© OpenStreetMap, © Carto',
      subdomains: 'abcd',
    });
    
    darkTileLayerRef.current = L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '© OpenStreetMap, © Carto',
      subdomains: 'abcd',
    });

    // Add initial layer based on theme
    const isDark = document.documentElement.classList.contains("dark");
    if (isDark) {
      darkTileLayerRef.current.addTo(map);
    } else {
      lightTileLayerRef.current.addTo(map);
    }

    // Listen for theme changes
    const observer = new MutationObserver(() => {
      const isNowDark = document.documentElement.classList.contains("dark");
      
      if (isNowDark) {
        if (lightTileLayerRef.current && map.hasLayer(lightTileLayerRef.current)) {
          map.removeLayer(lightTileLayerRef.current);
        }
        if (darkTileLayerRef.current && !map.hasLayer(darkTileLayerRef.current)) {
          darkTileLayerRef.current.addTo(map);
        }
      } else {
        if (darkTileLayerRef.current && map.hasLayer(darkTileLayerRef.current)) {
          map.removeLayer(darkTileLayerRef.current);
        }
        if (lightTileLayerRef.current && !map.hasLayer(lightTileLayerRef.current)) {
          lightTileLayerRef.current.addTo(map);
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    // Add resize handler for mobile responsiveness
    const handleResize = () => {
      map.invalidateSize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      map.remove();
    };
  }, []);

  // Create breathing dot icon with better mobile visibility
  const createBreathingIcon = () => {
    const isDark = document.documentElement.classList.contains("dark");
    const color = isDark ? "#fbbf24" : "#f59e0b";
    const shadowColor = isDark ? "#fbbf24" : "#f59e0b";
    
    return L.divIcon({
      html: `
        <div class="breathing-dot-container">
          <div class="breathing-dot" style="
            width: 16px;
            height: 16px;
            background-color: ${color};
            border: 2px solid white;
            border-radius: 50%;
            box-shadow: 0 0 15px ${shadowColor}80, 0 0 30px ${shadowColor}40;
            animation: breathe 2.5s infinite ease-in-out;
            position: relative;
            cursor: pointer;
          "></div>
          <style>
            @keyframes breathe {
              0%, 100% { 
                transform: scale(1); 
                opacity: 0.9; 
              }
              50% { 
                transform: scale(1.3); 
                opacity: 1; 
              }
            }
            .breathing-dot-container:hover .breathing-dot {
              transform: scale(1.5) !important;
              animation-play-state: paused;
            }
          </style>
        </div>
      `,
      className: 'breathing-marker',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
  };

  // Update markers when points change
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapRef.current?.removeLayer(marker);
    });
    markersRef.current = [];

    // Add new markers
    points.forEach((point) => {
      if (point.lat && point.lon) {
        const marker = L.marker([point.lat, point.lon], {
          icon: createBreathingIcon()
        }).addTo(mapRef.current!);

        // Add tooltip with better styling
        marker.bindTooltip(
          `<div class="text-center p-2">
            <div class="font-semibold text-sm text-foreground">${point.city}, ${point.country}</div>
            <div class="text-xs text-muted-foreground mt-1">1 user online</div>
          </div>`,
          {
            direction: 'top',
            offset: [0, -15],
            className: 'custom-tooltip',
            permanent: false,
            sticky: true
          }
        );

        // Add click handler for mobile interaction
        marker.on('click', () => {
          mapRef.current?.setView([point.lat, point.lon], Math.max(mapRef.current.getZoom(), 8), {
            animate: true,
            duration: 1
          });
        });

        markersRef.current.push(marker);
      }
    });
  }, [points]);

  // Fetch star points
  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const data = await getStarPoints();
        setPoints(data.points);
      } catch (error) {
        console.error('Failed to fetch star points:', error);
      }
    };

    fetchPoints();
    const interval = setInterval(fetchPoints, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-80 md:h-96 overflow-hidden rounded-lg border border-border/50 bg-gradient-card">
      <div ref={containerRef} className="absolute inset-0 w-full h-full -z-50" />
      
      {/* Mobile-friendly info overlay */}
      <div className="absolute top-4 left-4 right-4 md:right-auto bg-background/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm">
        <div className="text-sm font-medium text-foreground">{points.length} users online</div>
        <div className="text-xs text-muted-foreground">Tap dots to zoom • Pinch to zoom • Drag to explore</div>
      </div>
      
      {/* Attribution */}
      <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded">
        © OpenStreetMap, © Carto
      </div>
      
      {/* Custom styles for tooltips */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .custom-tooltip {
            background: hsl(var(--background)) !important;
            border: 1px solid hsl(var(--border)) !important;
            border-radius: 8px !important;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
          }
          .custom-tooltip::before {
            border-top-color: hsl(var(--background)) !important;
          }
          .leaflet-control-zoom {
            border: none !important;
            border-radius: 8px !important;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
          }
          .leaflet-control-zoom a {
            background: hsl(var(--background)) !important;
            color: hsl(var(--foreground)) !important;
            border: 1px solid hsl(var(--border)) !important;
            width: 40px !important;
            height: 40px !important;
            line-height: 38px !important;
            font-size: 18px !important;
          }
          .leaflet-control-zoom a:hover {
            background: hsl(var(--accent)) !important;
          }
          @media (max-width: 768px) {
            .leaflet-control-zoom a {
              width: 44px !important;
              height: 44px !important;
              line-height: 42px !important;
              font-size: 20px !important;
            }
          }
        `
      }} />
    </div>
  );
}