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
  searchCountry?: string;
}

export default function InteractiveListingMap({ 
  listings, 
  onListingClick, 
  center = { lat: 40.7128, lng: -74.0060 }, 
  zoom = 10,
  height = "500px",
  searchCity,
  searchCityCoords,
  searchCountry
}: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const markerClusterRef = useRef<L.MarkerClusterGroup | null>(null);
  const [listingsWithCoords, setListingsWithCoords] = useState<(Listing & { lat: number; lng: number })[]>([]);
  const [currentZoom, setCurrentZoom] = useState(zoom);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [mapStyle, setMapStyle] = useState<'street' | 'satellite'>('street');
  const [boundaryLayer, setBoundaryLayer] = useState<L.GeoJSON | null>(null);
  const [showBorders, setShowBorders] = useState(true);

  useEffect(() => {
    if (!mapRef.current) return;

    // Create map with world view when no specific search
    const initialZoom = searchCity ? Math.min(zoom + 2, 12) : 2;
    const map = L.map(mapRef.current, {
      center: searchCityCoords ? [searchCityCoords.lat, searchCityCoords.lng] : [20, 0],
      zoom: initialZoom,
      zoomControl: true,
      maxZoom: 18,
    });

    mapInstanceRef.current = map;
    setCurrentZoom(initialZoom);

    // Track zoom changes
    map.on('zoomend', () => {
      setCurrentZoom(map.getZoom());
    });

    // Add tile layer based on style
    const getTileLayer = () => {
      if (mapStyle === 'satellite') {
        return L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          attribution: '© Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        });
      } else {
        return L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        });
      }
    };

    const tileLayer = getTileLayer();
    tileLayer.addTo(map);

    return () => {
      map.remove();
    };
  }, [center.lat, center.lng, zoom, mapStyle]);

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
        const size = currentZoom < 8 ? 24 : 40;
        const fontSize = currentZoom < 8 ? '10px' : (count < 10 ? '14px' : count < 100 ? '12px' : '10px');
        return L.divIcon({
          html: `<div style="
            background: hsl(215, 94%, 50%);
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 2px 8px rgba(0, 133, 255, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: ${fontSize};
            cursor: pointer;
          ">${count}</div>`,
          className: 'custom-cluster-icon',
          iconSize: [size, size],
          iconAnchor: [size/2, size/2]
        });
      }
    });

    listingsWithCoords.forEach(listing => {
      // Show price only when zoomed in, otherwise show dot
      const showPrice = currentZoom >= 10;
      const priceDisplay = showPrice && listing.price 
        ? (listing.price >= 1000 
          ? `$${Math.round(listing.price/1000)}k` 
          : `$${listing.price}`)
        : '';

      // Create custom blue circular marker - smaller when zoomed out
      const size = showPrice ? 28 : 8;
      const blueIcon = L.divIcon({
        className: 'custom-blue-marker',
        html: `<div style="
          background-color: hsl(215, 94%, 50%);
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          border: ${showPrice ? '2px' : '1px'} solid white;
          box-shadow: 0 ${showPrice ? '4px 8px' : '2px 4px'} rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: ${showPrice ? '11px' : '6px'};
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          z-index: 1000;
        ">${priceDisplay}</div>`,
        iconSize: [size, size],
        iconAnchor: [size/2, size/2],
        popupAnchor: [0, -size/2]
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

      // Add click handler to show preview first
      marker.on('click', function(e) {
        e.originalEvent?.stopPropagation();
        setSelectedListing(listing);
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

    // Handle city/country search zoom functionality
    if (searchCityCoords && searchCity) {
      // Zoom to searched city
      mapInstanceRef.current.setView([searchCityCoords.lat, searchCityCoords.lng], 11);
      addBoundary(searchCity, 'city');
    } else if (searchCountry) {
      // Handle country search - zoom to show entire country
      const countryListings = listingsWithCoords.filter(listing => 
        listing.country?.toLowerCase() === searchCountry.toLowerCase()
      );
      if (countryListings.length > 0) {
        const group = new L.FeatureGroup(countryListings.map(listing => 
          L.marker([listing.lat, listing.lng])
        ));
        mapInstanceRef.current.fitBounds(group.getBounds(), { padding: [50, 50] });
        addBoundary(searchCountry, 'country');
      }
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
  }, [listingsWithCoords, onListingClick, zoom, searchCity, searchCityCoords, searchCountry]);

  // Function to add boundary highlighting
  const addBoundary = async (locationName: string, type: 'city' | 'country') => {
    if (!mapInstanceRef.current || !showBorders) return;

    // Remove existing boundary
    if (boundaryLayer) {
      mapInstanceRef.current.removeLayer(boundaryLayer);
      setBoundaryLayer(null);
    }

    try {
      // Use Nominatim to get boundary data
      const query = type === 'country' ? locationName : `${locationName}, city`;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=geojson&limit=1&polygon_geojson=1&q=${encodeURIComponent(query)}`
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        const boundary = L.geoJSON(feature, {
          style: {
            color: 'hsl(215, 94%, 50%)', // Blue color
            weight: 3,
            opacity: 0.8,
            fillOpacity: 0.1,
            fillColor: 'hsl(215, 94%, 50%)'
          }
        });

        boundary.addTo(mapInstanceRef.current);
        setBoundaryLayer(boundary);
      }
    } catch (error) {
      console.error('Failed to load boundary:', error);
    }
  };

  // Effect to handle border toggle changes
  useEffect(() => {
    if (!showBorders && boundaryLayer && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(boundaryLayer);
      setBoundaryLayer(null);
    } else if (showBorders && (searchCity || searchCountry)) {
      if (searchCity) {
        addBoundary(searchCity, 'city');
      } else if (searchCountry) {
        addBoundary(searchCountry, 'country');
      }
    }
  }, [showBorders, searchCity, searchCountry]);

  return (
    <div className="relative w-full" style={{ height }}>
      {/* Map View Toggle */}
      <div className="absolute top-4 right-4 z-[1000] bg-white rounded-lg shadow-lg border border-border/20">
        <div className="p-2">
          <div className="text-xs font-medium text-muted-foreground mb-2">Map Options</div>
          <div className="space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="mapStyle"
                value="street"
                checked={mapStyle === 'street'}
                onChange={(e) => setMapStyle(e.target.value as 'street' | 'satellite')}
                className="w-3 h-3 text-primary"
              />
              <span className="text-xs">Automatic</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="mapStyle"
                value="satellite"
                checked={mapStyle === 'satellite'}
                onChange={(e) => setMapStyle(e.target.value as 'street' | 'satellite')}
                className="w-3 h-3 text-primary"
              />
              <span className="text-xs">Satellite</span>
            </label>
            {(searchCity || searchCountry) && (
              <div className="border-t border-border/20 pt-2 mt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showBorders}
                    onChange={(e) => setShowBorders(e.target.checked)}
                    className="w-3 h-3 text-primary rounded"
                  />
                  <span className="text-xs">Show Borders</span>
                </label>
              </div>
            )}
          </div>
        </div>
      </div>

      <div ref={mapRef} className="w-full h-full rounded-lg" />
      
      {/* Listing Preview Popup */}
      {selectedListing && (
        <div className="absolute top-4 left-4 right-4 z-[1000] bg-white rounded-lg shadow-lg p-4 cursor-pointer"
             onClick={() => {
               if (onListingClick) {
                 onListingClick(selectedListing);
               }
             }}>
          <div className="flex gap-3">
            {selectedListing.images && selectedListing.images.length > 0 ? (
              <img 
                src={selectedListing.images[0]} 
                alt={selectedListing.title}
                className="w-16 h-16 object-cover rounded"
              />
            ) : (
              <div className="w-16 h-16 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                No Photo
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate">{selectedListing.title}</h3>
              <p className="text-xs text-muted-foreground truncate">
                {selectedListing.city}, {selectedListing.country}
              </p>
              {selectedListing.price && (
                <p className="text-sm font-bold text-primary">
                  ${selectedListing.price.toLocaleString()}
                </p>
              )}
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setSelectedListing(null);
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              ×
            </button>
          </div>
        </div>
      )}
      
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