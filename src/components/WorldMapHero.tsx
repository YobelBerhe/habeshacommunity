import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { getActiveUsers, subscribeToActiveUsers } from '@/services/activeUsers';
import { t, Lang } from '@/lib/i18n';
import type { ActiveUsers, ActivePoint } from '@/types';
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
  const [activeUsers, setActiveUsers] = useState<ActiveUsers>({ total: 0, points: [] });
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    // Initial load
    getActiveUsers().then(data => {
      setActiveUsers(data);
      setIsLoading(false);
    });

    // Subscribe to updates
    const unsubscribe = subscribeToActiveUsers(setActiveUsers);
    
    return unsubscribe;
  }, []);

  const createPulseIcon = (count: number) => {
    const size = Math.min(Math.max(count * 2 + 8, 12), 24);
    const clusterBadge = count > 10 ? `<span class="cluster-badge">+${count - 10}</span>` : '';
    
    return divIcon({
      html: `
        <div class="pulse-marker" style="width: ${size}px; height: ${size}px;">
          <div class="pulse-dot"></div>
          ${clusterBadge}
        </div>
      `,
      className: 'pulse-container',
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2]
    });
  };

  const citiesCount = activeUsers.points.length;

  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      <div className="absolute inset-0 bg-black/20"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <div className="text-white space-y-6">
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                {t(lang, "connect_headline_1")}
                <br />
                <span className="text-primary-glow">{t(lang, "connect_headline_2")}</span>
              </h1>
              
              <div className="flex items-center gap-4 text-lg md:text-xl">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                  <span className="font-semibold">
                    Live now: {isLoading ? '...' : activeUsers.total.toLocaleString()} people
                  </span>
                </div>
                <div className="text-white/80">
                  in {isLoading ? '...' : citiesCount} cities
                </div>
              </div>

              <p className="text-lg md:text-xl text-white/90 max-w-lg">
                {t(lang, "connect_sub")}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                className="px-6 py-3 bg-white/20 rounded-lg hover:bg-white/30 font-semibold transition-colors backdrop-blur-sm border border-white/20"
                onClick={onBrowseHousing}
              >
                {t(lang, "housing")}
              </button>
              <button 
                className="px-6 py-3 bg-white/20 rounded-lg hover:bg-white/30 font-semibold transition-colors backdrop-blur-sm border border-white/20"
                onClick={onFindJobs}
              >
                {t(lang, "jobs")}
              </button>
            </div>
          </div>

          {/* Map */}
          <div className="relative">
            <div className="rounded-xl overflow-hidden shadow-lg border-2 border-white/20 bg-white/10 backdrop-blur-sm">
              <div className="h-80 lg:h-96 relative">
                {!isLoading && (
                  <MapContainer
                    ref={mapRef}
                    center={[20, 20]}
                    zoom={2}
                    zoomControl={false}
                    scrollWheelZoom={false}
                    dragging={true}
                    className="h-full w-full"
                    attributionControl={false}
                  >
                    <TileLayer
                      url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                      attribution=""
                    />
                    
                    {activeUsers.points.map((point, index) => (
                      <Marker
                        key={`${point.city}-${index}`}
                        position={[point.lat, point.lon]}
                        icon={createPulseIcon(point.count)}
                      >
                        <Tooltip permanent={false} direction="top" offset={[0, -10]}>
                          <div className="text-center">
                            <div className="font-semibold">{point.city}, {point.country}</div>
                            <div className="text-sm">{point.count} online</div>
                          </div>
                        </Tooltip>
                      </Marker>
                    ))}
                  </MapContainer>
                )}
                
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted/20 backdrop-blur-sm">
                    <div className="text-white">Loading live data...</div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="absolute -bottom-2 right-4 text-xs text-white/60">
              Dots show approximate city-level activity
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}