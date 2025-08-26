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
  title: string;
  description: string;
  price?: number;
  category: string;
  jobSubcategory?: string;
  contact: string;
  images: string[];
  tags: string[];
  city: string;
  lat?: number;
  lon?: number;
  createdAt: number;
  userId?: string;
  featured?: boolean;
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