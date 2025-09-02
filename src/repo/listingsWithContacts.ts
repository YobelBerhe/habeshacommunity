import { supabase } from '@/integrations/supabase/client';
import type { ListingRow, ListingContactRow } from '@/types/db';
import { createListingContact } from './contacts';

// Fetch listings with their contact information (for authenticated users)
export async function fetchListingsWithContacts(filters: {
  city?: string;
  category?: string;
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  subcategory?: string;
  limit?: number;
} = {}): Promise<(ListingRow & { contact?: ListingContactRow })[]> {
  let query = supabase.from('listings').select(`
    *,
    listing_contacts (
      id,
      contact_method,
      contact_value,
      created_at
    )
  `).eq('status', 'active');

  if (filters.city) query = query.eq('city', filters.city);
  if (filters.category) query = query.eq('category', filters.category);
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
  
  return data.map(item => ({
    ...item,
    contact: item.listing_contacts?.[0] || undefined
  })) as (ListingRow & { contact?: ListingContactRow })[];
}

// Create listing with contact information
export async function createListingWithContact(
  listing: Omit<ListingRow, 'id' | 'created_at' | 'updated_at' | 'status'>,
  contact: {
    contact_method: 'phone' | 'whatsapp' | 'telegram' | 'email' | null;
    contact_value: string | null;
  }
): Promise<{ listing: ListingRow; contact?: ListingContactRow }> {
  const payload = { 
    ...listing, 
    status: 'active' as const,
    city: listing.city || 'Unknown',
  };
  
  const { data: listingData, error: listingError } = await supabase
    .from('listings')
    .insert(payload)
    .select('*')
    .single();
  
  if (listingError) throw listingError;
  
  let contactData: ListingContactRow | undefined;
  
  // Only create contact if contact method and value are provided
  if (contact.contact_method && contact.contact_value) {
    try {
      contactData = await createListingContact({
        listing_id: listingData.id,
        contact_method: contact.contact_method,
        contact_value: contact.contact_value,
      });
    } catch (contactError) {
      console.error('Failed to create contact:', contactError);
      // Don't fail the entire operation if contact creation fails
    }
  }
  
  return {
    listing: listingData as ListingRow,
    contact: contactData
  };
}