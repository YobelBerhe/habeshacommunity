import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/store/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Heart, Upload } from 'lucide-react';
import MobileHeader from '@/components/layout/MobileHeader';
import Header from '@/components/Header';
import { getAppState } from '@/utils/storage';

interface Question {
  id: number;
  text: string;
  choices: string[];
  weight: number;
}

interface Profile {
  display_name: string;
  city: string;
  country: string;
  gender: string;
  seeking: string;
  age: number;
  bio: string;
  photos: string[];
}

export default function MatchOnboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Profile>({
    display_name: '',
    city: '',
    country: '',
    gender: '',
    seeking: '',
    age: 0,
    bio: '',
    photos: []
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, { choice: number; importance: number }>>({});
  const [loading, setLoading] = useState(false);
  const appState = getAppState();

  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
      return;
    }
    fetchQuestions();
    fetchExistingProfile();
  }, [user, navigate]);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('match_questions')
        .select('*')
        .order('id');

      if (error) throw error;
      setQuestions(data || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const fetchExistingProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('match_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setProfile(data);
        setStep(2); // Skip to questions if profile exists
      }
    } catch (error) {
      // Profile doesn't exist, start with step 1
    }
  };

  const handleProfileSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('match_profiles')
        .upsert({
          user_id: user.id,
          ...profile
        });

      if (error) throw error;
      setStep(2);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to save profile',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAnswersSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Delete existing answers
      await supabase
        .from('match_answers')
        .delete()
        .eq('user_id', user.id);

      // Insert new answers
      const answersData = Object.entries(answers).map(([questionId, answer]) => ({
        user_id: user.id,
        question_id: parseInt(questionId),
        choice_index: answer.choice,
        importance: answer.importance
      }));

      const { error } = await supabase
        .from('match_answers')
        .insert(answersData);

      if (error) throw error;

      toast({
        title: 'Profile Complete!',
        description: 'Your match profile is ready. Start discovering matches!',
      });
      navigate('/match/discover');
    } catch (error) {
      console.error('Error saving answers:', error);
      toast({
        title: 'Error',
        description: 'Failed to save answers',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const setAnswer = (questionId: number, choice: number, importance: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: { choice, importance }
    }));
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader />
      <Header 
        currentCity={appState.city}
        onCityChange={() => {}}
        onAccountClick={() => {}}
        onLogoClick={() => navigate('/')}
      />
      
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="text-center mb-8">
          <Heart className="w-12 h-12 mx-auto mb-4 text-primary" />
          <h1 className="text-3xl font-bold mb-2">Find Your Match</h1>
          <p className="text-muted-foreground">
            Create your profile and answer questions to find compatible connections
          </p>
        </div>

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Create Your Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="display_name">Display Name</Label>
                  <Input
                    id="display_name"
                    value={profile.display_name}
                    onChange={(e) => setProfile({...profile, display_name: e.target.value})}
                    placeholder="How should others see you?"
                  />
                </div>
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={profile.age || ''}
                    onChange={(e) => setProfile({...profile, age: parseInt(e.target.value) || 0})}
                    placeholder="Your age"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={profile.city}
                    onChange={(e) => setProfile({...profile, city: e.target.value})}
                    placeholder="Your city"
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={profile.country}
                    onChange={(e) => setProfile({...profile, country: e.target.value})}
                    placeholder="Your country"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Gender</Label>
                  <Select value={profile.gender} onValueChange={(value) => setProfile({...profile, gender: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="man">Man</SelectItem>
                      <SelectItem value="woman">Woman</SelectItem>
                      <SelectItem value="non-binary">Non-binary</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Looking for</Label>
                  <Select value={profile.seeking} onValueChange={(value) => setProfile({...profile, seeking: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Looking for" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="men">Men</SelectItem>
                      <SelectItem value="women">Women</SelectItem>
                      <SelectItem value="everyone">Everyone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="bio">About You</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  placeholder="Tell others about yourself, your interests, what you're looking for..."
                  rows={4}
                />
              </div>

              <Button 
                onClick={handleProfileSave}
                disabled={loading || !profile.display_name || !profile.age}
                className="w-full"
              >
                {loading ? 'Saving...' : 'Continue to Questions'}
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Answer Questions</CardTitle>
              <p className="text-sm text-muted-foreground">
                Answer these questions to help us find your best matches
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {questions.map((question) => (
                <div key={question.id} className="space-y-3">
                  <h3 className="font-medium">{question.text}</h3>
                  
                  <RadioGroup
                    value={answers[question.id]?.choice?.toString()}
                    onValueChange={(value) => {
                      const choice = parseInt(value);
                      const importance = answers[question.id]?.importance || 1;
                      setAnswer(question.id, choice, importance);
                    }}
                  >
                    {question.choices.map((choice, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem value={index.toString()} id={`q${question.id}-${index}`} />
                        <Label htmlFor={`q${question.id}-${index}`}>{choice}</Label>
                      </div>
                    ))}
                  </RadioGroup>

                  {answers[question.id]?.choice !== undefined && (
                    <div>
                      <Label className="text-sm">How important is this to you?</Label>
                      <RadioGroup
                        value={answers[question.id]?.importance?.toString()}
                        onValueChange={(value) => {
                          const importance = parseInt(value);
                          const choice = answers[question.id]?.choice;
                          setAnswer(question.id, choice, importance);
                        }}
                        className="flex gap-4 mt-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" id={`imp${question.id}-1`} />
                          <Label htmlFor={`imp${question.id}-1`} className="text-sm">Not important</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="2" id={`imp${question.id}-2`} />
                          <Label htmlFor={`imp${question.id}-2`} className="text-sm">Somewhat important</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="3" id={`imp${question.id}-3`} />
                          <Label htmlFor={`imp${question.id}-3`} className="text-sm">Very important</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  )}
                </div>
              ))}

              <Button 
                onClick={handleAnswersSave}
                disabled={loading || Object.keys(answers).length < questions.length}
                className="w-full"
              >
                {loading ? 'Saving...' : 'Complete Profile & Find Matches'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}