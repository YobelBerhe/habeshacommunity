import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Props {
  points?: Array<{
    id: string;
    city: string;
    country: string;
    lat: number;
    lon: number;
  }>;
  className?: string;
}

export default function Globe({ points = [], className = "w-full h-80 md:h-96" }: Props) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [tokenInputVisible, setTokenInputVisible] = useState(true);

  // Initialize map when token is available
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || map.current) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        projection: { name: 'globe' },
        zoom: 1.5,
        center: [30, 15],
        pitch: 45,
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );

      // Add atmosphere and fog effects
      map.current.on('style.load', () => {
        if (!map.current) return;
        
        map.current.setFog({
          color: 'rgb(255, 255, 255)',
          'high-color': 'rgb(200, 200, 225)',
          'horizon-blend': 0.2,
        });

        // Switch to satellite view at street level
        map.current.on('zoom', () => {
          if (!map.current) return;
          const zoom = map.current.getZoom();
          
          if (zoom > 8) {
            map.current.setStyle('mapbox://styles/mapbox/satellite-streets-v12');
          } else {
            map.current.setStyle('mapbox://styles/mapbox/light-v11');
          }
        });
      });

      // Rotation animation settings
      const secondsPerRevolution = 240;
      const maxSpinZoom = 5;
      const slowSpinZoom = 3;
      let userInteracting = false;
      let spinEnabled = true;

      // Spin globe function
      function spinGlobe() {
        if (!map.current) return;
        
        const zoom = map.current.getZoom();
        if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
          let distancePerSecond = 360 / secondsPerRevolution;
          if (zoom > slowSpinZoom) {
            const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
            distancePerSecond *= zoomDif;
          }
          const center = map.current.getCenter();
          center.lng -= distancePerSecond;
          map.current.easeTo({ center, duration: 1000, easing: (n) => n });
        }
      }

      // Event listeners for interaction
      map.current.on('mousedown', () => {
        userInteracting = true;
      });
      
      map.current.on('dragstart', () => {
        userInteracting = true;
      });
      
      map.current.on('mouseup', () => {
        userInteracting = false;
        spinGlobe();
      });
      
      map.current.on('touchend', () => {
        userInteracting = false;
        spinGlobe();
      });

      map.current.on('moveend', () => {
        spinGlobe();
      });

      // Start the globe spinning
      spinGlobe();

    } catch (error) {
      console.error('Error initializing Mapbox:', error);
    }

    // Cleanup
    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [mapboxToken]);

  // Add markers for points
  useEffect(() => {
    if (!map.current || !points.length) return;

    const markers: mapboxgl.Marker[] = [];

    points.forEach((point) => {
      const el = document.createElement('div');
      el.className = 'globe-marker';
      el.style.cssText = `
        width: 12px;
        height: 12px;
        background-color: #f59e0b;
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 0 10px rgba(245, 158, 11, 0.6);
        cursor: pointer;
        animation: pulse 2s infinite;
      `;

      const marker = new mapboxgl.Marker(el)
        .setLngLat([point.lon, point.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div class="text-center p-2">
                <div class="font-semibold text-sm">${point.city}, ${point.country}</div>
                <div class="text-xs text-muted-foreground mt-1">1 user online</div>
              </div>
            `)
        )
        .addTo(map.current);

      markers.push(marker);
    });

    return () => {
      markers.forEach(marker => marker.remove());
    };
  }, [points, mapboxToken]);

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mapboxToken.trim()) {
      setTokenInputVisible(false);
    }
  };

  if (tokenInputVisible) {
    return (
      <div className={`relative ${className} bg-gradient-card rounded-lg border border-border/50 flex items-center justify-center`}>
        <div className="text-center p-6 max-w-md">
          <h3 className="text-lg font-semibold mb-2">Mapbox Token Required</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Get your free public token from{' '}
            <a 
              href="https://mapbox.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              mapbox.com
            </a>
          </p>
          <form onSubmit={handleTokenSubmit} className="space-y-3">
            <input
              type="text"
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              placeholder="Enter your Mapbox public token"
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              required
            />
            <button
              type="submit"
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Load Globe
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className} overflow-hidden rounded-lg border border-border/50 bg-gradient-card`}>
      <div ref={mapContainer} className="absolute inset-0 w-full h-full -z-50" />
      
      {/* Info overlay */}
      <div className="absolute top-4 left-4 right-4 md:right-auto bg-background/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm">
        <div className="text-sm font-medium text-foreground">{points.length} users online</div>
        <div className="text-xs text-muted-foreground">Drag to rotate • Scroll to zoom • Click markers for details</div>
      </div>
      
      {/* Pulse animation styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes pulse {
            0%, 100% { 
              transform: scale(1); 
              opacity: 0.9; 
            }
            50% { 
              transform: scale(1.2); 
              opacity: 1; 
            }
          }
          .mapboxgl-popup-content {
            background: hsl(var(--background)) !important;
            border: 1px solid hsl(var(--border)) !important;
            border-radius: 8px !important;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
          }
          .mapboxgl-popup-tip {
            border-top-color: hsl(var(--background)) !important;
          }
          .mapboxgl-ctrl-group {
            border-radius: 8px !important;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
          }
          .mapboxgl-ctrl-group button {
            background: hsl(var(--background)) !important;
            color: hsl(var(--foreground)) !important;
            border: 1px solid hsl(var(--border)) !important;
          }
          .mapboxgl-ctrl-group button:hover {
            background: hsl(var(--accent)) !important;
          }
        `
      }} />
    </div>
  );
}