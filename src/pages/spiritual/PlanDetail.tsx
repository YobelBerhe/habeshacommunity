import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getReadingPlan, getPlanDays } from "@/lib/api/spiritual/reading-plans";
import type { ReadingPlan, ReadingPlanDay } from "@/types/spiritual";

const PlanDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<ReadingPlan | null>(null);
  const [days, setDays] = useState<ReadingPlanDay[]>([]);
  const [loading, setLoading] = useState(true);

  useSEO({ title: `${plan?.title || "Plan"} - Reading Plan`, description: plan?.description || "Reading plan details" });

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        if (!slug) return;
        const p = await getReadingPlan(slug);
        if (!active) return;
        setPlan(p);
        if (p) {
          const d = await getPlanDays(p.id);
          if (!active) return;
          setDays(d);
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!plan) return <div className="min-h-screen flex items-center justify-center"><Card className="p-6">Plan not found.</Card></div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{plan.title}</h1>
          {plan.description && <p className="text-muted-foreground">{plan.description}</p>}
        </div>

        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Plan Days</h2>
          {days.length === 0 ? (
            <p className="text-muted-foreground">No days available yet.</p>
          ) : (
            <div className="space-y-2">
              {days.map((d) => (
                <div key={d.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/40">
                  <div>
                    <div className="font-semibold">Day {d.day_number}{d.title ? `: ${d.title}` : ""}</div>
                    {d.segments && d.segments.length > 0 && (
                      <div className="text-sm text-muted-foreground">{d.segments.length} segment(s)</div>
                    )}
                  </div>
                  <Button variant="outline" onClick={() => navigate("/spiritual/reader")}>Read</Button>
                </div>
              ))}
            </div>
          )}
        </Card>

        <div className="text-center">
          <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
        </div>
      </div>
    </div>
  );
};

export default PlanDetail;
