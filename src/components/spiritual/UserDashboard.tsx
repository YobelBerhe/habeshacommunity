/**
 * User Dashboard Component
 * Overview of user's spiritual journey with stats, streaks, and active plans
 */

import { useNavigate } from 'react-router-dom';
import { StreakBadge } from './StreakBadge';
import { ProgressCircle } from './ProgressCircle';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { UserReadingStreak, UserPlanProgress } from '@/types/spiritual';

interface UserDashboardProps {
  streak: UserReadingStreak;
  activePlans: UserPlanProgress[];
  stats: {
    totalVerses: number;
    totalChapters: number;
    totalTimeMinutes: number;
    averageTimePerDay: number;
  };
  isStreakAtRisk?: boolean;
}

export function UserDashboard({ streak, activePlans, stats, isStreakAtRisk = false }: UserDashboardProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 text-primary-foreground">
        <h1 className="text-3xl font-bold mb-2">Welcome back! 👋</h1>
        <p className="opacity-90">Continue your spiritual journey today</p>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Streak Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-muted-foreground">Current Streak</h3>
              {isStreakAtRisk && <Badge variant="destructive" className="text-xs">⚠️ At Risk</Badge>}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-5xl">🔥</span>
              <div>
                <div className="text-3xl font-bold">{streak.current_streak}</div>
                <div className="text-sm text-muted-foreground">days</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Verses Read */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-sm font-semibold text-muted-foreground mb-4">Verses Read</h3>
            <div className="flex items-center gap-3">
              <span className="text-5xl">📖</span>
              <div>
                <div className="text-3xl font-bold">{stats.totalVerses}</div>
                <div className="text-sm text-muted-foreground">verses</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Time Spent */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-sm font-semibold text-muted-foreground mb-4">Time in Scripture</h3>
            <div className="flex items-center gap-3">
              <span className="text-5xl">⏱️</span>
              <div>
                <div className="text-3xl font-bold">{stats.totalTimeMinutes}</div>
                <div className="text-sm text-muted-foreground">minutes</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Plans */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-sm font-semibold text-muted-foreground mb-4">Active Plans</h3>
            <div className="flex items-center gap-3">
              <span className="text-5xl">🎯</span>
              <div>
                <div className="text-3xl font-bold">{activePlans.length}</div>
                <div className="text-sm text-muted-foreground">in progress</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Streak Details */}
        <div className="space-y-6">
          <StreakBadge streak={streak} size="lg" showStats={true} isAtRisk={isStreakAtRisk} />

          {/* Quick Stats */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-bold">Quick Stats</h3>
              
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Chapters Read</span>
                <span className="font-bold">{stats.totalChapters}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Avg. Daily Time</span>
                <span className="font-bold">{stats.averageTimePerDay} min</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Longest Streak</span>
                <span className="font-bold">{streak.longest_streak} days</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Days</span>
                <span className="font-bold">{streak.total_days_read}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle Column - Active Plans */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Active Plans</h2>
            <Button
              variant="link"
              onClick={() => navigate("/spiritual/plans")}
            >
              Browse All →
            </Button>
          </div>

          {activePlans.length > 0 ? (
            <div className="space-y-4">
              {activePlans.map((plan) => (
                <Card key={plan.id} className="hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{plan.plan?.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Day {plan.current_day} of {plan.plan?.days_count}
                        </p>
                      </div>
                      <div className="ml-4">
                        <ProgressCircle progress={plan.progress_percentage} size={80} />
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mb-4">
                      <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-primary to-primary/80 h-full rounded-full transition-all duration-500"
                          style={{ width: `${plan.progress_percentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Button
                        className="flex-1"
                        onClick={() => navigate(`/spiritual/plans`)}
                      >
                        Continue Reading
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => navigate(`/spiritual/plans`)}
                      >
                        Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-bold mb-2">No Active Plans</h3>
                <p className="text-muted-foreground mb-6">Start a reading plan to grow in your faith journey</p>
                <Button onClick={() => navigate("/spiritual/plans")}>
                  Browse Reading Plans
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
