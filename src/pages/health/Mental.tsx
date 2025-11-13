import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Heart, Smile, Frown, Meh } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const MOOD_OPTIONS = [
  { value: "very_bad", label: "Very Bad", icon: Frown, color: "text-red-500" },
  { value: "bad", label: "Bad", icon: Frown, color: "text-orange-500" },
  { value: "neutral", label: "Neutral", icon: Meh, color: "text-yellow-500" },
  { value: "good", label: "Good", icon: Smile, color: "text-green-500" },
  { value: "very_good", label: "Very Good", icon: Smile, color: "text-emerald-500" },
];

export default function Mental() {
  const navigate = useNavigate();
  const [mood, setMood] = useState<string>("neutral");
  const [energyLevel, setEnergyLevel] = useState([5]);
  const [stressLevel, setStressLevel] = useState([5]);
  const [notes, setNotes] = useState("");
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRecentLogs();
  }, []);

  const loadRecentLogs = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: logs, error } = await supabase
        .from('mental_health_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('logged_at', { ascending: false })
        .limit(7);

      if (error) throw error;
      setRecentLogs(logs || []);
    } catch (error) {
      console.error('Error loading mental health logs:', error);
    }
  };

  const logMood = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please log in to track mood');
        return;
      }

      const { error } = await supabase.from('mental_health_logs').insert({
        user_id: user.id,
        mood: mood,
        energy_level: energyLevel[0],
        stress_level: stressLevel[0],
        notes: notes || null,
        logged_at: new Date().toISOString()
      });

      if (error) throw error;

      toast.success('Mood logged');
      setNotes("");
      loadRecentLogs();
    } catch (error) {
      console.error('Error logging mood:', error);
      toast.error('Failed to log mood');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/health')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Mental Health</h1>
              <p className="text-muted-foreground">Track your mood and emotional wellbeing</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Log Your Mood</CardTitle>
            <CardDescription>How are you feeling today?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="mb-3 block">Mood</Label>
              <div className="grid grid-cols-5 gap-2">
                {MOOD_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  return (
                    <Button
                      key={option.value}
                      variant={mood === option.value ? "default" : "outline"}
                      className="h-24 flex-col gap-2"
                      onClick={() => setMood(option.value)}
                    >
                      <Icon className={`h-8 w-8 ${option.color}`} />
                      <span className="text-xs">{option.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            <div>
              <Label>Energy Level: {energyLevel[0]}/10</Label>
              <Slider
                value={energyLevel}
                onValueChange={setEnergyLevel}
                max={10}
                min={1}
                step={1}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Stress Level: {stressLevel[0]}/10</Label>
              <Slider
                value={stressLevel}
                onValueChange={setStressLevel}
                max={10}
                min={1}
                step={1}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Notes (Optional)</Label>
              <Textarea
                placeholder="Any thoughts or reflections..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </div>

            <Button onClick={logMood} disabled={loading} className="w-full">
              <Heart className="h-4 w-4 mr-2" />
              Log Mood
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Mood Logs</CardTitle>
          </CardHeader>
          <CardContent>
            {recentLogs.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No mood logs yet</p>
            ) : (
              <div className="space-y-3">
                {recentLogs.map((log) => {
                  const moodOption = MOOD_OPTIONS.find(m => m.value === log.mood);
                  const Icon = moodOption?.icon || Heart;
                  return (
                    <div key={log.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon className={`h-5 w-5 ${moodOption?.color}`} />
                          <span className="font-medium capitalize">{log.mood.replace('_', ' ')}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(log.logged_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Energy: {log.energy_level}/10 • Stress: {log.stress_level}/10
                      </div>
                      {log.notes && (
                        <p className="text-sm mt-2 text-muted-foreground">{log.notes}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
