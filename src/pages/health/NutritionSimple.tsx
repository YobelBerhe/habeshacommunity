import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Trash2, ArrowLeft, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { searchHabeshaFoods, type HabeshaFood } from "@/lib/nutrition/habesha-foods";

export default function NutritionSimple() {
  const navigate = useNavigate();
  const [mealType, setMealType] = useState<"breakfast" | "lunch" | "dinner" | "snack">("breakfast");
  const [foodSearch, setFoodSearch] = useState("");
  const [searchResults, setSearchResults] = useState<HabeshaFood[]>([]);
  const [todayLogs, setTodayLogs] = useState<any[]>([]);
  const [todayStats, setTodayStats] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    goal: 2000
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTodayLogs();
  }, []);

  useEffect(() => {
    if (foodSearch.length >= 2) {
      const results = searchHabeshaFoods(foodSearch);
      setSearchResults(results.slice(0, 10));
    } else {
      setSearchResults([]);
    }
  }, [foodSearch]);

  const loadTodayLogs = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date().toISOString().split('T')[0];

      const { data: logs, error } = await supabase
        .from('nutrition_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('logged_at', `${today}T00:00:00`)
        .lte('logged_at', `${today}T23:59:59`)
        .order('logged_at', { ascending: false });

      if (error) throw error;

      setTodayLogs(logs || []);

      const totals = logs?.reduce(
        (acc, log) => ({
          calories: acc.calories + (log.calories || 0),
          protein: acc.protein + (Number(log.protein_g) || 0),
          carbs: acc.carbs + (Number(log.carbs_g) || 0),
          fat: acc.fat + (Number(log.fat_g) || 0),
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      );

      const { data: profile } = await supabase
        .from('health_profiles')
        .select('daily_calorie_goal')
        .eq('user_id', user.id)
        .single();

      setTodayStats({
        ...totals,
        goal: profile?.daily_calorie_goal || 2000
      });
    } catch (error) {
      console.error('Error loading nutrition logs:', error);
    }
  };

  const logFood = async (food: HabeshaFood) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please log in to track meals');
        return;
      }

      const { error } = await supabase.from('nutrition_logs').insert({
        user_id: user.id,
        meal_type: mealType,
        food_name: food.name,
        portion_size: '1 serving',
        calories: food.nutrition.calories,
        protein_g: food.nutrition.protein_g,
        carbs_g: food.nutrition.carbs_g,
        fat_g: food.nutrition.fats_g,
        fiber_g: food.nutrition.fiber_g,
        is_habesha_food: true,
        is_fasting_friendly: food.is_fasting_appropriate,
        logged_at: new Date().toISOString()
      });

      if (error) throw error;

      toast.success(`Logged ${food.name}`);
      setFoodSearch("");
      setSearchResults([]);
      loadTodayLogs();
    } catch (error) {
      console.error('Error logging food:', error);
      toast.error('Failed to log food');
    } finally {
      setLoading(false);
    }
  };

  const deleteLog = async (logId: string) => {
    try {
      const { error } = await supabase
        .from('nutrition_logs')
        .delete()
        .eq('id', logId);

      if (error) throw error;

      toast.success('Log deleted');
      loadTodayLogs();
    } catch (error) {
      console.error('Error deleting log:', error);
      toast.error('Failed to delete log');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/health')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Nutrition Tracker</h1>
                <p className="text-muted-foreground">Log your meals and track calories</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Today's Nutrition</CardTitle>
            <CardDescription>Track your daily intake</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Calories</span>
                  <span className="text-2xl font-bold">
                    {todayStats.calories} / {todayStats.goal}
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all"
                    style={{ width: `${Math.min((todayStats.calories / todayStats.goal) * 100, 100)}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Protein</p>
                  <p className="text-lg font-semibold">{todayStats.protein.toFixed(1)}g</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Carbs</p>
                  <p className="text-lg font-semibold">{todayStats.carbs.toFixed(1)}g</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fat</p>
                  <p className="text-lg font-semibold">{todayStats.fat.toFixed(1)}g</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Log Food</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Meal Type</Label>
              <Select value={mealType} onValueChange={(value: any) => setMealType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="dinner">Dinner</SelectItem>
                  <SelectItem value="snack">Snack</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Search Ethiopian/Eritrean Foods</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for injera, doro wat, etc..."
                  value={foodSearch}
                  onChange={(e) => setFoodSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {searchResults.length > 0 && (
              <div className="border rounded-lg divide-y max-h-96 overflow-y-auto">
                {searchResults.map((food) => (
                  <div
                    key={food.id}
                    className="p-3 hover:bg-accent cursor-pointer transition-colors"
                    onClick={() => logFood(food)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{food.name}</p>
                        <p className="text-sm text-muted-foreground">{food.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{food.nutrition.calories} cal</p>
                        <p className="text-xs text-muted-foreground">
                          P: {food.nutrition.protein_g}g | C: {food.nutrition.carbs_g}g | F: {food.nutrition.fats_g}g
                        </p>
                      </div>
                    </div>
                    {food.is_fasting_appropriate && (
                      <span className="inline-block mt-2 text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                        Fasting Friendly
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today's Meals</CardTitle>
          </CardHeader>
          <CardContent>
            {todayLogs.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No meals logged today</p>
            ) : (
              <div className="space-y-3">
                {todayLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{log.food_name}</p>
                      <p className="text-sm text-muted-foreground capitalize">{log.meal_type}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold">{log.calories} cal</p>
                        <p className="text-xs text-muted-foreground">
                          {log.protein_g}g protein
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteLog(log.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
