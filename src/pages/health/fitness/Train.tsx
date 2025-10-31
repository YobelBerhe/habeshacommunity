import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dumbbell, ArrowLeft } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

export default function Train() {
  useSEO({
    title: "Workout Training | DayAI",
    description: "Track your fitness workouts"
  });

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/health")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-4xl font-bold">Train</h1>
            <p className="text-muted-foreground">Log your workouts and track progress</p>
          </div>
        </div>

        <Card className="p-8 text-center">
          <Dumbbell className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Start Your Workout</h3>
          <p className="text-muted-foreground mb-6">
            Choose a workout plan or create your own
          </p>
          <Button size="lg">Start Workout</Button>
        </Card>
      </div>
    </div>
  );
}
