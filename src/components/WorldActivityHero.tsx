"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import L, { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import { CityActivity, fetchCityActivity, summarize } from "@/lib/activity";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import "./WorldActivityHero.css";

type Props = {
  mode?: "dark" | "light";
  onCityClick?: (city: string) => void;
  SearchBar?: React.ComponentType<any>;
  onPrimary?: () => void;
  onSecondary?: () => void;
};

export default function WorldActivityHero({
  mode = "dark",
  onCityClick,
  SearchBar,
  onPrimary,
  onSecondary,
}: Props) {
  const mapRef = useRef<LeafletMap | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [points, setPoints] = useState<CityActivity[]>([]);
  const [totals, setTotals] = useState({ totalCities: 0, totalPeople: 0 });
  const prefersReduced = useReducedMotion();

  const tileUrl = useMemo(() => {
    return mode === "dark"
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png";
  }, [mode]);

  useEffect(() => {
    let disposed = false;
    (async () => {
      const data = await fetchCityActivity();
      if (disposed) return;
      setPoints(data);
      setTotals(summarize(data));
    })();
    return () => { disposed = true; };
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    
    if (!mapRef.current) {
      const m = L.map(containerRef.current, {
        zoomControl: false,
        attributionControl: true,
        minZoom: 1,
        maxZoom: 5,
        worldCopyJump: true,
        dragging: window.innerWidth < 768,
        scrollWheelZoom: window.innerWidth < 768,
        inertia: true,
      }).setView([15, 20], 2);

      L.tileLayer(tileUrl, {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        detectRetina: true,
      }).addTo(m);

      mapRef.current = m;
    } else {
      mapRef.current.eachLayer((layer) => {
        if (layer instanceof L.TileLayer) {
          mapRef.current?.removeLayer(layer);
        }
      });
      L.tileLayer(tileUrl, {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        detectRetina: true,
      }).addTo(mapRef.current);
    }
  }, [tileUrl]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    
    const layer = L.layerGroup().addTo(map);

    points.forEach((p, index) => {
      const div = L.divIcon({
        className: "",
        html: `<div id="p-${index}"></div>`,
        iconSize: [0, 0],
      });
      
      const marker = L.marker([p.lat, p.lng], { icon: div }).addTo(layer);
      marker.bindTooltip(`View listings in ${p.city} • ${p.count}`, { 
        direction: "top", 
        offset: L.point(0, -18) 
      });
      
      marker.on("click", () => onCityClick?.(p.city));
      marker.on("keydown", (e: any) => {
        if (e.originalEvent.key === "Enter" || e.originalEvent.key === " ") {
          e.originalEvent.preventDefault();
          onCityClick?.(p.city);
        }
      });
      
      setTimeout(() => {
        const el = document.getElementById(`p-${index}`);
        if (el) {
          el.innerHTML = `
            <div class="hc-dot${mode === "light" ? " hc-dot-light" : ""}${prefersReduced ? " hc-dot-static" : ""}" 
                 style="cursor: pointer;" 
                 tabindex="0" 
                 role="button" 
                 aria-label="View listings in ${p.city}">
              <span class="hc-badge">+${p.count}</span>
            </div>`;
        }
      }, 0);
    });

    return () => { 
      map.removeLayer(layer); 
    };
  }, [points, onCityClick, mode, prefersReduced]);

  return (
    <section className={`relative w-full h-[72vh] md:h-[82vh] overflow-hidden ${mode === "light" ? "bg-white" : "bg-[#0b0c0f]"}`}>
      <div ref={containerRef} className="absolute inset-0 z-0" />
      
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/40 via-black/20 to-black/40 md:from-black/30 md:to-black/30 z-[1]" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 pt-14 md:pt-20">
        <h1 className="text-white text-3xl md:text-5xl font-semibold drop-shadow-sm">
          Connect with the <span className="text-blue-500">Habesha Community</span>
        </h1>
        <p className="text-white/90 mt-3 md:text-lg">
          <span className="text-red-500">Live now:</span> <b>{totals.totalPeople}</b> people in <b>{totals.totalCities}</b> cities
        </p>

        <div className="mt-6">
          {SearchBar ? (
            <div className="max-w-2xl">
              <SearchBar />
            </div>
          ) : null}
        </div>

        <div className="mt-5 flex gap-3">
          <button 
            onClick={onPrimary} 
            className="rounded-2xl px-5 py-3 bg-white/90 hover:bg-white text-gray-900 font-medium transition-colors"
          >
            Housing / Rentals
          </button>
          <button 
            onClick={onSecondary} 
            className="rounded-2xl px-5 py-3 bg-white/20 hover:bg-white/30 text-white font-medium transition-colors"
          >
            Jobs
          </button>
        </div>

        <p className="text-white/60 text-xs mt-6">Dots show approximate city-level activity.</p>
      </div>
    </section>
  );
}