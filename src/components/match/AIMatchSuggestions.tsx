import { useState } from 'react';
import { 
  Sparkles, Heart, X, TrendingUp, Star, MapPin,
  Briefcase, GraduationCap, Music, Utensils, Globe,
  Check, Zap, Target, Brain, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';

interface AIMatch {
  id: string;
  name: string;
  age: number;
  avatar: string;
  matchScore: number;
  location: string;
  occupation: string;
  aiReason: string;
  compatibility: {
    values: number;
    lifestyle: number;
    interests: number;
    goals: number;
  };
  highlights: string[];
  topReasons: string[];
}

const AIMatchSuggestions = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const aiMatches: AIMatch[] = [
    {
      id: '1',
      name: 'Sara Mehretab',
      age: 27,
      avatar: 'SM',
      matchScore: 94,
      location: 'Washington DC',
      occupation: 'Software Engineer',
      aiReason: 'Perfect alignment on career ambitions, cultural values, and lifestyle preferences. Your communication styles complement each other beautifully.',
      compatibility: {
        values: 95,
        lifestyle: 92,
        interests: 90,
        goals: 96
      },
      highlights: [
        'Both value family traditions',
        'Similar career trajectories',
        'Love for Ethiopian cuisine',
        'Prefer meaningful conversations'
      ],
      topReasons: [
        'Shares your passion for technology and innovation',
        'Strong cultural connection to heritage',
        'Compatible life goals and timeline',
        'Similar communication preferences'
      ]
    },
    {
      id: '2',
      name: 'Meron Kidane',
      age: 29,
      avatar: 'MK',
      matchScore: 89,
      location: 'Oakland, CA',
      occupation: 'Marketing Manager',
      aiReason: 'Great balance of similarities and complementary differences. Your outgoing personality pairs well with her thoughtful nature.',
      compatibility: {
        values: 88,
        lifestyle: 87,
        interests: 92,
        goals: 89
      },
      highlights: [
        'Both enjoy traveling',
        'Active lifestyle',
        'Love live music',
        'Value personal growth'
      ],
      topReasons: [
        'Complementary personality traits',
        'Shared interest in cultural events',
        'Similar relationship goals',
        'Strong emotional intelligence'
      ]
    },
    {
      id: '3',
      name: 'Rahel Woldu',
      age: 26,
      avatar: 'RW',
      matchScore: 87,
      location: 'Seattle, WA',
      occupation: 'Product Designer',
      aiReason: 'Excellent creative and logical balance. Your analytical thinking complements her creative approach to problem-solving.',
      compatibility: {
        values: 90,
        lifestyle: 85,
        interests: 88,
        goals: 85
      },
      highlights: [
        'Creative and logical balance',
        'Both love hiking',
        'Coffee enthusiasts',
        'Value work-life balance'
      ],
      topReasons: [
        'Balance of creativity and logic',
        'Aligned on life priorities',
        'Shared outdoor interests',
        'Compatible career ambitions'
      ]
    }
  ];

  const currentMatch = aiMatches[currentIndex];

  const handleLike = () => {
    if (currentIndex < aiMatches.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigate('/match/matches');
    }
  };

  const handleSkip = () => {
    if (currentIndex < aiMatches.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <Card className="p-6 mb-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">AI Match Suggestions</h2>
            <p className="text-white/90">Powered by advanced compatibility analysis</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Badge className="bg-white/20 text-white">
            <Brain className="w-4 h-4 mr-2" />
            {aiMatches.length} High-Quality Matches
          </Badge>
          <span className="text-sm">
            {currentIndex + 1} of {aiMatches.length}
          </span>
        </div>
      </Card>

      {/* Match Card */}
      <Card className="overflow-hidden">
        {/* Profile Header */}
        <div className="relative h-64 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30">
          <div className="absolute inset-0 flex items-center justify-center">
            <Avatar className="w-40 h-40 border-4 border-white dark:border-gray-800">
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-5xl font-bold">
                {currentMatch.avatar}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="absolute top-4 right-4">
            <Badge className="bg-gradient-to-r from-green-500 to-teal-500 text-white text-lg px-4 py-2">
              <Sparkles className="w-5 h-5 mr-2" />
              {currentMatch.matchScore}% Match
            </Badge>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-2">
              {currentMatch.name}, {currentMatch.age}
            </h3>
            <div className="flex items-center justify-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {currentMatch.location}
              </div>
              <div className="flex items-center gap-1">
                <Briefcase className="w-4 h-4" />
                {currentMatch.occupation}
              </div>
            </div>
          </div>

          {/* AI Insight */}
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-purple-200 dark:border-purple-800">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold mb-2 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-purple-600" />
                  AI Insight
                </h4>
                <p className="text-sm text-muted-foreground">{currentMatch.aiReason}</p>
              </div>
            </div>
          </Card>

          {/* Compatibility Breakdown */}
          <div>
            <h4 className="font-bold mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-primary" />
              Compatibility Analysis
            </h4>
            <div className="space-y-3">
              {Object.entries(currentMatch.compatibility).map(([key, value]) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium capitalize">{key}</span>
                    <span className="text-sm font-bold text-primary">{value}%</span>
                  </div>
                  <Progress value={value} className="h-2" />
                </div>
              ))}
            </div>
          </div>

          {/* Highlights */}
          <div>
            <h4 className="font-bold mb-3 flex items-center">
              <Star className="w-5 h-5 mr-2 text-amber-500" />
              Perfect Matches
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {currentMatch.highlights.map((highlight, index) => (
                <Badge key={index} variant="secondary" className="justify-start">
                  <Check className="w-3 h-3 mr-2 text-green-600" />
                  {highlight}
                </Badge>
              ))}
            </div>
          </div>

          {/* Top Reasons */}
          <div>
            <h4 className="font-bold mb-3 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-primary" />
              Why This Match Works
            </h4>
            <div className="space-y-2">
              {currentMatch.topReasons.map((reason, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">{reason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={handleSkip}
            >
              <X className="w-5 h-5 mr-2" />
              Maybe Later
            </Button>
            <Button
              size="lg"
              className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
              onClick={handleLike}
            >
              <Heart className="w-5 h-5 mr-2" />
              I'm Interested
            </Button>
          </div>

          <Button
            variant="ghost"
            className="w-full"
            onClick={() => navigate(`/match/profile/${currentMatch.id}`)}
          >
            View Full Profile
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </Card>

      {/* Progress Indicator */}
      <div className="flex justify-center gap-2 mt-6">
        {aiMatches.map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'w-8 bg-primary'
                : index < currentIndex
                ? 'w-2 bg-green-500'
                : 'w-2 bg-muted'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default AIMatchSuggestions;
