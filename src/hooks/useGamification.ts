import useSWR from 'swr';
import { supabase } from '@/integrations/supabase/client';
import type {
  Level,
  UserLevel,
  Badge,
  BadgeCategory,
  UserBadge,
  StreakType,
  UserStreak,
  UserPoints,
  Leaderboard,
  LeaderboardEntry,
  Challenge,
  UserChallenge,
  UserActivityStats,
  GamificationDashboard,
} from '@/types/gamification';

// =====================================================
// LEVELS & XP HOOKS
// =====================================================

export function useLevels() {
  const fetcher = async () => {
    const { data, error } = await supabase
      .from('levels')
      .select('*')
      .order('level_number');
    
    if (error) throw error;
    return data as Level[];
  };
  
  return useSWR('levels', fetcher);
}

export function useUserLevel(userId?: string) {
  const fetcher = async () => {
    if (!userId) return null;
    const { data, error } = await supabase
      .from('user_levels')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    return data as UserLevel;
  };
  
  return useSWR(userId ? `user-level-${userId}` : null, fetcher);
}

// =====================================================
// BADGES HOOKS
// =====================================================

export function useBadgeCategories() {
  const fetcher = async () => {
    const { data, error } = await supabase
      .from('badge_categories')
      .select('*')
      .order('display_order');
    
    if (error) throw error;
    return data as BadgeCategory[];
  };
  
  return useSWR('badge-categories', fetcher);
}

export function useBadges() {
  const fetcher = async () => {
    const { data, error } = await supabase
      .from('badges')
      .select('*, category:badge_categories(*)')
      .eq('is_active', true)
      .order('rarity');
    
    if (error) throw error;
    return data as Badge[];
  };
  
  return useSWR('badges', fetcher);
}

export function useUserBadges(userId?: string) {
  const fetcher = async () => {
    if (!userId) return [];
    const { data, error } = await supabase
      .from('user_badges')
      .select('*, badge:badges(*, category:badge_categories(*))')
      .eq('user_id', userId)
      .order('earned_at', { ascending: false });
    
    if (error) throw error;
    return data as UserBadge[];
  };
  
  return useSWR(userId ? `user-badges-${userId}` : null, fetcher);
}

// =====================================================
// STREAKS HOOKS
// =====================================================

export function useStreakTypes() {
  const fetcher = async () => {
    const { data, error } = await supabase
      .from('streak_types')
      .select('*')
      .eq('is_active', true)
      .order('name_en');
    
    if (error) throw error;
    return data as StreakType[];
  };
  
  return useSWR('streak-types', fetcher);
}

export function useUserStreaks(userId?: string) {
  const fetcher = async () => {
    if (!userId) return [];
    const { data, error } = await supabase
      .from('user_streaks')
      .select('*, streak_type:streak_types(*)')
      .eq('user_id', userId)
      .order('current_streak', { ascending: false });
    
    if (error) throw error;
    return data as UserStreak[];
  };
  
  return useSWR(userId ? `user-streaks-${userId}` : null, fetcher);
}

// =====================================================
// POINTS HOOKS
// =====================================================

export function useUserPoints(userId?: string) {
  const fetcher = async () => {
    if (!userId) return null;
    const { data, error } = await supabase
      .from('user_points')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    return data as UserPoints;
  };
  
  return useSWR(userId ? `user-points-${userId}` : null, fetcher);
}

// =====================================================
// LEADERBOARDS HOOKS
// =====================================================

export function useLeaderboards() {
  const fetcher = async () => {
    const { data, error } = await supabase
      .from('leaderboards')
      .select('*')
      .eq('is_active', true);
    
    if (error) throw error;
    return data as Leaderboard[];
  };
  
  return useSWR('leaderboards', fetcher);
}

export function useLeaderboardEntries(leaderboardId: string, limit = 100) {
  const fetcher = async () => {
    const { data, error } = await supabase
      .from('leaderboard_entries')
      .select('*')
      .eq('leaderboard_id', leaderboardId)
      .order('rank_position')
      .limit(limit);
    
    if (error) throw error;
    return data as LeaderboardEntry[];
  };
  
  return useSWR(`leaderboard-entries-${leaderboardId}`, fetcher);
}

// =====================================================
// CHALLENGES HOOKS
// =====================================================

export function useChallenges() {
  const fetcher = async () => {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Challenge[];
  };
  
  return useSWR('challenges', fetcher);
}

export function useUserChallenges(userId?: string) {
  const fetcher = async () => {
    if (!userId) return [];
    const { data, error } = await supabase
      .from('user_challenges')
      .select('*, challenge:challenges(*)')
      .eq('user_id', userId)
      .order('started_at', { ascending: false });
    
    if (error) throw error;
    return data as UserChallenge[];
  };
  
  return useSWR(userId ? `user-challenges-${userId}` : null, fetcher);
}

// =====================================================
// ACTIVITY STATS HOOK
// =====================================================

export function useActivityStats(userId?: string) {
  const fetcher = async () => {
    if (!userId) return null;
    const { data, error } = await supabase
      .from('user_activity_stats')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    return data as UserActivityStats;
  };
  
  return useSWR(userId ? `activity-stats-${userId}` : null, fetcher);
}

// =====================================================
// DASHBOARD HOOK
// =====================================================

export function useGamificationDashboard(userId?: string) {
  const { data: userLevel, isLoading: levelLoading } = useUserLevel(userId);
  const { data: userPoints, isLoading: pointsLoading } = useUserPoints(userId);
  const { data: streaks, isLoading: streaksLoading } = useUserStreaks(userId);
  const { data: badges, isLoading: badgesLoading } = useUserBadges(userId);
  const { data: challenges, isLoading: challengesLoading } = useUserChallenges(userId);
  const { data: activityStats, isLoading: statsLoading } = useActivityStats(userId);

  const isLoading = 
    levelLoading || 
    pointsLoading || 
    streaksLoading || 
    badgesLoading || 
    challengesLoading || 
    statsLoading;

  return {
    userLevel,
    userPoints,
    streaks,
    badges: badges?.slice(0, 5),
    challenges: challenges?.filter(c => c.status === 'active'),
    activityStats,
    isLoading,
  };
}
