import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { getStarPoints } from '@/services/activeUsers';
import 'leaflet/dist/leaflet.css';

export default function LiveUserMap() {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [points, setPoints] = useState<any[]>([]);
  const markersRef = useRef<L.Marker[]>([]);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [20, 0],
      zoom: 2,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      dragging: false,
      touchZoom: false,
      boxZoom: false,
      keyboard: false,
    });

    mapRef.current = map;

    // Add tile layers for light and dark themes
    let lightTileLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");
    let darkTileLayer = L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png");

    // Add initial layer based on theme
    const isDark = document.documentElement.classList.contains("dark");
    if (isDark) {
      darkTileLayer.addTo(map);
    } else {
      lightTileLayer.addTo(map);
    }

    // Listen for theme changes
    const observer = new MutationObserver(() => {
      const isNowDark = document.documentElement.classList.contains("dark");
      
      if (isNowDark) {
        if (map.hasLayer(lightTileLayer)) {
          map.removeLayer(lightTileLayer);
        }
        if (!map.hasLayer(darkTileLayer)) {
          darkTileLayer.addTo(map);
        }
      } else {
        if (map.hasLayer(darkTileLayer)) {
          map.removeLayer(darkTileLayer);
        }
        if (!map.hasLayer(lightTileLayer)) {
          lightTileLayer.addTo(map);
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => {
      observer.disconnect();
      map.remove();
    };
  }, []);

  // Create breathing dot icon
  const createBreathingIcon = () => {
    const isDark = document.documentElement.classList.contains("dark");
    const color = isDark ? "#fbbf24" : "#f59e0b";
    
    return L.divIcon({
      html: `
        <div class="breathing-dot" style="
          width: 12px;
          height: 12px;
          background-color: ${color};
          border-radius: 50%;
          box-shadow: 0 0 10px ${color}80, 0 0 20px ${color}40;
          animation: breathe 2s infinite ease-in-out;
          position: relative;
        "></div>
        <style>
          @keyframes breathe {
            0%, 100% { 
              transform: scale(1); 
              opacity: 0.8; 
            }
            50% { 
              transform: scale(1.5); 
              opacity: 1; 
            }
          }
        </style>
      `,
      className: 'breathing-marker',
      iconSize: [12, 12],
      iconAnchor: [6, 6]
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

        // Add tooltip
        marker.bindTooltip(
          `<div class="text-center">
            <div class="font-semibold text-xs">${point.city}, ${point.country}</div>
            <div class="text-xs opacity-70">1 user online</div>
          </div>`,
          {
            direction: 'top',
            offset: [0, -10],
            className: 'breathing-tooltip'
          }
        );

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
    <div className="relative w-full h-64 overflow-hidden rounded-lg border border-border/50 bg-gradient-card">
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />
      <div className="absolute bottom-4 left-4 text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded">
        {points.length} users online
      </div>
    </div>
  );
}