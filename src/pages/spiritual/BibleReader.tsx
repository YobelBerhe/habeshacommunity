import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Construction } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";

const BibleReader = () => {
  useSEO({ 
    title: "Bible Reader - HabeshaCommunity", 
    description: "Read the Holy Bible in multiple translations" 
  });
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto py-12">
        <Card>
          <CardHeader className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl">Bible Reader</CardTitle>
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
                <li>✓ Multiple translations (KJV, NIV, ESV, Amharic, Tigrinya)</li>
                <li>✓ Search verses by keyword or reference</li>
                <li>✓ Verse highlighting with colors</li>
                <li>✓ Bookmarks and personal notes</li>
                <li>✓ Audio narration (where available)</li>
                <li>✓ Reading preferences (font size, theme)</li>
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

export default BibleReader;
