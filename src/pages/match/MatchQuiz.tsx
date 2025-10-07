import { useState } from 'react';
import { 
  Heart, ArrowRight, ArrowLeft, Check, Sparkles, Brain, 
  Users, Home, Church, Target, Star, Trophy, Share2,
  MessageCircle, RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface QuizQuestion {
  id: string;
  category: 'personality' | 'values' | 'lifestyle' | 'relationship' | 'faith' | 'family';
  question: string;
  options: {
    value: string;
    label: string;
    score: number;
  }[];
}

interface QuizResults {
  overall: number;
  personality: number;
  values: number;
  lifestyle: number;
  relationship: number;
  faith: number;
  family: number;
}

const MatchQuiz = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<QuizResults | null>(null);

  const questions: QuizQuestion[] = [
    // Personality Questions
    {
      id: 'p1',
      category: 'personality',
      question: 'How would you describe your social energy?',
      options: [
        { value: 'very-extroverted', label: 'Very outgoing - I thrive in social situations', score: 5 },
        { value: 'extroverted', label: 'Outgoing - I enjoy socializing regularly', score: 4 },
        { value: 'balanced', label: 'Balanced - I enjoy both social time and alone time', score: 3 },
        { value: 'introverted', label: 'Reserved - I prefer smaller gatherings', score: 2 },
        { value: 'very-introverted', label: 'Very reserved - I prefer quiet, intimate settings', score: 1 }
      ]
    },
    {
      id: 'p2',
      category: 'personality',
      question: 'How do you handle conflict in relationships?',
      options: [
        { value: 'direct', label: 'Address it immediately and directly', score: 5 },
        { value: 'thoughtful', label: 'Think it through, then discuss calmly', score: 4 },
        { value: 'time', label: 'Need time to cool down first', score: 3 },
        { value: 'avoid', label: 'Prefer to avoid confrontation', score: 2 },
        { value: 'silent', label: 'Need space and process internally', score: 1 }
      ]
    },
    {
      id: 'p3',
      category: 'personality',
      question: 'What\'s your approach to planning and spontaneity?',
      options: [
        { value: 'very-planned', label: 'I plan everything in advance', score: 1 },
        { value: 'planned', label: 'I prefer having a plan but can be flexible', score: 2 },
        { value: 'balanced', label: 'I balance planning with spontaneity', score: 3 },
        { value: 'spontaneous', label: 'I prefer to go with the flow', score: 4 },
        { value: 'very-spontaneous', label: 'I thrive on spontaneity and adventure', score: 5 }
      ]
    },
    {
      id: 'p4',
      category: 'personality',
      question: 'How do you express affection?',
      options: [
        { value: 'words', label: 'Through words and verbal affirmation', score: 5 },
        { value: 'actions', label: 'Through actions and service', score: 4 },
        { value: 'time', label: 'Through quality time together', score: 3 },
        { value: 'physical', label: 'Through physical touch and closeness', score: 2 },
        { value: 'gifts', label: 'Through thoughtful gifts and gestures', score: 1 }
      ]
    },

    // Values Questions
    {
      id: 'v1',
      category: 'values',
      question: 'How important is maintaining cultural traditions in your daily life?',
      options: [
        { value: 'essential', label: 'Essential - It\'s the foundation of my identity', score: 5 },
        { value: 'very', label: 'Very important - I practice traditions regularly', score: 4 },
        { value: 'moderate', label: 'Moderately important - On special occasions', score: 3 },
        { value: 'somewhat', label: 'Somewhat important - When convenient', score: 2 },
        { value: 'flexible', label: 'Flexible - Open to blending traditions', score: 1 }
      ]
    },
    {
      id: 'v2',
      category: 'values',
      question: 'What role does community involvement play in your life?',
      options: [
        { value: 'very-active', label: 'Very active - I volunteer and lead initiatives', score: 5 },
        { value: 'active', label: 'Active - I regularly participate in community events', score: 4 },
        { value: 'moderate', label: 'Moderate - I attend when I can', score: 3 },
        { value: 'occasional', label: 'Occasional - A few times a year', score: 2 },
        { value: 'minimal', label: 'Minimal - I prefer to support in other ways', score: 1 }
      ]
    },
    {
      id: 'v3',
      category: 'values',
      question: 'How do you view the balance between career and personal life?',
      options: [
        { value: 'family-first', label: 'Family/personal life comes first always', score: 5 },
        { value: 'family-priority', label: 'Family is priority, but career matters', score: 4 },
        { value: 'balanced', label: 'Equal balance between both', score: 3 },
        { value: 'career-priority', label: 'Career is priority, but family matters', score: 2 },
        { value: 'career-focused', label: 'Career-focused at this stage of life', score: 1 }
      ]
    },
    {
      id: 'v4',
      category: 'values',
      question: 'What\'s your approach to financial management in a relationship?',
      options: [
        { value: 'joint', label: 'Fully combined finances and joint decisions', score: 5 },
        { value: 'mostly-joint', label: 'Mostly combined with some separate accounts', score: 4 },
        { value: 'hybrid', label: 'Hybrid - shared expenses, separate savings', score: 3 },
        { value: 'mostly-separate', label: 'Mostly separate with shared bills', score: 2 },
        { value: 'independent', label: 'Completely independent finances', score: 1 }
      ]
    },

    // Faith Questions
    {
      id: 'f1',
      category: 'faith',
      question: 'How does faith guide your daily decisions?',
      options: [
        { value: 'everything', label: 'Faith guides every aspect of my life', score: 5 },
        { value: 'most', label: 'Faith guides most major decisions', score: 4 },
        { value: 'important', label: 'Faith is important but not the only factor', score: 3 },
        { value: 'some', label: 'Faith influences some decisions', score: 2 },
        { value: 'personal', label: 'Faith is personal and private', score: 1 }
      ]
    },
    {
      id: 'f2',
      category: 'faith',
      question: 'How important is it that your partner shares your exact religious practices?',
      options: [
        { value: 'essential', label: 'Essential - Must share same denomination', score: 5 },
        { value: 'very', label: 'Very important - Same faith tradition', score: 4 },
        { value: 'important', label: 'Important - Same core beliefs', score: 3 },
        { value: 'moderate', label: 'Moderate - Similar values are enough', score: 2 },
        { value: 'flexible', label: 'Flexible - Respect is what matters', score: 1 }
      ]
    },
    {
      id: 'f3',
      category: 'faith',
      question: 'How often do you engage in spiritual practices (prayer, fasting, etc.)?',
      options: [
        { value: 'multiple-daily', label: 'Multiple times daily', score: 5 },
        { value: 'daily', label: 'Daily', score: 4 },
        { value: 'weekly', label: 'Weekly', score: 3 },
        { value: 'occasionally', label: 'Occasionally', score: 2 },
        { value: 'rarely', label: 'Rarely or on special occasions', score: 1 }
      ]
    },

    // Family Questions
    {
      id: 'fam1',
      category: 'family',
      question: 'How involved do you want your extended family in your marriage?',
      options: [
        { value: 'very-close', label: 'Very close - Regular involvement in decisions', score: 5 },
        { value: 'close', label: 'Close - Frequent visits and celebrations', score: 4 },
        { value: 'balanced', label: 'Balanced - Regular but with boundaries', score: 3 },
        { value: 'independent', label: 'Independent - Occasional family gatherings', score: 2 },
        { value: 'very-independent', label: 'Very independent - Limited involvement', score: 1 }
      ]
    },
    {
      id: 'fam2',
      category: 'family',
      question: 'When do you envision starting a family?',
      options: [
        { value: 'immediately', label: 'Immediately after marriage', score: 5 },
        { value: 'first-year', label: 'Within the first year', score: 4 },
        { value: 'few-years', label: 'After 2-3 years', score: 3 },
        { value: 'established', label: 'When we\'re more established', score: 2 },
        { value: 'unsure', label: 'Unsure or prefer to wait longer', score: 1 }
      ]
    },
    {
      id: 'fam3',
      category: 'family',
      question: 'What\'s your view on raising children with cultural traditions?',
      options: [
        { value: 'essential', label: 'Essential - Fully immersed in culture', score: 5 },
        { value: 'very-important', label: 'Very important - Regular cultural education', score: 4 },
        { value: 'important', label: 'Important - Balanced with modern life', score: 3 },
        { value: 'some', label: 'Some traditions, mostly modern', score: 2 },
        { value: 'flexible', label: 'Flexible - Let them choose', score: 1 }
      ]
    },

    // Lifestyle Questions
    {
      id: 'l1',
      category: 'lifestyle',
      question: 'How do you prefer to spend your free time?',
      options: [
        { value: 'home', label: 'At home with close family/friends', score: 5 },
        { value: 'social', label: 'Social gatherings and community events', score: 4 },
        { value: 'mixed', label: 'Mix of home and social activities', score: 3 },
        { value: 'outdoor', label: 'Outdoor activities and adventures', score: 2 },
        { value: 'alone', label: 'Quiet time alone or with partner', score: 1 }
      ]
    },
    {
      id: 'l2',
      category: 'lifestyle',
      question: 'What\'s your ideal living situation after marriage?',
      options: [
        { value: 'with-parents', label: 'Living with or very close to parents', score: 5 },
        { value: 'same-city', label: 'Same city as family', score: 4 },
        { value: 'flexible', label: 'Flexible based on circumstances', score: 3 },
        { value: 'independent', label: 'Independent but regular visits', score: 2 },
        { value: 'distance', label: 'Open to living far if needed', score: 1 }
      ]
    },
    {
      id: 'l3',
      category: 'lifestyle',
      question: 'How important is maintaining your native language at home?',
      options: [
        { value: 'primary', label: 'Primary language spoken at home', score: 5 },
        { value: 'frequent', label: 'Frequently spoken alongside English', score: 4 },
        { value: 'regular', label: 'Regular use with family', score: 3 },
        { value: 'occasional', label: 'Occasional use', score: 2 },
        { value: 'minimal', label: 'Minimal - mostly English', score: 1 }
      ]
    },

    // Relationship Questions
    {
      id: 'r1',
      category: 'relationship',
      question: 'How do you envision decision-making in marriage?',
      options: [
        { value: 'traditional', label: 'Traditional roles with husband leading', score: 5 },
        { value: 'mostly-traditional', label: 'Mostly traditional with some flexibility', score: 4 },
        { value: 'partnership', label: 'Equal partnership in all decisions', score: 3 },
        { value: 'flexible', label: 'Flexible based on each person\'s strengths', score: 2 },
        { value: 'independent', label: 'Independent with mutual respect', score: 1 }
      ]
    },
    {
      id: 'r2',
      category: 'relationship',
      question: 'What\'s your ideal timeline from dating to marriage?',
      options: [
        { value: 'months', label: 'Few months - When you know, you know', score: 5 },
        { value: 'year', label: '6-12 months', score: 4 },
        { value: 'two-years', label: '1-2 years', score: 3 },
        { value: 'longer', label: '2+ years', score: 2 },
        { value: 'no-rush', label: 'No rush - as long as it takes', score: 1 }
      ]
    },
    {
      id: 'r3',
      category: 'relationship',
      question: 'How important is physical attraction versus compatibility?',
      options: [
        { value: 'compatibility', label: 'Compatibility is most important', score: 5 },
        { value: 'mostly-compatibility', label: 'Mostly compatibility with some attraction', score: 4 },
        { value: 'equal', label: 'Both are equally important', score: 3 },
        { value: 'mostly-attraction', label: 'Mostly attraction with some compatibility', score: 2 },
        { value: 'attraction', label: 'Physical attraction is most important', score: 1 }
      ]
    },
    {
      id: 'r4',
      category: 'relationship',
      question: 'How do you feel about family involvement in relationship decisions?',
      options: [
        { value: 'essential', label: 'Essential - Family must approve', score: 5 },
        { value: 'important', label: 'Important - Value their input highly', score: 4 },
        { value: 'consider', label: 'Consider - But we decide together', score: 3 },
        { value: 'minimal', label: 'Minimal - Our decision primarily', score: 2 },
        { value: 'independent', label: 'Independent - We decide alone', score: 1 }
      ]
    }
  ];

  const totalQuestions = questions.length;
  const progressPercentage = ((currentQuestion + 1) / totalQuestions) * 100;

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const nextQuestion = () => {
    if (!answers[questions[currentQuestion].id]) {
      toast.error('Please select an answer');
      return;
    }

    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      calculateResults();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const calculateResults = () => {
    const categoryScores: Record<string, { total: number; max: number }> = {
      personality: { total: 0, max: 0 },
      values: { total: 0, max: 0 },
      lifestyle: { total: 0, max: 0 },
      relationship: { total: 0, max: 0 },
      faith: { total: 0, max: 0 },
      family: { total: 0, max: 0 }
    };

    questions.forEach(question => {
      const answer = answers[question.id];
      if (answer) {
        const option = question.options.find(opt => opt.value === answer);
        if (option) {
          categoryScores[question.category].total += option.score;
          categoryScores[question.category].max += 5; // Max score per question
        }
      }
    });

    const calculatePercentage = (category: string) => {
      const { total, max } = categoryScores[category];
      return max > 0 ? Math.round((total / max) * 100) : 0;
    };

    const results: QuizResults = {
      personality: calculatePercentage('personality'),
      values: calculatePercentage('values'),
      lifestyle: calculatePercentage('lifestyle'),
      relationship: calculatePercentage('relationship'),
      faith: calculatePercentage('faith'),
      family: calculatePercentage('family'),
      overall: 0
    };

    // Calculate weighted overall score (faith and values are weighted more)
    results.overall = Math.round(
      (results.personality * 0.15 +
        results.values * 0.25 +
        results.lifestyle * 0.15 +
        results.relationship * 0.15 +
        results.faith * 0.20 +
        results.family * 0.10)
    );

    setResults(results);
    setShowResults(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const retakeQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setResults(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentQ = questions[currentQuestion];
  const currentAnswer = answers[currentQ?.id];

  if (showResults && results) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-blue-50/20 dark:via-blue-950/10 to-background">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Your Results</h1>
                  <p className="text-xs text-muted-foreground">Compatibility Profile</p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/match/discover')}
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Overall Score */}
          <Card className="p-8 mb-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20 opacity-50" />
            <div className="relative z-10">
              <div className="w-32 h-32 mx-auto mb-6 relative">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-muted"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="url(#gradient)"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${(results.overall / 100) * 352} 352`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div>
                    <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                      {results.overall}%
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold mb-2">
                {results.overall >= 80 ? 'Excellent Match!' :
                  results.overall >= 60 ? 'Great Compatibility!' :
                    results.overall >= 40 ? 'Good Potential!' :
                      'Room to Grow'}
              </h2>
              <p className="text-muted-foreground mb-6">
                {results.overall >= 80 ? 'You have strong alignment in values and lifestyle' :
                  results.overall >= 60 ? 'You share important values with your matches' :
                    results.overall >= 40 ? 'You have some common ground to build on' :
                      'Focus on finding matches with similar core values'}
              </p>

              <div className="flex flex-wrap gap-2 justify-center">
                <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                  <Star className="w-3 h-3 mr-1" />
                  Profile Complete
                </Badge>
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Ready to Match
                </Badge>
              </div>
            </div>
          </Card>

          {/* Category Breakdown */}
          <Card className="p-6 mb-6">
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <Brain className="w-6 h-6 mr-3 text-blue-600 dark:text-blue-400" />
              Compatibility Breakdown
            </h3>

            <div className="space-y-6">
              {[
                { key: 'faith', label: 'Faith & Spirituality', icon: Church, color: 'from-purple-500 to-pink-500' },
                { key: 'values', label: 'Core Values', icon: Heart, color: 'from-blue-500 to-cyan-500' },
                { key: 'family', label: 'Family Orientation', icon: Users, color: 'from-green-500 to-emerald-500' },
                { key: 'relationship', label: 'Relationship Goals', icon: Target, color: 'from-amber-500 to-orange-500' },
                { key: 'lifestyle', label: 'Lifestyle Preferences', icon: Home, color: 'from-teal-500 to-cyan-500' },
                { key: 'personality', label: 'Personality Traits', icon: Sparkles, color: 'from-indigo-500 to-purple-500' }
              ].map(({ key, label, icon: Icon, color }) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Icon className="w-5 h-5 text-muted-foreground" />
                      <span className="font-semibold">{label}</span>
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r {color} bg-clip-text text-transparent">
                      {results[key as keyof QuizResults]}%
                    </span>
                  </div>
                  <Progress value={results[key as keyof QuizResults]} className="h-3" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {results[key as keyof QuizResults] >= 80 ? 'Excellent alignment' :
                      results[key as keyof QuizResults] >= 60 ? 'Good compatibility' :
                        results[key as keyof QuizResults] >= 40 ? 'Moderate match' :
                          'Some differences'}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* What This Means */}
          <Card className="p-6 mb-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-800">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
              What This Means
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-foreground">
                  Your profile will be shown to matches with similar scores in each category
                </span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-foreground">
                  Higher compatibility percentages indicate stronger alignment in values and lifestyle
                </span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-foreground">
                  Faith and values are weighted more heavily in your overall score
                </span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-foreground">
                  You can retake the quiz anytime to update your compatibility profile
                </span>
              </li>
            </ul>
          </Card>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-2 gap-4">
            <Button
              size="lg"
              variant="outline"
              onClick={retakeQuiz}
              className="w-full"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Retake Quiz
            </Button>

            <Button
              size="lg"
              onClick={() => navigate('/match/discover')}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
            >
              <Heart className="w-4 h-4 mr-2" />
              Start Matching
            </Button>
          </div>

          {/* Share Results */}
          <Card className="p-6 mt-6 text-center">
            <h4 className="font-semibold mb-3">Share Your Results</h4>
            <div className="flex justify-center gap-3">
              <Button variant="outline" size="icon">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
                <MessageCircle className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-blue-50/20 dark:via-blue-950/10 to-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Compatibility Quiz</h1>
                <p className="text-xs text-muted-foreground">
                  Question {currentQuestion + 1} of {totalQuestions}
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/match/discover')}
            >
              Skip
            </Button>
          </div>

          {/* Progress Bar */}
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </div>

      {/* Question Content */}
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Card className="p-6 lg:p-8 mb-6 animate-fade-in">
          {/* Category Badge */}
          <div className="flex justify-center mb-6">
            <Badge className={`
              ${currentQ.category === 'personality' ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : ''}
              ${currentQ.category === 'values' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : ''}
              ${currentQ.category === 'faith' ? 'bg-gradient-to-r from-purple-500 to-pink-500' : ''}
              ${currentQ.category === 'family' ? 'bg-gradient-to-r from-green-500 to-emerald-500' : ''}
              ${currentQ.category === 'lifestyle' ? 'bg-gradient-to-r from-teal-500 to-cyan-500' : ''}
              ${currentQ.category === 'relationship' ? 'bg-gradient-to-r from-amber-500 to-orange-500' : ''}
              text-white px-4 py-1 text-sm font-semibold
            `}>
              {currentQ.category.charAt(0).toUpperCase() + currentQ.category.slice(1)}
            </Badge>
          </div>

          {/* Question */}
          <h2 className="text-2xl lg:text-3xl font-bold text-center mb-8">
            {currentQ.question}
          </h2>

          {/* Options */}
          <RadioGroup value={currentAnswer} onValueChange={(value) => handleAnswer(currentQ.id, value)}>
            <div className="space-y-3">
              {currentQ.options.map((option) => (
                <div
                  key={option.value}
                  className={`
                    flex items-center space-x-4 p-4 border-2 rounded-xl cursor-pointer transition-all
                    ${currentAnswer === option.value
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    }
                  `}
                  onClick={() => handleAnswer(currentQ.id, option.value)}
                >
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label
                    htmlFor={option.value}
                    className="flex-1 cursor-pointer text-base"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </Card>

        {/* Navigation */}
        <div className="flex gap-4">
          {currentQuestion > 0 && (
            <Button
              variant="outline"
              onClick={prevQuestion}
              size="lg"
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
          )}

          <Button
            onClick={nextQuestion}
            size="lg"
            className={`${currentQuestion === 0 ? 'w-full' : 'flex-1'} bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700`}
            disabled={!currentAnswer}
          >
            {currentQuestion === totalQuestions - 1 ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                See Results
              </>
            ) : (
              <>
                Next Question
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-1 mt-6 flex-wrap">
          {questions.map((_, idx) => (
            <div
              key={idx}
              className={`
                w-2 h-2 rounded-full transition-all
                ${idx === currentQuestion ? 'bg-primary w-8' :
                  answers[questions[idx].id] ? 'bg-green-500' :
                    'bg-muted'}
              `}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MatchQuiz;
