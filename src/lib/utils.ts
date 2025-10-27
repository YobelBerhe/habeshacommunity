import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// =====================================================
// GAMIFICATION UTILITIES
// =====================================================

export function formatXP(xp: number): string {
  if (xp >= 1000) {
    return `${(xp / 1000).toFixed(1)}k`;
  }
  return xp.toString();
}

export function calculateProgress(current: number, total: number): number {
  if (total === 0) return 0;
  return Math.min(100, Math.round((current / total) * 100));
}

export function getBadgeColor(type: string): string {
  const colors: Record<string, string> = {
    bronze: '#CD7F32',
    silver: '#C0C0C0',
    gold: '#FFD700',
    platinum: '#E5E4E2',
    diamond: '#B9F2FF',
    special: '#8B5CF6',
  };
  return colors[type.toLowerCase()] || colors.bronze;
}

export function getRarityColor(rarity: string): string {
  const colors: Record<string, string> = {
    common: '#9CA3AF',
    uncommon: '#10B981',
    rare: '#3B82F6',
    epic: '#8B5CF6',
    legendary: '#F59E0B',
  };
  return colors[rarity.toLowerCase()] || colors.common;
}

export function getStreakFlames(days: number): string {
  if (days >= 365) return '🔥🔥🔥🔥🔥';
  if (days >= 180) return '🔥🔥🔥🔥';
  if (days >= 90) return '🔥🔥🔥';
  if (days >= 30) return '🔥🔥';
  if (days >= 7) return '🔥';
  return '✨';
}

export function getLevelIcon(level: number): string {
  const icons: Record<number, string> = {
    1: '🌱',
    2: '🔍',
    3: '✝️',
    4: '📖',
    5: '🙏',
    6: '👨‍🏫',
    7: '🧙',
    8: '🐑',
    9: '⛪',
    10: '✨',
  };
  return icons[level] || '⭐';
}

export function calculateXPForLevel(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.5));
}

export function getDifficultyColor(difficulty: string): string {
  const colors: Record<string, string> = {
    easy: '#10B981',
    medium: '#F59E0B',
    hard: '#EF4444',
    expert: '#8B5CF6',
  };
  return colors[difficulty.toLowerCase()] || colors.medium;
}

export function getOrdinalSuffix(num: number): string {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return num + 'st';
  if (j === 2 && k !== 12) return num + 'nd';
  if (j === 3 && k !== 13) return num + 'rd';
  return num + 'th';
}

export function formatPoints(points: number): string {
  if (points >= 1000000) {
    return `${(points / 1000000).toFixed(1)}M`;
  }
  if (points >= 1000) {
    return `${(points / 1000).toFixed(1)}k`;
  }
  return points.toString();
}

export function getRankChangeIcon(change: number): { icon: string; color: string } {
  if (change > 0) return { icon: '↑', color: '#10B981' };
  if (change < 0) return { icon: '↓', color: '#EF4444' };
  return { icon: '−', color: '#9CA3AF' };
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}
