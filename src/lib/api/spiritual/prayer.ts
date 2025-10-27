/**
 * HABESHA COMMUNITY - PHASE 3: PRAYER & SPIRITUAL API
 * API functions for prayer requests, daily prayers, fasting calendar, and saints
 */

import { supabase } from '@/integrations/supabase/client';
import type {
  PrayerRequest,
  PrayerResponse,
  PrayerComment,
  DailyPrayer,
  FastingPeriod,
  Saint,
  PrayerJournalEntry,
  UserPrayerItem,
  CreatePrayerRequestRequest,
  UpdatePrayerRequestRequest,
  GetPrayerRequestsParams,
  GetPrayerRequestsResponse,
  PrayForRequestRequest,
  AddPrayerCommentRequest,
  GetDailyPrayersParams,
  GetFastingCalendarParams,
  GetTodaysFastResponse,
  GetSaintsParams,
  GetTodaysSaintResponse,
  CreateJournalEntryRequest,
  UpdateJournalEntryRequest,
  CreatePrayerItemRequest,
  UpdatePrayerItemRequest,
  PrayerStatistics,
} from '@/types/prayer-spiritual';

// =====================================================
// PRAYER REQUESTS FUNCTIONS
// =====================================================

/**
 * Get all prayer requests with filters
 */
export async function getPrayerRequests(
  params: GetPrayerRequestsParams = {}
): Promise<GetPrayerRequestsResponse> {
  let query = supabase
    .from('prayer_requests')
    .select('*', { count: 'exact' })
    .eq('is_public', true);

  // Apply filters
  if (params.category) {
    query = query.eq('category', params.category);
  }

  if (params.status) {
    query = query.eq('status', params.status);
  } else {
    query = query.eq('status', 'active'); // Default to active
  }

  if (params.user_id) {
    query = query.eq('user_id', params.user_id);
  }

  // Sorting
  if (params.sort_by === 'popular') {
    query = query.order('prayer_count', { ascending: false });
  } else if (params.sort_by === 'urgent') {
    query = query.order('created_at', { ascending: true });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  // Pagination
  const page = params.page || 1;
  const per_page = params.per_page || 20;
  const from = (page - 1) * per_page;
  const to = from + per_page - 1;

  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) throw error;

  return {
    prayer_requests: (data || []) as PrayerRequest[],
    total_count: count || 0,
    page,
    per_page,
    total_pages: Math.ceil((count || 0) / per_page),
  };
}

/**
 * Get a single prayer request by ID
 */
export async function getPrayerRequest(id: string): Promise<PrayerRequest> {
  const { data, error } = await supabase
    .from('prayer_requests')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as PrayerRequest;
}

/**
 * Create a new prayer request
 */
export async function createPrayerRequest(
  userId: string,
  request: CreatePrayerRequestRequest
): Promise<PrayerRequest> {
  const { data, error } = await supabase
    .from('prayer_requests')
    .insert({
      user_id: userId,
      ...request,
    })
    .select()
    .single();

  if (error) throw error;
  return data as PrayerRequest;
}

/**
 * Update a prayer request
 */
export async function updatePrayerRequest(
  id: string,
  updates: UpdatePrayerRequestRequest
): Promise<PrayerRequest> {
  const { data, error } = await supabase
    .from('prayer_requests')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as PrayerRequest;
}

/**
 * Delete a prayer request
 */
