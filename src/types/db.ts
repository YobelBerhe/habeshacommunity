export type UUID = string;

export type ListingCategory = 'housing' | 'jobs' | 'services' | 'forsale' | 'community';
export type ListingStatus = 'active' | 'paused' | 'flagged' | 'archived';

export interface ListingRow {
  id: UUID;
  user_id: UUID | null;
  city: string;
  country: string | null;
  category: ListingCategory;
  subcategory: string | null;
  title: string;
  description: string;
  price_cents: number | null;
  currency: string | null;
  tags: string[] | null;
  images: string[] | null;        // URLs in storage
  location_lat: number | null;
  location_lng: number | null;
  website_url: string | null;
  contact_hidden: boolean | null;
  status: ListingStatus;
  created_at: string;
  updated_at: string;
}

export interface ListingContactRow {
  id: UUID;
  listing_id: UUID;
  contact_method: 'phone' | 'whatsapp' | 'telegram' | 'email' | null;
  contact_value: string | null;
  created_at: string;
}

export interface FavoriteRow {
  user_id: UUID;
  listing_id: UUID;
  created_at: string;
}

export interface SavedSearchRow {
  id: UUID;
  user_id: UUID;
  name: string | null;
  params: Record<string, any>;
  last_seen: string | null;
  created_at: string;
}