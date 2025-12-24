import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useOnboarding } from '@/store/onboarding';
import { Heart, Users, Book, Briefcase, ShoppingBag, Activity, ChevronLeft } from 'lucide-react';

const INTERESTS = [
  { id: 'spiritual', label: 'Grow spiritually', icon: Book, color: 'text-amber-500' },
  { id: 'match', label: 'Find a life partner', icon: Heart, color: 'text-rose-500' },
  { id: 'mentor', label: 'Get mentorship/guidance', icon: Users, color: 'text-blue-500' },
  { id: 'marketplace', label: 'Buy/sell/find housing', icon: ShoppingBag, color: 'text-emerald-500' },
  { id: 'community', label: 'Connect with community', icon: Briefcase, color: 'text-purple-500' },
  { id: 'health', label: 'Health & wellness', icon: Activity, color: 'text-teal-500' },
];

export default function Interests() {
  const navigate = useNavigate();
  const { interests, setInterests } = useOnboarding();
  const [selected, setSelected] = useState<string[]>(interests);

  const toggleInterest = (id: string) => {
    setSelected(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const handleContinue = () => {
    if (selected.length === 0) return;
    setInterests(selected);
    navigate('/onboarding/personal');
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Progress Header */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/onboarding/welcome')}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 flex gap-1">
            <div className="h-1 flex-1 rounded-full bg-primary" />
            <div className="h-1 flex-1 rounded-full bg-muted" />
            <div className="h-1 flex-1 rounded-full bg-muted" />
          </div>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-foreground">What brings you here?</h1>
          <p className="text-muted-foreground">Select all that apply</p>
        </div>

        {/* Interest Cards */}
        <div className="space-y-3">
          {INTERESTS.map((interest) => {
            const Icon = interest.icon;
            const isSelected = selected.includes(interest.id);
            
            return (
              <Card
                key={interest.id}
                className={`p-4 cursor-pointer transition-all ${
                  isSelected 
                    ? 'ring-2 ring-primary bg-primary/5' 
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => toggleInterest(interest.id)}
              >
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleInterest(interest.id)}
                  />
                  <div className={`w-10 h-10 rounded-full bg-muted flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${interest.color}`} />
                  </div>
                  <span className="font-medium text-foreground">{interest.label}</span>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Continue Button */}
        <Button 
          className="w-full h-12 text-base font-medium"
          onClick={handleContinue}
          disabled={selected.length === 0}
        >
          Continue {selected.length > 0 && `(${selected.length} selected)`}
        </Button>
      </div>
    </div>
  );
}
