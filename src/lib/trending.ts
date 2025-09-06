// src/lib/trending.ts
import { supabase } from "@/integrations/supabase/client";

export type ListingLite = {
  id: string;
  title: string;
  price_cents?: number | null;
  images?: string[] | null;
  city?: string | null;
  country?: string | null;
  category: string;
  subcategory?: string | null;
  created_at: string;
  views?: number | null;
};

type GetTrendingOpts = {
  category?: string;
  city?: string | null;
  limit?: number;
  featuredOnly?: boolean;
};

// Fallback image
export const fallbackImage = '/lovable-uploads/d2261896-ec85-45d6-8ecf-9928fb132004.png';

export async function getUserCity(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  const { data, error } = await supabase
    .from('profiles')
    .select('city')
    .eq('id', user.id)
    .maybeSingle();
    
  if (error) return null;
  return data?.city ?? null;
}

export async function getTrendingListings(opts: GetTrendingOpts = {}): Promise<ListingLite[]> {
  const { category, city, limit = 12, featuredOnly = false } = opts;

  // Base query
  let query = supabase
    .from('listings')
    .select('id,title,price_cents,images,city,country,category,subcategory,created_at,views')
    .eq('status', 'active');

  if (category) {
    query = query.eq('category', category);
  }
  
  if (featuredOnly) {
    query = query.eq('is_featured', true);
  }
  
  if (city) {
    query = query.eq('city', city);
  }

  // Order by views (trending) then by recency
  query = query
    .order('views', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  const { data, error } = await query;
  
  if (error) {
    console.warn('getTrendingListings error', error.message);
    return [];
  }
  
  return data ?? [];
}

// Call this when opening listing detail to drive trending
export async function bumpListingView(id: string) {
  try {
    await supabase.rpc('increment_views', { listing_id: id });
  } catch (error) {
    console.warn('Failed to bump listing view:', error);
  }
}