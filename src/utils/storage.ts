/* ======================================================================
   FILE: /utils/storage.ts
   Safe storage with compression + quota handling
   ====================================================================== */
import { Listing } from "@/types";
import type { AppState } from "@/types";

const KEY = "hn.posts"; // root object
const APP_KEY = "hn.app";


// New centralized storage functions
function load(): Record<string, Listing[]> {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function save(data: Record<string, Listing[]>) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    console.warn("Save failed:", e);
    return false;
  }
}

function cityKey(city: string) {
  return city.trim().toLowerCase(); // you can normalize further
}

export function getListingsByCity(city: string): Listing[] {
  const all = load();
  return all[cityKey(city)]?.slice()?.sort((a,b)=>b.createdAt - a.createdAt) ?? [];
}

export function addListing(city: string, listing: Listing): { ok: boolean; reason?: string } {
  const all = load();
  const k = cityKey(city);
  const arr = all[k] ?? [];
  arr.unshift(listing);
  all[k] = arr;
  const ok = save(all);
  return ok ? { ok } : { ok: false, reason: "quota" };
}

// App state management
export function getAppState(): AppState {
  try {
    const raw = localStorage.getItem("hn.appState");
    return raw ? JSON.parse(raw) : { city: "", viewMode: "list", lang: "EN" };
  } catch {
    return { city: "", viewMode: "list", lang: "EN" };
  }
}

export function saveAppState(state: AppState): boolean {
  try {
    localStorage.setItem("hn.appState", JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

// Legacy function for backward compatibility
export function getListings(city: string): Listing[] {
  return getListingsByCity(city);
}

function safeSetItem(key: string, value: string) {
  try { localStorage.setItem(key, value); return true; }
  catch { return false; }
}

export async function saveListing(city: string, l: Listing): Promise<{ok:boolean; note?:string}> {
  const result = addListing(city, l);
  if (result.ok) return { ok: true };
  
  if (result.reason === "quota") {
    // Try again without images
    const lean = { ...l, images: [], hasImage: false };
    const retryResult = addListing(city, lean);
    return retryResult.ok 
      ? { ok: true, note: "Saved without images due to browser storage limit." }
      : { ok: false };
  }
  
  return { ok: false };
}

/* Client-side compression to keep localStorage small */
export async function compressImage(file: File, maxSide = 960, quality = 0.82): Promise<string> {
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = URL.createObjectURL(file);
  });
  const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, w, h);
  const data = canvas.toDataURL("image/jpeg", quality);
  URL.revokeObjectURL(img.src);
  return data;
}

/* Favorites */
export function getFavorites(): string[] {
  try { return JSON.parse(localStorage.getItem("hn.favorites") || "[]"); } catch { return []; }
}

export function setFavorites(ids: string[]) {
  localStorage.setItem("hn.favorites", JSON.stringify(ids));
}

export function toggleFavorite(id: string): boolean {
  const ids = new Set(getFavorites());
  if (ids.has(id)) { ids.delete(id); setFavorites([...ids]); return false; }
  ids.add(id); setFavorites([...ids]); return true;
}

/* Seed demo */
export function seedDemoData(city: string) {
  const key = cityKey(city);
  const all = load();
  if (all[key]?.length) return;
  
  const demo: Listing[] = [{
    id: "demo1",
    user_id: "demo-user",
    title: `Furnished Room in ${city}`,
    category: "housing",
    subcategory: "apartments",
    description: "Beautiful furnished room in a safe neighborhood. Wi-Fi included.",
    tags: ["furnished","wifi","safe"],
    price: 350,
    currency: "USD",
    contact_phone: null,
    contact_whatsapp: "+1-555-0123",
    contact_telegram: null,
    contact_email: null,
    website_url: null,
    country: null,
    lat: null,
    lng: null,
    created_at: new Date().toISOString(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
    images: [],
    contact: { whatsapp: "+1-555-0123" },
    city: city,
    hasImage: false,
  }];
  
  all[key] = demo;
  save(all);
}