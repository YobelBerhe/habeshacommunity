import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Trophy, Target } from 'lucide-react';
import { LevelCard } from '@/components/gamification/LevelCard';
import { BadgeShowcase, StreakCalendar } from '@/components/gamification/BadgeStreak';
import { PointsWidget } from '@/components/gamification/PointsWidget';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGamificationDashboard } from '@/hooks/useGamification';
import { useAuth } from '@/store/auth';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function GamificationDashboard() {
  const { user } = useAuth();
  const { userLevel, userPoints, streaks, badges, activityStats, isLoading } = useGamificationDashboard(user?.id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Transform data for LevelCard
  const levelData = userLevel ? {
    currentLevel: userLevel.current_level,
    levelName: userLevel.level_details?.name_en || 'Newcomer',
    currentXP: userLevel.total_xp,
    nextLevelXP: userLevel.total_xp + userLevel.xp_to_next_level,
    totalXP: userLevel.total_xp,
    icon: userLevel.level_details?.icon,
    color: userLevel.level_details?.color || '#FCD34D',
    rank: userLevel.rank_position,
  } : {
    currentLevel: 1,
    levelName: 'Newcomer',
    currentXP: 0,
    nextLevelXP: 100,
    totalXP: 0,
    color: '#FCD34D',
  };

  // Transform badges
  const badgeItems = badges?.map(ub => ({
    id: ub.badge_id,
    name_en: ub.badge?.name_en || '',
    description_en: ub.badge?.description_en,
    icon: ub.badge?.icon || '🏆',
    color: ub.badge?.color || '#FCD34D',
    badge_type: ub.badge?.badge_type || 'bronze',
    rarity: ub.badge?.rarity || 'common',
    earned_at: ub.earned_at,
    is_favorite: ub.is_favorite,
    progress: ub.progress_data?.percentage,
  })) || [];

  // Transform streaks
  const streakData = streaks?.map(s => ({
    id: s.id,
    name_en: s.streak_type?.name_en || '',
    icon: s.streak_type?.icon || '🔥',
    color: s.streak_type?.color || '#10B981',
    current_streak: s.current_streak,
    longest_streak: s.longest_streak,
    last_activity_date: s.last_activity_date,
    activities: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      completed: i < s.current_streak,
    })),
  })) || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">
                <span className="bg-gradient-to-r from-primary via-spiritual-500 to-accent-500 bg-clip-text text-transparent">
                  Your Progress
                </span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Track your spiritual journey and earn rewards
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="lg">
                <TrendingUp className="h-4 w-4 mr-2" />
                View Stats
              </Button>
              <Button variant="default" size="lg">
                <Trophy className="h-4 w-4 mr-2" />
                Rewards
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Level Card - Full Width Hero */}
          <LevelCard {...levelData} animated />

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - 2/3 width */}
            <div className="lg:col-span-2 space-y-6">
              {/* Badge Showcase */}
              <BadgeShowcase
                badges={badgeItems}
                totalBadges={25}
                onBadgeClick={(badge) => console.log('Badge clicked:', badge)}
              />

              {/* Streak Calendar */}
              {streakData.length > 0 && <StreakCalendar streaks={streakData} />}
            </div>

            {/* Right Column - 1/3 width */}
            <div className="space-y-6">
              {/* Points Widget */}
              <PointsWidget
                totalPoints={userPoints?.total_points || 0}
                availablePoints={userPoints?.available_points || 0}
                lifetimePoints={userPoints?.lifetime_points || 0}
                recentTransactions={[]}
                onViewAll={() => console.log('View all transactions')}
                onRedeem={() => console.log('Redeem points')}
              />

              {/* Quick Stats Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Prayers</span>
                    <span className="font-bold">{activityStats?.total_prayers_completed || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Church Visits</span>
                    <span className="font-bold">{activityStats?.total_church_visits || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Bible Studies</span>
                    <span className="font-bold">{activityStats?.bible_study_sessions || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Events Attended</span>
                    <span className="font-bold">{activityStats?.events_attended || 0}</span>
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View Detailed Stats
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
