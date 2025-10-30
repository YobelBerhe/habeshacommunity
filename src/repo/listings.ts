import { supabase } from '@/integrations/supabase/client';
import type { ListingRow } from '@/types/db';

export async function fetchListings(filters: {
  city?: string;
  category?: string;
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  subcategory?: string;
  limit?: number;
} = {}): Promise<ListingRow[]> {
  let query = supabase.from('listings').select('*').eq('status', 'active');

  if (filters.city) query = query.eq('city', filters.city);
  if (filters.category) query = query.eq('category', filters.category as any);
  if (filters.subcategory) query = query.eq('subcategory', filters.subcategory);
  if (filters.minPrice != null) query = query.gte('price_cents', Math.round(filters.minPrice * 100));
  if (filters.maxPrice != null) query = query.lte('price_cents', Math.round(filters.maxPrice * 100));
  if (filters.q) query = query.or([
    `title.ilike.%${filters.q}%`,
    `description.ilike.%${filters.q}%`,
    `tags.cs.{${filters.q}}`
  ].join(','));

  const { data, error } = await query.order('created_at', { ascending: false }).limit(filters.limit ?? 60);
  if (error) throw error;
  return data as ListingRow[];
}

export async function fetchListingById(id: string) {
  const { data, error } = await supabase.from('listings').select('*').eq('id', id).single();
  if (error) throw error;
  return data as ListingRow;
}

export async function createListing(input: Omit<ListingRow, 'id' | 'created_at' | 'updated_at' | 'status'>) {
  const payload = { 
    ...input, 
    status: 'active' as const,
    city: input.city || 'Unknown', // Ensure city is not null
  };
  const { data, error } = await supabase.from('listings').insert(payload as any).select('*').single();
  if (error) throw error;
  return data as ListingRow;
}

export async function updateListing(id: string, patch: Partial<ListingRow>) {
  const { data, error } = await supabase.from('listings').update(patch as any).eq('id', id).select('*').single();
  if (error) throw error;
  return data as ListingRow;
}

export async function deleteListing(id: string) {
  const { error } = await supabase.from('listings').delete().eq('id', id);
  if (error) throw error;
}