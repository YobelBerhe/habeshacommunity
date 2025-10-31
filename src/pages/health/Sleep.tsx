import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Moon, ArrowLeft, TrendingUp, Clock } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

export default function SleepTracker() {
  useSEO({
    title: "Sleep Tracker | DayAI",
    description: "Track and improve your sleep quality"
  });

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-background dark:from-background dark:via-indigo-950/20 dark:to-background">
      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/health")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-4xl font-bold">Sleep Tracker</h1>
            <p className="text-muted-foreground">Monitor your sleep patterns</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Moon className="w-5 h-5 text-indigo-500" />
              <span className="font-semibold">Last Night</span>
            </div>
            <div className="text-3xl font-bold">0h</div>
            <p className="text-sm text-muted-foreground">No data yet</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="font-semibold">Weekly Average</span>
            </div>
            <div className="text-3xl font-bold">0h</div>
            <p className="text-sm text-muted-foreground">Start tracking</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <span className="font-semibold">Goal</span>
            </div>
            <div className="text-3xl font-bold">8h</div>
            <p className="text-sm text-muted-foreground">Recommended</p>
          </Card>
        </div>

        <Card className="p-8 text-center">
          <Moon className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Start Tracking Your Sleep</h3>
          <p className="text-muted-foreground mb-6">
            Log your sleep to see insights and improve your rest quality
          </p>
          <Button size="lg" className="mx-auto">
            Log Sleep
          </Button>
        </Card>
      </div>
    </div>
  );
}
