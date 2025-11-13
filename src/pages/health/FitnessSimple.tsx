import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Trash2, Dumbbell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const TRADITIONAL_EXERCISES = [
  { name: "Eskista Dance", type: "dance", calories: 300, duration: 30 },
  { name: "Gurage Dance", type: "dance", calories: 280, duration: 30 },
  { name: "Tigrigna Dance", type: "dance", calories: 290, duration: 30 },
  { name: "Running", type: "cardio", calories: 400, duration: 30 },
  { name: "Walking", type: "cardio", calories: 150, duration: 30 },
  { name: "Cycling", type: "cardio", calories: 350, duration: 30 },
  { name: "Push-ups", type: "strength", calories: 100, duration: 15 },
  { name: "Squats", type: "strength", calories: 120, duration: 15 },
  { name: "Yoga", type: "flexibility", calories: 150, duration: 30 },
];

export default function FitnessSimple() {
  const navigate = useNavigate();
  const [exerciseType, setExerciseType] = useState<string>("cardio");
  const [exerciseName, setExerciseName] = useState("");
  const [duration, setDuration] = useState("");
  const [intensity, setIntensity] = useState<string>("moderate");
  const [todayLogs, setTodayLogs] = useState<any[]>([]);
  const [todayStats, setTodayStats] = useState({
    totalMinutes: 0,
    totalCalories: 0,
    goal: 30
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTodayLogs();
  }, []);

  const loadTodayLogs = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date().toISOString().split('T')[0];

      const { data: logs, error } = await supabase
        .from('exercise_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('logged_at', `${today}T00:00:00`)
        .lte('logged_at', `${today}T23:59:59`)
        .order('logged_at', { ascending: false });

      if (error) throw error;

      setTodayLogs(logs || []);

      const totals = logs?.reduce(
        (acc, log) => ({
          totalMinutes: acc.totalMinutes + (log.duration_minutes || 0),
          totalCalories: acc.totalCalories + (log.calories_burned || 0),
        }),
        { totalMinutes: 0, totalCalories: 0 }
      );

      setTodayStats({
        ...totals,
        goal: 30
      });
    } catch (error) {
      console.error('Error loading exercise logs:', error);
    }
  };

  const logExercise = async () => {
    if (!exerciseName || !duration) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please log in to track workouts');
        return;
      }

      const durationNum = parseInt(duration);
      const estimatedCalories = Math.round(durationNum * (intensity === 'high' ? 10 : intensity === 'moderate' ? 7 : 4));

      const isTraditional = TRADITIONAL_EXERCISES.some(ex => 
        ex.name.toLowerCase() === exerciseName.toLowerCase()
      );

      const { error } = await supabase.from('exercise_logs').insert({
        user_id: user.id,
        exercise_name: exerciseName,
        exercise_type: exerciseType,
        duration_minutes: durationNum,
        intensity: intensity,
        calories_burned: estimatedCalories,
        is_traditional_exercise: isTraditional,
        logged_at: new Date().toISOString()
      });

      if (error) throw error;

      toast.success(`Logged ${exerciseName}`);
      setExerciseName("");
      setDuration("");
      loadTodayLogs();
    } catch (error) {
      console.error('Error logging exercise:', error);
      toast.error('Failed to log exercise');
    } finally {
      setLoading(false);
    }
  };

  const deleteLog = async (logId: string) => {
    try {
      const { error } = await supabase
        .from('exercise_logs')
        .delete()
        .eq('id', logId);

      if (error) throw error;

      toast.success('Log deleted');
      loadTodayLogs();
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
              <h1 className="text-3xl font-bold">Fitness Tracker</h1>
              <p className="text-muted-foreground">Log your workouts and activities</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Today's Activity</CardTitle>
            <CardDescription>Track your daily exercise</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Exercise Time</span>
                  <span className="text-2xl font-bold">
                    {todayStats.totalMinutes} / {todayStats.goal} min
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all"
                    style={{ width: `${Math.min((todayStats.totalMinutes / todayStats.goal) * 100, 100)}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Calories Burned</p>
                  <p className="text-2xl font-bold">{todayStats.totalCalories}</p>
                </div>
                <Dumbbell className="h-12 w-12 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Log Exercise</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Exercise Type</Label>
              <Select value={exerciseType} onValueChange={setExerciseType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cardio">Cardio</SelectItem>
                  <SelectItem value="strength">Strength Training</SelectItem>
                  <SelectItem value="flexibility">Flexibility</SelectItem>
                  <SelectItem value="dance">Dance</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Exercise Name</Label>
              <Input
                placeholder="e.g., Eskista Dance, Running, Push-ups"
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Try: {TRADITIONAL_EXERCISES.slice(0, 3).map(e => e.name).join(", ")}
              </p>
            </div>

            <div>
              <Label>Duration (minutes)</Label>
              <Input
                type="number"
                placeholder="30"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>

            <div>
              <Label>Intensity</Label>
              <Select value={intensity} onValueChange={setIntensity}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="very_high">Very High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={logExercise} disabled={loading} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Log Exercise
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today's Workouts</CardTitle>
          </CardHeader>
          <CardContent>
            {todayLogs.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No workouts logged today</p>
            ) : (
              <div className="space-y-3">
                {todayLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{log.exercise_name}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {log.exercise_type} • {log.intensity} intensity
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold">{log.duration_minutes} min</p>
                        <p className="text-xs text-muted-foreground">
                          {log.calories_burned} cal
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteLog(log.id)}
                      >
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
