// src/pages/health/fasting/FastingTrackerLive.tsx
// Live Fasting Tracker - Industry Standard Quality
// Matches apps like "Fasting - Intermittent Fasting" (50M+ downloads)

import { useState, useEffect } from 'react';
import { useSEO } from '@/hooks/useSEO';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, Pause, RotateCcw, TrendingUp, Flame, Share2,
  Clock, Target, Award, Activity, Droplets, Heart,
  Zap, Brain, Shield, AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BodyStage {
  name: string;
  hours: number;
  icon: string;
  color: string;
  description: string;
  benefits: string[];
}

interface FastingSession {
  plan: string;
  startTime: Date;
  endTime: Date;
  isActive: boolean;
  currentHours: number;
  totalHours: number;
}

export default function FastingTrackerLive() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useSEO({
    title: 'Live Fasting Tracker | HabeshaCommunity Health',
    description: 'Track your fast in real-time with countdown timer, body status updates, and progress tracking. Start your fasting journey today.'
  });
  
  // Get selected plan from localStorage
  const [selectedPlan] = useState(() => {
    return localStorage.getItem('selected_fasting_plan') || '16-8';
  });

  const [fastingSession, setFastingSession] = useState<FastingSession | null>(() => {
    const saved = localStorage.getItem('current_fasting_session');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        startTime: new Date(parsed.startTime),
        endTime: new Date(parsed.endTime)
      };
    }
    return null;
  });

  const [currentTime, setCurrentTime] = useState(new Date());
  const [elapsedHours, setElapsedHours] = useState(0);
  const [remainingHours, setRemainingHours] = useState(0);

  // Body stages during fasting
  const bodyStages: BodyStage[] = [
    {
      name: 'Anabolic Phase',
      hours: 0,
      icon: '🍽️',
      color: 'text-blue-600',
      description: 'Digestion and nutrient absorption',
      benefits: ['Energy from food', 'Insulin elevated', 'Storage mode']
    },
    {
      name: 'Blood Sugar Drop',
      hours: 4,
      icon: '📉',
      color: 'text-cyan-600',
      description: 'Blood sugar starts to normalize',
      benefits: ['Insulin decreasing', 'Glycogen usage begins', 'Fat mobilization starting']
    },
    {
      name: 'Fat Burning Begins',
      hours: 8,
      icon: '🔥',
      color: 'text-orange-600',
      description: 'Body switches to fat for fuel',
      benefits: ['Ketone production starts', 'Fat oxidation increases', 'Energy from stored fat']
    },
    {
      name: 'Ketosis State',
      hours: 12,
      icon: '⚡',
      color: 'text-yellow-600',
      description: 'Deep fat burning and mental clarity',
      benefits: ['Ketones elevated', 'Enhanced focus', 'Appetite suppression', 'Fat burning optimized']
    },
    {
      name: 'Gluconeogenesis',
      hours: 16,
      icon: '🧬',
      color: 'text-purple-600',
      description: 'Body creates glucose from non-carb sources',
      benefits: ['Metabolic flexibility', 'Muscle preservation', 'Sustained energy']
    },
    {
      name: 'Autophagy Peak',
      hours: 18,
      icon: '🔄',
      color: 'text-green-600',
      description: 'Cellular cleanup and regeneration',
      benefits: ['Cell repair maximized', 'Anti-aging effects', 'Immune boost', 'Brain health']
    },
    {
      name: 'Growth Hormone Surge',
      hours: 20,
      icon: '💪',
      color: 'text-red-600',
      description: 'HGH production increases dramatically',
      benefits: ['Muscle preservation', 'Fat burning enhanced', 'Anti-aging', 'Recovery boost']
    }
  ];

  // Update timer every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Calculate elapsed and remaining time
  useEffect(() => {
    if (fastingSession && fastingSession.isActive) {
      const elapsed = (currentTime.getTime() - fastingSession.startTime.getTime()) / (1000 * 60 * 60);
      const remaining = (fastingSession.endTime.getTime() - currentTime.getTime()) / (1000 * 60 * 60);
      
      setElapsedHours(Math.max(0, elapsed));
      setRemainingHours(Math.max(0, remaining));

      // Save to localStorage
      localStorage.setItem('current_fasting_session', JSON.stringify(fastingSession));

      // Check if fast completed
      if (remaining <= 0 && fastingSession.isActive) {
        completeFast();
      }
    }
  }, [currentTime, fastingSession]);

  function startFast() {
    const planHours = {
      '14-10': 14,
      '16-8': 16,
      '18-6': 18,
      '20-4': 20,
      '23-1-omad': 23
    }[selectedPlan] || 16;

    const now = new Date();
    const end = new Date(now.getTime() + planHours * 60 * 60 * 1000);

    const session: FastingSession = {
      plan: selectedPlan,
      startTime: now,
      endTime: end,
      isActive: true,
      currentHours: 0,
      totalHours: planHours
    };

    setFastingSession(session);
    toast({
      title: 'Fast Started! 🎉',
      description: `Your ${planHours}-hour fast has begun. Stay strong!`
    });
  }

  function pauseFast() {
    if (fastingSession) {
      setFastingSession({ ...fastingSession, isActive: false });
      toast({
        title: 'Fast Paused',
        description: 'You can resume anytime'
      });
    }
  }

  function resumeFast() {
    if (fastingSession) {
      setFastingSession({ ...fastingSession, isActive: true });
      toast({
        title: 'Fast Resumed',
        description: 'Keep going! You got this!'
      });
    }
  }

  function completeFast() {
    if (fastingSession) {
      toast({
        title: 'Fast Complete! 🎉',
        description: `Congratulations! You completed your ${fastingSession.totalHours}-hour fast!`,
        duration: 5000
      });
      
      // Save to history
      const history = JSON.parse(localStorage.getItem('fasting_history') || '[]');
      history.push({
        ...fastingSession,
        completedAt: new Date()
      });
      localStorage.setItem('fasting_history', JSON.stringify(history));
      
      setFastingSession(null);
      localStorage.removeItem('current_fasting_session');
    }
  }

  function endFast() {
    if (fastingSession) {
      const confirmEnd = confirm('Are you sure you want to end your fast early?');
      if (confirmEnd) {
        setFastingSession(null);
        localStorage.removeItem('current_fasting_session');
        toast({
          title: 'Fast Ended',
          description: 'No worries! Try again when ready.'
        });
      }
    }
  }

  function formatTime(hours: number): string {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    const s = Math.floor(((hours - h) * 60 - m) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  function getCurrentBodyStage(): BodyStage {
    for (let i = bodyStages.length - 1; i >= 0; i--) {
      if (elapsedHours >= bodyStages[i].hours) {
        return bodyStages[i];
      }
    }
    return bodyStages[0];
  }

  function getNextBodyStage(): BodyStage | null {
    const current = getCurrentBodyStage();
    const currentIndex = bodyStages.findIndex(s => s.name === current.name);
    return currentIndex < bodyStages.length - 1 ? bodyStages[currentIndex + 1] : null;
  }

  const currentStage = fastingSession?.isActive ? getCurrentBodyStage() : bodyStages[0];
  const nextStage = getNextBodyStage();
  const progress = fastingSession ? (elapsedHours / fastingSession.totalHours) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-orange-50/20 dark:via-orange-950/10 to-background">
      {/* Header */}
      <section className="border-b bg-background/95 backdrop-blur-lg sticky top-14 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={() => navigate('/health/fasting')}>
                ← Back
              </Button>
              <h1 className="font-bold text-xl">Fasting Tracker</h1>
              <Button variant="ghost" size="icon">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8 max-w-2xl">
          {!fastingSession ? (
            /* Not Fasting - Start Screen */
            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30">
                <CardContent className="p-12 text-center">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Clock className="w-12 h-12 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold mb-3">Ready to Start Fasting?</h2>
                  <p className="text-muted-foreground mb-6">
                    Your selected plan: <span className="font-bold">{selectedPlan.replace('-', ':')}</span>
                  </p>
                  <Button size="lg" onClick={startFast} className="px-12">
                    <Play className="w-5 h-5 mr-2" />
                    Start Fast
                  </Button>
                  <Button
                    variant="ghost"
                    className="mt-4"
                    onClick={() => navigate('/health/fasting/plans')}
                  >
                    Change Plan
                  </Button>
                </CardContent>
              </Card>

              {/* Fasting Benefits */}
              <Card>
                <CardHeader>
                  <CardTitle>What to Expect</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {bodyStages.slice(0, 4).map((stage, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg">
                      <span className="text-2xl">{stage.icon}</span>
                      <div>
                        <p className="font-semibold">{stage.name}</p>
                        <p className="text-sm text-muted-foreground">After {stage.hours} hours</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Active Fasting Session */
            <div className="space-y-6">
              {/* Main Timer Card */}
              <Card className="border-2 border-orange-200 dark:border-orange-800">
                <CardContent className="p-8">
                  {fastingSession.isActive ? (
                    <Badge className="mb-4 bg-green-600">🟢 You're Fasting!</Badge>
                  ) : (
                    <Badge className="mb-4 bg-yellow-600">⏸️ Paused</Badge>
                  )}

                  {/* Progress Ring */}
                  <div className="relative w-48 h-48 mx-auto mb-6">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-secondary"
                      />
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 88}`}
                        strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
                        className="text-orange-500 transition-all duration-300"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-4xl font-bold">
                        {formatTime(elapsedHours)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Elapsed Time
                      </div>
                    </div>
                  </div>

                  {/* Time Remaining */}
                  <div className="text-center mb-6">
                    <p className="text-sm text-muted-foreground mb-1">Time Remaining</p>
                    <p className="text-2xl font-bold">{formatTime(remainingHours)}</p>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>{Math.floor(elapsedHours)}h</span>
                      <span className="font-semibold">{Math.round(progress)}%</span>
                      <span>{fastingSession.totalHours}h</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  {/* Controls */}
                  <div className="flex gap-3">
                    {fastingSession.isActive ? (
                      <Button variant="outline" className="flex-1" onClick={pauseFast}>
                        <Pause className="w-4 h-4 mr-2" />
                        Pause
                      </Button>
                    ) : (
                      <Button className="flex-1" onClick={resumeFast}>
                        <Play className="w-4 h-4 mr-2" />
                        Resume
                      </Button>
                    )}
                    <Button variant="destructive" className="flex-1" onClick={endFast}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      End Fast
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Current Body Status */}
              <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Body Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-5xl">{currentStage.icon}</div>
                    <div className="flex-1">
                      <h3 className={`text-2xl font-bold ${currentStage.color} mb-1`}>
                        {currentStage.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {currentStage.description}
                      </p>
                      <div className="space-y-1">
                        {currentStage.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <Flame className="w-3 h-3 text-orange-500" />
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {nextStage && (
                    <div className="pt-4 border-t">
                      <p className="text-xs text-muted-foreground mb-2">COMING NEXT</p>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{nextStage.icon}</span>
                        <div>
                          <p className="font-semibold text-sm">{nextStage.name}</p>
                          <p className="text-xs text-muted-foreground">
                            In {formatTime(nextStage.hours - elapsedHours)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Flame className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                    <p className="text-2xl font-bold">{Math.round(elapsedHours * 80)}</p>
                    <p className="text-xs text-muted-foreground">Calories Burned</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Zap className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                    <p className="text-2xl font-bold">
                      {elapsedHours >= 12 ? 'High' : elapsedHours >= 8 ? 'Medium' : 'Low'}
                    </p>
                    <p className="text-xs text-muted-foreground">Ketone Level</p>
                  </CardContent>
                </Card>
              </div>

              {/* Tips */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-semibold mb-1">Fasting Tip</p>
                      <p className="text-sm text-muted-foreground">
                        Stay hydrated! Drink water, black coffee, or tea. Avoid breaking your fast with sugary drinks.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    );
  }
