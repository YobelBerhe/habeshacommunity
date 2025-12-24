import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Play, ChevronRight, Dumbbell } from 'lucide-react';
import { format } from 'date-fns';

interface Workout {
  id: string;
  name: string;
  exercises: number;
  duration: number;
  calories: number;
  date: Date;
}

export default function FitnessPage() {
  const navigate = useNavigate();
  const [workouts] = useState<Workout[]>([
    {
      id: '1',
      name: 'Upper Body Strength',
      exercises: 6,
      duration: 45,
      calories: 320,
      date: new Date()
    },
  ]);

  const quickWorkouts = [
    { name: 'Full Body', duration: 30, exercises: 8 },
    { name: 'Cardio', duration: 20, exercises: 5 },
    { name: 'Core', duration: 15, exercises: 6 },
  ];

  return (
    <div className="min-h-screen bg-background">
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
              <p className="text-2xl font-bold text-primary">320</p>
              <p className="text-xs text-muted-foreground">Calories Burned</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">45</p>
              <p className="text-xs text-muted-foreground">Minutes</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">1</p>
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
                onClick={() => navigate('/health/fitness/train')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Play className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{workout.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {workout.exercises} exercises • {workout.duration} min
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
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
                Log Your First Workout
              </Button>
            </Card>
          ) : (
            <div className="space-y-2">
              {workouts.map((workout) => (
                <Card key={workout.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{workout.name}</h4>
                    <span className="text-sm text-muted-foreground">
                      {format(workout.date, 'MMM d')}
                    </span>
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>{workout.exercises} exercises</span>
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
