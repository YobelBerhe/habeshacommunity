import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Utensils, ArrowLeft } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

export default function FoodLog() {
  useSEO({
    title: "Food Log | DayAI",
    description: "Track your daily nutrition and meals"
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
            <h1 className="text-4xl font-bold">Food Log</h1>
            <p className="text-muted-foreground">Track your meals and nutrition</p>
          </div>
        </div>

        <Card className="p-8 text-center">
          <Utensils className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Start Logging Your Meals</h3>
          <p className="text-muted-foreground mb-6">
            Track what you eat to understand your nutrition better
          </p>
          <Button size="lg">Add Meal</Button>
        </Card>
      </div>
    </div>
  );
}
