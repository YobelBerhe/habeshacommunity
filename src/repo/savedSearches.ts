import { supabase } from '@/lib/supabaseClient';

export async function saveSearch(userId: string, name: string, params: any) {
  const { data, error } = await supabase.from('saved_searches').insert({
    user_id: userId,
    name,
    params,
    last_seen: new Date().toISOString(),
  }).select('id').single();
  if (error) throw error;
  return data!.id as string;
}

export async function listSavedSearches(userId: string) {
  const { data, error } = await supabase.from('saved_searches').select('*').eq('user_id', userId).order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function touchSavedSearch(id: string) {
  await supabase.from('saved_searches').update({ last_seen: new Date().toISOString() }).eq('id', id);
}