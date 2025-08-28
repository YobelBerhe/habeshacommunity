import { useEffect } from "react";
import L from "leaflet";

type StarPoint = {
  id: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
};

type Props = {
  map: L.Map;
  points: StarPoint[];
};

export default function StarFieldLayer({ map, points }: Props) {
  useEffect(() => {
    if (!map || !points.length) return;

    // Create star markers
    const markers: L.Marker[] = [];

    const createStarIcon = () => {
      const isDark = document.documentElement.classList.contains("dark");
      const color = isDark ? "#fbbf24" : "#f59e0b"; // amber colors
      
      return L.divIcon({
        html: `
          <div class="star-marker">
            <div class="star-dot" style="background-color: ${color}; box-shadow: 0 0 6px ${color}40;"></div>
          </div>
        `,
        className: 'star-container',
        iconSize: [8, 8],
        iconAnchor: [4, 4]
      });
    };

    // Add markers for each point
    points.forEach((point) => {
      const marker = L.marker([point.lat, point.lon], {
        icon: createStarIcon()
      }).addTo(map);

      // Add tooltip
      marker.bindTooltip(
        `<div class="text-center">
          <div class="font-semibold">${point.city}, ${point.country}</div>
          <div class="text-sm">1 user online</div>
        </div>`,
        {
          direction: 'top',
          offset: [0, -10]
        }
      );

      markers.push(marker);
    });

    // Cleanup function
    return () => {
      markers.forEach(marker => {
        map.removeLayer(marker);
      });
    };
  }, [map, points]);

  return null;
}