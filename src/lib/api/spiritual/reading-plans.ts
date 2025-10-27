/**
 * Reading Plans API Functions
 * All database operations for reading plans
 */

import { supabase, getCurrentUser } from './client';
import type {
  ReadingPlan,
  ReadingPlanDay,
  UserPlanSubscription,
  UserPlanProgress,
  CreatePlanSubscriptionInput,
  UpdatePlanSubscriptionInput,
  CompleteDayInput,
  PaginatedResponse,
} from '@/types/spiritual';

// =====================================================
// GET PLANS
// =====================================================

/**
 * Get all reading plans with optional filtering
 */
export async function getReadingPlans(params?: {
  page?: number;
  per_page?: number;
  category?: string;
  language?: string;
  search?: string;
}): Promise<PaginatedResponse<ReadingPlan>> {
  const page = params?.page || 1;
  const per_page = params?.per_page || 20;
  const from = (page - 1) * per_page;
  const to = from + per_page - 1;

  let query = supabase
    .from('reading_plans')
    .select('*', { count: 'exact' })
    .eq('premium', false)
    .order('popularity_rank', { ascending: true })
    .range(from, to);

  // Apply filters
  if (params?.category) {
    query = query.contains('categories', [params.category]);
  }

  if (params?.language) {
    query = query.contains('languages', [params.language]);
  }

  if (params?.search) {
    query = query.ilike('title', `%${params.search}%`);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching reading plans:', error);
    throw error;
  }

  return {
    data: (data || []) as unknown as ReadingPlan[],
    count: count || 0,
    page,
    per_page,
    total_pages: Math.ceil((count || 0) / per_page),
  };
}

/**
 * Get featured/popular reading plans
 */
export async function getFeaturedPlans(limit: number = 10): Promise<ReadingPlan[]> {
  const { data, error } = await supabase
    .from('reading_plans')
    .select('*')
    .eq('premium', false)
    .order('popularity_rank', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('Error fetching featured plans:', error);
    throw error;
  }

  return (data || []) as unknown as ReadingPlan[];
}

/**
 * Get a single reading plan by slug or ID
 */
export async function getReadingPlan(slugOrId: string | number): Promise<ReadingPlan | null> {
  const query = typeof slugOrId === 'number'
    ? supabase.from('reading_plans').select('*').eq('id', slugOrId)
    : supabase.from('reading_plans').select('*').eq('slug', slugOrId);

  const { data, error } = await query.maybeSingle();

  if (error) {
    console.error('Error fetching reading plan:', error);
    throw error;
  }

  return data as unknown as ReadingPlan | null;
}

/**
 * Get all days for a reading plan with segments
 */
export async function getPlanDays(planId: number): Promise<ReadingPlanDay[]> {
  const { data, error } = await supabase
    .from('reading_plan_days')
    .select(`
      *,
      segments:reading_plan_segments(*)
    `)
    .eq('plan_id', planId)
    .order('day_number', { ascending: true });

  if (error) {
    console.error('Error fetching plan days:', error);
    throw error;
  }

  return (data || []) as ReadingPlanDay[];
}

/**
 * Get a specific day from a plan
 */
export async function getPlanDay(planId: number, dayNumber: number): Promise<ReadingPlanDay | null> {
  const { data, error } = await supabase
    .from('reading_plan_days')
    .select(`
      *,
      segments:reading_plan_segments(*)
    `)
    .eq('plan_id', planId)
    .eq('day_number', dayNumber)
    .maybeSingle();

  if (error) {
    console.error('Error fetching plan day:', error);
    throw error;
  }

  return data as ReadingPlanDay | null;
}

// =====================================================
// USER SUBSCRIPTIONS
// =====================================================

/**
 * Subscribe to a reading plan
 */
export async function subscribeToPlan(input: CreatePlanSubscriptionInput): Promise<UserPlanSubscription> {
  const user = await getCurrentUser();
  if (!user) throw new Error('User must be authenticated');

  const { data, error } = await supabase
    .from('user_plan_subscriptions')
    .insert({
      user_id: user.id,
      plan_id: input.plan_id,
      current_day: input.current_day || 1,
      status: 'active',
    })
    .select()
    .single();

  if (error) {
    console.error('Error subscribing to plan:', error);
    throw error;
  }

  return data as UserPlanSubscription;
}

