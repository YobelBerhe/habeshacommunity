// src/pages/health/fasting/SelectFastingPlan.tsx
// Fasting Plan Selection - Industry Standard Quality

import { useState } from 'react';
import { useSEO } from '@/hooks/useSEO';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, TrendingUp, Zap, Award, Church, ChevronRight,
  Star, Flame, Target
} from 'lucide-react';

interface FastingPlan {
  id: string;
  name: string;
  schedule: string;
  duration_hours: number;
  eating_window_hours: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  popular?: boolean;
  recommended?: boolean;
  type: 'intermittent' | 'orthodox';
  description: string;
  benefits: string[];
  ideal_for: string[];
  icon: string;
  color: string;
}

export default function SelectFastingPlan() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  useSEO({
    title: 'Choose Your Fasting Plan | HabeshaCommunity Health',
    description: 'Select from 8 different fasting plans including 16:8, 18:6, Orthodox fasting and more. Start your health journey today.'
  });

  const fastingPlans: FastingPlan[] = [
    {
      id: '16-8',
      name: '16:8',
      schedule: '16 hours fasting, 8 hours eating',
      duration_hours: 16,
      eating_window_hours: 8,
      difficulty: 'beginner',
      popular: true,
      recommended: true,
      type: 'intermittent',
      description: 'The most popular intermittent fasting method. Perfect for beginners and sustainable long-term.',
      benefits: [
        'Easy to maintain',
        'Fits busy schedules',
        'Steady weight loss',
        'Improved energy'
      ],
      ideal_for: [
        'Beginners',
        'Weight loss',
        'Busy professionals',
        'Long-term sustainability'
      ],
      icon: '⭐',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: '14-10',
      name: '14:10',
      schedule: '14 hours fasting, 10 hours eating',
      duration_hours: 14,
      eating_window_hours: 10,
      difficulty: 'beginner',
      type: 'intermittent',
      description: 'Great starter plan for intermittent fasting beginners. Gentle introduction to fasting lifestyle.',
      benefits: [
        'Easiest to start',
        'Flexible eating window',
        'Good for beginners',
        'Minimal disruption'
      ],
      ideal_for: [
        'First-time fasters',
        'Gradual lifestyle change',
        'Testing fasting',
        'Building habits'
      ],
      icon: '🌱',
      color: 'from-blue-400 to-cyan-400'
    },
    {
      id: '18-6',
      name: '18:6',
      schedule: '18 hours fasting, 6 hours eating',
      duration_hours: 18,
      eating_window_hours: 6,
      difficulty: 'intermediate',
      type: 'intermittent',
      description: 'For experienced fasters looking for enhanced results. More challenging but highly effective.',
      benefits: [
        'Faster weight loss',
        'Enhanced autophagy',
        'Better mental clarity',
        'Deeper ketosis'
      ],
      ideal_for: [
        'Experienced fasters',
        'Faster results',
        'Breaking plateaus',
        'Advanced goals'
      ],
      icon: '🔥',
      color: 'from-orange-500 to-red-500'
    },
    {
      id: '20-4',
      name: '20:4 Warrior',
      schedule: '20 hours fasting, 4 hours eating',
      duration_hours: 20,
      eating_window_hours: 4,
      difficulty: 'advanced',
      type: 'intermittent',
      description: 'Also known as the Warrior Diet. Extreme fasting for maximum results and mental toughness.',
      benefits: [
        'Maximum fat burning',
        'Deep autophagy',
        'Extreme mental clarity',
        'Rapid results'
      ],
      ideal_for: [
        'Advanced fasters',
        'Athletic performance',
        'Maximum results',
        'Experienced individuals'
      ],
      icon: '⚡',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: '23-1-omad',
      name: '23:1 OMAD',
      schedule: '23 hours fasting, 1 hour eating',
      duration_hours: 23,
      eating_window_hours: 1,
      difficulty: 'advanced',
      type: 'intermittent',
      description: 'One Meal A Day (OMAD). The ultimate fasting challenge for experienced practitioners.',
      benefits: [
        'Ultimate fat burning',
        'Maximum autophagy',
        'Time efficiency',
        'Peak mental state'
      ],
      ideal_for: [
        'Expert fasters',
        'Extreme discipline',
        'Busy schedules',
        'Maximum challenge'
      ],
      icon: '🏆',
      color: 'from-red-600 to-orange-600'
    },
    {
      id: 'orthodox-wednesday',
      name: 'Orthodox Wednesday',
      schedule: 'Wednesday weekly fast',
      duration_hours: 24,
      eating_window_hours: 0,
      difficulty: 'intermediate',
      type: 'orthodox',
      description: 'Traditional Ethiopian Orthodox Wednesday fast. No animal products from midnight to evening.',
      benefits: [
        'Spiritual growth',
        'Cultural connection',
        'Discipline building',
        'Community practice'
      ],
      ideal_for: [
        'Orthodox Christians',
        'Spiritual fasting',
        'Cultural practice',
        'Faith-based goals'
      ],
      icon: '🙏',
      color: 'from-purple-600 to-blue-600'
    },
    {
      id: 'orthodox-friday',
      name: 'Orthodox Friday',
      schedule: 'Friday weekly fast',
      duration_hours: 24,
      eating_window_hours: 0,
      difficulty: 'intermediate',
      type: 'orthodox',
      description: 'Traditional Ethiopian Orthodox Friday fast. No animal products from midnight to evening.',
      benefits: [
        'Spiritual discipline',
        'Weekly practice',
        'Faith commitment',
        'Traditional observance'
      ],
      ideal_for: [
        'Orthodox Christians',
        'Weekly fasting',
        'Spiritual growth',
        'Religious practice'
      ],
      icon: '🙏',
      color: 'from-purple-600 to-blue-600'
    },
    {
      id: 'great-lent',
      name: 'Great Lent (55 days)',
      schedule: '55-day fasting period',
      duration_hours: 1320, // 55 days
      eating_window_hours: 0,
      difficulty: 'advanced',
      type: 'orthodox',
      description: 'The holiest fasting period in Ethiopian Orthodox tradition. 55 days of spiritual devotion.',
      benefits: [
        'Deep spiritual growth',
        'Complete discipline',
        'Faith strengthening',
        'Cultural heritage'
      ],
      ideal_for: [
        'Devout Orthodox',
        'Lenten season',
        'Spiritual journey',
        'Traditional observance'
      ],
      icon: '⛪',
      color: 'from-purple-700 to-indigo-700'
    }
  ];

  const intermittentPlans = fastingPlans.filter(p => p.type === 'intermittent');
  const orthodoxPlans = fastingPlans.filter(p => p.type === 'orthodox');

  function getDifficultyBadge(difficulty: string) {
    const colors = {
      beginner: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
      advanced: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
    };
    return colors[difficulty as keyof typeof colors] || colors.beginner;
  }

  function startPlan(planId: string) {
    // Save selected plan and navigate to tracker
    localStorage.setItem('selected_fasting_plan', planId);
    navigate('/health/fasting/tracker');
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-purple-50/20 dark:via-purple-950/10 to-background">
      {/* Header */}
      <section className="border-b bg-background/95 backdrop-blur-lg sticky top-14 z-40">
          <div className="container mx-auto px-4 py-6">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-3">Choose Your Fasting Plan</h1>
              <p className="text-lg text-muted-foreground">
                Select the perfect fasting schedule for your goals and lifestyle
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12 max-w-7xl">
          {/* Intermittent Fasting Plans */}
          <section className="mb-12">
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <span className="text-3xl">⏱️</span>
                Intermittent Fasting
              </h2>
              <p className="text-muted-foreground">
                Popular time-restricted eating plans for weight loss and health
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {intermittentPlans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`group hover:shadow-xl transition-all cursor-pointer border-2 ${
                    selectedPlan === plan.id ? 'border-primary' : 'border-transparent'
                  } ${plan.popular ? 'ring-2 ring-yellow-400/50' : ''}`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {plan.popular && (
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-center py-1 text-sm font-bold">
                      ⭐ MOST POPULAR
                    </div>
                  )}
                  
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center text-3xl`}>
                        {plan.icon}
                      </div>
                      <Badge className={getDifficultyBadge(plan.difficulty)}>
                        {plan.difficulty}
                      </Badge>
                    </div>

                    <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{plan.schedule}</p>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm">{plan.description}</p>

                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                        Key Benefits
                      </p>
                      <div className="space-y-1">
                        {plan.benefits.slice(0, 3).map((benefit, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                        Ideal For
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {plan.ideal_for.slice(0, 2).map((item, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button
                      className="w-full"
                      size="lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        startPlan(plan.id);
                      }}
                    >
                      {plan.recommended ? (
                        <>
                          <Star className="w-4 h-4 mr-2" />
                          Start Recommended Plan
                        </>
                      ) : (
                        <>
                          Start {plan.name}
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Orthodox Fasting Plans */}
          <section>
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <span className="text-3xl">🙏</span>
                Orthodox Fasting
              </h2>
              <p className="text-muted-foreground">
                Traditional Ethiopian Orthodox fasting practices for spiritual growth
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orthodoxPlans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`group hover:shadow-xl transition-all cursor-pointer border-2 ${
                    selectedPlan === plan.id ? 'border-primary' : 'border-transparent'
                  }`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center text-3xl`}>
                        {plan.icon}
                      </div>
                      <Badge className={getDifficultyBadge(plan.difficulty)}>
                        {plan.difficulty}
                      </Badge>
                    </div>

                    <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{plan.schedule}</p>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm">{plan.description}</p>

                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                        Spiritual Benefits
                      </p>
                      <div className="space-y-1">
                        {plan.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <Church className="w-3 h-3 text-purple-600" />
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button
                      className="w-full"
                      size="lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        startPlan(plan.id);
                      }}
                    >
                      Start {plan.name}
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Custom Plan CTA */}
          <section className="mt-12">
            <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white border-0">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-3">Want a Custom Plan?</h3>
                <p className="text-lg opacity-90 mb-6">
                  Work with a Habesha health coach to create a personalized fasting plan
                </p>
                <Button
                  size="lg"
                  onClick={() => navigate('/health/coaches?type=nutrition')}
                  className="bg-white text-purple-600 hover:bg-gray-100"
                >
                  <Target className="w-5 h-5 mr-2" />
                  Find a Coach
                </Button>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
