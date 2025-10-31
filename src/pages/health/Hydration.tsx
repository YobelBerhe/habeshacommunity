import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Droplets, Plus, ArrowLeft, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useSEO } from "@/hooks/useSEO";

export default function Hydration() {
  useSEO({
    title: "Hydration Tracker | DayAI",
    description: "Track your daily water intake and stay hydrated"
  });

  const navigate = useNavigate();
  const { toast } = useToast();
  const [waterIntake, setWaterIntake] = useState(0);
  const dailyGoal = 64; // 64 oz = 8 glasses

  const addWater = (amount: number) => {
    setWaterIntake(prev => Math.min(prev + amount, dailyGoal * 1.5));
    toast({
      title: "Water logged!",
      description: `Added ${amount}oz to your daily intake`,
    });
  };

  const progress = (waterIntake / dailyGoal) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-background dark:from-background dark:via-cyan-950/20 dark:to-background">
      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/health")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-4xl font-bold">Hydration Tracker</h1>
            <p className="text-muted-foreground">Stay hydrated throughout your day</p>
          </div>
        </div>

        {/* Water Animation */}
        <Card className="p-8 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-2 border-cyan-200 dark:border-cyan-800">
          <div className="flex flex-col items-center">
            <motion.div
              className="relative w-48 h-48 rounded-full border-8 border-cyan-500/20 flex items-center justify-center overflow-hidden"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(6, 182, 212, 0.3)",
                  "0 0 40px rgba(6, 182, 212, 0.5)",
                  "0 0 20px rgba(6, 182, 212, 0.3)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <AnimatePresence>
                <motion.div
                  className="absolute bottom-0 w-full bg-gradient-to-t from-cyan-500 to-blue-400"
                  initial={{ height: 0 }}
                  animate={{ height: `${progress}%` }}
                  transition={{ type: "spring", stiffness: 50 }}
                />
              </AnimatePresence>
              <div className="relative z-10 text-center">
                <Droplets className="w-16 h-16 text-white mb-2 mx-auto" />
                <div className="text-3xl font-bold text-white">
                  {Math.round(progress)}%
                </div>
              </div>
            </motion.div>

            <div className="mt-8 text-center space-y-2">
              <div className="text-5xl font-bold">{waterIntake}oz</div>
              <div className="text-muted-foreground">of {dailyGoal}oz daily goal</div>
              <Progress value={progress} className="h-3 w-64 mt-4" />
            </div>
          </div>
        </Card>

        {/* Quick Add */}
        <div>
          <h2 className="text-xl font-bold mb-4">Quick Add</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[8, 12, 16, 20].map((amount) => (
              <motion.div key={amount} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Card
                  className="p-6 cursor-pointer hover:bg-cyan-50 dark:hover:bg-cyan-950/20 transition-colors"
                  onClick={() => addWater(amount)}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Droplets className="w-8 h-8 text-cyan-500" />
                    <span className="text-2xl font-bold">{amount}oz</span>
                    <span className="text-sm text-muted-foreground">
                      {amount === 8 ? "Glass" : amount === 12 ? "Bottle" : amount === 16 ? "Large" : "XL"}
                    </span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Droplets className="w-5 h-5 text-cyan-500" />
              <span className="font-semibold">Today's Progress</span>
            </div>
            <div className="text-3xl font-bold">{waterIntake}oz</div>
            <p className="text-sm text-muted-foreground">
              {waterIntake >= dailyGoal ? "Goal reached! 🎉" : `${dailyGoal - waterIntake}oz to go`}
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="font-semibold">Weekly Average</span>
            </div>
            <div className="text-3xl font-bold">0oz</div>
            <p className="text-sm text-muted-foreground">Start tracking to see trends</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Plus className="w-5 h-5 text-blue-500" />
              <span className="font-semibold">Streak</span>
            </div>
            <div className="text-3xl font-bold">0 days</div>
            <p className="text-sm text-muted-foreground">Keep it up!</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
