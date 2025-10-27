/**
 * Streak Badge Component
 * Displays user's reading streak with fire emoji and milestone tracking
 */

import type { UserReadingStreak } from "@/types/spiritual";
import { Card } from "@/components/ui/card";

interface StreakBadgeProps {
  streak: UserReadingStreak;
  size?: 'sm' | 'md' | 'lg';
  showStats?: boolean;
  isAtRisk?: boolean;
}

export function StreakBadge({ streak, size = 'md', showStats = true, isAtRisk = false }: StreakBadgeProps) {
  const sizeClasses = {
    sm: { container: 'p-4', flame: 'text-4xl', number: 'text-2xl', text: 'text-xs' },
    md: { container: 'p-6', flame: 'text-6xl', number: 'text-4xl', text: 'text-sm' },
    lg: { container: 'p-8', flame: 'text-8xl', number: 'text-6xl', text: 'text-base' },
  };

  const classes = sizeClasses[size];

  const getStreakLevel = (days: number) => {
    if (days === 0) return { level: 'Start', color: 'muted', emoji: '🔥' };
    if (days < 7) return { level: 'Beginner', color: 'orange', emoji: '🔥' };
    if (days < 30) return { level: 'Committed', color: 'yellow', emoji: '⭐' };
    if (days < 90) return { level: 'Dedicated', color: 'purple', emoji: '💜' };
    if (days < 365) return { level: 'Champion', color: 'blue', emoji: '👑' };
    return { level: 'Legend', color: 'gold', emoji: '🏆' };
  };

  const streakLevel = getStreakLevel(streak.current_streak);
  
  const milestones = [7, 14, 30, 60, 90, 180, 365];
  const nextMilestone = milestones.find((m) => m > streak.current_streak) || streak.current_streak + 365;
  const daysToMilestone = nextMilestone - streak.current_streak;

  return (
    <Card className={`${classes.container} border-4 ${isAtRisk ? 'border-destructive' : 'border-primary'} hover:shadow-lg transition-all duration-300`}>
      {isAtRisk && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive rounded-lg">
          <div className="flex items-center gap-2 text-destructive">
            <span className="text-sm font-semibold">⚠️ Read today to keep your streak!</span>
          </div>
        </div>
      )}

      <div className="text-center">
        <div className={`${classes.flame} mb-2`}>{streakLevel.emoji}</div>
        <div className={`${classes.number} font-bold text-foreground`}>{streak.current_streak}</div>
        <div className={`${classes.text} text-muted-foreground font-medium mb-4`}>Day Streak</div>
        
        <div className={`inline-block px-4 py-2 bg-primary/10 rounded-full ${classes.text}`}>
          <span className="font-semibold text-primary">{streakLevel.level}</span>
        </div>

        {showStats && (
          <div className="mt-6 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Longest Streak</span>
              <span className="font-semibold text-foreground">{streak.longest_streak} days</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Total Days</span>
              <span className="font-semibold text-foreground">{streak.total_days_read} days</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Next Milestone</span>
              <span className="font-semibold text-foreground">{daysToMilestone} days away</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

export function StreakBadgeCompact({ streak, isAtRisk }: { streak: UserReadingStreak; isAtRisk?: boolean }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-2 rounded-lg border-2 ${isAtRisk ? 'border-destructive bg-destructive/5' : 'border-primary bg-primary/5'}`}>
      <span className="text-3xl">🔥</span>
      <div>
        <div className="text-2xl font-bold text-foreground">{streak.current_streak}</div>
        <div className="text-xs text-muted-foreground">day streak</div>
      </div>
      {isAtRisk && <span className="text-destructive text-xs">⚠️</span>}
    </div>
  );
}

export function StreakBadgeInline({ streak }: { streak: UserReadingStreak }) {
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
      <span className="text-lg">🔥</span>
      <span className="font-semibold text-primary">{streak.current_streak}</span>
      <span className="text-sm text-muted-foreground">days</span>
    </span>
  );
}
