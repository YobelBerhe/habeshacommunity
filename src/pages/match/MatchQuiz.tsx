import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import MentorHeader from '@/components/MentorHeader';
import { useToast } from '@/hooks/use-toast';

interface Question {
  title: string;
  question: string;
  options: string[];
}

export default function MatchQuiz() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const questions: Record<number, Question> = {
    1: {
      title: 'Faith & Spirituality',
      question: 'How important is your faith in your daily life?',
      options: [
        'Extremely important - guides all my decisions',
        'Very important - I practice regularly',
        'Moderately important',
        'Somewhat important'
      ]
    },
    2: {
      title: 'Family Values',
      question: 'How do you envision family involvement in your relationship?',
      options: [
        'Very involved - I value their blessing and guidance',
        'Moderately involved - I want their input on major decisions',
        'Somewhat involved - I keep them informed',
        'Minimal involvement - I make my own decisions'
      ]
    },
    3: {
      title: 'Life Goals',
      question: 'What is your primary relationship goal?',
      options: [
        'Marriage within the next year',
        'Serious relationship leading to marriage',
        'Taking time to find the right person',
        'Getting to know people first'
      ]
    },
    4: {
      title: 'Cultural Connection',
      question: 'How important is it that your partner shares your cultural background?',
      options: [
        'Essential - I want someone from my specific ethnic group',
        'Very important - Habesha background is a must',
        'Moderately important - open to other backgrounds',
        'Not very important - personality matters most'
      ]
    },
    5: {
      title: 'Lifestyle & Habits',
      question: 'How do you spend your free time?',
      options: [
        'Church/spiritual activities and family time',
        'Mix of social, cultural events, and personal growth',
        'Career development and personal hobbies',
        'Varied - I enjoy many different activities'
      ]
    },
    6: {
      title: 'Communication Style',
      question: 'How do you prefer to resolve conflicts?',
      options: [
        'Open discussion with prayer and patience',
        'Direct conversation with mutual respect',
        'Taking time to think before discussing',
        'Seeking advice from trusted family/friends first'
      ]
    },
    7: {
      title: 'Future Plans',
      question: 'Where do you see yourself in 5 years?',
      options: [
        'Married with children, building a family',
        'Established in career with a life partner',
        'Balancing professional growth and family life',
        'Still exploring my path'
      ]
    },
    8: {
      title: 'Values & Priorities',
      question: 'What matters most to you in a partner?',
      options: [
        'Shared faith and strong family values',
        'Emotional maturity and good communication',
        'Ambition and professional success',
        'Kindness and compatibility'
      ]
    }
  };

  const totalSteps = Object.keys(questions).length;
  const currentQuestion = questions[currentStep];

  const handleAnswerSelect = (option: string) => {
    setAnswers({ ...answers, [currentStep]: option });
  };

  const handleNext = () => {
    if (currentStep === totalSteps) {
      toast({
        title: 'Quiz Complete!',
        description: 'Your compatibility profile has been updated',
      });
      navigate('/match/discover');
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!user) {
    navigate('/auth/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <MentorHeader title="Compatibility Quiz" backPath="/match/discover" />
      
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Progress Bar */}
        <div className="bg-card rounded-2xl shadow-lg p-6 mb-6 border border-border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold">Compatibility Quiz</h3>
            <span className="text-sm text-muted-foreground">Question {currentStep} of {totalSteps}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <div 
              className="bg-primary h-3 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-card rounded-2xl shadow-lg p-8 border border-border">
          <div className="mb-8">
            <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold mb-4">
              {currentQuestion.title}
            </div>
            <h2 className="text-2xl font-bold mb-2">{currentQuestion.question}</h2>
            <p className="text-muted-foreground">Select the option that best describes you</p>
          </div>

          <div className="space-y-4">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswerSelect(option)}
                className={`w-full text-left px-6 py-4 border-2 rounded-xl transition-all ${
                  answers[currentStep] === option
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary hover:bg-primary/5'
                }`}
              >
                <div className="flex items-start">
                  <div className={`w-6 h-6 border-2 rounded-full flex items-center justify-center mr-4 mt-0.5 ${
                    answers[currentStep] === option ? 'border-primary' : 'border-muted-foreground'
                  }`}>
                    {answers[currentStep] === option && (
                      <div className="w-3 h-3 bg-primary rounded-full" />
                    )}
                  </div>
                  <span className="font-medium">{option}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t-2 border-border">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Previous
            </Button>

            <Button
              onClick={handleNext}
              disabled={!answers[currentStep]}
            >
              {currentStep === totalSteps ? 'Complete Quiz' : 'Next Question'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-accent/10 rounded-2xl p-6 mt-6 border border-accent/20">
          <div className="flex items-start space-x-3">
            <Sparkles className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold mb-1">Why this matters</h4>
              <p className="text-sm text-muted-foreground">
                Your answers help us find matches who share your values, faith, and life goals. 
                This ensures more meaningful connections and higher compatibility.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
