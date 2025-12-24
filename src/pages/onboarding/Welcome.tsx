import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, Users, Book, Briefcase, ShoppingBag, Activity } from 'lucide-react';

export default function Welcome() {
  const navigate = useNavigate();

  const features = [
    { icon: Book, label: 'Spiritual Growth', color: 'text-amber-500' },
    { icon: Heart, label: 'Find Your Match', color: 'text-rose-500' },
    { icon: Users, label: 'Get Mentorship', color: 'text-blue-500' },
    { icon: ShoppingBag, label: 'Buy & Sell', color: 'text-emerald-500' },
    { icon: Briefcase, label: 'Join Community', color: 'text-purple-500' },
    { icon: Activity, label: 'Track Health', color: 'text-teal-500' },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo & Title */}
        <div className="text-center space-y-2">
          <div className="w-20 h-20 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
            <span className="text-4xl">🇪🇹</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome to
          </h1>
          <h2 className="text-3xl font-bold text-primary">
            HabeshaCommunity
          </h2>
          <p className="text-muted-foreground text-sm mt-2">
            Your all-in-one platform connecting the Habesha diaspora
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-3 gap-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.label} className="p-4 text-center hover:shadow-md transition-shadow">
                <div className={`w-10 h-10 mx-auto rounded-full bg-muted flex items-center justify-center mb-2`}>
                  <Icon className={`w-5 h-5 ${feature.color}`} />
                </div>
                <p className="text-xs text-muted-foreground">{feature.label}</p>
              </Card>
            );
          })}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button 
            className="w-full h-12 text-base font-medium"
            onClick={() => navigate('/onboarding/interests')}
          >
            Get Started
          </Button>
          <Button 
            variant="ghost" 
            className="w-full"
            onClick={() => navigate('/home')}
          >
            Skip for now
          </Button>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          Takes less than 2 minutes • Personalize your experience
        </p>
      </div>
    </div>
  );
}
