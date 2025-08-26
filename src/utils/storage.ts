/* ======================================================================
   FILE: /utils/storage.ts
   Safe storage with compression + quota handling
   ====================================================================== */
import type { Listing } from "@/types";

const APP_KEY = "hn.app";
const CITY_KEY = (city: string) => `hn.posts.${city}`;

export function getAppState() {
  try {
    return JSON.parse(localStorage.getItem(APP_KEY) || "{}") || {};
  } catch { return {}; }
}
export function saveAppState(state: any) {
  localStorage.setItem(APP_KEY, JSON.stringify(state));
}

export function getListings(city: string): Listing[] {
  try {
    return JSON.parse(localStorage.getItem(CITY_KEY(city)) || "[]");
  } catch { return []; }
}

function safeSetItem(key: string, value: string) {
  try { localStorage.setItem(key, value); return true; }
  catch { return false; }
}

export async function saveListing(city: string, l: Listing): Promise<{ok:boolean; note?:string}> {
  const list = getListings(city);
  const next = [l, ...list];

  // Try normal save first
  if (safeSetItem(CITY_KEY(city), JSON.stringify(next))) return { ok: true };

  // If quota error (usually due to images), strip images and try again
  const lean = next.map(x => ({ ...x, images: [] }));
  const ok = safeSetItem(CITY_KEY(city), JSON.stringify(lean));
  return ok
    ? { ok: true, note: "Saved without images due to browser storage limit." }
    : { ok: false };
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
const FAV_KEY = "hn.favs";
export function getFavorites(): string[] {
  try { return JSON.parse(localStorage.getItem(FAV_KEY) || "[]"); } catch { return []; }
}
export function toggleFavorite(id: string): boolean {
  const f = new Set(getFavorites());
  if (f.has(id)) f.delete(id); else f.add(id);
  localStorage.setItem(FAV_KEY, JSON.stringify([...f]));
  return f.has(id);
}

/* Seed demo */
export function seedDemoData(city: string) {
  const key = CITY_KEY(city);
  if (localStorage.getItem(key)) return;
  const demo: Listing[] = [{
    id: "demo1",
    title: `Furnished Room in ${city}`,
    category: "housing",
    categoryLabel: "Housing / Rentals",
    description: "Beautiful furnished room in a safe neighborhood. Wi-Fi included.",
    tags: ["furnished","wifi","safe"],
    price: 350,
    createdAt: Date.now(),
    images: [],
    contact: "WhatsApp: +1-555-0123",
    city: city,
  }];
  localStorage.setItem(key, JSON.stringify(demo));
}