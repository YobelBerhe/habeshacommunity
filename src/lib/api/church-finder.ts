/**
 * HABESHA COMMUNITY - PHASE 2: CHURCH FINDER API
 */

import { supabase } from "@/integrations/supabase/client";
import type {
  Church,
  ChurchWithDistance,
  ChurchDetails,
  ChurchDenomination,
  ChurchService,
  ChurchContact,
  ChurchReview,
  ChurchEvent,
  ChurchSearchParams,
  ChurchSearchResponse,
  NearbyChurchesParams,
  DenominationCategory,
  ChurchStatistics,
} from "@/types/church-finder";

// =====================================================
// DENOMINATION FUNCTIONS
// =====================================================

export async function getDenominations(): Promise<ChurchDenomination[]> {
  const { data, error } = await supabase
    .from('church_denominations')
    .select('*')
    .eq('is_active', true)
    .order('display_order');

  if (error) throw error;
  return (data || []) as ChurchDenomination[];
}

export async function getDenominationsByCategory(
  category: DenominationCategory
): Promise<ChurchDenomination[]> {
  const { data, error } = await supabase
    .from('church_denominations')
    .select('*')
    .eq('category', category)
    .eq('is_active', true)
    .order('display_order');

  if (error) throw error;
  return (data || []) as ChurchDenomination[];
}

// =====================================================
// CHURCH SEARCH FUNCTIONS
// =====================================================

export async function searchChurches(
  params: ChurchSearchParams
): Promise<ChurchSearchResponse> {
  const page = params.page || 1;
  const per_page = params.per_page || 12;
  const from = (page - 1) * per_page;
  const to = from + per_page - 1;

  let query = supabase
    .from('churches')
    .select('*, denomination:church_denominations(*)', { count: 'exact' })
    .eq('is_active', true);

  if (params.query) {
    query = query.textSearch('search_vector', params.query);
  }

  if (params.country) {
    query = query.eq('country', params.country);
  }

  if (params.city) {
    query = query.ilike('city', `%${params.city}%`);
  }

  if (params.denomination_id) {
    query = query.eq('denomination_id', params.denomination_id);
  }

  if (params.language) {
    query = query.contains('languages', [params.language]);
  }

  if (params.has_livestream !== undefined) {
    query = query.eq('has_livestream', params.has_livestream);
  }

  if (params.has_parking !== undefined) {
    query = query.eq('has_parking', params.has_parking);
  }

  if (params.has_sunday_school !== undefined) {
    query = query.eq('has_sunday_school', params.has_sunday_school);
  }

  const sort_by = params.sort_by || 'name';
  const sort_order = params.sort_order || 'asc';
  query = query.order(sort_by, { ascending: sort_order === 'asc' });

  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) throw error;

  const total_count = count || 0;
  const total_pages = Math.ceil(total_count / per_page);

  return {
    churches: (data || []) as Church[],
    total_count,
    page,
    per_page,
    total_pages,
  };
}

// =====================================================
// NEARBY CHURCHES (PostGIS)
// =====================================================

export async function findNearbyChurches(
  params: NearbyChurchesParams
): Promise<{ churches: ChurchWithDistance[]; total_count: number }> {
  const { latitude, longitude, radius_meters, limit = 20 } = params;

  const { data, error } = await supabase.rpc('find_nearby_churches' as any, {
    lat: latitude,
    lng: longitude,
    radius: radius_meters,
    result_limit: limit,
  });

  if (error) throw error;

  const churchData = (data || []) as unknown as ChurchWithDistance[];

  return {
    churches: churchData,
    total_count: churchData.length,
  };
}

// =====================================================
// CHURCH DETAILS
// =====================================================

export async function getChurchById(id: number): Promise<Church | null> {
  const { data, error } = await supabase
    .from('churches')
    .select('*, denomination:church_denominations(*)')
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (error) throw error;
  return data as Church;
}

