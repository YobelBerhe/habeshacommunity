import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Activity, ArrowLeft } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

export default function WorkoutInProgress() {
  useSEO({
    title: "Workout In Progress | DayAI",
    description: "Your active workout session"
  });

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/health/fitness/train")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-4xl font-bold">Workout In Progress</h1>
            <p className="text-muted-foreground">Keep pushing!</p>
          </div>
        </div>

        <Card className="p-8 text-center">
          <Activity className="w-16 h-16 text-green-500 mx-auto mb-4 animate-pulse" />
          <h3 className="text-xl font-bold mb-2">Workout Active</h3>
          <p className="text-muted-foreground mb-6">
            Track your sets and reps
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" variant="outline">Pause</Button>
            <Button size="lg">Complete Workout</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
