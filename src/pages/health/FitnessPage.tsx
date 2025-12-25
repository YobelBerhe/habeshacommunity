import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Play, ChevronRight, Dumbbell, Loader2, Flame, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface Workout {
  id: string;
  name: string;
  type: string;
  duration: number;
  calories: number;
  date: Date;
}

export default function FitnessPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [todayStats, setTodayStats] = useState({
    calories: 0,
    duration: 0,
    workouts: 0
  });

  const quickWorkouts = [
    { name: 'Full Body', duration: 30, icon: '💪' },
    { name: 'Cardio', duration: 20, icon: '🏃' },
    { name: 'Core', duration: 15, icon: '🧘' },
  ];

  useEffect(() => {
    if (user) {
      fetchWorkouts();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchWorkouts = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const today = format(new Date(), 'yyyy-MM-dd');

      const { data, error } = await supabase
        .from('exercise_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('logged_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      const formatted: Workout[] = (data || []).map(w => ({
        id: w.id,
        name: w.exercise_name || 'Workout',
        type: w.exercise_type || 'general',
        duration: w.duration_minutes || 0,
        calories: w.calories_burned || 0,
        date: new Date(w.logged_at || w.created_at)
      }));

      setWorkouts(formatted);

      // Calculate today's stats
      const todayWorkouts = formatted.filter(
        w => format(w.date, 'yyyy-MM-dd') === today
      );

      setTodayStats({
        calories: todayWorkouts.reduce((sum, w) => sum + w.calories, 0),
        duration: todayWorkouts.reduce((sum, w) => sum + w.duration, 0),
        workouts: todayWorkouts.length
      });
    } catch (error) {
      console.error('Error fetching workouts:', error);
      toast.error('Failed to load workouts');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-primary text-primary-foreground">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Fitness</h1>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/health/fitness/log')}
            >
              <Plus className="h-4 w-4 mr-1" />
              Log Workout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        {/* Today's Activity */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Today's Activity</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <Flame className="h-5 w-5 text-primary" />
              </div>
              <p className="text-2xl font-bold text-primary">{todayStats.calories}</p>
              <p className="text-xs text-muted-foreground">Calories</p>
            </div>
            <div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <p className="text-2xl font-bold text-primary">{todayStats.duration}</p>
              <p className="text-xs text-muted-foreground">Minutes</p>
            </div>
            <div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <Dumbbell className="h-5 w-5 text-primary" />
              </div>
              <p className="text-2xl font-bold text-primary">{todayStats.workouts}</p>
              <p className="text-xs text-muted-foreground">Workouts</p>
            </div>
          </div>
        </Card>

        {/* Quick Start */}
        <div className="space-y-3">
          <h3 className="font-semibold">Quick Start</h3>
          <div className="space-y-2">
            {quickWorkouts.map((workout, index) => (
              <Card
                key={index}
                className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toast.info('Workout tracking coming soon!')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl">
                      {workout.icon}
                    </div>
                    <div>
                      <p className="font-medium">{workout.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {workout.duration} min
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Start
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Workouts */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Recent Workouts</h3>
            <Button
              variant="link"
              size="sm"
              onClick={() => navigate('/health/fitness/history')}
            >
              View All
            </Button>
          </div>

          {workouts.length === 0 ? (
            <Card className="p-8 text-center">
              <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <h4 className="font-semibold mb-1">No workouts yet</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Start your fitness journey today
              </p>
              <Button onClick={() => navigate('/health/fitness/log')}>
                <Plus className="h-4 w-4 mr-1" />
                Log Your First Workout
              </Button>
            </Card>
          ) : (
            <div className="space-y-2">
              {workouts.map((workout) => (
                <Card key={workout.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{workout.name}</h4>
                      <p className="text-sm text-muted-foreground capitalize">
                        {workout.type}
                      </p>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {format(workout.date, 'MMM d')}
                    </span>
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>{workout.duration} min</span>
                    <span>{workout.calories} cal</span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Exercise Library */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Explore Exercises</h3>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate('/health/fitness/library')}
          >
            Browse Exercise Library
          </Button>
        </Card>
      </div>
    </div>
  );
}