import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Construction } from "lucide-react";

export default function WorkoutInProgress() {
  return (
    <div className="min-h-screen bg-background p-6">
      <Card className="p-8 text-center">
        <Construction className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-2xl font-bold mb-2">Workout In Progress</h1>
        <p className="text-muted-foreground">Coming Soon</p>
      </Card>
    </div>
  );
}