export async function getChurchBySlug(slug: string): Promise<Church | null> {
  const { data, error } = await supabase
    .from('churches')
    .select('*, denomination:church_denominations(*)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) throw error;
  return data as Church;
}

export async function getChurchDetails(
  churchIdOrSlug: number | string
): Promise<ChurchDetails | null> {
  const church = typeof churchIdOrSlug === 'number'
    ? await getChurchById(churchIdOrSlug)
    : await getChurchBySlug(churchIdOrSlug);

  if (!church) return null;

  const [services, contacts, upcomingEvents] = await Promise.all([
    getChurchServices(church.id),
    getChurchContacts(church.id),
    getChurchUpcomingEvents(church.id),
  ]);

  return {
    ...church,
    services,
    contacts,
    upcoming_events: upcomingEvents,
  };
}

// =====================================================
// SERVICES
// =====================================================

export async function getChurchServices(
  churchId: number
): Promise<ChurchService[]> {
  const { data, error } = await supabase
    .from('church_services')
    .select('*')
    .eq('church_id', churchId)
    .order('day_of_week')
    .order('time');

  if (error) throw error;
  return (data || []) as ChurchService[];
}

// =====================================================
// CONTACTS
// =====================================================

export async function getChurchContacts(
  churchId: number
): Promise<ChurchContact[]> {
  const { data, error } = await supabase
    .from('church_contacts')
    .select('*')
    .eq('church_id', churchId)
    .order('display_order');

  if (error) throw error;
  return (data || []) as ChurchContact[];
}

// =====================================================
// REVIEWS
// =====================================================

export async function getChurchReviews(
  churchId: number
): Promise<ChurchReview[]> {
  const { data, error } = await supabase
    .from('church_reviews')
    .select('*')
    .eq('church_id', churchId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as ChurchReview[];
}

export async function createChurchReview(
  churchId: number,
  rating: number,
  reviewText?: string
): Promise<ChurchReview> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('church_reviews')
    .insert({
      church_id: churchId,
      user_id: user.id,
      rating,
      review_text: reviewText,
    })
    .select()
    .single();

  if (error) throw error;
  return data as ChurchReview;
}

// =====================================================
// EVENTS
// =====================================================

export async function getChurchUpcomingEvents(
  churchId: number
): Promise<ChurchEvent[]> {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('church_events')
    .select('*')
    .eq('church_id', churchId)
    .gte('event_date', today)
    .order('event_date')
    .limit(10);

  if (error) throw error;
  return (data || []) as ChurchEvent[];
}

// =====================================================
// FAVORITES
// =====================================================

export async function getUserFavoriteChurches(): Promise<Church[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('user_favorite_churches')
    .select('church_id, churches(*, denomination:church_denominations(*))')
    .eq('user_id', user.id);

  if (error) throw error;
  return ((data || []).map((f: any) => f.churches) as Church[]).filter(Boolean);
}

export async function addFavoriteChurch(
  churchId: number,
  notes?: string
): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('user_favorite_churches')
    .insert({
      user_id: user.id,
      church_id: churchId,
      notes,
    });

  if (error) throw error;
}

export async function removeFavoriteChurch(churchId: number): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('user_favorite_churches')
    .delete()
    .eq('user_id', user.id)
    .eq('church_id', churchId);

  if (error) throw error;
}

export async function isChurchFavorited(churchId: number): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data, error } = await supabase
    .from('user_favorite_churches')
    .select('church_id')
    .eq('user_id', user.id)
    .eq('church_id', churchId)
    .single();

  return !error && !!data;
}

// =====================================================
// STATISTICS
// =====================================================

export async function getChurchStatistics(): Promise<ChurchStatistics> {
  const { data: totalData } = await supabase
    .from('churches')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  const { data: byCategoryData } = await supabase
    .from('churches')
    .select('denomination:church_denominations(category)')
    .eq('is_active', true);

  const { data: byCountryData } = await supabase
    .from('churches')
    .select('country')
    .eq('is_active', true);

  return {
    total_churches: totalData?.length || 0,
    total_by_category: [],
    total_by_country: [],
    most_reviewed: [],
    recently_added: [],
  };
}
