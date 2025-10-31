// src/pages/health/fasting/WeightProgress.tsx
// Weight Progress Tracker with Charts

import { useState, useEffect } from 'react';
import { useSEO } from '@/hooks/useSEO';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  TrendingDown, TrendingUp, Plus, Calendar, Target,
  Award, Scale, Flame, ArrowUp, ArrowDown
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WeightEntry {
  id: string;
  date: Date;
  weight: number;
  unit: 'kg' | 'lbs';
  note?: string;
}

export default function WeightProgress() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useSEO({
    title: 'Weight Progress Tracker | HabeshaCommunity Health',
    description: 'Track your weight loss progress with beautiful charts and goal tracking. Monitor your fasting results over time.'
  });

  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>(() => {
    const saved = localStorage.getItem('weight_entries');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((entry: any) => ({
        ...entry,
        date: new Date(entry.date)
      }));
    }
    // Sample data for demo
    return [
      { id: '1', date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), weight: 180, unit: 'lbs' as const },
      { id: '2', date: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000), weight: 178, unit: 'lbs' as const },
      { id: '3', date: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000), weight: 176, unit: 'lbs' as const },
      { id: '4', date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000), weight: 174, unit: 'lbs' as const },
      { id: '5', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), weight: 172, unit: 'lbs' as const }
    ];
  });

  const [goalWeight, setGoalWeight] = useState(() => {
    return Number(localStorage.getItem('goal_weight')) || 160;
  });

  const [showAddWeight, setShowAddWeight] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    localStorage.setItem('weight_entries', JSON.stringify(weightEntries));
  }, [weightEntries]);

  useEffect(() => {
    localStorage.setItem('goal_weight', goalWeight.toString());
  }, [goalWeight]);

  function addWeightEntry() {
    if (!newWeight || isNaN(Number(newWeight))) {
      toast({
        title: 'Invalid weight',
        description: 'Please enter a valid number',
        variant: 'destructive'
      });
      return;
    }

    const entry: WeightEntry = {
      id: Date.now().toString(),
      date: new Date(),
      weight: Number(newWeight),
      unit: 'lbs',
      note: newNote || undefined
    };

    setWeightEntries([entry, ...weightEntries]);
    setNewWeight('');
    setNewNote('');
    setShowAddWeight(false);

    toast({
      title: 'Weight logged! ✅',
      description: `${newWeight} lbs recorded for today`
    });
  }

  // Calculate statistics
  const currentWeight = weightEntries[0]?.weight || 0;
  const startWeight = weightEntries[weightEntries.length - 1]?.weight || currentWeight;
  const weightChange = currentWeight - startWeight;
  const goalProgress = startWeight - currentWeight;
  const goalTotal = startWeight - goalWeight;
  const goalPercentage = goalTotal > 0 ? (goalProgress / goalTotal) * 100 : 0;
  const daysTracking = weightEntries.length > 1 
    ? Math.floor((weightEntries[0].date.getTime() - weightEntries[weightEntries.length - 1].date.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  // Calculate average weekly loss
  const weeklyLoss = daysTracking > 0 ? (Math.abs(weightChange) / daysTracking) * 7 : 0;

  // Find highest weight for chart scaling
  const maxWeight = Math.max(...weightEntries.map(e => e.weight), goalWeight) + 5;
  const minWeight = Math.min(...weightEntries.map(e => e.weight), goalWeight) - 5;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-green-50/20 dark:via-green-950/10 to-background">
      {/* Header */}
      <section className="border-b bg-background/95 backdrop-blur-lg sticky top-14 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={() => navigate('/health/fasting')}>
                ← Back
              </Button>
              <h1 className="font-bold text-xl">Weight Progress</h1>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowAddWeight(true)}
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8 max-w-2xl space-y-6">
          {/* Current Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30">
              <CardContent className="p-6 text-center">
                <Scale className="w-10 h-10 mx-auto mb-3 text-blue-600" />
                <div className="text-4xl font-bold mb-1">{currentWeight}</div>
                <div className="text-sm text-muted-foreground">Current Weight (lbs)</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
              <CardContent className="p-6 text-center">
                <Target className="w-10 h-10 mx-auto mb-3 text-purple-600" />
                <div className="text-4xl font-bold mb-1">{goalWeight}</div>
                <div className="text-sm text-muted-foreground">Goal Weight (lbs)</div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Your Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Goal Progress</span>
                  <span className="text-sm font-semibold">
                    {Math.abs(goalProgress).toFixed(1)} / {Math.abs(goalTotal).toFixed(1)} lbs
                  </span>
                </div>
                <div className="relative h-4 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all"
                    style={{ width: `${Math.min(goalPercentage, 100)}%` }}
                  />
                </div>
                <div className="text-center mt-2">
                  <span className="text-2xl font-bold text-green-600">
                    {Math.round(goalPercentage)}%
                  </span>
                  <span className="text-sm text-muted-foreground ml-2">Complete</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    {weightChange < 0 ? (
                      <TrendingDown className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingUp className="w-4 h-4 text-red-600" />
                    )}
                    <span className={`text-2xl font-bold ${
                      weightChange < 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {Math.abs(weightChange).toFixed(1)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">Total Change (lbs)</p>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {weeklyLoss.toFixed(1)}
                  </div>
                  <p className="text-xs text-muted-foreground">Avg Weekly Loss</p>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {daysTracking}
                  </div>
                  <p className="text-xs text-muted-foreground">Days Tracking</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weight Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Weight Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative h-64">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-muted-foreground">
                  <span>{maxWeight}</span>
                  <span>{Math.round((maxWeight + minWeight) / 2)}</span>
                  <span>{minWeight}</span>
                </div>

                {/* Chart area */}
                <div className="ml-12 h-full relative">
                  {/* Goal line */}
                  <div 
                    className="absolute left-0 right-0 border-t-2 border-dashed border-purple-400"
                    style={{
                      bottom: `${((goalWeight - minWeight) / (maxWeight - minWeight)) * 100}%`
                    }}
                  >
                    <span className="absolute -top-6 right-0 text-xs text-purple-600 font-semibold">
                      Goal: {goalWeight} lbs
                    </span>
                  </div>

                  {/* Weight line */}
                  <svg className="w-full h-full">
                    <polyline
                      points={weightEntries.slice().reverse().map((entry, idx) => {
                        const x = (idx / (weightEntries.length - 1)) * 100;
                        const y = 100 - ((entry.weight - minWeight) / (maxWeight - minWeight)) * 100;
                        return `${x}%,${y}%`;
                      }).join(' ')}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      className="text-green-500"
                    />
                    {/* Data points */}
                    {weightEntries.slice().reverse().map((entry, idx) => {
                      const x = (idx / (weightEntries.length - 1)) * 100;
                      const y = 100 - ((entry.weight - minWeight) / (maxWeight - minWeight)) * 100;
                      return (
                        <circle
                          key={entry.id}
                          cx={`${x}%`}
                          cy={`${y}%`}
                          r="5"
                          fill="currentColor"
                          className="text-green-600"
                        />
                      );
                    })}
                  </svg>

                  {/* X-axis dates */}
                  <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-muted-foreground">
                    <span>{weightEntries[weightEntries.length - 1]?.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    <span>{weightEntries[0]?.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Entries */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Recent Entries
                </span>
                <Button 
                  size="sm"
                  onClick={() => setShowAddWeight(true)}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {weightEntries.slice(0, 5).map((entry, idx) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg"
                  >
                    <div>
                      <div className="font-semibold">{entry.weight} lbs</div>
                      <div className="text-xs text-muted-foreground">
                        {entry.date.toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      {entry.note && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {entry.note}
                        </div>
                      )}
                    </div>
                    {idx > 0 && (
                      <Badge variant="secondary">
                        {entry.weight - weightEntries[idx - 1].weight > 0 ? (
                          <>
                            <ArrowUp className="w-3 h-3 mr-1 text-red-600" />
                            +{(entry.weight - weightEntries[idx - 1].weight).toFixed(1)}
                          </>
                        ) : (
                          <>
                            <ArrowDown className="w-3 h-3 mr-1 text-green-600" />
                            {(entry.weight - weightEntries[idx - 1].weight).toFixed(1)}
                          </>
                        )}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Add Weight Modal */}
          {showAddWeight && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <Card className="max-w-md w-full">
                <CardHeader>
                  <CardTitle>Add Weight Entry</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="weight">Weight (lbs)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      placeholder="172.5"
                      value={newWeight}
                      onChange={(e) => setNewWeight(e.target.value)}
                      className="text-lg"
                    />
                  </div>

                  <div>
                    <Label htmlFor="note">Note (optional)</Label>
                    <Input
                      id="note"
                      placeholder="Feeling great!"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      className="flex-1"
                      onClick={addWeightEntry}
                    >
                      Add Entry
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setShowAddWeight(false);
                        setNewWeight('');
                        setNewNote('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    );
  }
