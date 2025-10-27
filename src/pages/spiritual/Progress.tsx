import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, BookOpen, Calendar, Clock } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { useDashboard } from "@/hooks/useSpiritual";
import { StreakBadge } from "@/components/spiritual/StreakBadge";
import { ProgressCircle } from "@/components/spiritual/ProgressCircle";

const Progress = () => {
  useSEO({ 
    title: "My Progress - HabeshaCommunity", 
    description: "Track your spiritual reading journey" 
  });
  const navigate = useNavigate();
  const { subscriptions, streak, stats, hasReadToday, isStreakAtRisk, isLoading } = useDashboard();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">My Progress 📈</h1>
          <p className="text-xl opacity-90">Track your spiritual journey</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Streak Card */}
          <Card className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-muted-foreground">Current Streak</h3>
                {isStreakAtRisk && <Badge variant="destructive" className="text-xs">⚠️ At Risk</Badge>}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-5xl">🔥</span>
                <div>
                  <div className="text-3xl font-bold">{streak?.current_streak || 0}</div>
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
                  <div className="text-3xl font-bold">{stats?.totalVersesRead || 0}</div>
                  <div className="text-sm text-muted-foreground">verses</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* This Week */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-sm font-semibold text-muted-foreground mb-4">This Week</h3>
              <div className="flex items-center gap-3">
                <Clock className="w-12 h-12 text-primary" />
                <div>
                  <div className="text-3xl font-bold">{stats?.thisWeekDays || 0}</div>
                  <div className="text-sm text-muted-foreground">days read</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Plans */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-sm font-semibold text-muted-foreground mb-4">Active Plans</h3>
              <div className="flex items-center gap-3">
                <Calendar className="w-12 h-12 text-primary" />
                <div>
                  <div className="text-3xl font-bold">{subscriptions?.length || 0}</div>
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
            {streak && (
              <StreakBadge 
                streak={streak} 
                size="lg" 
                showStats={true} 
                isAtRisk={isStreakAtRisk} 
              />
            )}

            {/* Quick Stats */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-bold">Quick Stats</h3>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">This Month</span>
                  <span className="font-bold">{stats?.thisMonthDays || 0} days</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Completed Plans</span>
                  <span className="font-bold">{stats?.completedPlansCount || 0}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Longest Streak</span>
                  <span className="font-bold">{streak?.longest_streak || 0} days</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Days</span>
                  <span className="font-bold">{streak?.total_days_read || 0}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Active Plans */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Active Plans</h2>
              <Button
                variant="link"
                onClick={() => navigate("/spiritual/plans")}
                className="text-primary"
              >
                Browse All →
              </Button>
            </div>

            {subscriptions && subscriptions.length > 0 ? (
              <div className="space-y-4">
                {subscriptions.map((plan) => (
                  <Card key={plan.id} className="hover:shadow-lg transition-shadow">
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

        {/* Recent Activity */}
        {subscriptions && subscriptions.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {subscriptions.slice(0, 3).map((plan) => (
                  <div key={plan.id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center text-primary-foreground font-bold">
                      {plan.current_day}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{plan.plan?.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Last read: {plan.last_read_at ? new Date(plan.last_read_at).toLocaleDateString() : 'Not started'}
                      </p>
                    </div>
                    <Badge variant="secondary">
                      {Math.round(plan.progress_percentage)}% complete
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="text-center">
          <Button variant="outline" onClick={() => navigate("/spiritual")}>
            Back to Spiritual Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Progress;
