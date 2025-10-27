/**
 * React Hooks for Spiritual Section
 * Data fetching hooks with SWR for caching and revalidation
 */

import { useState } from 'react';
import useSWR from 'swr';
import type {
  ReadingPlan,
  UserPlanProgress,
  VerseOfTheDay,
  UserReadingStreak,
  PaginatedResponse,
} from '@/types/spiritual';

import {
  getFeaturedPlans,
  getReadingPlans,
  getUserActiveSubscriptions,
  subscribeToPlan,
  completeDay,
} from '@/lib/api/spiritual/reading-plans';

import { getTodayVOTD, getVOTDByDate } from '@/lib/api/spiritual/bible';

import {
  getUserStreak,
  hasReadToday,
  getReadingStatsSummary,
} from '@/lib/api/spiritual/user-progress';

// Featured Plans
export function useFeaturedPlans(limit: number = 10) {
  const { data, error, isLoading } = useSWR(`/featured-plans/${limit}`, () => getFeaturedPlans(limit));

  return {
    plans: data || [],
    isLoading,
    error,
  };
}

// All Reading Plans with filters
export function useReadingPlans(params?: {
  page?: number;
  per_page?: number;
  category?: string;
  language?: string;
  search?: string;
}) {
  const key = `/reading-plans?${JSON.stringify(params)}`;
  const { data, error, isLoading } = useSWR<PaginatedResponse<ReadingPlan>>(key, () => getReadingPlans(params));

  return {
    data: data?.data || [],
    count: data?.count || 0,
    isLoading,
    error,
  };
}

// User's Active Subscriptions
export function useUserActiveSubscriptions() {
  const { data, error, isLoading, mutate } = useSWR<UserPlanProgress[]>(
    '/user/subscriptions/active',
    getUserActiveSubscriptions
  );

  return {
    subscriptions: data || [],
    isLoading,
    error,
    refresh: mutate,
  };
}

// Subscribe to Plan
export function useSubscribeToPlan() {
  const { refresh } = useUserActiveSubscriptions();
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const subscribe = async (planId: number) => {
    setIsSubscribing(true);
    setError(null);

    try {
      const subscription = await subscribeToPlan({ plan_id: planId });
      await refresh();
      return subscription;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsSubscribing(false);
    }
  };

  return { subscribe, isSubscribing, error };
}

// Complete Day
export function useCompleteDay() {
  const { refresh } = useUserActiveSubscriptions();
  const [isCompleting, setIsCompleting] = useState(false);

  const complete = async (input: { subscription_id: string; day_id: number; day_number: number; time_spent_seconds?: number }) => {
    setIsCompleting(true);
    try {
      await completeDay(input);
      await refresh();
    } finally {
      setIsCompleting(false);
    }
  };

  return { complete, isCompleting };
}

// Verse of the Day
export function useTodayVOTD() {
  const { data, error, isLoading } = useSWR<VerseOfTheDay>('/votd/today', getTodayVOTD);

  return {
    votd: data,
    isLoading,
    error,
  };
}

export function useVOTDByDate(date: string) {
  const { data, error, isLoading } = useSWR<VerseOfTheDay>(`/votd/${date}`, () => getVOTDByDate(date));

  return {
    votd: data,
    isLoading,
    error,
  };
}

// User Streak
export function useUserStreak() {
  const { data, error, isLoading } = useSWR<UserReadingStreak>('/user/streak', getUserStreak);

  return {
    streak: data,
    isLoading,
    error,
  };
}

// Streak Status
export function useStreakStatus() {
  const { data: hasReadTodayData } = useSWR<boolean>('/user/has-read-today', hasReadToday);
  const { data: streak } = useSWR<UserReadingStreak>('/user/streak', getUserStreak);

  const isAtRisk = streak && !hasReadTodayData && streak.current_streak > 0;

  return {
    hasReadToday: hasReadTodayData || false,
    isAtRisk: !!isAtRisk,
  };
}

// Reading Stats
export function useReadingStats() {
  const { data, error, isLoading } = useSWR('/user/reading-stats', getReadingStatsSummary);

  return {
    stats: data,
    isLoading,
    error,
  };
}

// Combined Dashboard Hook
export function useDashboard() {
  const { subscriptions, isLoading: subsLoading } = useUserActiveSubscriptions();
  const { streak, isLoading: streakLoading } = useUserStreak();
  const { stats, isLoading: statsLoading } = useReadingStats();
  const { hasReadToday, isAtRisk } = useStreakStatus();

  return {
    subscriptions,
    streak,
    stats,
    hasReadToday,
    isStreakAtRisk: isAtRisk,
    isLoading: subsLoading || streakLoading || statsLoading,
  };
}
