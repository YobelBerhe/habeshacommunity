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
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [seeking, setSeeking] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [lookingFor, setLookingFor] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  
  // Cropper state
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);
  const [editingPhotoIndex, setEditingPhotoIndex] = useState<number | null>(null);

  const extractYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = extractYouTubeId(youtubeUrl);

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
          age: age ? parseInt(age) : null,
          gender: gender || null,
          seeking: seeking || null,
          interests,
          looking_for: lookingFor || null,
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
  const currentQuestions = step === 3 ? requiredQuestions : step === 4 ? optionalQuestions : [];

  const interestOptions = ['Coffee ceremonies', 'Traditional music', 'Cooking', 'Reading', 'Travel', 'Volunteering', 'Church community', 'Photography', 'Hiking', 'Sports'];

  const toggleInterest = (interest: string) => {
    setInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <MentorHeader 
        title={`Create Profile - Step ${step}/5`}
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
              Create Your Match Profile - Step {step} of 5
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="age">Age *</Label>
                    <Input
                      id="age"
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="Your age"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender *</Label>
                    <select
                      id="gender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="seeking">Seeking *</Label>
                  <select
                    id="seeking"
                    value={seeking}
                    onChange={(e) => setSeeking(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  >
                    <option value="">Who are you looking for?</option>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                  </select>
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

                <Button
                  onClick={() => setStep(2)}
                  disabled={!name || !bio || !age || !gender || !seeking}
                  className="w-full"
                >
                  Continue
                </Button>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <Label>Interests & Hobbies</Label>
                  <p className="text-sm text-muted-foreground mb-3">Select all that apply</p>
                  <div className="grid grid-cols-2 gap-2">
                    {interestOptions.map((interest) => (
                      <button
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className={`px-4 py-2 rounded-xl border-2 transition-colors ${
                          interests.includes(interest)
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'border-border hover:border-primary'
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="lookingFor">What are you looking for? *</Label>
                  <select
                    id="lookingFor"
                    value={lookingFor}
                    onChange={(e) => setLookingFor(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  >
                    <option value="">Select relationship goal</option>
                    <option value="Serious relationship leading to marriage">Serious relationship leading to marriage</option>
                    <option value="Marriage-focused dating">Marriage-focused dating</option>
                    <option value="Friendship first">Friendship first, then see where it goes</option>
                  </select>
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

                <div className="bg-accent/10 rounded-xl p-4 border border-accent/20">
                  <Label htmlFor="youtubeUrl" className="flex items-center gap-2 mb-2">
                    <Upload className="w-4 h-4" />
                    Video Introduction (Optional - YouTube)
                  </Label>
                  <Input
                    id="youtubeUrl"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="mb-2"
                  />
                  <p className="text-xs text-muted-foreground mb-3">
                    Add a 30-60 second video introduction from YouTube (can be unlisted for privacy)
                  </p>
                  
                  {videoId && (
                    <div className="rounded-lg overflow-hidden">
                      <iframe
                        width="100%"
                        height="200"
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title="YouTube video preview"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => setStep(3)}
                  disabled={!lookingFor || interests.length === 0}
                  className="w-full"
                >
                  Continue to Questions
                </Button>
              </>
            )}

            {(step === 3 || step === 4) && (
              <>
                <div className="space-y-4">
                  {currentQuestions.map((q) => (
                    <div key={q.id}>
                      <Label>
                        {q.question_text} {q.is_required && '*'}
                      </Label>
                      {q.choices.length > 0 ? (
                        <select
                          className="w-full mt-1 p-2 border border-input rounded-md bg-background text-foreground"
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
                  {step === 3 && (
                    <Button
                      onClick={() => setStep(4)}
                      disabled={requiredQuestions.some(q => !answers[q.id])}
                      className="flex-1"
                    >
                      Continue to Optional Questions
                    </Button>
                  )}
                  {step === 4 && (
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
