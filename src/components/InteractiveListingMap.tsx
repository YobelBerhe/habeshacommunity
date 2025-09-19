import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import { Listing } from '@/types';
import { Badge } from "@/components/ui/badge";

// Fix default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Geocoding function to get coordinates from address or city
async function geocodeLocation(listing: Listing): Promise<{ lat: number; lng: number } | null> {
  try {
    // Skip invalid cities
    if (!listing.city || listing.city === 'Select a city' || listing.city === 'Unknown') {
      // Use a default city center (San Francisco) for listings without valid city
      return { lat: 37.7749, lng: -122.4194 };
    }
    
    // Try street address first if available
    const streetAddress = (listing as any).street_address;
    const query = streetAddress 
      ? `${streetAddress}, ${listing.city}, ${listing.country}`
      : `${listing.city}, ${listing.country}`;
    
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`
    );
    const results = await response.json();
    
    if (results && results.length > 0) {
      return {
        lat: parseFloat(results[0].lat),
        lng: parseFloat(results[0].lon)
      };
    }
    
    // Fallback to default location if geocoding fails
    return { lat: 37.7749, lng: -122.4194 };
  } catch (error) {
    console.error('Geocoding failed:', error);
    // Fallback to default location
    return { lat: 37.7749, lng: -122.4194 };
  }
}

interface Props {
  listings: Listing[];
  onListingClick?: (listing: Listing) => void;
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
  searchCity?: string;
  searchCityCoords?: { lat: number; lng: number };
}

export default function InteractiveListingMap({ 
  listings, 
  onListingClick, 
  center = { lat: 40.7128, lng: -74.0060 }, 
  zoom = 10,
  height = "500px",
  searchCity,
  searchCityCoords
}: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const markerClusterRef = useRef<L.MarkerClusterGroup | null>(null);
  const [listingsWithCoords, setListingsWithCoords] = useState<(Listing & { lat: number; lng: number })[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Create map with increased zoom levels
    const map = L.map(mapRef.current, {
      center: [center.lat, center.lng],
      zoom: Math.min(zoom + 2, 12),
      zoomControl: true,
      maxZoom: 12,
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

  // Geocode listings without coordinates
  useEffect(() => {
    const geocodeListings = async () => {
      const listingsWithValidCoords: (Listing & { lat: number; lng: number })[] = [];
      
      for (const listing of listings) {
        // Check if listing already has coordinates
        if (listing.lat && listing.lng && 
            typeof listing.lat === 'number' && 
            typeof listing.lng === 'number') {
          listingsWithValidCoords.push({ ...listing, lat: listing.lat, lng: listing.lng });
          continue;
        }
        
        // Try to geocode using street address or city
        const coords = await geocodeLocation(listing);
        if (coords) {
          listingsWithValidCoords.push({ ...listing, lat: coords.lat, lng: coords.lng });
        }
      }
      
      setListingsWithCoords(listingsWithValidCoords);
    };

    if (listings.length > 0) {
      geocodeListings();
    }
  }, [listings]);

  // Debug logging
  useEffect(() => {
    console.log('InteractiveListingMap received listings:', listings.length);
    console.log('Listings with coordinates:', listingsWithCoords.length);
    console.log('Valid listings for map:', listingsWithCoords.length);
  }, [listings, listingsWithCoords]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers and cluster group
    if (markerClusterRef.current) {
      mapInstanceRef.current.removeLayer(markerClusterRef.current);
    }
    markersRef.current = [];

    if (listingsWithCoords.length === 0) return;

    // Create a new marker cluster group with custom styling
    markerClusterRef.current = L.markerClusterGroup({
      maxClusterRadius: 80,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      iconCreateFunction: function(cluster) {
        const count = cluster.getChildCount();
        return L.divIcon({
          html: `<div style="
            background: hsl(215, 94%, 50%);
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 4px 12px rgba(0, 133, 255, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: ${count < 10 ? '14px' : count < 100 ? '12px' : '10px'};
            cursor: pointer;
          ">${count}</div>`,
          className: 'custom-cluster-icon',
          iconSize: [40, 40],
          iconAnchor: [20, 20]
        });
      }
    });

    listingsWithCoords.forEach(listing => {
      // Format price correctly - ensure we're displaying the actual listing price
      const priceDisplay = listing.price 
        ? (listing.price >= 1000 
          ? `$${Math.round(listing.price/1000)}k` 
          : `$${listing.price}`)
        : '•';

      // Create custom blue circular marker similar to Zillow
      const blueIcon = L.divIcon({
        className: 'custom-blue-marker',
        html: `<div style="
          background-color: hsl(215, 94%, 50%);
          width: 28px;
          height: 28px;
          border-radius: 50%;
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
          position: relative;
          z-index: 1000;
        ">${priceDisplay}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -14]
      });

      const marker = L.marker([listing.lat!, listing.lng!], { 
        icon: blueIcon 
      });

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

      // Add click handler directly to marker
      marker.on('click', function(e) {
        e.originalEvent?.stopPropagation();
        if (onListingClick) {
          onListingClick(listing);
        }
      });

      // Add click handler to popup content as backup
      popupContent.addEventListener('click', (e) => {
        e.stopPropagation();
        if (onListingClick) {
          onListingClick(listing);
        }
      });

      // Make popup content clickable
      popupContent.style.cursor = 'pointer';

      // Improve clickability without altering Leaflet positioning transform
      marker.on('mouseover', () => {
        marker.setZIndexOffset(1000);
      });
      
      marker.on('mouseout', () => {
        marker.setZIndexOffset(0);
      });

      marker.bindPopup(popupContent, {
        maxWidth: 280,
        className: 'listing-popup-container',
        closeButton: true,
        autoPan: false,
        keepInView: false,
        autoClose: false,
        closeOnClick: false
      });

      // Add marker to cluster group instead of directly to map
      markerClusterRef.current!.addLayer(marker);
      markersRef.current.push(marker);
    });

    // Add the cluster group to the map
    mapInstanceRef.current.addLayer(markerClusterRef.current);

    // Handle city search zoom functionality
    if (searchCityCoords && searchCity) {
      // Zoom to searched city
      mapInstanceRef.current.setView([searchCityCoords.lat, searchCityCoords.lng], 11);
    } else if (listingsWithCoords.length > 0) {
      if (listingsWithCoords.length === 1) {
        // For single listing, center on it with increased zoom
        mapInstanceRef.current.setView([listingsWithCoords[0].lat, listingsWithCoords[0].lng], Math.min(zoom + 2, 12));
      } else {
        // For multiple listings, fit all markers with padding
        const group = new L.FeatureGroup(markersRef.current);
        mapInstanceRef.current.fitBounds(group.getBounds(), { padding: [30, 30] });
      }
    }
  }, [listingsWithCoords, onListingClick, zoom, searchCity, searchCityCoords]);

  return (
    <div className="relative w-full" style={{ height }}>
      <div ref={mapRef} className="w-full h-full rounded-lg" />
      {listingsWithCoords.length === 0 && listings.length > 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-lg">
          <div className="text-center">
            <p className="text-muted-foreground">Loading map locations...</p>
          </div>
        </div>
      )}
    </div>
  );
}