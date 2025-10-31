// src/pages/health/Nutrition.tsx
// Complete Nutrition Page with Orthodox Fasting Integration

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSEO } from '@/hooks/useSEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Plus, Search, TrendingUp, Calendar, Apple, Flame,
  UtensilsCrossed, Church, Clock, Target
} from 'lucide-react';
import { getCurrentFastingPeriod } from '@/lib/fasting/orthodox-calendar';
import { searchHabeshaFoods, getRecommendedFoods } from '@/lib/nutrition/habesha-foods';
import type { FastingDay } from '@/lib/fasting/orthodox-calendar';
import type { HabeshaFood } from '@/lib/nutrition/habesha-foods';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FoodLog {
  id: string;
  date: string;
  time: string;
  food_name: string;
  food_name_amharic?: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fats_g: number;
  fiber_g?: number;
}

export default function NutritionPage() {
  useSEO({
    title: 'Nutrition Tracking | HabeshaCommunity Health',
    description: 'Track your meals with traditional Habesha foods and Orthodox fasting support',
  });

  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentFast, setCurrentFast] = useState<FastingDay | null>(null);
  const [todayLogs, setTodayLogs] = useState<FoodLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFastingOnly, setShowFastingOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  // Daily goals
  const dailyGoals = {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fats: 65,
    fiber: 30
  };

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      // Check fasting status
      const fast = await getCurrentFastingPeriod(new Date());
      setCurrentFast(fast);
      
      // If fasting, default to showing fasting foods only
      if (fast) {
        setShowFastingOnly(true);
      }

      // Load today's food logs
      await loadTodayLogs();
    } catch (error) {
      console.error('Error loading nutrition data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadTodayLogs() {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('habesha_food_logs')
        .select('*')
        .eq('date', today)
        .order('time', { ascending: false });

      if (error) throw error;
      setTodayLogs(data || []);
    } catch (error) {
      console.error('Error loading food logs:', error);
    }
  }

  async function addFood(food: HabeshaFood) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: 'Sign in required',
          description: 'Please sign in to log foods',
          variant: 'destructive'
        });
        return;
      }

      const now = new Date();
      const { error } = await supabase
        .from('habesha_food_logs')
        .insert({
          user_id: user.id,
          date: now.toISOString().split('T')[0],
          time: now.toTimeString().split(' ')[0],
          food_name: food.name,
          food_name_amharic: food.name_amharic,
          food_name_tigrinya: food.name_tigrinya,
          is_traditional_habesha: true,
          is_fasting_appropriate: food.is_fasting_appropriate,
          calories: food.nutrition.calories,
          protein_g: food.nutrition.protein_g,
          carbs_g: food.nutrition.carbs_g,
          fats_g: food.nutrition.fats_g,
          fiber_g: food.nutrition.fiber_g,
          serving_size: food.serving_size
        });

      if (error) throw error;

      toast({
        title: 'Food logged!',
        description: `Added ${food.name} to your diary`
      });

      await loadTodayLogs();
    } catch (error) {
      console.error('Error adding food:', error);
      toast({
        title: 'Error',
        description: 'Failed to log food',
        variant: 'destructive'
      });
    }
  }

  // Calculate today's totals
  const todayTotals = todayLogs.reduce(
    (acc, log) => ({
      calories: acc.calories + log.calories,
      protein: acc.protein + log.protein_g,
      carbs: acc.carbs + log.carbs_g,
      fats: acc.fats + log.fats_g,
      fiber: acc.fiber + (log.fiber_g || 0)
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 }
  );

  // Filter foods
  const allFoods = searchHabeshaFoods(searchQuery, {
    fastingOnly: showFastingOnly
  });

  const recommendedFoods = getRecommendedFoods('energy').slice(0, 6);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-green-50/20 dark:via-green-950/10 to-background">
        {/* Header */}
        <section className="border-b bg-background/95 backdrop-blur-lg sticky top-14 z-40">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                  <span className="text-4xl">🍽️</span>
                  Nutrition Tracking
                </h1>
                <p className="text-muted-foreground">
                  Track your meals with traditional Habesha foods
                </p>
              </div>
              <Button onClick={() => navigate('/health/nutrition/meal-plans')} size="lg">
                <Calendar className="w-5 h-5 mr-2" />
                Meal Plans
              </Button>
            </div>
          </div>
        </section>

        {/* Fasting Banner (if fasting) */}
        {currentFast && (
          <section className="container mx-auto px-4 py-6">
            <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center">
                      <Church className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <Badge className="mb-2 bg-purple-600">Fasting Day</Badge>
                      <h3 className="font-bold text-lg">{currentFast.fast_name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {currentFast.strictness === 'full' && '🚫 No animal products today'}
                        {currentFast.strictness === 'fish-allowed' && '🐟 Fish allowed today'}
                        {currentFast.strictness === 'partial' && '🥚 Partial fasting'}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant={showFastingOnly ? 'default' : 'outline'}
                    onClick={() => setShowFastingOnly(!showFastingOnly)}
                  >
                    {showFastingOnly ? '✓ Showing Fasting Foods' : 'Show Fasting Foods Only'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        <div className="container mx-auto px-4 py-8 grid lg:grid-cols-3 gap-6">
          {/* Left Column: Today's Summary */}
          <div className="lg:col-span-1 space-y-6">
            {/* Daily Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Today's Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Calories */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-orange-500" />
                      <span className="font-medium">Calories</span>
                    </div>
                    <span className="text-sm font-semibold">
                      {todayTotals.calories} / {dailyGoals.calories}
                    </span>
                  </div>
                  <Progress 
                    value={(todayTotals.calories / dailyGoals.calories) * 100} 
                    className="h-2"
                  />
                </div>

                {/* Protein */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Protein</span>
                    <span className="text-sm font-semibold">
                      {todayTotals.protein}g / {dailyGoals.protein}g
                    </span>
                  </div>
                  <Progress 
                    value={(todayTotals.protein / dailyGoals.protein) * 100}
                    className="h-2"
                  />
                </div>

                {/* Carbs */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Carbs</span>
                    <span className="text-sm font-semibold">
                      {todayTotals.carbs}g / {dailyGoals.carbs}g
                    </span>
                  </div>
                  <Progress 
                    value={(todayTotals.carbs / dailyGoals.carbs) * 100}
                    className="h-2"
                  />
                </div>

                {/* Fats */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Fats</span>
                    <span className="text-sm font-semibold">
                      {todayTotals.fats}g / {dailyGoals.fats}g
                    </span>
                  </div>
                  <Progress 
                    value={(todayTotals.fats / dailyGoals.fats) * 100}
                    className="h-2"
                  />
                </div>

                {/* Fiber */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Fiber</span>
                    <span className="text-sm font-semibold">
                      {todayTotals.fiber}g / {dailyGoals.fiber}g
                    </span>
                  </div>
                  <Progress 
                    value={(todayTotals.fiber / dailyGoals.fiber) * 100}
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Today's Meals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Today's Meals ({todayLogs.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {todayLogs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Apple className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No meals logged yet today</p>
                    <p className="text-xs mt-1">Add your first meal below!</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {todayLogs.map((log) => (
                      <div
                        key={log.id}
                        className="p-3 bg-secondary/50 rounded-lg"
                      >
                        <div className="flex items-start justify-between mb-1">
                          <div>
                            <p className="font-medium">{log.food_name}</p>
                            {log.food_name_amharic && (
                              <p className="text-xs text-muted-foreground">
                                {log.food_name_amharic}
                              </p>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {log.time.slice(0, 5)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{log.calories} cal</span>
                          <span>•</span>
                          <span>P: {log.protein_g}g</span>
                          <span>•</span>
                          <span>C: {log.carbs_g}g</span>
                          <span>•</span>
                          <span>F: {log.fats_g}g</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">
                      {todayLogs.length}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Meals Today
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">
                      {Math.round((todayTotals.calories / dailyGoals.calories) * 100)}%
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Goal Progress
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Food Search & Add */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search Bar */}
            <Card>
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search traditional Habesha foods..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 text-lg"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Recommended Foods */}
            {!searchQuery && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <span className="text-2xl">🇪🇹</span>
                    {showFastingOnly ? 'Fasting-Appropriate Foods' : 'Traditional Habesha Foods'}
                  </h2>
                  {currentFast && (
                    <Badge variant="outline" className="bg-purple-100 dark:bg-purple-900">
                      {allFoods.length} fasting foods available
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {allFoods.slice(0, 12).map((food) => (
                    <Card
                      key={food.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{food.name}</h3>
                            {food.name_amharic && (
                              <p className="text-sm text-muted-foreground">
                                {food.name_amharic}
                              </p>
                            )}
                          </div>
                          {food.is_fasting_appropriate && (
                            <Badge variant="secondary" className="bg-green-100 dark:bg-green-900 ml-2">
                              🙏 OK
                            </Badge>
                          )}
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Calories</span>
                            <span className="font-semibold">{food.nutrition.calories}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div className="text-center p-2 bg-secondary/50 rounded">
                              <p className="font-semibold">{food.nutrition.protein_g}g</p>
                              <p className="text-muted-foreground">Protein</p>
                            </div>
                            <div className="text-center p-2 bg-secondary/50 rounded">
                              <p className="font-semibold">{food.nutrition.carbs_g}g</p>
                              <p className="text-muted-foreground">Carbs</p>
                            </div>
                            <div className="text-center p-2 bg-secondary/50 rounded">
                              <p className="font-semibold">{food.nutrition.fats_g}g</p>
                              <p className="text-muted-foreground">Fats</p>
                            </div>
                          </div>
                        </div>

                        <p className="text-xs text-muted-foreground mb-3">
                          {food.serving_size}
                        </p>

                        <Button
                          className="w-full"
                          onClick={() => addFood(food)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add to Diary
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results */}
            {searchQuery && (
              <div>
                <h2 className="text-xl font-bold mb-4">
                  Search Results ({allFoods.length})
                </h2>

                {allFoods.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <p className="text-muted-foreground">
                        No foods found matching "{searchQuery}"
                      </p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => setSearchQuery('')}
                      >
                        Clear Search
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {allFoods.map((food) => (
                      <Card
                        key={food.id}
                        className="hover:shadow-md transition-shadow"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold">{food.name}</h3>
                              {food.name_amharic && (
                                <p className="text-sm text-muted-foreground">
                                  {food.name_amharic}
                                </p>
                              )}
                            </div>
                            {food.is_fasting_appropriate && (
                              <Badge variant="secondary" className="bg-green-100 dark:bg-green-900">
                                🙏
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                            <span>{food.nutrition.calories} cal</span>
                            <span>•</span>
                            <span>P: {food.nutrition.protein_g}g</span>
                            <span>•</span>
                            <span>C: {food.nutrition.carbs_g}g</span>
                          </div>

                          <Button
                            className="w-full"
                            size="sm"
                            onClick={() => addFood(food)}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom CTA */}
        <section className="container mx-auto px-4 py-12">
          <Card className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white border-0">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">
                Want Personalized Meal Plans?
              </h2>
              <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                Work with a Habesha nutritionist who understands Orthodox fasting and traditional foods
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => navigate('/health/coaches?type=nutrition')}
                  className="bg-white text-green-600 hover:bg-gray-100"
                >
                  <UtensilsCrossed className="w-5 h-5 mr-2" />
                  Find a Nutritionist
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/health/nutrition/meal-plans')}
                  className="border-white text-white hover:bg-white/10"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Browse Meal Plans
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
  );
}
