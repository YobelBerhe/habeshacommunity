import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  ArrowLeft, 
  Plus, 
  Flame,
  Scan,
  Sparkles,
  Apple,
  Clock,
  Trash2,
  BookOpen,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function FoodLog() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  // Stats
  const [targets, setTargets] = useState({ calories: 2000, protein: 150, carbs: 200, fats: 60 });
  const [consumed, setConsumed] = useState({ calories: 0, protein: 0, carbs: 0, fats: 0 });
  const [foodLogs, setFoodLogs] = useState<any[]>([]);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    init();
  }, []);

  async function init() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/auth/login');
      return;
    }
    setUserId(user.id);
    await loadData(user.id);
  }

  async function loadData(uid: string) {
    try {
      const { data: targetData } = await supabase
        .from('daily_targets')
        .select('*')
        .eq('user_id', uid)
        .eq('date', today)
        .maybeSingle();

      if (targetData) {
        setTargets({
          calories: targetData.calories,
          protein: targetData.protein_g,
          carbs: targetData.carbs_g,
          fats: targetData.fats_g
        });
      }

      const { data: logs } = await supabase
        .from('food_logs')
        .select('*')
        .eq('user_id', uid)
        .eq('date', today)
        .order('time', { ascending: false });

      if (logs) {
        setFoodLogs(logs);
        const totals = logs.reduce((acc, log) => ({
          calories: acc.calories + (log.calories || 0),
          protein: acc.protein + (log.protein_g || 0),
          carbs: acc.carbs + (log.carbs_g || 0),
          fats: acc.fats + (log.fats_g || 0)
        }), { calories: 0, protein: 0, carbs: 0, fats: 0 });
        setConsumed(totals);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  }

  async function deleteLog(id: string) {
    try {
      await supabase.from('food_logs').delete().eq('id', id);
      toast({ title: 'Food log deleted' });
      loadData(userId);
    } catch (error) {
      toast({ title: 'Error deleting log', variant: 'destructive' });
    }
  }

  const remaining = {
    calories: targets.calories - consumed.calories,
    protein: targets.protein - consumed.protein,
    carbs: targets.carbs - consumed.carbs,
    fats: targets.fats - consumed.fats
  };

  const percentages = {
    calories: Math.round((consumed.calories / targets.calories) * 100),
    protein: Math.round((consumed.protein / targets.protein) * 100),
    carbs: Math.round((consumed.carbs / targets.carbs) * 100),
    fats: Math.round((consumed.fats / targets.fats) * 100)
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/health')}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Meals</h1>
                <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate('/health/barcode-scanner')}>
                <Scan className="w-4 h-4 mr-2" />
                Scan
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate('/health/recipes')}>
                <BookOpen className="w-4 h-4 mr-2" />
                Recipes
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold mb-1">Today's Nutrition</h2>
                <p className="text-sm text-muted-foreground">{consumed.calories} / {targets.calories} cal</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{remaining.calories}</div>
                <div className="text-sm text-muted-foreground">Remaining</div>
              </div>
            </div>

            <Progress value={percentages.calories} className="h-3 mb-4" />

            <div className="grid grid-cols-3 gap-4 mt-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Protein</div>
                <div className="font-bold">{consumed.protein}g / {targets.protein}g</div>
                <Progress value={percentages.protein} className="h-2 mt-1" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Carbs</div>
                <div className="font-bold">{consumed.carbs}g / {targets.carbs}g</div>
                <Progress value={percentages.carbs} className="h-2 mt-1" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Fats</div>
                <div className="font-bold">{consumed.fats}g / {targets.fats}g</div>
                <Progress value={percentages.fats} className="h-2 mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <Button className="h-20" onClick={() => setShowAddDialog(true)}>
            <Plus className="w-5 h-5 mr-2" />
            Add Food
          </Button>
          <Button variant="outline" className="h-20" onClick={() => navigate('/health/recipes')}>
            <Sparkles className="w-5 h-5 mr-2" />
            Find Recipe
          </Button>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold mb-3">Today's Meals</h3>
          {foodLogs.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Apple className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No meals logged yet</p>
                <Button className="mt-4" onClick={() => setShowAddDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Log Your First Meal
                </Button>
              </CardContent>
            </Card>
          ) : (
            foodLogs.map((log) => (
              <motion.div key={log.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{log.food_name}</h4>
                          {log.meal_type && (
                            <Badge variant="secondary" className="text-xs">{log.meal_type}</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{log.serving_size || 'Standard serving'}</p>
                        <div className="flex gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Flame className="w-4 h-4 text-orange-500" />
                            <span className="font-medium">{log.calories} cal</span>
                          </div>
                          <span>P: {log.protein_g}g</span>
                          <span>C: {log.carbs_g}g</span>
                          <span>F: {log.fats_g}g</span>
                        </div>
                        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {new Date(log.time).toLocaleTimeString()}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => deleteLog(log.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Food</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Search for food..." />
            <div className="text-sm text-muted-foreground text-center py-8">
              Quick add feature coming soon!
              <div className="mt-4 flex gap-2 justify-center">
                <Button variant="outline" onClick={() => navigate('/health/barcode-scanner')}>
                  <Scan className="w-4 h-4 mr-2" />
                  Scan Barcode
                </Button>
                <Button variant="outline" onClick={() => navigate('/health/recipes')}>
                  <BookOpen className="w-4 h-4 mr-2" />
                  Browse Recipes
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
