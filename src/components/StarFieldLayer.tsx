import { useEffect, useRef } from "react";
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
  glowColorLight?: string;
  glowColorDark?: string;
};

export default function StarFieldLayer({
  map,
  points,
  glowColorLight = "rgba(255,255,240,0.9)",
  glowColorDark = "rgba(255, 204, 0, 0.9)",
}: Props) {
  const layerRef = useRef<L.Canvas | null>(null);

  useEffect(() => {
    if (!map) return;

    const canvas = L.canvas({ padding: 0.5 });
    layerRef.current = canvas;
    canvas.addTo(map);

    const isDark = document.documentElement.classList.contains("dark");
    const glow = isDark ? glowColorDark : glowColorLight;

    const ctx = (canvas as any)._ctx as CanvasRenderingContext2D;

    function draw() {
      const size = map.getSize();
      ctx.clearRect(0, 0, size.x, size.y);

      const zoom = map.getZoom();
      const r = Math.max(0.8, Math.min(2.2, 0.9 + (zoom - 2) * 0.15));

      points.forEach((p) => {
        const pt = map.latLngToContainerPoint([p.lat, p.lon]);
        if (pt.x < 0 || pt.y < 0 || pt.x > size.x || pt.y > size.y) return;

        // center bright core
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // soft outer glow
        const grd = ctx.createRadialGradient(pt.x, pt.y, r*0.2, pt.x, pt.y, r*3.2);
        grd.addColorStop(0, glow);
        grd.addColorStop(1, "rgba(255,255,255,0)");
        ctx.beginPath();
        ctx.fillStyle = grd;
        ctx.arc(pt.x, pt.y, r*3.2, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    const redraw = () => {
      (canvas as any).redraw();
      draw();
    };

    map.on("move zoom resize", redraw);
    redraw();

    // twinkle animation
    const id = setInterval(() => redraw(), 900);

    return () => {
      clearInterval(id);
      map.off("move zoom resize", redraw);
      map.removeLayer(canvas);
    };
  }, [map, points, glowColorLight, glowColorDark]);

  return null;
}