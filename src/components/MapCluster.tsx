import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Listing } from "@/types";

type Props = {
  center?: { lat: number; lon: number };
  listings: Listing[];
  height?: number;
};

export default function MapCluster({ center, listings, height = 440 }: Props) {
  useEffect(() => {
    const map = L.map("hn-map", { zoomControl: true, scrollWheelZoom: false });
    const tile = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);

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
      tile.remove();
    };
  }, [center, listings]);

  return <div id="hn-map" style={{ height, width: "100%", borderRadius: 12, overflow: "hidden" }} />;
}

function escapeHtml(s: string){ return s.replace(/[&<>"']/g, (c)=>({ "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;" }[c]!)); }