/**
 * User Progress & Streaks API Functions
 */

import { supabase, getCurrentUser } from './client';
import type {
  UserReadingStreak,
  UserDailyReading,
  UserBiblePreferences,
  UpdatePreferencesInput,
} from '@/types/spiritual';

// =====================================================
// READING STREAKS
// =====================================================

/**
 * Get user's reading streak
 */
export async function getUserStreak(): Promise<UserReadingStreak | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('user_reading_streaks')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching user streak:', error);
    throw error;
  }

  // If no streak exists, initialize one
  if (!data) {
    return await initializeStreak();
  }

  return data;
}

/**
 * Initialize a new streak record for user
 */
async function initializeStreak(): Promise<UserReadingStreak> {
  const user = await getCurrentUser();
  if (!user) throw new Error('User must be authenticated');

  const { data, error } = await supabase
    .from('user_reading_streaks')
    .insert({
      user_id: user.id,
      current_streak: 0,
      longest_streak: 0,
      total_days_read: 0,
    })
    .select()
    .single();

  if (error) {
    console.error('Error initializing streak:', error);
    throw error;
  }

  return data;
}

/**
 * Record a daily reading activity
 * This automatically updates the streak via database trigger
 */
export async function recordDailyReading(data: {
  verses_read?: number[];
  chapters_read?: number[];
  plans_engaged?: number[];
  time_spent_seconds?: number;
}): Promise<UserDailyReading> {
  const user = await getCurrentUser();
  if (!user) throw new Error('User must be authenticated');

  const today = new Date().toISOString().split('T')[0];

  // Check if today's reading already exists
  const { data: existing } = await supabase
    .from('user_daily_readings')
    .select('*')
    .eq('user_id', user.id)
    .eq('read_date', today)
    .maybeSingle();

  if (existing) {
    // Update existing record
    const { data: updated, error } = await supabase
      .from('user_daily_readings')
      .update({
        verses_read: [...(existing.verses_read || []), ...(data.verses_read || [])],
        chapters_read: [...(existing.chapters_read || []), ...(data.chapters_read || [])],
        plans_engaged: [...(existing.plans_engaged || []), ...(data.plans_engaged || [])],
        time_spent_seconds: (existing.time_spent_seconds || 0) + (data.time_spent_seconds || 0),
      })
      .eq('id', existing.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating daily reading:', error);
      throw error;
    }

    return updated;
  }

  // Create new record
  const { data: newRecord, error } = await supabase
    .from('user_daily_readings')
    .insert({
      user_id: user.id,
      read_date: today,
      verses_read: data.verses_read || [],
      chapters_read: data.chapters_read || [],
      plans_engaged: data.plans_engaged || [],
      time_spent_seconds: data.time_spent_seconds || 0,
    })
    .select()
    .single();

  if (error) {
    console.error('Error recording daily reading:', error);
    throw error;
  }

  return newRecord;
}

/**
 * Get user's reading history
 */
export async function getReadingHistory(days: number = 30): Promise<UserDailyReading[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from('user_daily_readings')
    .select('*')
    .eq('user_id', user.id)
    .gte('read_date', startDate.toISOString().split('T')[0])
    .order('read_date', { ascending: false });

  if (error) {
    console.error('Error fetching reading history:', error);
    throw error;
  }

  return data || [];
}

/**
 * Check if user has read today
 */
export async function hasReadToday(): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;

  const today = new Date().toISOString().split('T')[0];

  const { data } = await supabase
    .from('user_daily_readings')
    .select('id')
    .eq('user_id', user.id)
    .eq('read_date', today)
    .maybeSingle();

  return !!data;
}

/**
 * Get streak statistics
 */
export async function getStreakStats(): Promise<{
  currentStreak: number;
  longestStreak: number;
  totalDaysRead: number;
  readToday: boolean;
  streakPercentile?: number;
}> {
  const streak = await getUserStreak();
  const readToday = await hasReadToday();

  if (!streak) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalDaysRead: 0,
      readToday,
    };
  }

  return {
    currentStreak: streak.current_streak,
    longestStreak: streak.longest_streak,
    totalDaysRead: streak.total_days_read,
    readToday,
  };
}

// =====================================================
// USER PREFERENCES
// =====================================================

/**
 * Get user's Bible preferences
 */
export async function getUserPreferences(): Promise<UserBiblePreferences | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('user_bible_preferences')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching user preferences:', error);
    throw error;
  }

  // If no preferences exist, initialize defaults
  if (!data) {
    return await initializePreferences();
  }

  return data as unknown as UserBiblePreferences;
}

/**
 * Initialize default preferences for user
 */
async function initializePreferences(): Promise<UserBiblePreferences> {
  const user = await getCurrentUser();
  if (!user) throw new Error('User must be authenticated');

  const { data, error } = await supabase
    .from('user_bible_preferences')
    .insert({
      user_id: user.id,
      default_version_id: 111, // KJV
      font_size: 'medium',
      theme: 'light',
      show_verse_numbers: true,
      red_letter_words: true,
      cross_references: true,
      daily_reminder_enabled: false,
      verse_of_day_notification: true,
    })
    .select()
    .single();

  if (error) {
    console.error('Error initializing preferences:', error);
    throw error;
  }

  return data as unknown as UserBiblePreferences;
}

/**
 * Update user preferences
 */
export async function updatePreferences(updates: UpdatePreferencesInput): Promise<UserBiblePreferences> {
  const user = await getCurrentUser();
  if (!user) throw new Error('User must be authenticated');

  const { data, error } = await supabase
    .from('user_bible_preferences')
    .update(updates)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating preferences:', error);
    throw error;
  }

  return data as unknown as UserBiblePreferences;
}

/**
 * Get user's reading stats summary
 */
export async function getReadingStatsSummary(): Promise<{
  streak: UserReadingStreak | null;
  readToday: boolean;
  thisWeekDays: number;
  thisMonthDays: number;
  totalVersesRead: number;
  activePlansCount: number;
  completedPlansCount: number;
}> {
  const user = await getCurrentUser();
  
  if (!user) {
    return {
      streak: null,
      readToday: false,
      thisWeekDays: 0,
      thisMonthDays: 0,
      totalVersesRead: 0,
      activePlansCount: 0,
      completedPlansCount: 0,
    };
  }

  // Get all data in parallel
  const [streak, todayRead, weekHistory, monthHistory, subscriptions] = await Promise.all([
    getUserStreak(),
    hasReadToday(),
    getReadingHistory(7),
    getReadingHistory(30),
    supabase.from('user_plan_subscriptions').select('status').eq('user_id', user.id),
  ]);

  const activePlansCount = subscriptions.data?.filter(s => s.status === 'active').length || 0;
  const completedPlansCount = subscriptions.data?.filter(s => s.status === 'completed').length || 0;

  // Calculate total verses read from history
  const totalVersesRead = monthHistory.reduce((total, day) => {
    return total + (day.verses_read?.length || 0);
  }, 0);

  return {
    streak,
    readToday: todayRead,
    thisWeekDays: weekHistory.length,
    thisMonthDays: monthHistory.length,
    totalVersesRead,
    activePlansCount,
    completedPlansCount,
  };
}
