import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  Clock, 
  Users, 
  Award,
  ChevronRight,
  CheckCircle
} from 'lucide-react';

export default function BecomeMentor() {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: DollarSign,
      title: 'Earn Income',
      description: 'Set your own rates and earn money sharing your expertise'
    },
    {
      icon: Clock,
      title: 'Flexible Schedule',
      description: 'Choose when and how often you want to mentor'
    },
    {
      icon: Users,
      title: 'Give Back',
      description: 'Help others in the Habesha community succeed'
    },
    {
      icon: Award,
      title: 'Build Reputation',
      description: 'Grow your professional network and credibility'
    },
  ];

  const requirements = [
    'At least 3 years of professional experience',
    'Passion for helping others succeed',
    'Good communication skills',
    'Commitment to respond within 24 hours',
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-foreground">Become a Mentor</h1>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Hero */}
        <div className="text-center py-6">
          <h2 className="text-2xl font-bold text-foreground">Share Your Expertise</h2>
          <p className="text-muted-foreground mt-2">
            Join hundreds of mentors helping the Habesha diaspora navigate their careers, businesses, and life goals.
          </p>
          <Button 
            className="mt-6 bg-mentor hover:bg-mentor/90"
            size="lg"
            onClick={() => navigate('/mentor/onboarding')}
          >
            Start Application
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Benefits */}
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground text-lg">Why Become a Mentor?</h3>
          <div className="grid grid-cols-2 gap-3">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="p-4">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-mentor/10 flex items-center justify-center mb-3">
                      <Icon className="h-6 w-6 text-mentor" />
                    </div>
                    <h4 className="font-medium text-foreground text-sm">{benefit.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {benefit.description}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Requirements */}
        <Card className="p-4">
          <h3 className="font-semibold text-foreground mb-4">Requirements</h3>
          <div className="space-y-3">
            {requirements.map((req, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-mentor/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="h-3 w-3 text-mentor" />
                </div>
                <span className="text-sm text-muted-foreground">{req}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* CTA */}
        <Card className="p-6 bg-mentor/5 border-mentor/20">
          <h3 className="font-semibold text-foreground text-center">Ready to get started?</h3>
          <p className="text-sm text-muted-foreground text-center mt-2">
            The application takes about 10 minutes. We'll review and get back to you within 3 business days.
          </p>
          <Button 
            className="w-full mt-4 bg-mentor hover:bg-mentor/90"
            onClick={() => navigate('/mentor/onboarding')}
          >
            Apply Now
          </Button>
        </Card>
      </div>
    </div>
  );
}
