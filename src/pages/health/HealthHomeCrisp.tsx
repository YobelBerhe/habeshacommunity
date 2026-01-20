import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Plus, Flame, Droplets,
  Moon, Brain, Dumbbell, Apple, TrendingUp, Target,
  Calendar, Clock, Award, Heart, Utensils, MoreHorizontal,
  ArrowRight, Sparkles, Check, ChevronDown
} from 'lucide-react';
import { useAuth } from '@/store/auth';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { format, isToday, subDays, addDays } from 'date-fns';
import { getCurrentFastingPeriod, getFastingProgress } from '@/lib/fasting/orthodox-calendar';

// ============================================
// TYPES
// ============================================

interface DailyStats {
  calories: { current: number; goal: number };
  protein: { current: number; goal: number };
  water: { current: number; goal: number };
  steps: { current: number; goal: number };
  sleep: { current: number; goal: number };
}

interface HealthCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  stats?: string;
  isNew?: boolean;
}

// ============================================
// RING PROGRESS COMPONENT (Apple Health Style)
// ============================================

const RingProgress = ({ 
  progress, 
  size = 120, 
  strokeWidth = 12,
  color = '#10B981',
  bgColor = '#E5E7EB',
  children 
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
  children?: React.ReactNode;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (Math.min(progress, 100) / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

// ============================================
// STAT CARD COMPONENT
// ============================================

const StatCard = ({
  icon,
  label,
  value,
  unit,
  progress,
  color,
  onClick
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  unit: string;
  progress: number;
  color: string;
  onClick?: () => void;
}) => (
  <motion.div
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 cursor-pointer"
  >
    <div className="flex items-center gap-2 mb-3">
      <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", color)}>
        {icon}
      </div>
      <span className="text-sm text-gray-500 font-medium">{label}</span>
    </div>
    <div className="flex items-end justify-between">
      <div>
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        <span className="text-sm text-gray-400 ml-1">{unit}</span>
      </div>
      <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <motion.div 
          className={cn("h-full rounded-full", color.replace('bg-', 'bg-').replace('/10', ''))}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  </motion.div>
);

// ============================================
// CATEGORY TILE COMPONENT
// ============================================

const CategoryTile = ({ category }: { category: HealthCategory }) => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      onClick={() => navigate(category.href)}
      className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 cursor-pointer"
    >
      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center",
        category.color
      )}>
        {category.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900">{category.name}</h3>
          {category.isNew && (
            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">
              NEW
            </span>
          )}
        </div>
        {category.stats && (
          <p className="text-sm text-gray-500">{category.stats}</p>
        )}
      </div>
      <ChevronRight className="w-5 h-5 text-gray-300" />
    </motion.div>
  );
};

// ============================================
// QUICK ACTION BUTTON
// ============================================

const QuickAction = ({
  icon,
  label,
  onClick,
  variant = 'default'
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'primary';
}) => (
  <motion.button
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={cn(
      "flex flex-col items-center gap-2 p-4 rounded-2xl min-w-[80px]",
      variant === 'primary' 
        ? "bg-gray-900 text-white" 
        : "bg-gray-50 text-gray-700"
    )}
  >
    {icon}
    <span className="text-xs font-medium">{label}</span>
  </motion.button>
);

// ============================================
// FASTING CARD COMPONENT
// ============================================

const FastingCard = ({ 
  fastName, 
  progress, 
  daysRemaining,
  onClick 
}: {
  fastName: string;
  progress: number;
  daysRemaining: number;
  onClick: () => void;
}) => (
  <motion.div
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-5 border border-purple-100 cursor-pointer"
  >
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
          <span className="text-xl">🙏</span>
        </div>
        <div>
          <p className="text-xs text-purple-600 font-medium uppercase tracking-wide">Orthodox Fasting</p>
          <h3 className="font-bold text-gray-900">{fastName}</h3>
        </div>
      </div>
      <ArrowRight className="w-5 h-5 text-purple-400" />
    </div>
    
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{daysRemaining} days remaining</span>
        <span className="font-semibold text-gray-900">{progress}%</span>
      </div>
      <div className="h-2 bg-white rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8 }}
        />
      </div>
    </div>
  </motion.div>
);

// ============================================
// STREAK BADGE COMPONENT
// ============================================

const StreakBadge = ({ days, label }: { days: number; label: string }) => (
  <div className="flex items-center gap-2 bg-orange-50 text-orange-700 px-3 py-1.5 rounded-full">
    <Flame className="w-4 h-4" />
    <span className="text-sm font-semibold">{days} day {label}</span>
  </div>
);

