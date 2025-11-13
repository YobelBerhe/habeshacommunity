import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Moon, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Sleep() {
  const navigate = useNavigate();
  const [sleepStart, setSleepStart] = useState("");
  const [sleepEnd, setSleepEnd] = useState("");
  const [quality, setQuality] = useState<string>("good");
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [avgSleep, setAvgSleep] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRecentLogs();
  }, []);

  const loadRecentLogs = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: logs, error } = await supabase
        .from('sleep_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('sleep_start', { ascending: false })
        .limit(7);

      if (error) throw error;

      setRecentLogs(logs || []);

      const avg = logs?.reduce((sum, log) => sum + (Number(log.duration_hours) || 0), 0) / (logs?.length || 1);
      setAvgSleep(avg || 0);
    } catch (error) {
      console.error('Error loading sleep logs:', error);
    }
  };

  const logSleep = async () => {
    if (!sleepStart || !sleepEnd) {
      toast.error('Please fill in sleep times');
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please log in to track sleep');
        return;
      }

      const start = new Date(sleepStart);
      const end = new Date(sleepEnd);
      const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

      if (durationHours <= 0) {
        toast.error('End time must be after start time');
        return;
      }

      const { error } = await supabase.from('sleep_logs').insert({
        user_id: user.id,
        sleep_start: start.toISOString(),
        sleep_end: end.toISOString(),
        duration_hours: durationHours,
        quality: quality
      });

      if (error) throw error;

      toast.success('Sleep logged');
      setSleepStart("");
      setSleepEnd("");
      loadRecentLogs();
    } catch (error) {
      console.error('Error logging sleep:', error);
      toast.error('Failed to log sleep');
    } finally {
      setLoading(false);
    }
  };

  const deleteLog = async (logId: string) => {
    try {
      const { error } = await supabase
        .from('sleep_logs')
        .delete()
        .eq('id', logId);

      if (error) throw error;

      toast.success('Log deleted');
      loadRecentLogs();
    } catch (error) {
      console.error('Error deleting log:', error);
      toast.error('Failed to delete log');
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
              <h1 className="text-3xl font-bold">Sleep Tracker</h1>
              <p className="text-muted-foreground">Monitor your sleep patterns</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Sleep Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">7-Day Average</p>
                <p className="text-3xl font-bold">{avgSleep.toFixed(1)} hrs</p>
              </div>
              <Moon className="h-16 w-16 text-indigo-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Log Sleep</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Sleep Start</Label>
              <Input
                type="datetime-local"
                value={sleepStart}
                onChange={(e) => setSleepStart(e.target.value)}
              />
            </div>

            <div>
              <Label>Sleep End</Label>
              <Input
                type="datetime-local"
                value={sleepEnd}
                onChange={(e) => setSleepEnd(e.target.value)}
              />
            </div>

            <div>
              <Label>Sleep Quality</Label>
              <Select value={quality} onValueChange={setQuality}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="poor">Poor</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="excellent">Excellent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={logSleep} disabled={loading} className="w-full">
              Log Sleep
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Sleep</CardTitle>
          </CardHeader>
          <CardContent>
            {recentLogs.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No sleep logs yet</p>
            ) : (
              <div className="space-y-3">
                {recentLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{Number(log.duration_hours).toFixed(1)} hours</p>
                      <p className="text-sm text-muted-foreground capitalize">Quality: {log.quality}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-sm text-muted-foreground">
                        {new Date(log.sleep_start).toLocaleDateString()}
                      </p>
                      <Button variant="ghost" size="icon" onClick={() => deleteLog(log.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
