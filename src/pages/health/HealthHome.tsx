import { useNavigate } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Apple, Moon, Droplets, Brain, Leaf, TrendingUp } from "lucide-react";

const categories = [
  { id: "fitness", name: "Fitness", icon: Dumbbell, route: "/coming-soon" },
  { id: "nutrition", name: "Nutrition", icon: Apple, route: "/coming-soon" },
  { id: "sleep", name: "Sleep", icon: Moon, route: "/coming-soon" },
  { id: "hydration", name: "Hydration", icon: Droplets, route: "/coming-soon" },
  { id: "mental_health", name: "Mental Health", icon: Brain, route: "/coming-soon" },
  { id: "wellness", name: "Wellness", icon: Leaf, route: "/coming-soon" },
];

export default function HealthHome() {
  useSEO({
    title: "Health & Wellness - HabeshaCommunity",
    description: "Track fitness, nutrition, sleep and more — adapted for Habesha culture",
  });
  const navigate = useNavigate();

  return (
    <main>
      <section className="border-b bg-background/95">
        <div className="container mx-auto px-4 py-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Health & Wellness</h1>
            <p className="text-muted-foreground">Your journey to a healthier you</p>
          </div>
          <Button onClick={() => navigate("/coming-soon")}>
            <TrendingUp className="w-5 h-5 mr-2" /> View Dashboard
          </Button>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6">Explore Health Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((c) => {
            const Icon = c.icon;
            return (
              <Card key={c.id} onClick={() => navigate(c.route)} className="cursor-pointer hover:shadow-lg transition-all">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold">{c.name}</h3>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <Badge className="mb-2">New</Badge>
              <h3 className="text-xl font-semibold">Find a Health Coach</h3>
              <p className="text-sm text-muted-foreground">Habesha experts in fitness, nutrition, sleep and wellness</p>
            </div>
            <Button onClick={() => navigate("/mentor")}>Browse Coaches</Button>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
