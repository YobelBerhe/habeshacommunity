import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  Apple, 
  Moon, 
  Droplets, 
  BookOpen,
  CheckCircle2,
  TrendingUp,
  Calendar,
  Target,
  Utensils
} from "lucide-react";
import { motion } from "framer-motion";
import { useSEO } from "@/hooks/useSEO";

export default function HealthDashboard() {
  useSEO({
    title: "Health Dashboard | DayAI",
    description: "Track your fitness, nutrition, sleep, and wellness goals"
  });

  const navigate = useNavigate();
  const [currentTime] = useState(new Date());
  
  const greeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const quickActions = [
    { icon: BookOpen, label: "Morning Journal", color: "bg-purple-500", route: "/health/fitness" },
    { icon: CheckCircle2, label: "My Tasks", color: "bg-blue-500", badge: "0", route: "/health/fitness" },
    { icon: Activity, label: "Log Workout", color: "bg-red-500", route: "/health/fitness/train" },
    { icon: Utensils, label: "Log Meal", color: "bg-yellow-500", route: "/health/nutrition/food-log" },
    { icon: Moon, label: "Evening Reflect", color: "bg-indigo-500", route: "/health/sleep" },
  ];

  const stats = [
    { label: "Sleep", value: "0.0h", target: "8.0h", icon: Moon, color: "text-purple-500", progress: 0 },
    { label: "Tasks", value: "0/0", target: "0 MITs left", icon: CheckCircle2, color: "text-blue-500", progress: 0 },
    { label: "Workout", value: "0min", target: "No workout yet", icon: Activity, color: "text-red-500", progress: 0 },
    { label: "Calories", value: "0/2000", target: "2000 cal remaining", icon: Apple, color: "text-orange-500", progress: 0 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-4xl font-bold">{greeting()}, Champion!</h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} • Let's optimize your day
          </p>
        </motion.div>

        {/* Today's Progress */}
        <Card className="p-8 bg-gradient-to-br from-card to-card/50 border-2">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">Today's Progress</h2>
              <p className="text-muted-foreground">0% of your daily goals complete</p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold text-muted-foreground">0%</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                    <span className="font-semibold">{stat.label}</span>
                    <span className="text-sm text-muted-foreground">{stat.value}</span>
                  </div>
                  <Progress value={stat.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground">{stat.target}</p>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={action.label}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card
                    className="p-6 cursor-pointer hover:shadow-lg transition-shadow relative"
                    onClick={() => navigate(action.route)}
                  >
                    {action.badge && (
                      <Badge className="absolute -top-2 -right-2 bg-red-500 text-white">
                        {action.badge}
                      </Badge>
                    )}
                    <div className="flex flex-col items-center gap-3 text-center">
                      <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="font-semibold text-sm">{action.label}</span>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Your Day */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Your Day</h2>
            <Button variant="link" className="text-primary">
              View Schedule →
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">6:00 AM</h3>
                  <p className="text-sm text-muted-foreground">Morning Routine</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-muted" />
                  Sleep logged
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-muted" />
                  Morning journal
                </li>
                <li className="flex items-center gap-2 text-primary font-semibold">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  Hydration
                </li>
              </ul>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">9:00 AM</h3>
                  <p className="text-sm text-muted-foreground">Deep Work</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-primary font-semibold">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  MITs: 0/0
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-muted" />
                  Focus mode
                </li>
              </ul>
            </Card>
          </div>
        </div>

        {/* Streaks */}
        <div>
          <h2 className="text-2xl font-bold mb-4">🔥 Your Streaks</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Moon, label: "Sleep streak", value: 0, target: "7+ hours" },
              { icon: BookOpen, label: "Journal streak", value: 0, target: "Daily entries" },
              { icon: Activity, label: "Workout streak", value: 0, target: "Active days" },
              { icon: Target, label: "Goal streak", value: 0, target: "Completed" },
            ].map((streak) => {
              const Icon = streak.icon;
              return (
                <Card key={streak.label} className="p-6">
                  <Icon className="w-8 h-8 mb-3 text-primary" />
                  <div className="text-4xl font-bold mb-1">{streak.value}</div>
                  <div className="text-sm font-semibold mb-1">{streak.label}</div>
                  <div className="text-xs text-muted-foreground">{streak.target}</div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
