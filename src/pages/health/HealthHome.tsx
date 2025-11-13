import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSEO } from '@/hooks/useSEO';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Dumbbell, Apple, Moon, Droplets, Brain, Leaf, 
  TrendingUp, Clock, Utensils 
} from 'lucide-react';
import { getCurrentFastingPeriod, getFastingProgress } from '@/lib/fasting/orthodox-calendar';
import type { FastingDay } from '@/lib/fasting/orthodox-calendar';

export default function HealthHome() {
  useSEO({
    title: 'Health & Wellness | HabeshaCommunity',
    description: 'Track fitness, nutrition, sleep and more — adapted for Habesha culture with Orthodox fasting support',
  });

  const navigate = useNavigate();
  const [currentFast, setCurrentFast] = useState<FastingDay | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFastingStatus();
  }, []);

  async function loadFastingStatus() {
    try {
      const today = new Date();
      const fast = await getCurrentFastingPeriod(today);
      setCurrentFast(fast);
    } catch (error) {
      console.error('Error loading fasting status:', error);
    } finally {
      setLoading(false);
    }
  }

  const healthCategories = [
    { 
      id: 'fitness', 
      name: 'Fitness', 
      icon: Dumbbell, 
      color: 'from-blue-500 to-cyan-500', 
      route: '/health/fitness',
      description: 'Workouts, trainers, progress tracking'
    },
    { 
      id: 'nutrition', 
      name: 'Nutrition', 
      icon: Apple, 
      color: 'from-green-500 to-emerald-500', 
      route: '/health/nutrition',
      description: 'Meal plans, food logging, recipes'
    },
    { 
      id: 'sleep', 
      name: 'Sleep', 
      icon: Moon, 
      color: 'from-purple-500 to-pink-500', 
      route: '/health/sleep',
      description: 'Sleep tracking, quality analysis'
    },
    { 
      id: 'hydration', 
      name: 'Hydration', 
      icon: Droplets, 
      color: 'from-blue-400 to-cyan-400', 
      route: '/health/hydration',
      description: 'Water intake, daily goals'
    },
    { 
      id: 'mental', 
      name: 'Mental Health', 
      icon: Brain, 
      color: 'from-indigo-500 to-purple-500', 
      route: '/health/mental',
      description: 'Meditation, therapy, support'
    },
    { 
      id: 'wellness', 
      name: 'Wellness', 
      icon: Leaf, 
      color: 'from-green-400 to-teal-500', 
      route: '/coming-soon',
      description: 'Challenges, holistic health'
    },
  ];

  const fastingProgress = currentFast ? getFastingProgress(currentFast) : null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-purple-50/20 dark:via-purple-950/10 to-background">
      {/* Header */}
      <section className="border-b bg-background/95 backdrop-blur-lg sticky top-14 z-40">
        <div className="container mx-auto px-4 py-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Health & Wellness</h1>
            <p className="text-muted-foreground">Your journey to a healthier you</p>
          </div>
          <Button onClick={() => navigate('/health/dashboard')}>
            <TrendingUp className="w-5 h-5 mr-2" /> View Dashboard
          </Button>
        </div>
      </section>

      {/* Orthodox Fasting Banner (shown when fasting) */}
      {!loading && currentFast && (
        <section className="container mx-auto px-4 pt-6">
          <Card className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 border-purple-200 dark:border-purple-800">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">🙏</span>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-purple-100">
                      Fasting Today
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold mb-1">{currentFast.fast_name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{currentFast.description}</p>
                  
                  {/* Progress for multi-day fasts */}
                  {fastingProgress && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Day {fastingProgress.day} of {fastingProgress.total}
                        </span>
                        <span className="font-medium">{fastingProgress.percentage}%</span>
                      </div>
                      <Progress value={fastingProgress.percentage} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {fastingProgress.daysRemaining} days remaining
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-2">
                  <Button 
                    onClick={() => navigate('/health/fasting')} 
                    size="sm"
                    className="whitespace-nowrap"
                  >
                    <Utensils className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Health Categories */}
      <section className="container mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6">Explore Health Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {healthCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Card 
                key={category.id} 
                onClick={() => navigate(category.route)} 
                className="cursor-pointer hover:shadow-lg transition-all group"
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-1">{category.name}</h3>
                  <p className="text-xs text-muted-foreground">{category.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Find a Health Coach */}
      <section className="container mx-auto px-4 pb-16">
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <Badge className="mb-3">New</Badge>
                <h2 className="text-2xl font-bold mb-2">Find a Health Coach</h2>
                <p className="text-muted-foreground mb-4">
                  Habesha experts in fitness, nutrition, sleep and wellness
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    Speaks Amharic or Tigrinya
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    Expert in Orthodox fasting nutrition
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    Understands traditional Habesha foods
                  </li>
                </ul>
              </div>
              <Button 
                size="lg"
                onClick={() => navigate('/mentor')}
                className="shrink-0"
              >
                Browse Coaches
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
