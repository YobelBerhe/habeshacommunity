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
  city: string;                  // normalized "Oakland, US-CA"
  category: CategoryKey;
  subcategory: string;           // slug in TAXONOMY
  jobKind?: JobKind;             // only for jobs: "regular" | "gig"
  title: string;
  description: string;
  price?: number;
  currency?: string;
  contact?: {
    phone?: string; email?: string; whatsapp?: string; telegram?: string;
  };
  tags: string[];
  images: string[];              // data URLs for now
  lat?: number; lon?: number;

  // timestamps
  createdAt: number;             // ms since epoch (UTC)
  updatedAt: number;             // ms since epoch (UTC)

  // quick flags
  hasImage?: boolean;
  
  // Legacy fields for backward compatibility
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
  jobSubcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  city?: string;
}