/**
 * HABESHA COMMUNITY - PHASE 3: PRAYER & SPIRITUAL TYPES
 * TypeScript types for prayer requests, daily prayers, fasting, and saints
 */

// =====================================================
// PRAYER REQUEST TYPES
// =====================================================

export type PrayerRequestCategory = 
  | 'Health' 
  | 'Family' 
  | 'Work' 
  | 'Spiritual Growth' 
  | 'Guidance' 
  | 'Thanksgiving' 
  | 'Other';

export type PrayerRequestStatus = 'active' | 'answered' | 'archived';

export interface PrayerRequest {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category?: PrayerRequestCategory;
  is_anonymous: boolean;
  is_public: boolean;
  status: PrayerRequestStatus;
  answered_description?: string;
  answered_at?: string;
  prayer_count: number;
  comment_count: number;
  created_at: string;
  updated_at: string;
  expires_at?: string;
  
  // Populated fields
  user_name?: string;
  user_avatar?: string;
  has_user_prayed?: boolean;
}

// =====================================================
// PRAYER RESPONSE TYPES
// =====================================================

export interface PrayerResponse {
  id: string;
  prayer_request_id: string;
  user_id: string;
  message?: string;
  prayed_at: string;
  
  // Populated
  user_name?: string;
  user_avatar?: string;
}

// =====================================================
// PRAYER COMMENT TYPES
// =====================================================

export interface PrayerComment {
  id: string;
  prayer_request_id: string;
  user_id: string;
  comment_text: string;
  is_anonymous: boolean;
  is_approved: boolean;
  is_flagged: boolean;
  created_at: string;
  updated_at: string;
  
  // Populated
  user_name?: string;
  user_avatar?: string;
}

// =====================================================
// DAILY PRAYER TYPES
// =====================================================

export type PrayerType = 'Morning' | 'Evening' | 'Meal' | 'Bedtime' | 'Special';

export type PrayerOccasion = 
  | 'Daily' 
  | 'Sunday' 
  | 'Feast Day' 
  | 'Fast Day' 
  | 'As Needed';

export interface DailyPrayer {
  id: number;
  title: string;
  prayer_text: string;
  prayer_type: PrayerType;
  occasion: PrayerOccasion;
  language_code: string;
  source?: string;
  author?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

// =====================================================
// FASTING CALENDAR TYPES
// =====================================================

export type FastType = 'Major Fast' | 'Minor Fast' | 'Weekly Fast';

export type FastingLevel = 'Complete Fast' | 'No Animal Products' | 'Fish Allowed';

export interface FastingPeriod {
  id: number;
  fast_name: string;
  fast_type: FastType;
  description?: string;
  start_date: string;
  end_date: string;
  is_recurring: boolean;
  recurrence_rule?: string;
  fasting_level?: FastingLevel;
  restricted_foods?: string[];
  allowed_foods?: string[];
  language_code: string;
  denomination_category: string;
  created_at: string;
}

// =====================================================
// SAINTS CALENDAR TYPES
// =====================================================

export interface Saint {
  id: number;
  saint_name: string;
  title?: string;
  feast_date: string;
  is_recurring: boolean;
  biography?: string;
  significance?: string;
  icon_url?: string;
  language_code: string;
  denomination_category: string;
  created_at: string;
}

// =====================================================
// PRAYER JOURNAL TYPES
// =====================================================

export interface PrayerJournalEntry {
  id: string;
  user_id: string;
  entry_date: string;
  entry_text: string;
  gratitude_items?: string[];
  prayer_topics?: string[];
  mood?: string;
  created_at: string;
  updated_at: string;
}

// =====================================================
// USER PRAYER LIST TYPES
// =====================================================

export interface UserPrayerItem {
  id: string;
  user_id: string;
  prayer_item: string;
  category?: string;
  is_active: boolean;
  reminder_enabled: boolean;
  reminder_frequency?: string;
  answered_at?: string;
  answer_notes?: string;
  created_at: string;
  updated_at: string;
}

// =====================================================
// API REQUEST/RESPONSE TYPES
// =====================================================

export interface CreatePrayerRequestRequest {
  title: string;
  description: string;
  category?: PrayerRequestCategory;
  is_anonymous?: boolean;
  is_public?: boolean;
  expires_at?: string;
}

export interface UpdatePrayerRequestRequest {
  title?: string;
  description?: string;
  category?: PrayerRequestCategory;
  status?: PrayerRequestStatus;
  answered_description?: string;
  answered_at?: string;
}

export interface GetPrayerRequestsParams {
  category?: PrayerRequestCategory;
  status?: PrayerRequestStatus;
  user_id?: string;
  page?: number;
  per_page?: number;
  sort_by?: 'recent' | 'popular' | 'urgent';
}

export interface GetPrayerRequestsResponse {
  prayer_requests: PrayerRequest[];
  total_count: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface PrayForRequestRequest {
  prayer_request_id: string;
  message?: string;
}

export interface AddPrayerCommentRequest {
  prayer_request_id: string;
  comment_text: string;
  is_anonymous?: boolean;
}

export interface GetDailyPrayersParams {
  prayer_type?: PrayerType;
  occasion?: PrayerOccasion;
  language_code?: string;
}

export interface GetFastingCalendarParams {
  start_date?: string;
  end_date?: string;
  fast_type?: FastType;
  language_code?: string;
}

export interface GetTodaysFastResponse {
  is_fasting: boolean;
  fast?: FastingPeriod;
}

export interface GetSaintsParams {
  month?: number;
  day?: number;
  language_code?: string;
}

export interface GetTodaysSaintResponse {
  saint?: Saint;
  has_saint: boolean;
}

export interface CreateJournalEntryRequest {
  entry_date: string;
  entry_text: string;
  gratitude_items?: string[];
  prayer_topics?: string[];
  mood?: string;
}

export interface UpdateJournalEntryRequest {
  entry_text?: string;
  gratitude_items?: string[];
  prayer_topics?: string[];
  mood?: string;
}

export interface CreatePrayerItemRequest {
  prayer_item: string;
  category?: string;
  reminder_enabled?: boolean;
  reminder_frequency?: string;
}

export interface UpdatePrayerItemRequest {
  prayer_item?: string;
  category?: string;
  is_active?: boolean;
  reminder_enabled?: boolean;
  reminder_frequency?: string;
  answered_at?: string;
  answer_notes?: string;
}

export interface PrayerStatistics {
  total_prayers: number;
  answered_prayers: number;
  active_prayers: number;
  prayers_given: number;
}