/**
 * Get user's active subscriptions with progress
 */
export async function getUserActiveSubscriptions(): Promise<UserPlanProgress[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('user_active_plans_with_progress')
    .select('*')
    .eq('user_id', user.id);

  if (error) {
    console.error('Error fetching user subscriptions:', error);
    throw error;
  }

  return (data || []) as unknown as UserPlanProgress[];
}

/**
 * Get all user subscriptions with filtering
 */
export async function getUserSubscriptions(status?: string): Promise<UserPlanSubscription[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  let query = supabase
    .from('user_plan_subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .order('started_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching user subscriptions:', error);
    throw error;
  }

  return (data || []) as UserPlanSubscription[];
}

/**
 * Get a specific subscription
 */
export async function getUserSubscription(subscriptionId: string): Promise<UserPlanSubscription | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('user_plan_subscriptions')
    .select('*')
    .eq('id', subscriptionId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching subscription:', error);
    throw error;
  }

  return data as UserPlanSubscription | null;
}

/**
 * Update a subscription
 */
export async function updateSubscription(
  subscriptionId: string,
  updates: UpdatePlanSubscriptionInput
): Promise<UserPlanSubscription> {
  const user = await getCurrentUser();
  if (!user) throw new Error('User must be authenticated');

  const { data, error } = await supabase
    .from('user_plan_subscriptions')
    .update(updates)
    .eq('id', subscriptionId)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }

  return data as UserPlanSubscription;
}

/**
 * Pause a subscription
 */
export async function pauseSubscription(subscriptionId: string): Promise<UserPlanSubscription> {
  return updateSubscription(subscriptionId, { status: 'paused' });
}

/**
 * Resume a subscription
 */
export async function resumeSubscription(subscriptionId: string): Promise<UserPlanSubscription> {
  return updateSubscription(subscriptionId, { status: 'active' });
}

/**
 * Abandon a subscription
 */
export async function abandonSubscription(subscriptionId: string): Promise<UserPlanSubscription> {
  return updateSubscription(subscriptionId, { status: 'abandoned' });
}

// =====================================================
// DAY COMPLETION
// =====================================================

/**
 * Mark a day as complete
 */
export async function completeDay(input: CompleteDayInput): Promise<void> {
  const user = await getCurrentUser();
  if (!user) throw new Error('User must be authenticated');

  // Insert completion record
  const { error: completionError } = await supabase
    .from('user_day_completions')
    .insert({
      subscription_id: input.subscription_id,
      day_id: input.day_id,
      user_id: user.id,
      time_spent_seconds: input.time_spent_seconds,
    });

  if (completionError) {
    console.error('Error completing day:', completionError);
    throw completionError;
  }

  // Update subscription's completed_days array
  const { data: subscription } = await supabase
    .from('user_plan_subscriptions')
    .select('completed_days, current_day')
    .eq('id', input.subscription_id)
    .single();

  if (subscription) {
    const completedDays = subscription.completed_days || [];
    if (!completedDays.includes(input.day_number)) {
      completedDays.push(input.day_number);
      
      await supabase
        .from('user_plan_subscriptions')
        .update({
          completed_days: completedDays,
          current_day: Math.max(subscription.current_day, input.day_number + 1),
          last_read_at: new Date().toISOString(),
        })
        .eq('id', input.subscription_id);
    }
  }
}

/**
 * Check if a day is completed
 */
export async function isDayCompleted(subscriptionId: string, dayId: number): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;

  const { data } = await supabase
    .from('user_day_completions')
    .select('id')
    .eq('subscription_id', subscriptionId)
    .eq('day_id', dayId)
    .eq('user_id', user.id)
    .maybeSingle();

  return !!data;
}

/**
 * Get completed days for a subscription
 */
export async function getCompletedDays(subscriptionId: string): Promise<number[]> {
  const { data } = await supabase
    .from('user_plan_subscriptions')
    .select('completed_days')
    .eq('id', subscriptionId)
    .maybeSingle();

  return data?.completed_days || [];
}
