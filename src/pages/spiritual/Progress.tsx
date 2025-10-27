import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Construction } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";

const Progress = () => {
  useSEO({ 
    title: "My Progress - HabeshaCommunity", 
    description: "Track your spiritual reading journey" 
  });
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto py-12">
        <Card>
          <CardHeader className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <TrendingUp className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl">My Progress</CardTitle>
            <CardDescription className="text-lg">
              Database structure is ready. UI components coming soon.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Construction className="w-5 h-5" />
              <span>Under Development</span>
            </div>
            
            <div className="bg-muted/50 p-6 rounded-lg text-left">
              <h4 className="font-semibold mb-3">What's Coming:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Current reading streak counter</li>
                <li>✓ Longest streak and total days read</li>
                <li>✓ Active plans with percentage completion</li>
                <li>✓ Completed plan history</li>
                <li>✓ Favorite verses and bookmarks</li>
                <li>✓ Reading statistics and insights</li>
              </ul>
            </div>

            <Button onClick={() => navigate("/spiritual")} variant="outline">
              Back to Spiritual Home
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Progress;
