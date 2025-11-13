import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Droplets, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const QUICK_AMOUNTS = [250, 500, 750, 1000];

export default function Hydration() {
  const navigate = useNavigate();
  const [todayTotal, setTodayTotal] = useState(0);
  const [goal, setGoal] = useState(2000);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTodayTotal();
  }, []);

  const loadTodayTotal = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date().toISOString().split('T')[0];

      const { data: logs } = await supabase
        .from('hydration_records')
        .select('amount_ml')
        .eq('user_id', user.id)
        .eq('date', today);

      const total = logs?.reduce((sum, log) => sum + log.amount_ml, 0) || 0;
      setTodayTotal(total);

      const { data: profile } = await supabase
        .from('health_profiles')
        .select('daily_water_goal_ml')
        .eq('user_id', user.id)
        .single();

      setGoal(profile?.daily_water_goal_ml || 2000);
    } catch (error) {
      console.error('Error loading hydration:', error);
    }
  };

  const logWater = async (amount: number) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please log in to track hydration');
        return;
      }

      const { error } = await supabase.from('hydration_records').insert({
        user_id: user.id,
        amount_ml: amount,
        drink_type: 'water'
      });

      if (error) throw error;

      toast.success(`Logged ${amount}ml water`);
      loadTodayTotal();
    } catch (error) {
      console.error('Error logging water:', error);
      toast.error('Failed to log water');
    } finally {
      setLoading(false);
    }
  };

  const percentage = Math.min((todayTotal / goal) * 100, 100);

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/health')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Hydration Tracker</h1>
              <p className="text-muted-foreground">Stay hydrated throughout the day</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Today's Hydration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className="relative inline-block mb-4">
                <Droplets 
                  className="h-32 w-32 text-blue-500"
                  style={{
                    opacity: 0.2 + (percentage / 100) * 0.8
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold">{Math.round(percentage)}%</span>
                </div>
              </div>
              
              <p className="text-2xl font-bold mb-2">
                {todayTotal} / {goal} ml
              </p>
              <p className="text-muted-foreground">
                {goal - todayTotal > 0 ? `${goal - todayTotal}ml remaining` : 'Goal reached! 🎉'}
              </p>
            </div>

            <div className="h-4 bg-secondary rounded-full overflow-hidden mb-6">
              <div
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${percentage}%` }}
              />
            </div>

            <div>
              <p className="text-sm font-medium mb-3">Quick Log</p>
              <div className="grid grid-cols-2 gap-3">
                {QUICK_AMOUNTS.map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    onClick={() => logWater(amount)}
                    disabled={loading}
                    className="h-16 text-lg"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    {amount}ml
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              💡 Tip: Drink water regularly throughout the day, especially during Ethiopian Orthodox fasting periods.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
