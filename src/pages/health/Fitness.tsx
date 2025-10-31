// src/pages/health/Fitness.tsx
// Complete Fitness Tracking & Workout Planning

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSEO } from '@/hooks/useSEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Dumbbell, Play, TrendingUp, Calendar, Target,
  Clock, Flame, Award, Users, Plus, CheckCircle2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WorkoutTemplate {
  id: string;
  name: string;
  name_amharic?: string;
  type: 'strength' | 'cardio' | 'flexibility' | 'hiit';
  duration_min: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  exercises: Exercise[];
  calories_burned: number;
  description: string;
}

interface Exercise {
  name: string;
  name_amharic?: string;
  sets?: number;
  reps?: string;
  duration_sec?: number;
  rest_sec: number;
  muscle_group: string;
  equipment: string[];
}

export default function FitnessPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<WorkoutTemplate | null>(null);
  const [workoutsThisWeek, setWorkoutsThisWeek] = useState(3);
  const [weeklyGoal, setWeeklyGoal] = useState(4);

  // Workout templates inspired by Ethiopian fitness culture
  const workoutTemplates: WorkoutTemplate[] = [
    {
      id: 'habesha-warrior',
      name: 'Habesha Warrior Workout',
      name_amharic: 'የሐበሻ ተዋጊ ስልጠና',
      type: 'strength',
      duration_min: 45,
      difficulty: 'intermediate',
      calories_burned: 350,
      description: 'Full body strength inspired by Ethiopian warrior training',
      exercises: [
        {
          name: 'Bodyweight Squats',
          name_amharic: 'በራስ ክብደት መንቀጥቀጥ',
          sets: 4,
          reps: '15-20',
          rest_sec: 60,
          muscle_group: 'Legs',
          equipment: ['Bodyweight']
        },
        {
          name: 'Push-ups',
          name_amharic: 'መግፋት',
          sets: 4,
          reps: '10-15',
          rest_sec: 60,
          muscle_group: 'Chest',
          equipment: ['Bodyweight']
        },
        {
          name: 'Walking Lunges',
          sets: 3,
          reps: '20 (10 each leg)',
          rest_sec: 45,
          muscle_group: 'Legs',
          equipment: ['Bodyweight']
        },
        {
          name: 'Plank Hold',
          name_amharic: 'ፕላንክ መያዝ',
          sets: 3,
          duration_sec: 60,
          rest_sec: 45,
          muscle_group: 'Core',
          equipment: ['Bodyweight']
        },
        {
          name: 'Burpees',
          sets: 3,
          reps: '10',
          rest_sec: 90,
          muscle_group: 'Full Body',
          equipment: ['Bodyweight']
        }
      ]
    },
    {
      id: 'bekoji-runner',
      name: 'Bekoji Runner Training',
      name_amharic: 'የበቆጂ ሯጭ ስልጠና',
      type: 'cardio',
      duration_min: 30,
      difficulty: 'advanced',
      calories_burned: 400,
      description: 'Inspired by legendary Ethiopian distance runners',
      exercises: [
        {
          name: 'Warm-up Jog',
          duration_sec: 300,
          rest_sec: 0,
          muscle_group: 'Legs',
          equipment: ['Treadmill', 'Outdoors']
        },
        {
          name: 'Interval Sprints',
          reps: '8 rounds (30sec sprint, 90sec recovery)',
          rest_sec: 0,
          muscle_group: 'Legs',
          equipment: ['Treadmill', 'Track']
        },
        {
          name: 'Hill Runs',
          duration_sec: 600,
          rest_sec: 120,
          muscle_group: 'Legs',
          equipment: ['Outdoors', 'Treadmill']
        },
        {
          name: 'Cool-down Jog',
          duration_sec: 300,
          rest_sec: 0,
          muscle_group: 'Legs',
          equipment: ['Treadmill', 'Outdoors']
        }
      ]
    },
    {
      id: 'morning-stretch',
      name: 'Morning Mobility Flow',
      type: 'flexibility',
      duration_min: 15,
      difficulty: 'beginner',
      calories_burned: 50,
      description: 'Start your day with Ethiopian-inspired stretching',
      exercises: [
        {
          name: 'Cat-Cow Stretch',
          duration_sec: 60,
          rest_sec: 0,
          muscle_group: 'Spine',
          equipment: ['Mat']
        },
        {
          name: 'Downward Dog',
          duration_sec: 45,
          rest_sec: 15,
          muscle_group: 'Full Body',
          equipment: ['Mat']
        },
        {
          name: 'Hip Circles',
          reps: '10 each direction',
          rest_sec: 0,
          muscle_group: 'Hips',
          equipment: ['Bodyweight']
        },
        {
          name: 'Shoulder Rolls',
          reps: '15 forward, 15 backward',
          rest_sec: 0,
          muscle_group: 'Shoulders',
          equipment: ['Bodyweight']
        },
        {
          name: 'Standing Quad Stretch',
          duration_sec: 30,
          rest_sec: 0,
          muscle_group: 'Legs',
          equipment: ['Bodyweight']
        }
      ]
    },
    {
      id: 'hiit-power',
      name: 'HIIT Power Session',
      type: 'hiit',
      duration_min: 20,
      difficulty: 'intermediate',
      calories_burned: 300,
      description: 'High-intensity workout for busy schedules',
      exercises: [
        {
          name: 'Jumping Jacks',
          duration_sec: 45,
          rest_sec: 15,
          muscle_group: 'Full Body',
          equipment: ['Bodyweight']
        },
        {
          name: 'Mountain Climbers',
          duration_sec: 45,
          rest_sec: 15,
          muscle_group: 'Core',
          equipment: ['Bodyweight']
        },
        {
          name: 'Squat Jumps',
          duration_sec: 45,
          rest_sec: 15,
          muscle_group: 'Legs',
          equipment: ['Bodyweight']
        },
        {
          name: 'Push-up to Plank',
          duration_sec: 45,
          rest_sec: 15,
          muscle_group: 'Chest & Core',
          equipment: ['Bodyweight']
        },
        {
          name: 'High Knees',
          duration_sec: 45,
          rest_sec: 15,
          muscle_group: 'Legs',
          equipment: ['Bodyweight']
        }
      ]
    },
    {
      id: 'strength-basics',
      name: 'Strength Basics',
      type: 'strength',
      duration_min: 40,
      difficulty: 'beginner',
      calories_burned: 250,
      description: 'Perfect for building foundational strength',
      exercises: [
        {
          name: 'Goblet Squats',
          sets: 3,
          reps: '12',
          rest_sec: 90,
          muscle_group: 'Legs',
          equipment: ['Dumbbell', 'Kettlebell']
        },
        {
          name: 'Dumbbell Rows',
          sets: 3,
          reps: '10 each arm',
          rest_sec: 60,
          muscle_group: 'Back',
          equipment: ['Dumbbell']
        },
        {
          name: 'Chest Press',
          sets: 3,
          reps: '12',
          rest_sec: 90,
          muscle_group: 'Chest',
          equipment: ['Dumbbells', 'Bench']
        },
        {
          name: 'Shoulder Press',
          sets: 3,
          reps: '10',
          rest_sec: 60,
          muscle_group: 'Shoulders',
          equipment: ['Dumbbells']
        },
        {
          name: 'Bicep Curls',
          sets: 3,
          reps: '12',
          rest_sec: 45,
          muscle_group: 'Arms',
          equipment: ['Dumbbells']
        }
      ]
    },
    {
      id: 'recovery-day',
      name: 'Active Recovery',
      type: 'flexibility',
      duration_min: 25,
      difficulty: 'beginner',
      calories_burned: 80,
      description: 'Gentle movement for recovery days',
      exercises: [
        {
          name: 'Easy Walking',
          duration_sec: 600,
          rest_sec: 0,
          muscle_group: 'Legs',
          equipment: ['Outdoors', 'Treadmill']
        },
        {
          name: 'Foam Rolling',
          duration_sec: 300,
          rest_sec: 0,
          muscle_group: 'Full Body',
          equipment: ['Foam Roller']
        },
        {
          name: 'Gentle Yoga Flow',
          duration_sec: 600,
          rest_sec: 0,
          muscle_group: 'Full Body',
          equipment: ['Mat']
        }
      ]
    }
  ];

  const workoutTypes = [
    { 
      type: 'strength', 
      label: 'Strength', 
      icon: '💪', 
      color: 'from-blue-500 to-cyan-500',
      count: workoutTemplates.filter(w => w.type === 'strength').length
    },
    { 
      type: 'cardio', 
      label: 'Cardio', 
      icon: '🏃', 
      color: 'from-red-500 to-orange-500',
      count: workoutTemplates.filter(w => w.type === 'cardio').length
    },
    { 
      type: 'hiit', 
      label: 'HIIT', 
      icon: '⚡', 
      color: 'from-purple-500 to-pink-500',
      count: workoutTemplates.filter(w => w.type === 'hiit').length
    },
    { 
      type: 'flexibility', 
      label: 'Flexibility', 
      icon: '🧘', 
      color: 'from-green-500 to-emerald-500',
      count: workoutTemplates.filter(w => w.type === 'flexibility').length
    }
  ];

  function startWorkout(template: WorkoutTemplate) {
    toast({
      title: 'Workout Started!',
      description: `Starting ${template.name} - ${template.duration_min} minutes`
    });
    setSelectedTemplate(template);
  }

  function completeWorkout() {
    toast({
      title: 'Workout Complete! 🎉',
      description: 'Great job! Keep up the momentum!'
    });
    setWorkoutsThisWeek(workoutsThisWeek + 1);
    setSelectedTemplate(null);
  }

  useSEO({
    title: 'Fitness | HabeshaCommunity Health',
    description: 'Track workouts, access exercise library, and work with Habesha fitness trainers'
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-blue-50/20 dark:via-blue-950/10 to-background">
        {/* Header */}
        <section className="border-b bg-background/95 backdrop-blur-lg sticky top-14 z-40">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                  <span className="text-4xl">💪</span>
                  Fitness & Workouts
                </h1>
                <p className="text-muted-foreground">
                  Train like Ethiopian champions
                </p>
              </div>
              <Button 
                onClick={() => navigate('/health/coaches?type=fitness')} 
                size="lg"
              >
                <Users className="w-5 h-5 mr-2" />
                Find a Trainer
              </Button>
            </div>
          </div>
        </section>

        {/* Weekly Progress */}
        <section className="container mx-auto px-4 py-6">
          <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-1">
                    This Week's Progress
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {workoutsThisWeek} of {weeklyGoal} workouts completed
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600">
                    {Math.round((workoutsThisWeek / weeklyGoal) * 100)}%
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Goal Progress</p>
                </div>
              </div>
              <Progress 
                value={(workoutsThisWeek / weeklyGoal) * 100} 
                className="h-3"
              />
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="text-2xl font-bold">1,200</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Calories Burned</p>
                </div>
                <div className="text-center p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="text-2xl font-bold">150</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Minutes Active</p>
                </div>
                <div className="text-center p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Award className="w-4 h-4 text-yellow-500" />
                    <span className="text-2xl font-bold">7</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Day Streak</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Workout Types */}
        <section className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {workoutTypes.map((type) => (
              <Card
                key={type.type}
                className="hover:shadow-md transition-shadow cursor-pointer group"
              >
                <CardContent className="p-4 text-center">
                  <div className={`w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br ${type.color} opacity-10 group-hover:opacity-20 transition-opacity flex items-center justify-center`}>
                    <span className="text-3xl">{type.icon}</span>
                  </div>
                  <h3 className="font-bold mb-1">{type.label}</h3>
                  <p className="text-xs text-muted-foreground">
                    {type.count} workouts
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Workout Templates */}
        <section className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="text-2xl">🇪🇹</span>
              Workout Programs
            </h2>
            <Badge variant="outline" className="text-sm">
              {workoutTemplates.length} programs available
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workoutTemplates.map((template) => {
              const typeInfo = workoutTypes.find(t => t.type === template.type);
              
              return (
                <Card 
                  key={template.id}
                  className="hover:shadow-xl transition-all group"
                >
                  <div className={`h-2 bg-gradient-to-r ${typeInfo?.color}`} />
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-1 group-hover:text-primary transition-colors">
                          {template.name}
                        </CardTitle>
                        {template.name_amharic && (
                          <p className="text-sm text-muted-foreground">
                            {template.name_amharic}
                          </p>
                        )}
                      </div>
                      <span className="text-3xl">{typeInfo?.icon}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">
                        {template.difficulty}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {template.duration_min} min
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Flame className="w-3 h-3 mr-1" />
                        {template.calories_burned} cal
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {template.description}
                    </p>

                    {/* Exercise List */}
                    <div className="space-y-2 mb-4">
                      <p className="text-xs font-semibold text-muted-foreground uppercase">
                        Exercises ({template.exercises.length})
                      </p>
                      <div className="space-y-1">
                        {template.exercises.slice(0, 3).map((exercise, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="w-3 h-3 text-green-600" />
                            <span>{exercise.name}</span>
                          </div>
                        ))}
                        {template.exercises.length > 3 && (
                          <p className="text-xs text-muted-foreground pl-5">
                            +{template.exercises.length - 3} more exercises
                          </p>
                        )}
                      </div>
                    </div>

                    <Button
                      className="w-full"
                      onClick={() => startWorkout(template)}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Workout
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Workout Modal (if selected) */}
        {selectedTemplate && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">
                      {selectedTemplate.name}
                    </CardTitle>
                    {selectedTemplate.name_amharic && (
                      <p className="text-muted-foreground">
                        {selectedTemplate.name_amharic}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedTemplate(null)}
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Workout Info */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-secondary/30 rounded-lg">
                  <div className="text-center">
                    <Clock className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                    <p className="font-semibold">{selectedTemplate.duration_min} min</p>
                    <p className="text-xs text-muted-foreground">Duration</p>
                  </div>
                  <div className="text-center">
                    <Flame className="w-5 h-5 mx-auto mb-1 text-orange-600" />
                    <p className="font-semibold">{selectedTemplate.calories_burned}</p>
                    <p className="text-xs text-muted-foreground">Calories</p>
                  </div>
                  <div className="text-center">
                    <Target className="w-5 h-5 mx-auto mb-1 text-green-600" />
                    <p className="font-semibold capitalize">{selectedTemplate.difficulty}</p>
                    <p className="text-xs text-muted-foreground">Level</p>
                  </div>
                </div>

                {/* Exercise List */}
                <div>
                  <h3 className="font-bold mb-4">Exercises</h3>
                  <div className="space-y-4">
                    {selectedTemplate.exercises.map((exercise, idx) => (
                      <div
                        key={idx}
                        className="p-4 border rounded-lg hover:bg-secondary/50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold">{idx + 1}. {exercise.name}</h4>
                            {exercise.name_amharic && (
                              <p className="text-sm text-muted-foreground">
                                {exercise.name_amharic}
                              </p>
                            )}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {exercise.muscle_group}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {exercise.sets && (
                            <span>{exercise.sets} sets</span>
                          )}
                          {exercise.reps && (
                            <span>• {exercise.reps} reps</span>
                          )}
                          {exercise.duration_sec && (
                            <span>• {exercise.duration_sec}s</span>
                          )}
                          <span>• {exercise.rest_sec}s rest</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {exercise.equipment.map((eq, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {eq}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    className="flex-1"
                    size="lg"
                    onClick={completeWorkout}
                  >
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Complete Workout
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setSelectedTemplate(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Find a Trainer CTA */}
        <section className="container mx-auto px-4 py-12">
          <Card className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 text-white border-0">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Level Up?
              </h2>
              <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                Work with Habesha fitness trainers who understand your goals and speak your language
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => navigate('/health/coaches?type=fitness')}
                  className="bg-white text-blue-600 hover:bg-gray-100"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Find a Trainer
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Custom Program
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
  );
}
