import { supabase } from '@/integrations/supabase/client';

export async function toggleFavorite(listingId: string, userId: string) {
  const { data: existing } = await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', userId)
    .eq('listing_id', listingId)
    .maybeSingle();

  if (existing) {
    await supabase.from('favorites').delete().eq('user_id', userId).eq('listing_id', listingId);
    return false;
  } else {
    const { error } = await supabase.from('favorites').insert({ user_id: userId, listing_id: listingId });
    if (error) throw error;
    return true;
  }
}

export async function fetchFavorites(userId: string) {
  const { data, error } = await supabase.from('favorites').select('listing_id').eq('user_id', userId);
  if (error) throw error;
  return new Set((data ?? []).map(r => r.listing_id as string));
}