import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useOnboarding } from '@/store/onboarding';
import { useAuth } from '@/store/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ChevronLeft, Loader2 } from 'lucide-react';

const RELATIONSHIP_STATUSES = [
  { value: 'single_looking', label: 'Single (looking for match)' },
  { value: 'single', label: 'Single (not looking)' },
  { value: 'relationship', label: 'In a relationship' },
  { value: 'married', label: 'Married' },
  { value: 'prefer_not_say', label: 'Prefer not to say' },
];

const FAITH_BACKGROUNDS = [
  { value: 'orthodox', label: 'Orthodox Christian' },
  { value: 'protestant', label: 'Protestant Christian' },
  { value: 'catholic', label: 'Catholic' },
  { value: 'muslim', label: 'Muslim' },
  { value: 'other', label: 'Other faith' },
  { value: 'non_religious', label: 'Non-religious' },
  { value: 'prefer_not_say', label: 'Prefer not to say' },
];

export default function PersonalInfo() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { interests, relationshipStatus, faithBackground, setRelationshipStatus, setFaithBackground } = useOnboarding();
  
  const [relationship, setRelationship] = useState(relationshipStatus);
  const [faith, setFaith] = useState(faithBackground);
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    if (!relationship || !faith) {
      toast.error('Please answer all questions');
      return;
    }

    setLoading(true);

    try {
      // Determine visible/hidden categories based on answers
      const visibleCategories = [...interests];
      const hiddenCategories: string[] = [];

      // Hide Match if married or in relationship
      if (relationship === 'married' || relationship === 'relationship') {
        const matchIndex = visibleCategories.indexOf('match');
        if (matchIndex > -1) {
          visibleCategories.splice(matchIndex, 1);
          hiddenCategories.push('match');
        }
      }

      // Hide Spiritual if Muslim or non-religious (Orthodox-focused content)
      if (faith === 'muslim' || faith === 'non_religious') {
        const spiritualIndex = visibleCategories.indexOf('spiritual');
        if (spiritualIndex > -1) {
          visibleCategories.splice(spiritualIndex, 1);
          hiddenCategories.push('spiritual');
        }
      }

      // Update profile
      const { error } = await supabase
        .from('profiles')
        .update({
          relationship_status: relationship,
          faith_background: faith,
          interests,
          visible_categories: visibleCategories,
          hidden_categories: hiddenCategories,
          onboarding_completed: true,
        })
        .eq('id', user?.id);

      if (error) throw error;

      // Save to store
      setRelationshipStatus(relationship);
      setFaithBackground(faith);

      toast.success('Welcome to HabeshaCommunity! 🎉');
      navigate('/home');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Progress Header */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/onboarding/interests')}
            disabled={loading}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 flex gap-1">
            <div className="h-1 flex-1 rounded-full bg-primary" />
            <div className="h-1 flex-1 rounded-full bg-primary" />
            <div className="h-1 flex-1 rounded-full bg-primary" />
          </div>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-foreground">A little about you</h1>
          <p className="text-muted-foreground">This helps us personalize your experience</p>
        </div>

        <div className="space-y-6">
          {/* Relationship Status */}
          <Card className="p-4">
            <h3 className="font-medium text-foreground mb-4">Your relationship status?</h3>
            <RadioGroup value={relationship} onValueChange={setRelationship}>
              <div className="space-y-3">
                {RELATIONSHIP_STATUSES.map((status) => (
                  <div key={status.value} className="flex items-center space-x-3">
                    <RadioGroupItem value={status.value} id={status.value} />
                    <Label htmlFor={status.value} className="text-sm cursor-pointer">
                      {status.label}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </Card>

          {/* Faith Background */}
          <Card className="p-4">
            <h3 className="font-medium text-foreground mb-4">Your faith background?</h3>
            <RadioGroup value={faith} onValueChange={setFaith}>
              <div className="space-y-3">
                {FAITH_BACKGROUNDS.map((bg) => (
                  <div key={bg.value} className="flex items-center space-x-3">
                    <RadioGroupItem value={bg.value} id={bg.value} />
                    <Label htmlFor={bg.value} className="text-sm cursor-pointer">
                      {bg.label}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </Card>
        </div>

        {/* Complete Button */}
        <Button 
          className="w-full h-12 text-base font-medium"
          onClick={handleComplete}
          disabled={!relationship || !faith || loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Setting up...
            </>
          ) : (
            'Complete Setup'
          )}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          You can always change these preferences in Settings
        </p>
      </div>
    </div>
  );
}
