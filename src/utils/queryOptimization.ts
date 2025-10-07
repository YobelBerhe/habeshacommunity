import { supabase } from '@/integrations/supabase/client';

export async function getListingsOptimized(filters: {
  city?: string;
  category?: string;
  limit?: number;
}) {
  const { city, category, limit = 50 } = filters;

  let query = supabase
    .from('listings')
    .select(`
      id,
      title,
      description,
      price_cents,
      currency,
      city,
      category,
      images,
      created_at
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(limit);

  if (city) query = query.eq('city', city);
  if (category) query = query.eq('category', category as any);

  return query;
}

export async function batchFetchListings(ids: string[]) {
  const chunks = [];
  for (let i = 0; i < ids.length; i += 100) {
    chunks.push(ids.slice(i, i + 100));
  }

  const results = await Promise.all(
    chunks.map(chunk =>
      supabase
        .from('listings')
        .select('*')
        .in('id', chunk as any)
    )
  );

  return results.flatMap(r => r.data || []);
}
