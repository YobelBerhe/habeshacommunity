import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Moon, 
  CheckSquare, 
  Dumbbell, 
  Coffee,
  BookOpen,
  ListTodo,
  Utensils,
  Droplet,
  Flame,
  Activity,
  Target,
  Sparkles,
  ShoppingCart,
  Heart,
  Calendar,
  ChevronRight
} from "lucide-react";

export default function HealthDashboard() {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) setGreeting("Good morning");
      else if (hour < 17) setGreeting("Good afternoon");
      else setGreeting("Good evening");

      setTime(new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }));
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  const quickActions = [
    {
      icon: BookOpen,
      label: "Morning Journal",
      color: "bg-purple-100 dark:bg-purple-950",
      textColor: "text-purple-700 dark:text-purple-300",
      path: "/health/mental"
    },
    {
      icon: ListTodo,
      label: "My Tasks",
      color: "bg-blue-100 dark:bg-blue-950",
      textColor: "text-blue-700 dark:text-blue-300",
      badge: "0",
      path: "/health/mental"
    },
    {
      icon: Dumbbell,
      label: "Log Workout",
      color: "bg-red-100 dark:bg-red-950",
      textColor: "text-red-700 dark:text-red-300",
      path: "/health/fitness"
    },
    {
      icon: Coffee,
      label: "Log Meal",
      color: "bg-amber-100 dark:bg-amber-950",
      textColor: "text-amber-700 dark:text-amber-300",
      path: "/health/eat"
    },
    {
      icon: Moon,
      label: "Evening Reflection",
      color: "bg-indigo-100 dark:bg-indigo-950",
      textColor: "text-indigo-700 dark:text-indigo-300",
      path: "/health/sleep"
    }
  ];

  const streaks = [
    { icon: Moon, label: "Sleep streak", target: "7+ hours", count: 0, color: "bg-indigo-100 dark:bg-indigo-950", iconColor: "text-indigo-600" },
    { icon: BookOpen, label: "Journal streak", target: "Daily entries", count: 0, color: "bg-purple-100 dark:bg-purple-950", iconColor: "text-purple-600" },
    { icon: Dumbbell, label: "Workout streak", target: "Consecutive days", count: 0, color: "bg-red-100 dark:bg-red-950", iconColor: "text-red-600" },
    { icon: Target, label: "Task streak", target: "All MITs done", count: 0, color: "bg-blue-100 dark:bg-blue-950", iconColor: "text-blue-600" }
  ];

  const exploreItems = [
    { icon: Coffee, label: "Food Diary", path: "/health/eat" },
    { icon: ShoppingCart, label: "Shopping List", path: "/health/nutrition/shopping-list" },
    { icon: Heart, label: "Meal Swap", path: "/health/nutrition/recipes" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="p-6 pb-4">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-foreground mb-1"
        >
          {greeting}, Champion!
        </motion.h1>
        <p className="text-muted-foreground flex items-center gap-2">
          <span className="text-lg">{time}</span>
          <span>•</span>
          <span>Let's optimize your day</span>
        </p>
      </div>

      <div className="px-6 space-y-6 pb-20">
        {/* Today's Progress */}
        <Card className="p-6 bg-card">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1">Today's Progress</h2>
              <p className="text-muted-foreground">0% of your daily goals complete</p>
            </div>
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-muted"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${0 * 2 * Math.PI * 32} ${2 * Math.PI * 32}`}
                  className="text-primary"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold">0%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center">
                  <Moon className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium text-foreground">Sleep</span>
                    <span className="text-sm text-muted-foreground">0.0h</span>
                  </div>
                </div>
              </div>
              <Progress value={0} className="h-1" />
              <p className="text-xs text-muted-foreground">8.0h short</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                  <CheckSquare className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium text-foreground">Tasks</span>
                    <span className="text-sm text-muted-foreground">0/0</span>
                  </div>
                </div>
              </div>
              <Progress value={0} className="h-1" />
              <p className="text-xs text-muted-foreground">0 MITs left</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center">
                  <Dumbbell className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium text-foreground">Workout</span>
                    <span className="text-sm text-muted-foreground">0min</span>
                  </div>
                </div>
              </div>
              <Progress value={0} className="h-1" />
              <p className="text-xs text-muted-foreground">No workout yet</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950 flex items-center justify-center">
                  <Coffee className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium text-foreground">Calories</span>
                    <span className="text-sm text-muted-foreground">0/2000</span>
                  </div>
                </div>
              </div>
              <Progress value={0} className="h-1" />
              <p className="text-xs text-muted-foreground">2000 cal remaining</p>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`${action.color} p-6 cursor-pointer hover:shadow-lg transition-all relative`}
                  onClick={() => navigate(action.path)}
                >
                  {action.badge && (
                    <Badge variant="destructive" className="absolute top-3 right-3 h-6 w-6 p-0 flex items-center justify-center">
                      {action.badge}
                    </Badge>
                  )}
                  <action.icon className={`w-8 h-8 ${action.textColor} mb-3`} />
                  <h3 className={`font-semibold ${action.textColor}`}>{action.label}</h3>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Your Day */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-foreground">Your Day</h2>
            <button className="text-primary font-medium flex items-center gap-1">
              View Schedule <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-muted-foreground">6:00 PM</span>
            </div>
            <div className="flex items-center gap-4 cursor-pointer hover:bg-accent/50 p-3 -m-3 rounded-lg transition-colors">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                ❤️
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Dinner & Family</h3>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="pl-16 space-y-2 text-sm text-muted-foreground">
              <p>• Dinner</p>
              <p>• Family time</p>
            </div>
          </Card>
        </div>

        {/* Your Streaks */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            🔥 Your Streaks
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {streaks.map((streak, index) => (
              <motion.div
                key={streak.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`${streak.color} p-5`}>
                  <streak.icon className={`w-8 h-8 ${streak.iconColor} mb-3`} />
                  <div className="text-4xl font-bold text-foreground mb-1">{streak.count}</div>
                  <div className="font-medium text-foreground mb-1">{streak.label}</div>
                  <div className="text-xs text-muted-foreground">{streak.target}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-5 text-center">
            <Droplet className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-3xl font-bold text-foreground mb-1">48oz</div>
            <div className="text-xs text-muted-foreground">Water today</div>
            <Progress value={48} className="h-1 mt-3" />
          </Card>
          <Card className="p-5 text-center">
            <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <div className="text-3xl font-bold text-foreground mb-1">0g</div>
            <div className="text-xs text-muted-foreground">Protein today</div>
            <Progress value={0} className="h-1 mt-3" />
          </Card>
          <Card className="p-5 text-center">
            <Activity className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-3xl font-bold text-foreground mb-1">0</div>
            <div className="text-xs text-muted-foreground">Active minutes</div>
            <Progress value={0} className="h-1 mt-3" />
          </Card>
        </div>

        {/* Today's Insights */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            Today's Insights
          </h2>
          <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💪</span>
              <div>
                <h3 className="font-semibold text-red-900 dark:text-red-100 mb-1">Workout Reminder</h3>
                <p className="text-sm text-red-700 dark:text-red-300">Your afternoon workout is coming up</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Upcoming */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Upcoming
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 cursor-pointer hover:bg-accent/50 p-3 -m-3 rounded-lg transition-colors">
              <span className="text-3xl">🌮</span>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Dinner</h3>
                <p className="text-sm text-muted-foreground">6:00 PM</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex items-center gap-4 cursor-pointer hover:bg-accent/50 p-3 -m-3 rounded-lg transition-colors">
              <span className="text-3xl">🌙</span>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Evening reflection</h3>
                <p className="text-sm text-muted-foreground">9:00 PM</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
        </Card>

        {/* Daily Motivation */}
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5">
          <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
            💬 Daily Motivation
          </h2>
          <blockquote className="italic text-foreground mb-2">
            "The secret of getting ahead is getting started."
          </blockquote>
          <p className="text-sm text-muted-foreground">- Mark Twain</p>
        </Card>

        {/* Explore */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            🚀 Explore
          </h2>
          <div className="space-y-3">
            {exploreItems.map((item) => (
              <Card
                key={item.label}
                className="p-4 cursor-pointer hover:shadow-lg transition-all"
                onClick={() => navigate(item.path)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground flex-1">{item.label}</h3>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
