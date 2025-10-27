import { useEffect, useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import { Card } from "@/components/ui/card";
import { getUserHighlights } from "@/lib/api/spiritual/bible";
import type { UserVerseHighlight } from "@/types/spiritual";

const HighlightsPage = () => {
  useSEO({ title: "My Highlights - HabeshaCommunity", description: "Your highlighted verses" });
  const [highlights, setHighlights] = useState<UserVerseHighlight[]>([]);

  useEffect(() => {
    (async () => {
      const data = await getUserHighlights();
      setHighlights(data);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
        <h1 className="text-3xl font-bold">My Highlights</h1>
        {highlights.length === 0 ? (
          <Card className="p-6">No highlights yet.</Card>
        ) : (
          <div className="space-y-3">
            {highlights.map((h) => (
              <Card key={h.id} className="p-4">
                <div className="text-sm text-muted-foreground">{h.verse?.usfm}</div>
                <div>{h.verse?.text}</div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HighlightsPage;