// ============================================
// MAIN COMPONENT
// ============================================

export default function HealthHomeCrisp() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [stats, setStats] = useState<DailyStats>({
    calories: { current: 0, goal: 2000 },
    protein: { current: 0, goal: 150 },
    water: { current: 0, goal: 8 },
    steps: { current: 0, goal: 10000 },
    sleep: { current: 0, goal: 8 }
  });
  const [fastingData, setFastingData] = useState<{
    name: string;
    progress: number;
    daysRemaining: number;
  } | null>(null);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  // Health categories
  const categories: HealthCategory[] = [
    {
      id: 'nutrition',
      name: 'Nutrition',
      icon: <Apple className="w-6 h-6 text-green-600" />,
      href: '/health/nutrition',
      color: 'bg-green-50',
      stats: `${stats.calories.current} / ${stats.calories.goal} cal`
    },
    {
      id: 'fitness',
      name: 'Fitness',
      icon: <Dumbbell className="w-6 h-6 text-blue-600" />,
      href: '/health/fitness',
      color: 'bg-blue-50',
      stats: 'Track workouts'
    },
    {
      id: 'fasting',
      name: 'Fasting',
      icon: <Clock className="w-6 h-6 text-purple-600" />,
      href: '/health/fasting',
      color: 'bg-purple-50',
      stats: fastingData ? 'Active fast' : 'Start a fast'
    },
    {
      id: 'sleep',
      name: 'Sleep',
      icon: <Moon className="w-6 h-6 text-indigo-600" />,
      href: '/health/sleep',
      color: 'bg-indigo-50',
      stats: `${stats.sleep.current}h logged`,
      isNew: true
    },
    {
      id: 'hydration',
      name: 'Hydration',
      icon: <Droplets className="w-6 h-6 text-cyan-600" />,
      href: '/health/hydration',
      color: 'bg-cyan-50',
      stats: `${stats.water.current} / ${stats.water.goal} glasses`
    },
    {
      id: 'mental',
      name: 'Mental Health',
      icon: <Brain className="w-6 h-6 text-pink-600" />,
      href: '/health/mental',
      color: 'bg-pink-50',
      stats: 'Check in',
      isNew: true
    }
  ];

  useEffect(() => {
    loadData();
  }, [user, selectedDate]);

  const loadData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const dateStr = format(selectedDate, 'yyyy-MM-dd');

      // Fetch food logs
      const { data: foodLogs } = await supabase
        .from('food_logs')
        .select('calories, protein_g')
        .eq('user_id', user.id)
        .eq('date', dateStr);

      if (foodLogs) {
        const totalCals = foodLogs.reduce((sum, log) => sum + (log.calories || 0), 0);
        const totalProtein = foodLogs.reduce((sum, log) => sum + (Number(log.protein_g) || 0), 0);
        setStats(prev => ({
          ...prev,
          calories: { ...prev.calories, current: totalCals },
          protein: { ...prev.protein, current: totalProtein }
        }));
      }

      // Fetch hydration logs (amount_ml column, convert to glasses: 1 glass = 250ml)
      const { data: hydrationLogs } = await supabase
        .from('hydration_logs')
        .select('amount_ml')
        .eq('user_id', user.id);

      if (hydrationLogs) {
        const totalMl = hydrationLogs.reduce((sum, log) => sum + (log.amount_ml || 0), 0);
        const totalGlasses = Math.round(totalMl / 250); // Convert ml to glasses
        setStats(prev => ({
          ...prev,
          water: { ...prev.water, current: totalGlasses }
        }));
      }

      // Fetch sleep logs (duration_hours column, filter by sleep_start date)
      const { data: sleepLogs } = await supabase
        .from('sleep_logs')
        .select('duration_hours, sleep_start')
        .eq('user_id', user.id)
        .gte('sleep_start', dateStr)
        .lt('sleep_start', format(addDays(selectedDate, 1), 'yyyy-MM-dd'));

      if (sleepLogs && sleepLogs.length > 0) {
        const lastSleep = sleepLogs[sleepLogs.length - 1];
        setStats(prev => ({
          ...prev,
          sleep: { ...prev.sleep, current: lastSleep.duration_hours || 0 }
        }));
      }

      // Fetch fasting status - wrap in try/catch for safety
      try {
        const fast = await getCurrentFastingPeriod(selectedDate);
        if (fast) {
          const progress = getFastingProgress(fast);
          setFastingData({
            name: fast.fast_name,
            progress: progress?.percentage || 0,
            daysRemaining: progress?.daysRemaining || 0
          });
        } else {
          setFastingData(null);
        }
      } catch {
        setFastingData(null);
      }

      // Streak placeholder - will be implemented with proper typing later
      setStreak(5); // Demo value

    } catch (error) {
      console.error('Error loading health data:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    setSelectedDate(prev => 
      direction === 'prev' ? subDays(prev, 1) : addDays(prev, 1)
    );
  };

  const calorieProgress = (stats.calories.current / stats.calories.goal) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="px-4 pt-12 pb-4">
          {/* Top Row */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500">Good {getTimeOfDay()}</p>
              <h1 className="text-2xl font-bold text-gray-900">Health</h1>
            </div>
            {streak > 0 && <StreakBadge days={streak} label="streak" />}
          </div>

          {/* Date Selector */}
          <div className="flex items-center justify-center gap-4 py-2">
            <button
              onClick={() => navigateDate('prev')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="text-center min-w-[140px]">
              <p className="font-semibold text-gray-900">
                {isToday(selectedDate) ? 'Today' : format(selectedDate, 'EEE, MMM d')}
              </p>
            </div>
            <button
              onClick={() => navigateDate('next')}
              disabled={isToday(selectedDate)}
              className={cn(
                "p-2 rounded-full transition-colors",
                isToday(selectedDate) 
                  ? "text-gray-300 cursor-not-allowed" 
                  : "hover:bg-gray-100 text-gray-600"
              )}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 space-y-6 pb-24">
        {/* Calorie Ring + Quick Stats */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            {/* Main Ring */}
            <RingProgress 
              progress={calorieProgress} 
              size={140}
              strokeWidth={14}
              color="#10B981"
            >
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">{stats.calories.current}</p>
                <p className="text-xs text-gray-500">of {stats.calories.goal} cal</p>
              </div>
            </RingProgress>

            {/* Side Stats */}
            <div className="flex-1 ml-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-sm text-gray-600">Protein</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {stats.protein.current}g / {stats.protein.goal}g
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-cyan-500" />
                  <span className="text-sm text-gray-600">Water</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {stats.water.current} / {stats.water.goal} cups
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-indigo-500" />
                  <span className="text-sm text-gray-600">Sleep</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {stats.sleep.current}h / {stats.sleep.goal}h
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-3 mt-6 overflow-x-auto no-scrollbar">
            <QuickAction
              icon={<Plus className="w-5 h-5" />}
              label="Log Food"
              onClick={() => navigate('/health/nutrition/log')}
              variant="primary"
            />
            <QuickAction
              icon={<Droplets className="w-5 h-5" />}
              label="Add Water"
              onClick={() => navigate('/health/hydration')}
            />
            <QuickAction
              icon={<Dumbbell className="w-5 h-5" />}
              label="Workout"
              onClick={() => navigate('/health/fitness')}
            />
            <QuickAction
              icon={<Moon className="w-5 h-5" />}
              label="Log Sleep"
              onClick={() => navigate('/health/sleep')}
            />
          </div>
        </div>

        {/* Orthodox Fasting Card (if active) */}
        {fastingData && (
          <FastingCard
            fastName={fastingData.name}
            progress={fastingData.progress}
            daysRemaining={fastingData.daysRemaining}
            onClick={() => navigate('/health/fasting')}
          />
        )}

        {/* Categories Section */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Categories</h2>
          <div className="space-y-3">
            {categories.map(category => (
              <CategoryTile key={category.id} category={category} />
            ))}
          </div>
        </div>

        {/* Habesha Health Tip */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-100">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
              <Sparkles className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Habesha Health Tip</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Injera is rich in iron and protein. During fasting, pair it with 
                misir wot (lentils) for a complete protein meal.
              </p>
            </div>
          </div>
        </div>

        {/* Find a Health Coach CTA */}
        <motion.div
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/mentor?category=health')}
          className="bg-gray-900 text-white rounded-2xl p-5 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wide mb-1">
                Premium
              </p>
              <h3 className="font-bold text-lg mb-1">Find a Health Coach</h3>
              <p className="text-gray-400 text-sm">
                Habesha experts in nutrition & fitness
              </p>
            </div>
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
              <ArrowRight className="w-6 h-6" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Custom Scrollbar Hide */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

// Helper function
function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}
