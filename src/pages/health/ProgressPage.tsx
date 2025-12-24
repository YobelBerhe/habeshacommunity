import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingDown, Award, Target } from 'lucide-react';

export default function ProgressPage() {
  const stats = {
    currentWeight: 165,
    startWeight: 180,
    goalWeight: 160,
    totalLost: 15,
    streak: 7,
    workoutsThisWeek: 4,
    avgCalories: 1850,
  };

  const progressPercent = Math.round(
    ((stats.startWeight - stats.currentWeight) / (stats.startWeight - stats.goalWeight)) * 100
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Progress</h1>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        {/* Overview */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Weight Progress</h3>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-4xl font-bold">{stats.currentWeight}</p>
              <p className="text-sm text-muted-foreground">lbs current</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-green-500">
                <TrendingDown className="h-4 w-4" />
                <span className="font-semibold">-{stats.totalLost} lbs</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Goal: {stats.goalWeight} lbs
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all"
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            {progressPercent}% to goal
          </p>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <span className="text-xl">🔥</span>
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.streak}</p>
                <p className="text-xs text-muted-foreground">Day Streak</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Target className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.workoutsThisWeek}</p>
                <p className="text-xs text-muted-foreground">Workouts</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="week" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>

          <TabsContent value="week" className="mt-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3">This Week</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg Calories</span>
                  <span className="font-medium">{stats.avgCalories}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Workouts</span>
                  <span className="font-medium">{stats.workoutsThisWeek}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Weight Change</span>
                  <span className="font-medium text-green-500">-2 lbs</span>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="month" className="mt-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3">This Month</h4>
              <p className="text-muted-foreground text-center py-4">
                Monthly stats coming soon
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="year" className="mt-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3">This Year</h4>
              <p className="text-muted-foreground text-center py-4">
                Yearly stats coming soon
              </p>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Achievements */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Recent Achievements</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl">🔥</div>
              <div>
                <p className="font-medium">7 Day Streak!</p>
                <p className="text-sm text-muted-foreground">
                  Logged meals for 7 days straight
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl">💪</div>
              <div>
                <p className="font-medium">First Workout</p>
                <p className="text-sm text-muted-foreground">
                  Completed your first workout
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
