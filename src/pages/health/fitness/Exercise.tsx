// =====================================================
// EXERCISE DASHBOARD - Strong App Style
// Main entry point for exercise tracking
// =====================================================

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dumbbell,
  Plus,
  TrendingUp,
  Calendar,
  Flame,
  Clock,
  Target,
  Award,
  Play,
  History,
  BookOpen,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { format, startOfWeek, endOfWeek } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/store/auth";
import { useToast } from "@/components/ui/use-toast";
import { Workout } from "@/types/health";
import { Skeleton } from "@/components/ui/skeleton";

const Exercise = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [todayWorkouts, setTodayWorkouts] = useState<Workout[]>([]);
  const [weeklyStats, setWeeklyStats] = useState({
    total_minutes: 0,
    total_calories: 0,
    workout_count: 0,
    weekly_goal: 150, // Default goal: 150 minutes/week
  });

  useEffect(() => {
    if (user) {
      loadExerciseData();
    }
  }, [user]);

  const loadExerciseData = async () => {
    try {
      setLoading(true);
      const today = format(new Date(), 'yyyy-MM-dd');
      const weekStart = format(startOfWeek(new Date()), 'yyyy-MM-dd');
      const weekEnd = format(endOfWeek(new Date()), 'yyyy-MM-dd');

      // Load today's workouts
      const { data: todayData } = await supabase
        .from('workouts' as any)
        .select('*')
        .eq('user_id', user?.id)
        .eq('date', today)
        .order('completed_at', { ascending: false });

      // Load this week's stats
      const { data: weekData } = await supabase
        .from('workouts' as any)
        .select('*')
        .eq('user_id', user?.id)
        .gte('date', weekStart)
        .lte('date', weekEnd);

      setTodayWorkouts((todayData as any) || []);

      if (weekData) {
        const totalMinutes = (weekData as any).reduce((sum: number, w: any) => sum + (w.duration_minutes || 0), 0);
        const totalCalories = (weekData as any).reduce((sum: number, w: any) => sum + (w.calories_burned || 0), 0);
        
        setWeeklyStats({
          total_minutes: totalMinutes,
          total_calories: totalCalories,
          workout_count: weekData.length,
          weekly_goal: 150, // TODO: Get from health profile
        });
      }
    } catch (error: any) {
      console.error('Error loading exercise data:', error);
      toast({
        title: "Error loading exercise data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const quickWorkouts = [
    {
      name: "Quick Strength",
      duration: 30,
      type: "strength",
      icon: Dumbbell,
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "Cardio Blast",
      duration: 20,
      type: "cardio",
      icon: Zap,
      color: "from-orange-500 to-red-500",
    },
    {
      name: "Eskista Dance",
      duration: 15,
      type: "traditional_dance",
      icon: Play,
      color: "from-green-500 to-emerald-500",
      isTraditional: true,
    },
    {
      name: "Yoga Flow",
      duration: 25,
      type: "flexibility",
      icon: Target,
      color: "from-purple-500 to-pink-500",
    },
  ];

  const todayStats = {
    minutes: todayWorkouts.reduce((sum, w) => sum + (w.duration_minutes || 0), 0),
    calories: todayWorkouts.reduce((sum, w) => sum + (w.calories_burned || 0), 0),
    workouts: todayWorkouts.length,
  };

  const weeklyProgress = (weeklyStats.total_minutes / weeklyStats.weekly_goal) * 100;

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Exercise & Fitness
              </h1>
              <p className="text-blue-50">
                {format(new Date(), 'EEEE, MMMM d')}
              </p>
            </div>
            <Dumbbell className="w-12 h-12 opacity-80" />
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Quick Start</h2>
            <Button
              onClick={() => navigate("/health/exercise/log")}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Log Workout
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickWorkouts.map((workout, index) => (
              <motion.div
                key={workout.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Card 
                  className="cursor-pointer hover:shadow-lg transition-all group"
                  onClick={() => navigate("/health/exercise/log", { state: { workoutType: workout.type } })}
                >
                  <CardContent className="p-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${workout.color} p-2.5 mb-3 group-hover:scale-110 transition-transform mx-auto`}>
                      <workout.icon className="w-full h-full text-white" />
                    </div>
                    <h3 className="font-semibold text-center mb-1">{workout.name}</h3>
                    {workout.isTraditional && (
                      <Badge variant="secondary" className="w-full justify-center text-xs mb-1">
                        Traditional
                      </Badge>
                    )}
                    <p className="text-xs text-muted-foreground text-center">
                      ~{workout.duration} min
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Today's Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold mb-4">Today's Activity</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              icon={Clock}
              title="Time"
              value={todayStats.minutes}
              unit="min"
              color="from-blue-500 to-cyan-500"
              goal={30}
            />
            <StatCard
              icon={Flame}
              title="Calories Burned"
              value={todayStats.calories}
              unit="cal"
              color="from-orange-500 to-red-500"
            />
            <StatCard
              icon={Dumbbell}
              title="Workouts"
              value={todayStats.workouts}
              unit="completed"
              color="from-green-500 to-emerald-500"
            />
          </div>
        </motion.div>

        {/* Weekly Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Weekly Goal</CardTitle>
                  <CardDescription>
                    {weeklyStats.total_minutes} / {weeklyStats.weekly_goal} minutes
                  </CardDescription>
                </div>
                <Target className="w-8 h-8 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={Math.min(weeklyProgress, 100)} className="h-3" />
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {weeklyStats.workout_count}
                    </div>
                    <div className="text-xs text-muted-foreground">Workouts</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">
                      {weeklyStats.total_calories}
                    </div>
                    <div className="text-xs text-muted-foreground">Calories</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round(weeklyProgress)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Complete</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Today's Workouts */}
        {todayWorkouts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold mb-4">Today's Workouts</h2>
            <div className="space-y-3">
              {todayWorkouts.map((workout) => (
                <WorkoutCard
                  key={workout.id}
                  workout={workout}
                  onClick={() => navigate(`/health/exercise/workout/${workout.id}`)}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {todayWorkouts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="text-center py-12">
              <CardContent>
                <Dumbbell className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No Workouts Today</h3>
                <p className="text-muted-foreground mb-6">
                  Start your fitness journey! Log your first workout or try a quick workout.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={() => navigate("/health/exercise/log")}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Log Workout
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/health/exercise/library")}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Browse Exercises
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all group"
            onClick={() => navigate("/health/exercise/library")}
          >
            <CardContent className="flex items-center gap-4 p-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Exercise Library</h3>
                <p className="text-sm text-muted-foreground">
                  Browse exercises including traditional dances
                </p>
              </div>
              <Award className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-all group"
            onClick={() => navigate("/health/exercise/history")}
          >
            <CardContent className="flex items-center gap-4 p-6">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <History className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Workout History</h3>
                <p className="text-sm text-muted-foreground">
                  Review past workouts and progress
                </p>
              </div>
              <Calendar className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

// Stat Card Component
interface StatCardProps {
  icon: React.ComponentType<any>;
  title: string;
  value: number;
  unit: string;
  color: string;
  goal?: number;
}

const StatCard = ({ icon: Icon, title, value, unit, color, goal }: StatCardProps) => {
  const progress = goal ? (value / goal) * 100 : 0;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} p-2`}>
            <Icon className="w-full h-full text-white" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">{value}</span>
            <span className="text-sm text-muted-foreground">{unit}</span>
          </div>
          {goal && (
            <>
              <Progress value={Math.min(progress, 100)} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Goal: {goal} {unit}
              </p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Workout Card Component
interface WorkoutCardProps {
  workout: Workout;
  onClick?: () => void;
}

const WorkoutCard = ({ workout, onClick }: WorkoutCardProps) => {
  const getWorkoutIcon = (type: string) => {
    switch (type) {
      case 'strength':
        return Dumbbell;
      case 'cardio':
        return Zap;
      case 'traditional_dance':
        return Play;
      case 'flexibility':
        return Target;
      default:
        return Dumbbell;
    }
  };

  const getWorkoutColor = (type: string) => {
    switch (type) {
      case 'strength':
        return 'from-blue-500 to-cyan-500';
      case 'cardio':
        return 'from-orange-500 to-red-500';
      case 'traditional_dance':
        return 'from-green-500 to-emerald-500';
      case 'flexibility':
        return 'from-purple-500 to-pink-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const Icon = getWorkoutIcon(workout.workout_type);
  const color = getWorkoutColor(workout.workout_type);

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all group"
      onClick={onClick}
    >
      <CardContent className="flex items-center gap-4 p-4">
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color} p-2.5 flex-shrink-0`}>
          <Icon className="w-full h-full text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold truncate">
              {workout.name || `${workout.workout_type} Workout`}
            </h3>
            {workout.workout_type === 'traditional_dance' && (
              <Badge variant="secondary" className="text-xs">Traditional</Badge>
            )}
          </div>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {workout.duration_minutes} min
            </span>
            {workout.calories_burned && (
              <span className="flex items-center gap-1">
                <Flame className="w-3 h-3" />
                {workout.calories_burned} cal
              </span>
            )}
            {workout.intensity && (
              <Badge variant="outline" className="text-xs capitalize">
                {workout.intensity}
              </Badge>
            )}
          </div>
        </div>
        <div className="text-sm text-muted-foreground flex-shrink-0">
          {format(new Date(workout.completed_at), 'h:mm a')}
        </div>
      </CardContent>
    </Card>
  );
};

// Loading Skeleton
const LoadingSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-10 w-64 mb-2 bg-white/20" />
          <Skeleton className="h-6 w-48 bg-white/20" />
        </div>
      </div>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Skeleton className="h-8 w-48 mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-8 w-48 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Exercise;
