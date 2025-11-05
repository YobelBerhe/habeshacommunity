import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Droplet, 
  Plus,
  Minus,
  Target,
  TrendingUp,
  Award,
  Clock,
  Calendar,
  ArrowLeft,
  Zap,
  Settings,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSEO } from '@/hooks/useSEO';

export default function Hydration() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [waterIntake, setWaterIntake] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(64); // oz
  const [logs, setLogs] = useState<any[]>([]);
  const [streak, setStreak] = useState(0);
  const [weeklyAverage, setWeeklyAverage] = useState(0);

  useSEO({
    title: "Hydration Tracker | Track Your Daily Water Intake",
    description: "Monitor your daily water consumption with beautiful animations and achieve your hydration goals"
  });

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    init();
  }, []);

  async function init() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/auth');
      return;
    }
    setUserId(user.id);
    await loadData(user.id);
  }

  async function loadData(uid: string) {
    try {
      // Load today's water logs
      const { data: todayLogs } = await supabase
        .from('water_logs')
        .select('*')
        .eq('user_id', uid)
        .eq('date', today)
        .order('logged_at', { ascending: false });

      if (todayLogs) {
        setLogs(todayLogs);
        const total = todayLogs.reduce((sum, log) => sum + (log.amount_oz || 0), 0);
        setWaterIntake(total);
      }

      // Calculate streak
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: weekLogs } = await supabase
        .from('water_logs')
        .select('date, amount_oz')
        .eq('user_id', uid)
        .gte('date', sevenDaysAgo.toISOString().split('T')[0]);

      if (weekLogs) {
        // Group by date and calculate daily totals
        const dailyTotals = weekLogs.reduce((acc, log) => {
          acc[log.date] = (acc[log.date] || 0) + log.amount_oz;
          return acc;
        }, {} as Record<string, number>);

        // Calculate streak
        let currentStreak = 0;
        const today = new Date();
        for (let i = 0; i < 30; i++) {
          const checkDate = new Date(today);
          checkDate.setDate(today.getDate() - i);
          const dateStr = checkDate.toISOString().split('T')[0];
          
          if ((dailyTotals[dateStr] || 0) >= dailyGoal) {
            currentStreak++;
          } else {
            break;
          }
        }
        setStreak(currentStreak);

        // Calculate weekly average
        const weeklyTotal = Object.values(dailyTotals).reduce((sum, val) => sum + val, 0);
        setWeeklyAverage(Math.round(weeklyTotal / 7));
      }

    } catch (error) {
      console.error('Error loading hydration data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function addWater(amount: number) {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('water_logs')
        .insert({
          user_id: userId,
          date: today,
          amount_oz: amount,
          logged_at: new Date().toISOString()
        });

      if (error) throw error;

      await loadData(userId);

      // Show celebration when goal reached
      if (waterIntake < dailyGoal && (waterIntake + amount) >= dailyGoal) {
        toast({
          title: "🎉 Daily goal achieved!",
          description: "Great job staying hydrated!"
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  }

  const percentage = Math.min((waterIntake / dailyGoal) * 100, 100);
  const glassSize = 8; // oz
  const glassesConsumed = Math.floor(waterIntake / glassSize);
  const glassesNeeded = Math.ceil(dailyGoal / glassSize);

  const WaterWave = () => {
    return (
      <div className="relative w-64 h-64 mx-auto">
        {/* Glass Container */}
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {/* Glass outline */}
          <path
            d="M 50 10 L 60 180 L 140 180 L 150 10 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-primary/30"
          />
          
          {/* Water with wave animation */}
          <defs>
            <clipPath id="glass-clip">
              <path d="M 50 10 L 60 180 L 140 180 L 150 10 Z" />
            </clipPath>
          </defs>
          
          <g clipPath="url(#glass-clip)">
            <motion.path
              d={`M 0 ${200 - (percentage * 1.7)} 
                  Q 50 ${200 - (percentage * 1.7) - 10}, 100 ${200 - (percentage * 1.7)} 
                  T 200 ${200 - (percentage * 1.7)} 
                  L 200 200 L 0 200 Z`}
              fill="url(#water-gradient)"
              animate={{
                d: [
                  `M 0 ${200 - (percentage * 1.7)} 
                   Q 50 ${200 - (percentage * 1.7) - 10}, 100 ${200 - (percentage * 1.7)} 
                   T 200 ${200 - (percentage * 1.7)} 
                   L 200 200 L 0 200 Z`,
                  `M 0 ${200 - (percentage * 1.7)} 
                   Q 50 ${200 - (percentage * 1.7) + 10}, 100 ${200 - (percentage * 1.7)} 
                   T 200 ${200 - (percentage * 1.7)} 
                   L 200 200 L 0 200 Z`,
                  `M 0 ${200 - (percentage * 1.7)} 
                   Q 50 ${200 - (percentage * 1.7) - 10}, 100 ${200 - (percentage * 1.7)} 
                   T 200 ${200 - (percentage * 1.7)} 
                   L 200 200 L 0 200 Z`
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Water bubbles */}
            {[...Array(5)].map((_, i) => (
              <motion.circle
                key={i}
                cx={60 + i * 20}
                cy={200}
                r="3"
                fill="rgba(255,255,255,0.6)"
                animate={{
                  cy: [200, 200 - (percentage * 1.7) - 20],
                  opacity: [1, 0]
                }}
                transition={{
                  duration: 2 + i * 0.3,
                  repeat: Infinity,
                  delay: i * 0.4
                }}
              />
            ))}
          </g>
          
          <defs>
            <linearGradient id="water-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <motion.div
            key={waterIntake}
            initial={{ scale: 1.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <div className="text-4xl font-bold text-foreground">
              {waterIntake}
            </div>
            <div className="text-sm text-muted-foreground">of {dailyGoal} oz</div>
            <div className="text-xs font-semibold text-primary mt-2">
              {Math.round(percentage)}%
            </div>
          </motion.div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
          <Droplet className="w-12 h-12 text-primary" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border/50"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate('/health')}
                className="rounded-full"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Droplet className="w-6 h-6 text-primary" />
                  Hydration Tracker
                </h1>
                <p className="text-sm text-muted-foreground">Stay refreshed, stay healthy</p>
              </div>
            </div>
            <Button variant="outline" size="icon" className="rounded-full">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <Badge variant="secondary">{streak} days</Badge>
                </div>
                <h3 className="text-2xl font-bold">{streak}</h3>
                <p className="text-sm text-muted-foreground">Day Streak</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <Badge variant="secondary">{weeklyAverage} oz</Badge>
                </div>
                <h3 className="text-2xl font-bold">{weeklyAverage}</h3>
                <p className="text-sm text-muted-foreground">Weekly Average</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <Badge variant="secondary">{glassesConsumed}/{glassesNeeded}</Badge>
                </div>
                <h3 className="text-2xl font-bold">{glassesConsumed}</h3>
                <p className="text-sm text-muted-foreground">Glasses Today</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Water Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-0 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none" />
            <CardContent className="p-8 relative">
              <WaterWave />

              {/* Quick Add Buttons */}
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {[8, 16, 24, 32].map((amount) => (
                  <motion.div key={amount} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={() => addWater(amount)}
                      variant="outline"
                      size="lg"
                      className="rounded-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {amount} oz
                    </Button>
                  </motion.div>
                ))}
              </div>

              {/* Goal Status */}
              <div className="mt-6 text-center">
                {percentage >= 100 ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center justify-center gap-2 text-primary"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-semibold">Daily goal achieved! 🎉</span>
                  </motion.div>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <AlertCircle className="w-5 h-5" />
                    <span>{dailyGoal - waterIntake} oz remaining to reach your goal</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Today's Log */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Today's Activity
              </h3>
              
              {logs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Droplet className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>No water logged yet today</p>
                  <p className="text-sm">Start tracking your hydration!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {logs.map((log, index) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Droplet className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-semibold">{log.amount_oz} oz</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(log.logged_at).toLocaleTimeString('en-US', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Hydration Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Hydration Tips
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  <span>Drink water first thing in the morning to kickstart your metabolism</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  <span>Keep a water bottle with you throughout the day</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  <span>Increase intake during exercise and hot weather</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  <span>Eat water-rich foods like cucumbers, watermelon, and oranges</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}