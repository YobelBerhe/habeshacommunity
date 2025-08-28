import type { ActiveUsers } from "@/types";
import { DEMO_ACTIVE } from "@/data/demoActive";
import { jitterAround } from "@/utils/geoJitter";

export type StarPoint = {
  id: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
};

let currentData: ActiveUsers = { ...DEMO_ACTIVE };
let lastUpdateTime = Date.now();

// Simulate live updates by randomly adjusting counts
function tickDemoData() {
  const newPoints = currentData.points.map(point => {
    const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
    const newCount = Math.max(1, Math.min(50, point.count + change));
    return { ...point, count: newCount };
  });
  
  const newTotal = newPoints.reduce((sum, point) => sum + point.count, 0);
  
  currentData = {
    total: newTotal,
    points: newPoints
  };
  
  lastUpdateTime = Date.now();
}

// Start demo ticker
let demoInterval: NodeJS.Timeout | null = null;

export function startDemoUpdates() {
  if (demoInterval) return;
  
  demoInterval = setInterval(tickDemoData, 15000); // Update every 15 seconds
}

export function stopDemoUpdates() {
  if (demoInterval) {
    clearInterval(demoInterval);
    demoInterval = null;
  }
}

export async function getActiveUsers(): Promise<ActiveUsers> {
  // TODO: Check if Supabase is available and configured
  // For now, always use demo mode
  
  // Start demo updates if not already running
  startDemoUpdates();
  
  // Add some jitter to coordinates for privacy
  const jitteredPoints = currentData.points.map(point => ({
    ...point,
    lat: point.lat + (Math.random() - 0.5) * 0.1,
    lon: point.lon + (Math.random() - 0.5) * 0.1
  }));
  
  return {
    total: currentData.total,
    points: jitteredPoints
  };
}

export function subscribeToActiveUsers(callback: (data: ActiveUsers) => void) {
  // In demo mode, call the callback when data updates
  const checkForUpdates = () => {
    callback(currentData);
  };
  
  const interval = setInterval(checkForUpdates, 16000); // Check every 16 seconds
  
  return () => clearInterval(interval);
}

export async function getStarPoints(): Promise<{ total: number; points: StarPoint[]; demo: boolean; }> {
  const hasSupabase =
    import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!hasSupabase) {
    // explode demo city counts into individual jittered points
    const pts: StarPoint[] = [];
    DEMO_ACTIVE.points.forEach((c) => {
      for (let i = 0; i < c.count; i++) {
        const j = jitterAround(c.lat, c.lon);
        pts.push({
          id: `demo-${c.city}-${i}`,
          city: c.city,
          country: c.country,
          lat: j.lat,
          lon: j.lon,
        });
      }
    });
    return { total: pts.length, points: pts, demo: true };
  }

  // TODO: LIVE mode - replace with actual Supabase query
  return { total: 0, points: [], demo: true };
}