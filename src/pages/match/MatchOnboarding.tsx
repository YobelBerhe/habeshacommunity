import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Heart, Upload, Edit2 } from 'lucide-react';
import MentorHeader from '@/components/MentorHeader';
import { getAppState } from '@/utils/storage';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ImageCropper } from '@/components/ImageCropper';

interface Question {
  id: string;
  section: string;
  question_text: string;
  choices: string[];
  weight: number;
  is_required: boolean;
}

export default function MatchOnboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const appState = getAppState();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  // Profile fields
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  
  // Cropper state
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);
  const [editingPhotoIndex, setEditingPhotoIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
      return;
    }
    loadQuestions();
  }, [user, navigate]);

  const loadQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('match_questions')
        .select('*')
        .order('section', { ascending: true })
        .order('is_required', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our Question interface
      const transformedData = data?.map(q => ({
        id: q.id,
        section: q.section,
        question_text: q.question_text,
        choices: (q.choices as any) || [],
        weight: q.weight,
        is_required: q.is_required,
      })) as Question[] || [];
      
      setQuestions(transformedData);
    } catch (error) {
      console.error('Error loading questions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load questions',
        variant: 'destructive',
      });
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Create temporary URL for cropping
    const imageUrl = URL.createObjectURL(file);
    setTempImageUrl(imageUrl);
    setEditingPhotoIndex(null); // Adding new photo
  };

  const handleEditPhoto = (index: number) => {
    setTempImageUrl(photos[index]);
    setEditingPhotoIndex(index);
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    if (!user) return;

    try {
      const fileName = `${user.id}/${Date.now()}.jpg`;
      
      const { error: uploadError } = await supabase.storage
        .from('chat-media')
        .upload(fileName, croppedBlob);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('chat-media')
        .getPublicUrl(fileName);

      if (editingPhotoIndex !== null) {
        // Replace existing photo
        const newPhotos = [...photos];
        newPhotos[editingPhotoIndex] = publicUrl;
        setPhotos(newPhotos);
      } else {
        // Add new photo
        setPhotos([...photos, publicUrl]);
      }

      setTempImageUrl(null);
      setEditingPhotoIndex(null);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: 'Could not upload photo',
        variant: 'destructive',
      });
    }
  };

  const handleCropCancel = () => {
    if (tempImageUrl && editingPhotoIndex === null) {
      URL.revokeObjectURL(tempImageUrl);
    }
    setTempImageUrl(null);
    setEditingPhotoIndex(null);
  };

  const handleSubmit = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Create match profile
      const { error: profileError } = await supabase
        .from('match_profiles')
        .insert([{
          id: crypto.randomUUID(),
          user_id: user.id,
          name,
          bio,
          photos,
          city: appState.city || '',
          active: true,
        }]);

      if (profileError) throw profileError;

      // Save answers
      const answerData = Object.entries(answers).map(([questionId, answer]) => ({
        user_id: user.id,
        question_id: questionId,
        answer,
      }));

      const { error: answersError } = await supabase
        .from('user_answers')
        .upsert(answerData);

      if (answersError) throw answersError;

      toast({
        title: 'Profile created!',
        description: 'You can now start matching',
      });

      navigate('/match/discover');
    } catch (error) {
      console.error('Error creating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to create profile',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const requiredQuestions = questions.filter(q => q.is_required);
  const optionalQuestions = questions.filter(q => !q.is_required);
  const currentQuestions = step === 2 ? requiredQuestions : step === 3 ? optionalQuestions : [];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <MentorHeader 
        title={`Create Profile - Step ${step}/3`}
        backPath={step > 1 ? '/' : '/'}
      />
      
      <div className="container mx-auto px-4 py-4 max-w-2xl">
        {step > 1 && (
          <Button 
            variant="ghost" 
            onClick={() => setStep(step - 1)}
            className="mb-4"
          >
            ← Previous Step
          </Button>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-primary" />
              Create Your Match Profile - Step {step} of 3
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <>
                <div>
                  <Label htmlFor="name">Your Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <Label htmlFor="bio">About You *</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label>Photos (up to 5)</Label>
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    {photos.map((photo, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={photo}
                          alt={`Photo ${idx + 1}`}
                          className="w-full h-24 object-cover rounded-md"
                        />
                        <Button
                          variant="secondary"
                          size="sm"
                          className="absolute bottom-1 right-1 h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleEditPhoto(idx)}
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                    {photos.length < 5 && (
                      <label className="border-2 border-dashed rounded-md h-24 flex items-center justify-center cursor-pointer hover:bg-muted">
                        <Upload className="w-6 h-6 text-muted-foreground" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                <Button
                  onClick={() => setStep(2)}
                  disabled={!name || !bio}
                  className="w-full"
                >
                  Continue
                </Button>
              </>
            )}

            {(step === 2 || step === 3) && (
              <>
                <div className="space-y-4">
                  {currentQuestions.map((q) => (
                    <div key={q.id}>
                      <Label>
                        {q.question_text} {q.is_required && '*'}
                      </Label>
                      {q.choices.length > 0 ? (
                        <select
                          className="w-full mt-1 p-2 border rounded-md"
                          value={answers[q.id] || ''}
                          onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                        >
                          <option value="">Select...</option>
                          {q.choices.map((choice) => (
                            <option key={choice} value={choice}>
                              {choice}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <Input
                          value={answers[q.id] || ''}
                          onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                          placeholder="Your answer..."
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  {step === 2 && (
                    <Button
                      onClick={() => setStep(3)}
                      disabled={requiredQuestions.some(q => !answers[q.id])}
                      className="flex-1"
                    >
                      Continue to Optional Questions
                    </Button>
                  )}
                  {step === 3 && (
                    <>
                      <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex-1"
                      >
                        {loading ? 'Creating...' : 'Complete Profile'}
                      </Button>
                    </>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {tempImageUrl && (
        <ImageCropper
          imageUrl={tempImageUrl}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  );
}
