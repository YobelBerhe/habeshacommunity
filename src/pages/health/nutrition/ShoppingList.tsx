import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

export default function ShoppingList() {
  useSEO({
    title: "Shopping List | DayAI",
    description: "Manage your grocery shopping list"
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
            <h1 className="text-4xl font-bold">Shopping List</h1>
            <p className="text-muted-foreground">Plan your healthy grocery shopping</p>
          </div>
        </div>

        <Card className="p-8 text-center">
          <ShoppingCart className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Create Your Shopping List</h3>
          <p className="text-muted-foreground mb-6">
            Build a list of healthy ingredients for your meal plan
          </p>
          <Button size="lg">Add Item</Button>
        </Card>
      </div>
    </div>
  );
}
