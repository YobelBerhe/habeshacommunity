import { supabase } from "@/integrations/supabase/client";

export type CityActivity = {
  city: string;
  country?: string | null;
  lat: number;
  lng: number;
  count: number;
};

const DEMO: CityActivity[] = [
  { city: "Asmara", country: "Eritrea", lat: 15.3229, lng: 38.9251, count: 22 },
  { city: "Addis Ababa", country: "Ethiopia", lat: 8.9806, lng: 38.7578, count: 18 },
  { city: "Nairobi", country: "Kenya", lat: -1.286389, lng: 36.817223, count: 12 },
  { city: "Frankfurt", country: "Germany", lat: 50.1109, lng: 8.6821, count: 9 },
  { city: "Oakland", country: "USA", lat: 37.8044, lng: -122.2712, count: 7 },
  { city: "Seattle", country: "USA", lat: 47.6062, lng: -122.3321, count: 6 },
  { city: "Tel Aviv", country: "Israel", lat: 32.0853, lng: 34.7818, count: 6 },
  { city: "Melbourne", country: "Australia", lat: -37.8136, lng: 144.9631, count: 5 },
  { city: "Dubai", country: "UAE", lat: 25.2048, lng: 55.2708, count: 5 },
  { city: "Jeddah", country: "Saudi Arabia", lat: 21.4858, lng: 39.1925, count: 4 },
];

export async function fetchCityActivity(): Promise<CityActivity[]> {
  // Try listings grouped by city
  const { data: listings, error: e1 } = await supabase
    .from("listings")
    .select("city, country, location_lat, location_lng")
    .not("city", "is", null);

  if (!e1 && listings && listings.length) {
    const map = new Map<string, CityActivity>();
    for (const r of listings as any[]) {
      if (!r.city || r.location_lat == null || r.location_lng == null) continue;
      const key = `${r.city}|${r.country ?? ""}|${r.location_lat}|${r.location_lng}`;
      const cur = map.get(key) ?? { 
        city: r.city, 
        country: r.country, 
        lat: r.location_lat, 
        lng: r.location_lng, 
        count: 0 
      };
      cur.count += 1;
      map.set(key, cur);
    }
    const arr = Array.from(map.values()).sort((a,b)=>b.count-a.count).slice(0, 300);
    return arr.length ? arr : DEMO;
  }

  // Fallback to profiles grouped by city
  const { data: profiles, error: e2 } = await supabase
    .from("profiles")
    .select("city")
    .not("city", "is", null);

  if (!e2 && profiles && profiles.length) {
    const map = new Map<string, CityActivity>();
    for (const r of profiles as any[]) {
      if (!r.city) continue;
      // For profiles without lat/lng, use demo coordinates if available
      const demo = DEMO.find(d => d.city.toLowerCase() === r.city.toLowerCase());
      if (demo) {
        const key = `${demo.city}|${demo.country}|${demo.lat}|${demo.lng}`;
        const cur = map.get(key) ?? { ...demo, count: 0 };
        cur.count += 1;
        map.set(key, cur);
      }
    }
    const arr = Array.from(map.values()).sort((a,b)=>b.count-a.count).slice(0, 300);
    return arr.length ? arr : DEMO;
  }

  // Cold start
  return DEMO;
}

export function summarize(arr: CityActivity[]) {
  const cities = new Set(arr.map(a => a.city));
  const people = arr.reduce((n, a) => n + a.count, 0);
  return { totalCities: cities.size, totalPeople: people };
}