import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Construction, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Sleep() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="outline" 
          className="mb-6"
          onClick={() => navigate('/health')}
        >
          ← Back to Health
        </Button>
        
        <Card className="p-8 text-center">
          <Moon className="h-16 w-16 mx-auto mb-4 text-purple-500" />
          <h1 className="text-2xl font-bold mb-2">Sleep Tracking</h1>
          <p className="text-muted-foreground mb-4">Track your sleep patterns and quality</p>
          <Construction className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Database tables are being set up. Available soon.</p>
        </Card>
      </div>
    </div>
  );
}
