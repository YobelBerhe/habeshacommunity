// src/pages/health/HealthDashboard.tsx
// Unified Health Dashboard - The Crown Jewel

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSEO } from '@/hooks/useSEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, Calendar, Target, Flame, Church, UtensilsCrossed,
  Dumbbell, Award, Clock, ChevronRight, Activity, Heart,
  Zap, Trophy, BarChart3, ArrowUp, ArrowDown
} from 'lucide-react';
import { getCurrentFastingPeriod, getFastingProgress } from '@/lib/fasting/orthodox-calendar';
import type { FastingDay } from '@/lib/fasting/orthodox-calendar';
import { supabase } from '@/integrations/supabase/client';

interface HealthScore {
  overall: number;
  nutrition: number;
  fitness: number;
  fasting: number;
  consistency: number;
}

interface DailyStats {
  calories: number;
  caloriesGoal: number;
  protein: number;
  proteinGoal: number;
  workouts: number;
  workoutsGoal: number;
  activeDays: number;
  currentStreak: number;
}

export default function HealthDashboard() {
  const navigate = useNavigate();
  const [currentFast, setCurrentFast] = useState<FastingDay | null>(null);
  const [loading, setLoading] = useState(true);
  const [dailyStats, setDailyStats] = useState<DailyStats>({
    calories: 1450,
    caloriesGoal: 2000,
    protein: 85,
    proteinGoal: 150,
    workouts: 3,
    workoutsGoal: 4,
    activeDays: 23,
    currentStreak: 7
  });

  const [healthScore, setHealthScore] = useState<HealthScore>({
    overall: 82,
    nutrition: 75,
    fitness: 85,
    fasting: 90,
    consistency: 78
  });

  // Weekly activity data for chart
  const weeklyData = [
    { day: 'Mon', calories: 1850, workouts: 1, fasting: true },
    { day: 'Tue', calories: 1920, workouts: 0, fasting: false },
    { day: 'Wed', calories: 1450, workouts: 1, fasting: true },
    { day: 'Thu', calories: 2100, workouts: 1, fasting: false },
    { day: 'Fri', calories: 1380, workouts: 0, fasting: true },
    { day: 'Sat', calories: 1950, workouts: 1, fasting: false },
    { day: 'Sun', calories: 1750, workouts: 0, fasting: false }
  ];

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      // Check fasting status
      const fast = await getCurrentFastingPeriod(new Date());
      setCurrentFast(fast);

      // Load user's health data
      await loadTodayStats();
      await calculateHealthScore();
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadTodayStats() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date().toISOString().split('T')[0];

      // Load today's food logs
      const { data: foodLogs } = await supabase
        .from('habesha_food_logs')
        .select('calories, protein_g')
        .eq('user_id', user.id)
        .eq('date', today);

      if (foodLogs && foodLogs.length > 0) {
        const totals = foodLogs.reduce(
          (acc, log) => ({
            calories: acc.calories + log.calories,
            protein: acc.protein + log.protein_g
          }),
          { calories: 0, protein: 0 }
        );

        setDailyStats(prev => ({
          ...prev,
          calories: totals.calories,
          protein: totals.protein
        }));
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }

  async function calculateHealthScore() {
    // Calculate based on user's activities
    const nutritionScore = Math.round((dailyStats.calories / dailyStats.caloriesGoal) * 100);
    const fitnessScore = Math.round((dailyStats.workouts / dailyStats.workoutsGoal) * 100);
    const fastingScore = currentFast ? 95 : 80;
    const consistencyScore = Math.round((dailyStats.currentStreak / 30) * 100);

    const overall = Math.round(
      (nutritionScore * 0.3) + 
      (fitnessScore * 0.3) + 
      (fastingScore * 0.2) + 
      (consistencyScore * 0.2)
    );

    setHealthScore({
      overall,
      nutrition: nutritionScore,
      fitness: fitnessScore,
      fasting: fastingScore,
      consistency: consistencyScore
    });
  }

  function getScoreColor(score: number): string {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  }

  function getScoreLabel(score: number): string {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Great';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Work';
  }

  const maxCalories = Math.max(...weeklyData.map(d => d.calories));

  const fastingProgress = currentFast ? getFastingProgress(currentFast) : null;

  useSEO({
    title: 'Health Dashboard | HabeshaCommunity Health',
    description: 'Your complete health overview - track fasting, nutrition, fitness and overall wellness'
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-purple-50/10 dark:via-purple-950/5 to-background">
        {/* Header */}
        <section className="border-b bg-background/95 backdrop-blur-lg">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                  <span className="text-4xl">📊</span>
                  Health Dashboard
                </h1>
                <p className="text-muted-foreground">
                  Your complete health overview
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Today</p>
                <p className="font-semibold">{new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'short', 
                  day: 'numeric' 
                })}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          {/* Overall Health Score */}
          <section className="mb-8">
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-purple-950/30 dark:via-blue-950/30 dark:to-cyan-950/30">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  {/* Score Circle */}
                  <div className="relative">
                    <div className="w-40 h-40 rounded-full border-8 border-primary/20 flex items-center justify-center bg-background">
                      <div className="text-center">
                        <div className={`text-5xl font-bold ${getScoreColor(healthScore.overall)}`}>
                          {healthScore.overall}
                        </div>
                        <div className="text-xs text-muted-foreground uppercase mt-1">
                          Health Score
                        </div>
                      </div>
                    </div>
                    <div className="absolute -top-2 -right-2">
                      <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Score Breakdown */}
                  <div className="flex-1 space-y-4 w-full">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium flex items-center gap-2">
                          <UtensilsCrossed className="w-4 h-4" />
                          Nutrition
                        </span>
                        <span className="text-sm font-semibold">{healthScore.nutrition}%</span>
                      </div>
                      <Progress value={healthScore.nutrition} className="h-2" />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium flex items-center gap-2">
                          <Dumbbell className="w-4 h-4" />
                          Fitness
                        </span>
                        <span className="text-sm font-semibold">{healthScore.fitness}%</span>
                      </div>
                      <Progress value={healthScore.fitness} className="h-2" />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium flex items-center gap-2">
                          <Church className="w-4 h-4" />
                          Fasting
                        </span>
                        <span className="text-sm font-semibold">{healthScore.fasting}%</span>
                      </div>
                      <Progress value={healthScore.fasting} className="h-2" />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium flex items-center gap-2">
                          <Zap className="w-4 h-4" />
                          Consistency
                        </span>
                        <span className="text-sm font-semibold">{healthScore.consistency}%</span>
                      </div>
                      <Progress value={healthScore.consistency} className="h-2" />
                    </div>
                  </div>

                  {/* Status Message */}
                  <div className="text-center md:text-right">
                    <Badge className="mb-2 text-base px-4 py-2">
                      {getScoreLabel(healthScore.overall)}
                    </Badge>
                    <p className="text-sm text-muted-foreground max-w-xs">
                      {healthScore.overall >= 80 
                        ? "You're doing amazing! Keep it up!" 
                        : "You're on the right track. Stay consistent!"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Today's Overview */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Activity className="w-6 h-6" />
              Today's Overview
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Fasting Status */}
              {currentFast ? (
                <Card 
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate('/health/fasting')}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                        <Church className="w-6 h-6 text-purple-600" />
                      </div>
                      <Badge className="bg-purple-600">Fasting</Badge>
                    </div>
                    <h3 className="font-bold text-lg mb-1">{currentFast.fast_name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {currentFast.strictness === 'full' && '🚫 No animal products'}
                      {currentFast.strictness === 'fish-allowed' && '🐟 Fish allowed'}
                    </p>
                    <Button variant="ghost" size="sm" className="w-full">
                      View Details <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card 
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate('/health/fasting')}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                        <Church className="w-6 h-6 text-green-600" />
                      </div>
                      <Badge variant="outline">Not Fasting</Badge>
                    </div>
                    <h3 className="font-bold text-lg mb-1">No Fast Today</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Regular eating day
                    </p>
                    <Button variant="ghost" size="sm" className="w-full">
                      View Calendar <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Nutrition */}
              <Card 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate('/health/nutrition')}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <UtensilsCrossed className="w-6 h-6 text-green-600" />
                    </div>
                    <Badge variant="secondary">
                      {Math.round((dailyStats.calories / dailyStats.caloriesGoal) * 100)}%
                    </Badge>
                  </div>
                  <h3 className="font-bold text-lg mb-1">
                    {dailyStats.calories} / {dailyStats.caloriesGoal}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Calories today
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Flame className="w-3 h-3" />
                    <span>Protein: {dailyStats.protein}g</span>
                  </div>
                  <Button variant="ghost" size="sm" className="w-full mt-3">
                    Log Food <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>

              {/* Fitness */}
              <Card 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate('/health/fitness')}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <Dumbbell className="w-6 h-6 text-blue-600" />
                    </div>
                    <Badge variant="secondary">
                      {dailyStats.workouts}/{dailyStats.workoutsGoal} this week
                    </Badge>
                  </div>
                  <h3 className="font-bold text-lg mb-1">
                    {dailyStats.workouts} Workouts
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    This week
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>150 active minutes</span>
                  </div>
                  <Button variant="ghost" size="sm" className="w-full mt-3">
                    Start Workout <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>

              {/* Streak */}
              <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                      <Flame className="w-6 h-6 text-orange-600" />
                    </div>
                    <Badge className="bg-orange-600">On Fire!</Badge>
                  </div>
                  <h3 className="font-bold text-2xl mb-1">
                    {dailyStats.currentStreak} Days
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Current streak
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Trophy className="w-3 h-3" />
                    <span>{dailyStats.activeDays} active days total</span>
                  </div>
                  <Progress 
                    value={(dailyStats.currentStreak / 30) * 100} 
                    className="h-1 mt-3"
                  />
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Weekly Activity Chart */}
          <section className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Weekly Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {weeklyData.map((day, idx) => {
                    const isToday = idx === 2; // Wednesday (for demo)
                    const caloriePercent = (day.calories / maxCalories) * 100;
                    
                    return (
                      <div key={day.day} className="flex items-center gap-3">
                        <div className="w-12 text-sm font-medium text-muted-foreground">
                          {day.day}
                        </div>
                        <div className="flex-1">
                          <div className="relative h-8 bg-secondary rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all ${
                                isToday 
                                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500' 
                                  : 'bg-gradient-to-r from-purple-400 to-blue-400'
                              }`}
                              style={{ width: `${caloriePercent}%` }}
                            />
                            <div className="absolute inset-0 flex items-center justify-between px-3">
                              <span className="text-xs font-medium text-white drop-shadow">
                                {day.calories} cal
                              </span>
                              <div className="flex items-center gap-2">
                                {day.workouts > 0 && (
                                  <Badge variant="secondary" className="text-xs h-5">
                                    💪 {day.workouts}
                                  </Badge>
                                )}
                                {day.fasting && (
                                  <Badge variant="secondary" className="text-xs h-5">
                                    🙏
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">12,950</div>
                    <div className="text-xs text-muted-foreground">Total Calories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">3</div>
                    <div className="text-xs text-muted-foreground">Workouts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">3</div>
                    <div className="text-xs text-muted-foreground">Fasting Days</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Quick Actions */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Zap className="w-6 h-6" />
              Quick Actions
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="h-24 flex-col gap-2"
                onClick={() => navigate('/health/nutrition')}
              >
                <UtensilsCrossed className="w-6 h-6" />
                <span>Log Meal</span>
              </Button>

              <Button
                variant="outline"
                className="h-24 flex-col gap-2"
                onClick={() => navigate('/health/fitness')}
              >
                <Dumbbell className="w-6 h-6" />
                <span>Start Workout</span>
              </Button>

              <Button
                variant="outline"
                className="h-24 flex-col gap-2"
                onClick={() => navigate('/health/fasting')}
              >
                <Church className="w-6 h-6" />
                <span>Fasting Calendar</span>
              </Button>

              <Button
                variant="outline"
                className="h-24 flex-col gap-2"
                onClick={() => navigate('/health/coaches')}
              >
                <Heart className="w-6 h-6" />
                <span>Find Coach</span>
              </Button>
            </div>
          </section>
        </div>
      </div>
  );
}
