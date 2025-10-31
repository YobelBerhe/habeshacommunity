import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChefHat, ArrowLeft } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

export default function Recipes() {
  useSEO({
    title: "Recipes | DayAI",
    description: "Discover healthy recipes"
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
            <h1 className="text-4xl font-bold">Recipes</h1>
            <p className="text-muted-foreground">Healthy meal ideas and recipes</p>
          </div>
        </div>

        <Card className="p-8 text-center">
          <ChefHat className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Recipe Library Coming Soon</h3>
          <p className="text-muted-foreground">
            Discover nutritious recipes tailored to your health goals
          </p>
        </Card>
      </div>
    </div>
  );
}
