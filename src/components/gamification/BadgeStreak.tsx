import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Lock, Sparkles, Flame, Calendar as CalendarIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn, getBadgeColor, getRarityColor, getStreakFlames } from '@/lib/utils';
import { format } from 'date-fns';

export interface BadgeItem {
  id: string;
  name_en: string;
  description_en?: string;
  icon: string;
  color: string;
  badge_type: string;
  rarity: string;
  earned_at?: string;
  is_favorite?: boolean;
  progress?: number;
}

export interface BadgeShowcaseProps {
  badges: BadgeItem[];
  totalBadges?: number;
  className?: string;
  onBadgeClick?: (badge: BadgeItem) => void;
}

export function BadgeShowcase({
  badges,
  totalBadges = 0,
  className,
  onBadgeClick,
}: BadgeShowcaseProps) {
  const earnedCount = badges.filter((b) => b.earned_at).length;
  const completionRate = totalBadges > 0 ? Math.round((earnedCount / totalBadges) * 100) : 0;

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10">
              <Award className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Badge Collection</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {earnedCount} of {totalBadges} earned ({completionRate}%)
              </p>
            </div>
          </div>
          <Badge variant="default" className="px-3 py-1">
            <Sparkles className="h-3 w-3 mr-1" />
            {earnedCount} Badges
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
          <AnimatePresence>
            {badges.map((badge, index) => {
              const isEarned = !!badge.earned_at;
              const badgeColor = badge.color || getBadgeColor(badge.badge_type);
              const rarityColor = getRarityColor(badge.rarity);

              return (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.1, rotate: isEarned ? 5 : 0 }}
                  className={cn(
                    'relative group cursor-pointer',
                    !isEarned && 'opacity-50 grayscale'
                  )}
                  onClick={() => onBadgeClick?.(badge)}
                >
                  <div
                    className={cn(
                      'relative aspect-square rounded-xl flex items-center justify-center transition-all duration-300',
                      isEarned
                        ? 'bg-gradient-to-br shadow-lg group-hover:shadow-xl'
                        : 'bg-muted border-2 border-dashed'
                    )}
                    style={
                      isEarned
                        ? {
                            backgroundColor: `${badgeColor}20`,
                            borderColor: badgeColor,
                            boxShadow: `0 4px 20px ${badgeColor}30`,
                          }
                        : undefined
                    }
                  >
                    <div className="text-3xl sm:text-4xl">
                      {isEarned ? badge.icon : <Lock className="h-8 w-8 text-muted-foreground" />}
                    </div>

                    {isEarned && badge.is_favorite && (
                      <div className="absolute -top-1 -right-1 bg-primary rounded-full p-1">
                        <Sparkles className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}

                    {isEarned && (
                      <div
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full"
                        style={{ backgroundColor: rarityColor }}
                      />
                    )}

                    {!isEarned && badge.progress !== undefined && badge.progress > 0 && (
                      <svg
                        className="absolute inset-0 w-full h-full -rotate-90"
                        viewBox="0 0 100 100"
                      >
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="4"
                          className="text-muted"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke={badgeColor}
                          strokeWidth="4"
                          strokeDasharray={`${badge.progress * 2.83} 283`}
                          className="transition-all duration-500"
                        />
                      </svg>
                    )}
                  </div>

                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    <div
                      className="bg-popover text-popover-foreground px-3 py-2 rounded-lg shadow-lg border whitespace-nowrap text-xs"
                      style={{ borderColor: badgeColor }}
                    >
                      <div className="font-semibold">{badge.name_en}</div>
                      {badge.description_en && (
                        <div className="text-muted-foreground mt-0.5">
                          {badge.description_en}
                        </div>
                      )}
                      {isEarned && badge.earned_at && (
                        <div className="text-muted-foreground text-xs mt-1">
                          Earned {format(new Date(badge.earned_at), 'MMM d')}
                        </div>
                      )}
                      {!isEarned && badge.progress !== undefined && (
                        <div className="text-muted-foreground mt-1">
                          Progress: {badge.progress}%
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}

export interface StreakData {
  id: string;
  name_en: string;
  icon: string;
  color: string;
  current_streak: number;
  longest_streak: number;
  last_activity_date?: string;
  activities: {
    date: string;
    completed: boolean;
  }[];
}

export interface StreakCalendarProps {
  streaks: StreakData[];
  className?: string;
}

export function StreakCalendar({ streaks, className }: StreakCalendarProps) {
  const [selectedStreak, setSelectedStreak] = React.useState(0);
  const currentStreak = streaks[selectedStreak];

  const days = React.useMemo(() => {
    const result = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const activity = currentStreak?.activities?.find((a) => a.date === dateStr);
      result.push({
        date: dateStr,
        completed: activity?.completed || false,
        day: date.getDate(),
        isToday: i === 0,
      });
    }
    return result;
  }, [currentStreak]);

  if (!currentStreak) return null;

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="p-2.5 rounded-lg"
              style={{ backgroundColor: `${currentStreak.color}20` }}
            >
              <Flame className="h-5 w-5" style={{ color: currentStreak.color }} />
            </div>
            <div>
              <CardTitle className="text-xl">Streak Calendar</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Track your daily consistency
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getStreakFlames(currentStreak.current_streak)}</span>
            <div className="text-right">
              <div className="text-2xl font-bold" style={{ color: currentStreak.color }}>
                {currentStreak.current_streak}
              </div>
              <div className="text-xs text-muted-foreground">day streak</div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {streaks.map((streak, index) => (
            <motion.button
              key={streak.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedStreak(index)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all whitespace-nowrap',
                selectedStreak === index
                  ? 'border-current shadow-lg'
                  : 'border-transparent bg-muted hover:bg-muted/80'
              )}
              style={
                selectedStreak === index
                  ? {
                      borderColor: streak.color,
                      backgroundColor: `${streak.color}10`,
                    }
                  : undefined
              }
            >
              <span className="text-xl">{streak.icon}</span>
              <div className="text-left">
                <div className="text-sm font-semibold">{streak.name_en}</div>
                <div className="text-xs text-muted-foreground">
                  {streak.current_streak} days
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Last 30 Days</span>
            <span className="font-medium">
              Longest: <span style={{ color: currentStreak.color }}>{currentStreak.longest_streak} days</span>
            </span>
          </div>

          <div className="grid grid-cols-10 gap-2">
            {days.map((day, index) => (
              <motion.div
                key={day.date}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02 }}
                className={cn(
                  'aspect-square rounded-lg border-2 flex items-center justify-center text-xs font-medium transition-all',
                  day.completed
                    ? 'border-current shadow-md'
                    : 'border-muted bg-muted',
                  day.isToday && 'ring-2 ring-primary ring-offset-2'
                )}
                style={
                  day.completed
                    ? {
                        borderColor: currentStreak.color,
                        backgroundColor: `${currentStreak.color}20`,
                        color: currentStreak.color,
                      }
                    : undefined
                }
                title={day.date}
              >
                {day.completed ? '✓' : day.day}
              </motion.div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground pt-2">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded border-2 border-muted bg-muted" />
              <span>Missed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div
                className="w-4 h-4 rounded border-2"
                style={{
                  borderColor: currentStreak.color,
                  backgroundColor: `${currentStreak.color}20`,
                }}
              />
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded border-2 border-primary ring-2 ring-primary ring-offset-2" />
              <span>Today</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
