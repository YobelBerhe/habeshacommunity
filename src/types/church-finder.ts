/**
 * HABESHA COMMUNITY - PHASE 2: CHURCH FINDER TYPES
 */

export type DenominationCategory = 'Orthodox' | 'Catholic' | 'Protestant' | 'Other';

export interface ChurchDenomination {
  id: number;
  name: string;
  category: DenominationCategory;
  description?: string;
  parent_denomination_id?: number;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

export interface Church {
  id: number;
  name: string;
  slug: string;
  denomination_id: number;
  denomination?: ChurchDenomination;
  country: string;
  country_code: string;
  state_province?: string;
  city: string;
  address?: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  website?: string;
  languages: string[];
  primary_language?: string;
  description?: string;
  founding_year?: number;
  priest_pastor_name?: string;
  capacity?: number;
  main_image_url?: string;
  gallery_images?: string[];
  has_parking: boolean;
  has_wheelchair_access: boolean;
  has_sunday_school: boolean;
  has_youth_ministry: boolean;
  has_livestream: boolean;
  facebook_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  view_count: number;
  favorite_count: number;
  rating_average: number;
  rating_count: number;
  is_verified: boolean;
  is_active: boolean;
  verification_date?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface ChurchWithDistance extends Church {
  distance_meters: number;
  distance_miles?: number;
  distance_km?: number;
}

export type ServiceType = 'Regular' | 'Special' | 'Holiday';

export interface ChurchService {
  id: number;
  church_id: number;
  service_name: string;
  service_type: ServiceType;
  day_of_week?: number;
  time?: string;
  duration_minutes?: number;
  language?: string;
  is_livestreamed: boolean;
  livestream_url?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface ChurchContact {
  id: number;
  church_id: number;
  name: string;
  title?: string;
  role?: string;
  email?: string;
  phone?: string;
  is_primary: boolean;
  display_order: number;
  created_at: string;
}

export interface ChurchReview {
  id: string;
  church_id: number;
  user_id: string;
  rating: number;
  review_text?: string;
  is_verified_visit: boolean;
  helpful_count: number;
  created_at: string;
  updated_at: string;
}

export interface ChurchEvent {
  id: number;
  church_id: number;
  title: string;
  description?: string;
  event_date: string;
  start_time?: string;
  end_time?: string;
  is_recurring: boolean;
  recurrence_pattern?: string;
  location_details?: string;
  is_online: boolean;
  online_url?: string;
  created_at: string;
}

export interface UserFavoriteChurch {
  user_id: string;
  church_id: number;
  notes?: string;
  created_at: string;
}

export interface ChurchSearchParams {
  query?: string;
  country?: string;
  city?: string;
  denomination_id?: number;
  denomination_category?: DenominationCategory;
  language?: string;
  has_livestream?: boolean;
  has_parking?: boolean;
  has_sunday_school?: boolean;
  sort_by?: 'name' | 'rating' | 'distance';
  sort_order?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}

export interface ChurchSearchResponse {
  churches: Church[];
  total_count: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface NearbyChurchesParams {
  latitude: number;
  longitude: number;
  radius_meters: number;
  denomination_category?: DenominationCategory;
  has_livestream?: boolean;
  limit?: number;
}

export interface ChurchDetails extends Church {
  services: ChurchService[];
  contacts: ChurchContact[];
  upcoming_events: ChurchEvent[];
}

export interface ChurchStatistics {
  total_churches: number;
  total_by_category: { category: string; count: number }[];
  total_by_country: { country: string; count: number }[];
  most_reviewed: Church[];
  recently_added: Church[];
}
