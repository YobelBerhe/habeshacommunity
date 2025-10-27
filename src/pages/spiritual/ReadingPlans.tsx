import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Construction } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";

const ReadingPlans = () => {
  useSEO({ 
    title: "Reading Plans - HabeshaCommunity", 
    description: "Join structured Bible reading plans" 
  });
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto py-12">
        <Card>
          <CardHeader className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Calendar className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl">Reading Plans</CardTitle>
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
                <li>✓ Curated reading plans (7-day, 30-day, 1-year)</li>
                <li>✓ Topical and devotional plans</li>
                <li>✓ Daily reading assignments</li>
                <li>✓ Progress tracking for each plan</li>
                <li>✓ Mix of scripture, devotionals, and videos</li>
                <li>✓ Subscribe to multiple plans at once</li>
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

export default ReadingPlans;
