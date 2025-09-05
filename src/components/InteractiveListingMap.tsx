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
      // Create custom purple marker similar to Zillow
      const purpleIcon = L.divIcon({
        className: 'custom-purple-marker',
        html: `<div style="
          background-color: #7c3aed;
          width: 28px;
          height: 28px;
          border-radius: 6px;
          border: 2px solid white;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 11px;
          cursor: pointer;
          transition: all 0.2s ease;
        ">${listing.price ? `$${Math.round(listing.price/1000)}k` : '•'}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -14]
      });

      const marker = L.marker([listing.lat!, listing.lng!], { 
        icon: purpleIcon 
      }).addTo(mapInstanceRef.current!);

      // Create popup content similar to Zillow
      const popupContent = document.createElement('div');
      popupContent.className = 'listing-popup';
      popupContent.innerHTML = `
        <div style="min-width: 280px; padding: 0; border-radius: 8px; overflow: hidden; font-family: system-ui, -apple-system, sans-serif;">
          <div style="position: relative;">
            ${listing.images && listing.images.length > 0 ? 
              `<img src="${listing.images[0]}" alt="${listing.title}" style="
                width: 100%; 
                height: 120px; 
                object-fit: cover;
              " />` : 
              `<div style="
                width: 100%; 
                height: 120px; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 14px;
              ">No Photo Available</div>`
            }
            ${listing.images && listing.images.length > 1 ? 
              `<div style="position: absolute; bottom: 8px; right: 8px; background: rgba(0,0,0,0.7); color: white; padding: 2px 6px; border-radius: 4px; font-size: 11px;">
                1/${listing.images.length}
              </div>` : ''
            }
          </div>
          <div style="padding: 12px;">
            ${listing.price ? 
              `<div style="font-weight: 700; color: #1a1a1a; font-size: 18px; margin-bottom: 4px;">
                ${new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                }).format(listing.price)}${listing.category === 'housing' ? '/mo' : ''}
              </div>` : ''
            }
            <div style="font-size: 14px; color: #1a1a1a; line-height: 1.4; margin-bottom: 6px; font-weight: 500;">
              ${listing.title}
            </div>
            <div style="font-size: 12px; color: #6b7280; margin-bottom: 8px;">
              ${(listing as any).street_address || listing.city}
            </div>
            ${listing.category === 'housing' ? 
              `<div style="display: flex; gap: 12px; font-size: 12px; color: #6b7280;">
                <span>• Available now</span>
                <span>• ${listing.subcategory || 'Housing'}</span>
              </div>` : 
              `<div style="font-size: 12px; color: #6b7280;">
                ${listing.category || 'Item'} • ${listing.subcategory || 'General'}
              </div>`
            }
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

      // Add hover effect to marker
      marker.on('mouseover', function() {
        this.getElement()?.style.setProperty('transform', 'scale(1.1)');
        this.getElement()?.style.setProperty('z-index', '1000');
      });
      
      marker.on('mouseout', function() {
        this.getElement()?.style.setProperty('transform', 'scale(1.0)');
        this.getElement()?.style.setProperty('z-index', '');
      });

      marker.bindPopup(popupContent, {
        maxWidth: 280,
        className: 'listing-popup-container',
        closeButton: true,
        autoPan: true,
        keepInView: true
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
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 8px 24px rgba(0,0,0,0.15);
          }
          .listing-popup-container .leaflet-popup-content-wrapper {
            border-radius: 12px;
            padding: 0;
            box-shadow: none;
          }
          .listing-popup-container .leaflet-popup-content {
            margin: 0;
            border-radius: 12px;
            overflow: hidden;
          }
          .listing-popup-container .leaflet-popup-tip {
            background: white;
            box-shadow: 0 3px 6px rgba(0,0,0,0.1);
          }
          .custom-purple-marker {
            background: transparent !important;
            border: none !important;
          }
          .custom-purple-marker > div:hover {
            transform: scale(1.1) !important;
            background-color: #6366f1 !important;
            box-shadow: 0 6px 12px rgba(0,0,0,0.4) !important;
          }
          .leaflet-popup-close-button {
            top: 8px !important;
            right: 8px !important;
            background: rgba(0,0,0,0.5) !important;
            color: white !important;
            border-radius: 50% !important;
            width: 24px !important;
            height: 24px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 16px !important;
            line-height: 1 !important;
          }
          .leaflet-popup-close-button:hover {
            background: rgba(0,0,0,0.7) !important;
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