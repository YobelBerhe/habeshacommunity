import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Plus, ChevronLeft, ChevronRight, Search, Loader2 } from 'lucide-react';
import { format, addDays, subDays } from 'date-fns';
import { toast } from 'sonner';

interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meal: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
}

export default function NutritionPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const dailyGoals = {
    calories: 2000,
    protein: 150,
    carbs: 200,
    fat: 65
  };

  useEffect(() => {
    if (user) {
      fetchFoodLogs();
    } else {
      setLoading(false);
    }
  }, [user, selectedDate]);

  const fetchFoodLogs = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const dateStr = format(selectedDate, 'yyyy-MM-dd');

      const { data, error } = await supabase
        .from('food_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', dateStr)
        .order('time', { ascending: true });

      if (error) throw error;

      const formatted: FoodEntry[] = (data || []).map(log => ({
        id: log.id,
        name: log.food_name || 'Food Item',
        calories: log.calories || 0,
        protein: Number(log.protein_g) || 0,
        carbs: Number(log.carbs_g) || 0,
        fat: Number(log.fats_g) || 0,
        meal: (log.meal_type || 'snacks') as 'breakfast' | 'lunch' | 'dinner' | 'snacks'
      }));

      setEntries(formatted);
    } catch (error) {
      console.error('Error fetching food logs:', error);
      toast.error('Failed to load food logs');
    } finally {
      setLoading(false);
    }
  };

  const totals = entries.reduce(
    (acc, entry) => ({
      calories: acc.calories + entry.calories,
      protein: acc.protein + entry.protein,
      carbs: acc.carbs + entry.carbs,
      fat: acc.fat + entry.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const remaining = {
    calories: dailyGoals.calories - totals.calories,
  };

  const mealGroups = {
    breakfast: entries.filter(e => e.meal === 'breakfast'),
    lunch: entries.filter(e => e.meal === 'lunch'),
    dinner: entries.filter(e => e.meal === 'dinner'),
    snacks: entries.filter(e => e.meal === 'snacks'),
  };

  const getMealTotal = (meal: keyof typeof mealGroups) => {
    return mealGroups[meal].reduce((sum, entry) => sum + entry.calories, 0);
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
            <h1 className="text-xl font-bold">Nutrition</h1>
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground"
              onClick={() => navigate('/health/nutrition/search')}
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        {/* Date Selector */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedDate(subDays(selectedDate, 1))}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {format(selectedDate, 'EEEE')}
              </p>
              <p className="font-semibold">
                {format(selectedDate, 'MMMM d, yyyy')}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedDate(addDays(selectedDate, 1))}
              disabled={format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </Card>

        {/* Calorie Summary */}
        <Card className="p-6">
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-muted"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={440}
                  strokeDashoffset={440 - (440 * Math.min(totals.calories / dailyGoals.calories, 1))}
                  className="text-primary"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-3xl font-bold">{remaining.calories}</p>
                <p className="text-sm text-muted-foreground">Remaining</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">{dailyGoals.calories}</p>
              <p className="text-xs text-muted-foreground">Goal</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{totals.calories}</p>
              <p className="text-xs text-muted-foreground">Food</p>
            </div>
            <div>
              <p className="text-2xl font-bold">0</p>
              <p className="text-xs text-muted-foreground">Exercise</p>
            </div>
          </div>
        </Card>

        {/* Macros */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Macronutrients</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Protein</span>
                <span className="text-muted-foreground">
                  {totals.protein}g / {dailyGoals.protein}g
                </span>
              </div>
              <Progress value={Math.min((totals.protein / dailyGoals.protein) * 100, 100)} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Carbs</span>
                <span className="text-muted-foreground">
                  {totals.carbs}g / {dailyGoals.carbs}g
                </span>
              </div>
              <Progress value={Math.min((totals.carbs / dailyGoals.carbs) * 100, 100)} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Fat</span>
                <span className="text-muted-foreground">
                  {totals.fat}g / {dailyGoals.fat}g
                </span>
              </div>
              <Progress value={Math.min((totals.fat / dailyGoals.fat) * 100, 100)} className="h-2" />
            </div>
          </div>
        </Card>

        {/* Meals */}
        {(['breakfast', 'lunch', 'dinner', 'snacks'] as const).map((mealType) => (
          <Card key={mealType} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold capitalize">{mealType}</h3>
                <p className="text-sm text-muted-foreground">
                  {getMealTotal(mealType)} calories
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/health/nutrition/add?meal=${mealType}`)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Food
              </Button>
            </div>

            {mealGroups[mealType].length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-2">
                No foods logged
              </p>
            ) : (
              <div className="space-y-2">
                {mealGroups[mealType].map((entry) => (
                  <div key={entry.id} className="flex justify-between items-start py-2 border-t">
                    <div>
                      <p className="font-medium">{entry.name}</p>
                      <p className="text-xs text-muted-foreground">
                        P: {entry.protein}g • C: {entry.carbs}g • F: {entry.fat}g
                      </p>
                    </div>
                    <span className="font-medium">{entry.calories}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}