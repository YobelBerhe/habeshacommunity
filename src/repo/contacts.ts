import { supabase } from "@/integrations/supabase/client";
import type { ListingContactRow } from "@/types/db";

// Track that a user has viewed a listing (for legitimate interest)
export async function trackListingView(listingId: string): Promise<void> {
  const { data } = await supabase.auth.getUser();
  if (!data.user) return; // Only track for authenticated users
  
  const { error } = await supabase.rpc('track_listing_view', { 
    listing_id: listingId 
  });
  
  if (error) {
    console.warn('Failed to track listing view:', error);
  }
}

export async function createListingContact(contact: {
  listing_id: string;
  contact_method: 'phone' | 'whatsapp' | 'telegram' | 'email' | null;
  contact_value: string | null;
}): Promise<ListingContactRow> {
  const { data, error } = await supabase
    .from('listing_contacts')
    .insert([contact])
    .select()
    .single();

  if (error) throw error;
  return data as ListingContactRow;
}

export async function getListingContact(listingId: string): Promise<ListingContactRow | null> {
  // First track that the user is viewing this listing
  await trackListingView(listingId);
  
  const { data, error } = await supabase
    .from('listing_contacts')
    .select('*')
    .eq('listing_id', listingId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No rows found
    throw error;
  }
  return data as ListingContactRow;
}

export async function updateListingContact(
  listingId: string,
  updates: {
    contact_method?: 'phone' | 'whatsapp' | 'telegram' | 'email' | null;
    contact_value?: string | null;
  }
): Promise<ListingContactRow> {
  const { data, error } = await supabase
    .from('listing_contacts')
    .update(updates)
    .eq('listing_id', listingId)
    .select()
    .single();

  if (error) throw error;
  return data as ListingContactRow;
}

export async function deleteListingContact(listingId: string): Promise<void> {
  const { error } = await supabase
    .from('listing_contacts')
    .delete()
    .eq('listing_id', listingId);

  if (error) throw error;
}