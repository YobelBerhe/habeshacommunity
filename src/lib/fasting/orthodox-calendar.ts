// lib/fasting/orthodox-calendar.ts
// Orthodox Ethiopian/Eritrean fasting calendar utilities

import { supabase } from '@/integrations/supabase/client';

export interface FastingDay {
  id: string;
  date: string;
  fast_type: 'lent' | 'wednesday' | 'friday' | 'apostles' | 'dormition' | 'nativity' | 'none';
  fast_name: string;
  description: string;
  strictness: 'full' | 'partial' | 'fish-allowed';
  day_of_fast: number;
  total_days: number;
}

/**
 * Check if date is in fasting period
 */
export async function getCurrentFastingPeriod(date: Date = new Date()): Promise<FastingDay | null> {
  try {
    const dateStr = date.toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('orthodox_fasting_calendar')
      .select('*')
      .eq('date', dateStr)
      .maybeSingle();

    if (error) {
      console.error('Error fetching fasting period:', error);
      return null;
    }

    return data as FastingDay | null;
  } catch (error) {
    console.error('Error in getCurrentFastingPeriod:', error);
    return null;
  }
}

/**
 * Check if date is weekly fasting day (Wednesday or Friday)
 */
export function isWeeklyFastingDay(date: Date): boolean {
  const day = date.getDay();
  return day === 3 || day === 5; // Wednesday=3, Friday=5
}

/**
 * Get fasting-appropriate meals based on strictness
 */
export function getFastingMealRecommendations(fastingDay: FastingDay): string[] {
  if (fastingDay.strictness === 'full') {
    // No animal products
    return [
      'Shiro Wat (chickpea stew)',
      'Ful Medames (fava beans)',
      'Misir Wat (red lentil stew)',
      'Gomen (collard greens)',
      'Azifa (green lentil salad)',
      'Tomato Fitfit (tomato & injera)',
      'Fasolia (green beans)',
      'Beyaynetu (vegan combo platter)',
      'Atkilt Wat (vegetable stew)'
    ];
  } else if (fastingDay.strictness === 'fish-allowed') {
    // Fish allowed, no other meat/dairy
    return [
      'Asa Gulash (fish stew)',
      'Fried Tilapia with vegetables',
      'Fish Kitfo (minced fish)',
      'Shiro Wat',
      'Ful Medames',
      'Grilled fish with injera'
    ];
  } else if (fastingDay.strictness === 'partial') {
    // Some animal products allowed
    return [
      'Eggs with vegetables',
      'Cheese with injera',
      'Yogurt with honey',
      'Shiro Wat',
      'Gomen with egg'
    ];
  }
  
  return [];
}

/**
 * Get fasting progress (for multi-day fasts like Lent)
 */
export function getFastingProgress(fastingDay: FastingDay): {
  day: number;
  total: number;
  percentage: number;
  daysRemaining: number;
} | null {
  if (!fastingDay.total_days || fastingDay.total_days <= 1) {
    return null;
  }

  const day = fastingDay.day_of_fast || 1;
  const total = fastingDay.total_days;
  const percentage = Math.round((day / total) * 100);
  const daysRemaining = total - day;

  return {
    day,
    total,
    percentage,
    daysRemaining
  };
}

/**
 * Get upcoming fasting periods
 */
export async function getUpcomingFasts(limit: number = 5): Promise<FastingDay[]> {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('orthodox_fasting_calendar')
      .select('*')
      .gte('date', today)
      .neq('fast_type', 'wednesday')
      .neq('fast_type', 'friday')
      .order('date', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('Error fetching upcoming fasts:', error);
      return [];
    }

    // Deduplicate by fast_type (show only first day of each fast)
    const seen = new Set<string>();
    return ((data || []) as FastingDay[]).filter(fast => {
      if (seen.has(fast.fast_type)) return false;
      seen.add(fast.fast_type);
      return true;
    });
  } catch (error) {
    console.error('Error in getUpcomingFasts:', error);
    return [];
  }
}

/**
 * Calculate ideal eating window during fasting
 */
export function getFastingEatingWindow(fastingDay: FastingDay): {
  start: string;
  end: string;
  duration: number;
} {
  // Traditional Orthodox fasting allows one meal in evening
  if (fastingDay.strictness === 'full') {
    return {
      start: '17:00', // 5 PM
      end: '20:00',   // 8 PM
      duration: 3
    };
  }
  
  // Fish-allowed or partial fasting - more flexibility
  return {
    start: '12:00', // Noon
    end: '20:00',   // 8 PM
    duration: 8
  };
}

/**
 * Get fasting tips based on fast type
 */
export function getFastingTips(fastingDay: FastingDay): string[] {
  const tips: string[] = [];

  if (fastingDay.fast_type === 'lent') {
    tips.push('🙏 Great Lent is a time for spiritual renewal');
    tips.push('💧 Stay hydrated - drink plenty of water');
    tips.push('🌱 Focus on plant-based proteins (lentils, chickpeas)');
    tips.push('⏰ Consider intermittent fasting until evening');
    tips.push('📖 Combine fasting with prayer and reflection');
  } else if (fastingDay.fast_type === 'wednesday' || fastingDay.fast_type === 'friday') {
    tips.push('🙏 Weekly fasting keeps you spiritually grounded');
    tips.push('🥗 Enjoy traditional vegan Ethiopian dishes');
    tips.push('💪 Light exercise is fine - listen to your body');
  }

  // General tips
  tips.push('🍵 Ethiopian coffee is allowed during fasting');
  tips.push('🌾 Injera with vegan stews is perfect fasting food');
  
  return tips;
}

/**
 * Check if user is currently fasting
 */
export async function isCurrentlyFasting(): Promise<boolean> {
  const now = new Date();
  const fastingPeriod = await getCurrentFastingPeriod(now);
  
  if (!fastingPeriod) return false;
  
  // Check if within fasting hours (typically sunrise to evening)
  const hour = now.getHours();
  const eatingWindow = getFastingEatingWindow(fastingPeriod);
  const [startHour] = eatingWindow.start.split(':').map(Number);
  const [endHour] = eatingWindow.end.split(':').map(Number);
  
  // If before eating window, user is fasting
  return hour < startHour || hour > endHour;
}
