import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Listing } from '@/types';
import { Badge } from "@/components/ui/badge";

// Fix default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Props {
  listings: Listing[];
  onListingClick?: (listing: Listing) => void;
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
}

export default function InteractiveListingMap({ 
  listings, 
  onListingClick, 
  center = { lat: 40.7128, lng: -74.0060 }, 
  zoom = 10,
  height = "500px"
}: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Create map
    const map = L.map(mapRef.current, {
      center: [center.lat, center.lng],
      zoom: zoom,
      zoomControl: true,
    });

    mapInstanceRef.current = map;

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    return () => {
      map.remove();
    };
  }, [center.lat, center.lng, zoom]);

  // Debug logging
  useEffect(() => {
    console.log('InteractiveListingMap received listings:', listings.length);
    console.log('Listings with coordinates:', listings.filter(l => l.lat && l.lng).length);
  }, [listings]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current?.removeLayer(marker);
    });
    markersRef.current = [];

    // Add new markers for listings
    const validListings = listings.filter(listing => 
      listing.lat && listing.lng && 
      typeof listing.lat === 'number' && 
      typeof listing.lng === 'number'
    );

    console.log('Valid listings for map:', validListings.length);

    if (validListings.length === 0) return;

    validListings.forEach(listing => {
      // Create custom purple marker
      const purpleIcon = L.divIcon({
        className: 'custom-purple-marker',
        html: `<div style="
          background-color: #8b5cf6;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 10px;
        ">$</div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10]
      });

      const marker = L.marker([listing.lat!, listing.lng!], { 
        icon: purpleIcon 
      }).addTo(mapInstanceRef.current!);

      // Create popup content
      const popupContent = document.createElement('div');
      popupContent.className = 'listing-popup';
      popupContent.innerHTML = `
        <div style="min-width: 200px; padding: 8px;">
          <div style="display: flex; gap: 8px;">
            ${listing.images && listing.images.length > 0 ? 
              `<img src="${listing.images[0]}" alt="${listing.title}" style="
                width: 60px; 
                height: 60px; 
                object-fit: cover; 
                border-radius: 4px;
                flex-shrink: 0;
              " />` : 
              `<div style="
                width: 60px; 
                height: 60px; 
                background-color: #f3f4f6; 
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #6b7280;
                flex-shrink: 0;
              ">No image</div>`
            }
            <div style="flex: 1; min-width: 0;">
              ${listing.price ? 
                `<div style="font-weight: 600; color: #111827; margin-bottom: 4px;">
                  ${new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                  }).format(listing.price)}
                </div>` : ''
              }
              <div style="font-size: 14px; color: #374151; line-height: 1.3; margin-bottom: 4px;">
                ${listing.title}
              </div>
              <div style="font-size: 12px; color: #6b7280;">
                ${(listing as any).street_address || listing.city}
              </div>
            </div>
          </div>
        </div>
      `;

      // Add click handler to popup content
      popupContent.addEventListener('click', (e) => {
        e.stopPropagation();
        if (onListingClick) {
          onListingClick(listing);
        }
      });

      // Make popup content clickable
      popupContent.style.cursor = 'pointer';

      marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'listing-popup-container'
      });

      markersRef.current.push(marker);
    });

    // Fit map to show all markers if there are any
    if (validListings.length > 0) {
      const group = new L.FeatureGroup(markersRef.current);
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
    }

  }, [listings, onListingClick]);

  // Calculate validListings for the notice
  const validListings = listings.filter(listing => 
    listing.lat && listing.lng && 
    typeof listing.lat === 'number' && 
    typeof listing.lng === 'number'
  );

  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        style={{ height }}
        className="w-full rounded-lg overflow-hidden border border-border/50"
      />
      
      {/* Show notice if no listings have coordinates */}
      {listings.length > 0 && validListings.length === 0 && (
        <div className="absolute top-4 left-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg p-4 border border-border/50">
          <h3 className="font-semibold text-sm mb-2">No map locations available</h3>
          <p className="text-xs text-muted-foreground">
            The current listings don't have location coordinates set. When posting a listing, add latitude/longitude or a street address to show it on the map.
          </p>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{
        __html: `
          .listing-popup-container {
            border-radius: 8px;
            overflow: hidden;
          }
          .listing-popup-container .leaflet-popup-content-wrapper {
            border-radius: 8px;
            padding: 0;
          }
          .listing-popup-container .leaflet-popup-content {
            margin: 0;
          }
          .custom-purple-marker {
            background: transparent !important;
            border: none !important;
          }
        `
      }} />
    </div>
  );
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(price);
}