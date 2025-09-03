import { Listing } from "@/types";
import type { SortKey } from "@/components/SortDropdown";

export const timeAgo = (iso?: string | Date | number) => {
  if (!iso) return "";
  const ts = typeof iso === "string" ? new Date(iso) : typeof iso === "number" ? new Date(iso) : iso;
  const s = Math.floor((Date.now() - ts.getTime()) / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  
  if (s < 60) return `${s}s ago`;
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${d}d ago`;
};

export const getFaves = (): string[] =>
  JSON.parse(localStorage.getItem("hn.faves") || "[]");

export const setFaves = (ids: string[]) =>
  localStorage.setItem("hn.faves", JSON.stringify(ids));

export const isFaved = (id: string) => getFaves().includes(id);

export const toggleFave = (id: string) => {
  const cur = new Set(getFaves());
  cur.has(id) ? cur.delete(id) : cur.add(id);
  setFaves([...cur]);
  return cur.has(id);
};

export const getHidden = (): string[] =>
  JSON.parse(localStorage.getItem("hn.hidden") || "[]");

export const hideId = (id: string) =>
  localStorage.setItem("hn.hidden", JSON.stringify([...new Set([...getHidden(), id])]));

export const shareListing = async (l: { id: string; title: string; city?: string }) => {
  const url = `${window.location.origin}/l/${l.id}`;
  const text = `${l.title}${l.city ? " • " + l.city : ""}`;
  
  try {
    if (navigator.share) {
      await navigator.share({ title: l.title, text, url });
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link copied!");
    }
  } catch {
    // Silent fail
  }
};

export const isToday = (date: string | Date | number) => {
  const ts = typeof date === "string" ? new Date(date) : typeof date === "number" ? new Date(date) : date;
  const today = new Date();
  return ts.toDateString() === today.toDateString();
};

export const applyQuickFilters = (
  listings: Listing[], 
  filters: { hasImage?: boolean; postedToday?: boolean }
) => {
  let filtered = [...listings];
  
  if (filters.hasImage) {
    filtered = filtered.filter(l => l.images && l.images.length > 0);
  }
  
  if (filters.postedToday) {
    filtered = filtered.filter(l => isToday(l.created_at));
  }
  
  return filtered;
};

// Sorting function
export const sortListings = (listings: Listing[], key: SortKey) => {
  const safeNum = (v: any) => (typeof v === "number" ? v : Number(v || 0));
  const safeDate = (v: any) => new Date(v || 0).getTime();
  
  switch (key) {
    case "newest": 
      return [...listings].sort((a, b) => safeDate(b.created_at) - safeDate(a.created_at));
    case "oldest": 
      return [...listings].sort((a, b) => safeDate(a.created_at) - safeDate(b.created_at));
    case "price_asc": 
      return [...listings].sort((a, b) => safeNum(a.price) - safeNum(b.price));
    case "price_desc": 
      return [...listings].sort((a, b) => safeNum(b.price) - safeNum(a.price));
    case "upcoming":
      return [...listings].sort((a, b) => {
        const A = new Date((a as any).available_date || "9999-12-31").getTime();
        const B = new Date((b as any).available_date || "9999-12-31").getTime();
        return A - B;
      });
    default: 
      return listings; // relevance = current ordering
  }
};