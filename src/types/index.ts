import type { CategoryKey, JobKind } from "@/lib/taxonomy";

export { type CategoryKey, type JobKind };

export interface Category {
  id: string;
  name: string;
  icon?: string;
}

export interface JobSubcategory {
  id: string;
  name: string;
  category: string;
}

export interface City {
  name: string;
  country: string;
  countryCode: string;
  lat: number;
  lon: number;
}

export interface Listing {
  id: string;
  user_id: string;
  category: string;              // e.g., 'housing' | 'jobs' | 'services' | 'community'
  subcategory?: string | null;
  title: string;
  description: string;
  price?: number | null;
  currency?: string | null;
  tags: string[];
  images: string[];              // public URLs
  contact_phone?: string | null;
  contact_whatsapp?: string | null;
  contact_telegram?: string | null;
  contact_email?: string | null;
  website_url?: string | null;   // NEW
  city: string;                  // NEW
  country?: string | null;       // NEW
  lat?: number | null;
  lng?: number | null;
  contact_hidden?: boolean;      // NEW
  created_at: string;            // ISO
  
  // Legacy fields for backward compatibility
  jobKind?: JobKind;             // only for jobs: "regular" | "gig"
  contact?: {
    phone?: string; email?: string; whatsapp?: string; telegram?: string;
  };
  photos?: string[];             // alias for images for compatibility
  lon?: number;                  // alias for lng for compatibility
  createdAt?: number;            // ms since epoch (UTC)
  updatedAt?: number;            // ms since epoch (UTC)
  hasImage?: boolean;
  userId?: string;
  featured?: boolean;
  categoryLabel?: string;
  jobSubcategoryLabel?: string;
}

export interface User {
  id?: string;
  name: string;
  email: string;
  verified?: boolean;
  createdAt?: number;
}

export interface SearchFilters {
  query?: string;
  category?: string;
  subcategory?: string;
  jobSubcategory?: string;
  jobKind?: "regular" | "gig";
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  city?: string;
}

export interface AppState {
  city: string;
  cityLat?: string;
  cityLon?: string;
  category?: string;
  viewMode?: "grid" | "map";
  lang?: "EN" | "TI";
}

export type ForumBoardKey =
  | "general"
  | "housing_tips"
  | "jobs_career"
  | "immigration_legal"
  | "community_events"
  | "buy_sell_swap"
  | "health_wellness"
  | "faith_bible"
  | "tech_learn";

export type ForumBoard = {
  key: ForumBoardKey;
  name: { en: string; ti: string };
  description?: { en: string; ti: string };
};

export type ForumTopic = {
  id: string;
  city: string;              // normalized city key
  board: ForumBoardKey;
  title: string;
  author?: string;           // optional (anon allowed)
  createdAt: number;         // ms UTC
  updatedAt: number;         // ms UTC
  replies: number;           // denormalized count
};

export type ForumMessage = {
  id: string;
  topicId: string;
  author?: string;
  body: string;
  createdAt: number;
};

export type ActivePoint = {
  city: string;
  country: string;
  lat: number;
  lon: number;
  count: number;
};

export type ActiveUsers = {
  total: number;
  points: ActivePoint[];
};