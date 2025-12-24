import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Plus, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { format, addDays, subDays } from 'date-fns';

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
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [entries] = useState<FoodEntry[]>([
    {
      id: '1',
      name: 'Injera with Shiro Wot',
      calories: 420,
      protein: 15,
      carbs: 65,
      fat: 12,
      meal: 'lunch'
    },
    {
      id: '2',
      name: 'Ethiopian Coffee',
      calories: 5,
      protein: 0,
      carbs: 1,
      fat: 0,
      meal: 'breakfast'
    },
  ]);

  const dailyGoals = {
    calories: 2000,
    protein: 150,
    carbs: 200,
    fat: 65
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

  return (
    <div className="min-h-screen bg-background">
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
                  strokeDashoffset={440 - (440 * (totals.calories / dailyGoals.calories))}
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
              <Progress value={(totals.protein / dailyGoals.protein) * 100} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Carbs</span>
                <span className="text-muted-foreground">
                  {totals.carbs}g / {dailyGoals.carbs}g
                </span>
              </div>
              <Progress value={(totals.carbs / dailyGoals.carbs) * 100} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Fat</span>
                <span className="text-muted-foreground">
                  {totals.fat}g / {dailyGoals.fat}g
                </span>
              </div>
              <Progress value={(totals.fat / dailyGoals.fat) * 100} className="h-2" />
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