export async function deletePrayerRequest(id: string): Promise<void> {
  const { error } = await supabase
    .from('prayer_requests')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

/**
 * "I prayed for this" - Record a prayer response
 */
export async function prayForRequest(
  userId: string,
  request: PrayForRequestRequest
): Promise<PrayerResponse> {
  const { data, error } = await supabase
    .from('prayer_responses')
    .insert({
      user_id: userId,
      prayer_request_id: request.prayer_request_id,
      message: request.message,
    })
    .select()
    .single();

  if (error) throw error;
  return data as PrayerResponse;
}

/**
 * Remove prayer response
 */
export async function removePrayerResponse(
  userId: string,
  prayerRequestId: string
): Promise<void> {
  const { error } = await supabase
    .from('prayer_responses')
    .delete()
    .eq('user_id', userId)
    .eq('prayer_request_id', prayerRequestId);

  if (error) throw error;
}

/**
 * Get prayer responses for a request
 */
export async function getPrayerResponses(
  prayerRequestId: string
): Promise<PrayerResponse[]> {
  const { data, error } = await supabase
    .from('prayer_responses')
    .select('*')
    .eq('prayer_request_id', prayerRequestId)
    .order('prayed_at', { ascending: false });

  if (error) throw error;
  return (data || []) as PrayerResponse[];
}

/**
 * Add a comment to a prayer request
 */
export async function addPrayerComment(
  userId: string,
  request: AddPrayerCommentRequest
): Promise<PrayerComment> {
  const { data, error } = await supabase
    .from('prayer_comments')
    .insert({
      user_id: userId,
      prayer_request_id: request.prayer_request_id,
      comment_text: request.comment_text,
      is_anonymous: request.is_anonymous || false,
    })
    .select()
    .single();

  if (error) throw error;
  return data as PrayerComment;
}

/**
 * Get comments for a prayer request
 */
export async function getPrayerComments(
  prayerRequestId: string
): Promise<PrayerComment[]> {
  const { data, error } = await supabase
    .from('prayer_comments')
    .select('*')
    .eq('prayer_request_id', prayerRequestId)
    .eq('is_approved', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as PrayerComment[];
}

// =====================================================
// DAILY PRAYERS FUNCTIONS
// =====================================================

/**
 * Get daily prayers with filters
 */
export async function getDailyPrayers(
  params: GetDailyPrayersParams = {}
): Promise<DailyPrayer[]> {
  let query = supabase
    .from('daily_prayers')
    .select('*')
    .eq('is_active', true);

  if (params.prayer_type) {
    query = query.eq('prayer_type', params.prayer_type);
  }

  if (params.occasion) {
    query = query.eq('occasion', params.occasion);
  }

  if (params.language_code) {
    query = query.eq('language_code', params.language_code);
  }

  query = query.order('display_order', { ascending: true });

  const { data, error } = await query;

  if (error) throw error;
  return (data || []) as DailyPrayer[];
}

/**
 * Get morning prayers
 */
export async function getMorningPrayers(languageCode: string = 'en'): Promise<DailyPrayer[]> {
  return getDailyPrayers({ prayer_type: 'Morning', language_code: languageCode });
}

/**
 * Get evening prayers
 */
export async function getEveningPrayers(languageCode: string = 'en'): Promise<DailyPrayer[]> {
  return getDailyPrayers({ prayer_type: 'Evening', language_code: languageCode });
}

/**
 * Get meal prayers
 */
export async function getMealPrayers(languageCode: string = 'en'): Promise<DailyPrayer[]> {
  return getDailyPrayers({ prayer_type: 'Meal', language_code: languageCode });
}

// =====================================================
// FASTING CALENDAR FUNCTIONS
// =====================================================

/**
 * Get fasting calendar with filters
 */
export async function getFastingCalendar(
  params: GetFastingCalendarParams = {}
): Promise<FastingPeriod[]> {
  let query = supabase.from('fasting_calendar').select('*');

  if (params.start_date) {
    query = query.gte('end_date', params.start_date);
  }

  if (params.end_date) {
    query = query.lte('start_date', params.end_date);
  }

  if (params.fast_type) {
    query = query.eq('fast_type', params.fast_type);
  }

  if (params.language_code) {
    query = query.eq('language_code', params.language_code);
  }

  query = query.order('start_date', { ascending: true });

  const { data, error } = await query;

  if (error) throw error;
  return (data || []) as FastingPeriod[];
}

/**
 * Check if today is a fasting day
 */
export async function getTodaysFast(
  languageCode: string = 'en'
): Promise<GetTodaysFastResponse> {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('fasting_calendar')
    .select('*')
    .eq('language_code', languageCode)
    .lte('start_date', today)
    .gte('end_date', today)
    .order('fast_type', { ascending: true })
    .limit(1);

  if (error) throw error;

  if (data && data.length > 0) {
    return {
      is_fasting: true,
      fast: data[0] as FastingPeriod,
    };
  }

  return { is_fasting: false };
}

// =====================================================
// SAINTS CALENDAR FUNCTIONS
// =====================================================

/**
 * Get saints with filters
 */
export async function getSaints(params: GetSaintsParams = {}): Promise<Saint[]> {
  let query = supabase.from('saints_calendar').select('*');

  if (params.language_code) {
    query = query.eq('language_code', params.language_code);
  }

  query = query.order('feast_date', { ascending: true });

  const { data, error } = await query;

  if (error) throw error;
  return (data || []) as Saint[];
}

/**
 * Get today's saint
 */
export async function getTodaysSaint(
  languageCode: string = 'en'
): Promise<GetTodaysSaintResponse> {
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const todayStr = `2025-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

  const { data, error } = await supabase
    .from('saints_calendar')
    .select('*')
    .eq('language_code', languageCode)
    .eq('feast_date', todayStr)
    .limit(1);

  if (error) throw error;

  if (data && data.length > 0) {
    return {
      has_saint: true,
      saint: data[0] as Saint,
    };
  }

  return { has_saint: false };
}

// =====================================================
// PRAYER JOURNAL FUNCTIONS
// =====================================================

/**
 * Get user's prayer journal entries
 */
export async function getPrayerJournalEntries(
  userId: string,
  limit: number = 30
): Promise<PrayerJournalEntry[]> {
  const { data, error } = await supabase
    .from('user_prayer_journal')
    .select('*')
    .eq('user_id', userId)
    .order('entry_date', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []) as PrayerJournalEntry[];
}

/**
 * Create a prayer journal entry
 */
export async function createJournalEntry(
  userId: string,
  request: CreateJournalEntryRequest
): Promise<PrayerJournalEntry> {
  const { data, error } = await supabase
    .from('user_prayer_journal')
    .insert({
      user_id: userId,
      ...request,
    })
    .select()
    .single();

  if (error) throw error;
  return data as PrayerJournalEntry;
}

/**
 * Update a prayer journal entry
 */
export async function updateJournalEntry(
  id: string,
  updates: UpdateJournalEntryRequest
): Promise<PrayerJournalEntry> {
  const { data, error } = await supabase
    .from('user_prayer_journal')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as PrayerJournalEntry;
}

/**
 * Delete a prayer journal entry
 */
export async function deleteJournalEntry(id: string): Promise<void> {
  const { error } = await supabase
    .from('user_prayer_journal')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// =====================================================
// USER PRAYER LIST FUNCTIONS
// =====================================================

/**
 * Get user's prayer list
 */
export async function getUserPrayerList(
  userId: string,
  activeOnly: boolean = true
): Promise<UserPrayerItem[]> {
  let query = supabase
    .from('user_prayer_list')
    .select('*')
    .eq('user_id', userId);

  if (activeOnly) {
    query = query.eq('is_active', true);
  }

  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) throw error;
  return (data || []) as UserPrayerItem[];
}

/**
 * Create a prayer list item
 */
export async function createPrayerItem(
  userId: string,
  request: CreatePrayerItemRequest
): Promise<UserPrayerItem> {
  const { data, error } = await supabase
    .from('user_prayer_list')
    .insert({
      user_id: userId,
      ...request,
    })
    .select()
    .single();

  if (error) throw error;
  return data as UserPrayerItem;
}

/**
 * Update a prayer list item
 */
export async function updatePrayerItem(
  id: string,
  updates: UpdatePrayerItemRequest
): Promise<UserPrayerItem> {
  const { data, error } = await supabase
    .from('user_prayer_list')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as UserPrayerItem;
}

/**
 * Delete a prayer list item
 */
export async function deletePrayerItem(id: string): Promise<void> {
  const { error } = await supabase
    .from('user_prayer_list')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// =====================================================
// STATISTICS FUNCTIONS
// =====================================================

/**
 * Get prayer statistics for a user
 */
export async function getPrayerStatistics(userId: string): Promise<PrayerStatistics> {
  // Get user's prayer requests
  const { count: totalPrayers } = await supabase
    .from('prayer_requests')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  const { count: answeredPrayers } = await supabase
    .from('prayer_requests')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'answered');

  const { count: activePrayers } = await supabase
    .from('prayer_requests')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'active');

  const { count: prayersGiven } = await supabase
    .from('prayer_responses')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  return {
    total_prayers: totalPrayers || 0,
    answered_prayers: answeredPrayers || 0,
    active_prayers: activePrayers || 0,
    prayers_given: prayersGiven || 0,
  };
}
