import { useEffect, useState } from "react";
import L from "leaflet";
import type { Listing } from "@/types";

type Props = {
  center?: { lat: number; lon: number };
  listings: Listing[];
  height?: number;
};

export default function MapCluster({ center, listings, height = 440 }: Props) {
  const [currentMap, setCurrentMap] = useState<L.Map | null>(null);
  const [currentTileLayer, setCurrentTileLayer] = useState<L.TileLayer | null>(null);

  const getTileLayerUrl = () => {
    const isDark = document.documentElement.classList.contains("dark");
    return isDark 
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  };

  const getTileLayerAttribution = () => {
    const isDark = document.documentElement.classList.contains("dark");
    return isDark
      ? "&copy; OpenStreetMap contributors &copy; CARTO"
      : "&copy; OpenStreetMap contributors";
  };

  useEffect(() => {
    // Clear any existing map instance
    const mapContainer = document.getElementById("hn-map");
    if (mapContainer) {
      mapContainer.innerHTML = '';
    }

    const map = L.map("hn-map", { zoomControl: true, scrollWheelZoom: false });
    const tile = L.tileLayer(getTileLayerUrl(), {
      attribution: getTileLayerAttribution(),
      maxZoom: 19,
    }).addTo(map);
    
    setCurrentMap(map);
    setCurrentTileLayer(tile);

    const group: L.Marker[] = [];
    listings.forEach((l) => {
      if (l.lat != null && l.lon != null) {
        const m = L.marker([l.lat, l.lon]).bindPopup(`<b>${escapeHtml(l.title)}</b>`);
        m.addTo(map);
        group.push(m);
      }
    });

    if (group.length) {
      const fg = L.featureGroup(group);
      map.fitBounds(fg.getBounds().pad(0.2));
    } else if (center) {
      map.setView([center.lat, center.lon], 12);
    } else {
      map.setView([0, 0], 2);
    }

    return () => {
      map.remove();
      setCurrentMap(null);
      setCurrentTileLayer(null);
    };
  }, [center, listings]);

  // Theme change listener
  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (currentMap && currentTileLayer) {
        currentMap.removeLayer(currentTileLayer);
        const newTile = L.tileLayer(getTileLayerUrl(), {
          attribution: getTileLayerAttribution(),
          maxZoom: 19,
        }).addTo(currentMap);
        setCurrentTileLayer(newTile);
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, [currentMap, currentTileLayer]);

  return <div id="hn-map" style={{ height, width: "100%", borderRadius: 12, overflow: "hidden" }} />;
}

function escapeHtml(s: string){ return s.replace(/[&<>"']/g, (c)=>({ "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;" }[c]!)); }