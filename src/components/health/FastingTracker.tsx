// src/components/health/FastingTracker.tsx
// Orthodox Ethiopian/Eritrean Fasting Tracker
// The most culturally relevant health feature!

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, Utensils, Calendar, TrendingUp, Info } from 'lucide-react';
import { getCurrentFastingPeriod, getFastingMealRecommendations, getFastingProgress, getUpcomingFasts, getFastingEatingWindow, getFastingTips } from '@/lib/fasting/orthodox-calendar';
import { searchHabeshaFoods } from '@/lib/nutrition/habesha-foods';
import type { FastingDay } from '@/lib/fasting/orthodox-calendar';

export function FastingTracker() {
  const [currentFast, setCurrentFast] = useState<FastingDay | null>(null);
  const [upcomingFasts, setUpcomingFasts] = useState<FastingDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeUntilEating, setTimeUntilEating] = useState<string>('');

  useEffect(() => {
    loadFastingData();
  }, []);

  // Update countdown timer every minute
  useEffect(() => {
    if (!currentFast) return;

    const updateTimer = () => {
      const now = new Date();
      const eatingWindow = getFastingEatingWindow(currentFast);
      const [hours, minutes] = eatingWindow.start.split(':').map(Number);
      
      const eatingTime = new Date();
      eatingTime.setHours(hours, minutes, 0);

      if (now < eatingTime) {
        const diff = eatingTime.getTime() - now.getTime();
        const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
        const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeUntilEating(`${hoursLeft}h ${minutesLeft}m`);
      } else {
        setTimeUntilEating('Eating window open');
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [currentFast]);

  async function loadFastingData() {
    try {
      const today = new Date();
      const fast = await getCurrentFastingPeriod(today);
      setCurrentFast(fast);

      const upcoming = await getUpcomingFasts(5);
      setUpcomingFasts(upcoming);
    } catch (error) {
      console.error('Error loading fasting data:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading fasting status...</p>
        </CardContent>
      </Card>
    );
  }

  // NOT FASTING TODAY
  if (!currentFast) {
    return (
      <div className="space-y-6">
        {/* No Fasting Today Card */}
        <Card className="border-2 border-green-200 dark:border-green-800 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
          <CardContent className="p-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center">
                  <span className="text-4xl">✅</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">No Fasting Today</h3>
                  <p className="text-muted-foreground">
                    Enjoy your regular meals and stay nourished!
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Fasts */}
        {upcomingFasts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Upcoming Fasting Periods
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingFasts.map((fast) => {
                  const date = new Date(fast.date);
                  const formattedDate = date.toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  });

                  return (
                    <div
                      key={fast.id}
                      className="flex items-start justify-between p-4 border rounded-lg hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{fast.fast_name}</h4>
                          <Badge variant="outline">
                            {fast.total_days > 1 ? `${fast.total_days} days` : '1 day'}
                          </Badge>
                          <Badge
                            variant={fast.strictness === 'full' ? 'default' : 'secondary'}
                          >
                            {fast.strictness}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {fast.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Starts: {formattedDate}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // FASTING TODAY!
  const progress = getFastingProgress(currentFast);
  const mealRecommendations = getFastingMealRecommendations(currentFast);
  const eatingWindow = getFastingEatingWindow(currentFast);
  const tips = getFastingTips(currentFast);
  const fastingFoods = searchHabeshaFoods('', { fastingOnly: true }).slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Main Fasting Status Banner */}
      <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950/30 dark:via-blue-950/30 dark:to-indigo-950/30 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600"></div>
        <CardContent className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-purple-600 flex items-center justify-center shadow-lg">
                <span className="text-5xl">🙏</span>
              </div>
              <div>
                <Badge className="mb-3 bg-purple-600 hover:bg-purple-700">
                  FASTING DAY
                </Badge>
                <h2 className="text-3xl font-bold mb-2">{currentFast.fast_name}</h2>
                <p className="text-muted-foreground max-w-2xl">
                  {currentFast.description}
                </p>
              </div>
            </div>

            <Badge
              variant="outline"
              className="text-lg px-4 py-2 border-2"
            >
              {currentFast.strictness === 'full' && '🚫 No Animal Products'}
              {currentFast.strictness === 'fish-allowed' && '🐟 Fish Allowed'}
              {currentFast.strictness === 'partial' && '🥚 Partial Fast'}
            </Badge>
          </div>

          {/* Progress Bar for Multi-Day Fasts */}
          {progress && (
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">
                    Day {progress.day} of {progress.total}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {progress.daysRemaining} days remaining
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-purple-600">
                    {progress.percentage}%
                  </p>
                  <p className="text-xs text-muted-foreground">Complete</p>
                </div>
              </div>
              <Progress value={progress.percentage} className="h-3" />
            </div>
          )}

          {/* Eating Window Timer */}
          <Card className="bg-white/50 dark:bg-black/20 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium">Eating Window</p>
                    <p className="text-lg font-bold">
                      {eatingWindow.start} - {eatingWindow.end}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Time until eating</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {timeUntilEating}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Fasting Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            Fasting Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tips.map((tip, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg"
              >
                <span className="text-xl">{tip.split(' ')[0]}</span>
                <p className="text-sm">{tip.split(' ').slice(1).join(' ')}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommended Fasting Meals */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Utensils className="w-5 h-5" />
              Fasting-Appropriate Meals
            </CardTitle>
            <Badge variant="outline" className="bg-green-100 dark:bg-green-900">
              {currentFast.strictness}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Quick Suggestions */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {mealRecommendations.map((meal, index) => (
              <Card
                key={index}
                className="cursor-pointer hover:shadow-md transition-all hover:scale-105 border-green-200"
              >
                <CardContent className="p-4 text-center">
                  <span className="text-3xl mb-2 block">
                    {index === 0 ? '🥘' : index === 1 ? '🫘' : index === 2 ? '🥗' : '🍛'}
                  </span>
                  <p className="text-sm font-medium">{meal}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Traditional Habesha Fasting Foods */}
          <div className="border-t pt-6">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <span className="text-xl">🇪🇹</span>
              Traditional Habesha Fasting Foods
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {fastingFoods.map((food) => (
                <Card
                  key={food.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h5 className="font-semibold">{food.name}</h5>
                        {food.name_amharic && (
                          <p className="text-sm text-muted-foreground">
                            {food.name_amharic}
                          </p>
                        )}
                      </div>
                      <Badge variant="secondary" className="bg-green-100 dark:bg-green-900 text-xs">
                        ✅ OK
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{food.nutrition.calories} cal</span>
                      <span>•</span>
                      <span>{food.nutrition.protein_g}g protein</span>
                    </div>
                    <Button size="sm" variant="outline" className="w-full mt-3">
                      Add to Diary
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats & Progress Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Your Fasting Journey
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <p className="text-3xl font-bold text-purple-600">
                {progress ? progress.day : 1}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Days Completed
              </p>
            </div>
            <div className="text-center p-4 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">
                {progress ? progress.daysRemaining : 0}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Days Remaining
              </p>
            </div>
            <div className="text-center p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <p className="text-3xl font-bold text-green-600">
                {progress ? progress.percentage : 0}%
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Progress
              </p>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button className="flex-1">
              <Calendar className="w-4 h-4 mr-2" />
              View Full Calendar
            </Button>
            <Button variant="outline" className="flex-1">
              <TrendingUp className="w-4 h-4 mr-2" />
              Track Participation
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Fasts Preview */}
      {upcomingFasts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Next Fasting Periods
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingFasts.slice(0, 3).map((fast) => {
                const date = new Date(fast.date);
                const formattedDate = date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                });

                return (
                  <div
                    key={fast.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <div>
                      <p className="font-semibold">{fast.fast_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formattedDate} • {fast.total_days > 1 ? `${fast.total_days} days` : '1 day'}
                      </p>
                    </div>
                    <Badge variant="outline">{fast.strictness}</Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
