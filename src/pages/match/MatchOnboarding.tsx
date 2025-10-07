import { useState } from 'react';
import { 
  Heart, ArrowRight, ArrowLeft, Check, MapPin, Globe, Church, 
  Briefcase, GraduationCap, Users, Sparkles, Home, Calendar,
  Coffee, Music, Book, Camera, Target, Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface OnboardingData {
  // Step 1: Basic Info
  name: string;
  age: string;
  gender: string;
  location: string;
  origin: string;
  ethnicity: string;

  // Step 2: Faith & Values
  faith: string;
  denomination: string;
  churchAttendance: string;
  faithImportance: string;
  spiritualPractices: string[];

  // Step 3: Education & Career
  education: string;
  profession: string;
  careerGoals: string;
  careerImportance: string;

  // Step 4: Family & Lifestyle
  familyValues: string;
  familyPlans: string;
  numberOfChildren: string;
  livingWithFamily: string;
  culturalTraditions: string[];

  // Step 5: Interests & Hobbies
  interests: string[];
  hobbies: string[];
  languages: string[];
  musicPreference: string;

  // Step 6: Relationship Goals
  lookingFor: string;
  relationshipTimeline: string;
  idealPartner: string;
  dealBreakers: string[];
  agePreference: [number, number];

  // Step 7: About You
  bio: string;
  height: string;
  personalityTraits: string[];
}

const MatchOnboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7;

  const [formData, setFormData] = useState<OnboardingData>({
    name: '',
    age: '',
    gender: '',
    location: '',
    origin: '',
    ethnicity: '',
    faith: '',
    denomination: '',
    churchAttendance: '',
    faithImportance: '',
    spiritualPractices: [],
    education: '',
    profession: '',
    careerGoals: '',
    careerImportance: '',
    familyValues: '',
    familyPlans: '',
    numberOfChildren: '',
    livingWithFamily: '',
    culturalTraditions: [],
    interests: [],
    hobbies: [],
    languages: [],
    musicPreference: '',
    lookingFor: '',
    relationshipTimeline: '',
    idealPartner: '',
    dealBreakers: [],
    agePreference: [22, 35],
    bio: '',
    height: '',
    personalityTraits: []
  });

  const updateFormData = (field: keyof OnboardingData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: keyof OnboardingData, value: string) => {
    const currentArray = formData[field] as string[];
    if (currentArray.includes(value)) {
      updateFormData(field, currentArray.filter(item => item !== value));
    } else {
      updateFormData(field, [...currentArray, value]);
    }
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      if (currentStep < totalSteps) {
        setCurrentStep(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        handleSubmit();
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.name || !formData.age || !formData.gender || !formData.location) {
          toast.error('Please fill in all required fields');
          return false;
        }
        if (parseInt(formData.age) < 18 || parseInt(formData.age) > 80) {
          toast.error('Please enter a valid age (18-80)');
          return false;
        }
        break;
      case 2:
        if (!formData.faith || !formData.faithImportance) {
          toast.error('Please answer all faith-related questions');
          return false;
        }
        break;
      case 3:
        if (!formData.education || !formData.profession) {
          toast.error('Please provide your education and profession');
          return false;
        }
        break;
      case 4:
        if (!formData.familyValues || !formData.familyPlans) {
          toast.error('Please answer all family-related questions');
          return false;
        }
        break;
      case 5:
        if (formData.interests.length === 0 || formData.languages.length === 0) {
          toast.error('Please select at least one interest and language');
          return false;
        }
        break;
      case 6:
        if (!formData.lookingFor || !formData.relationshipTimeline) {
          toast.error('Please specify your relationship goals');
          return false;
        }
        break;
      case 7:
        if (!formData.bio || formData.bio.length < 50) {
          toast.error('Please write a bio (at least 50 characters)');
          return false;
        }
        break;
    }
    return true;
  };

  const handleSubmit = async () => {
    try {
      // TODO: Save to Supabase
      // const { error } = await supabase
      //   .from('match_profiles')
      //   .insert([formData]);

      toast.success('Profile created! 🎉', {
        description: 'Your matchmaking journey begins now'
      });

      setTimeout(() => {
        navigate('/match/discover');
      }, 2000);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile. Please try again.');
    }
  };

  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-blue-50/20 dark:via-blue-950/10 to-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white fill-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Create Your Profile</h1>
                <p className="text-xs text-muted-foreground">Step {currentStep} of {totalSteps}</p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/match/discover')}
            >
              Skip for now
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-600 transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Card className="p-6 lg:p-8 mb-6 animate-fade-in">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-2">Let's Get to Know You</h2>
                <p className="text-muted-foreground">Tell us the basics to get started</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="age">Age *</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Your age"
                      value={formData.age}
                      onChange={(e) => updateFormData('age', e.target.value)}
                      className="mt-1"
                      min="18"
                      max="80"
                    />
                  </div>

                  <div>
                    <Label htmlFor="gender">Gender *</Label>
                    <Select value={formData.gender} onValueChange={(value) => updateFormData('gender', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Current Location *</Label>
                  <div className="relative mt-1">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="location"
                      placeholder="City, Country"
                      value={formData.location}
                      onChange={(e) => updateFormData('location', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="origin">Place of Origin *</Label>
                  <div className="relative mt-1">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="origin"
                      placeholder="e.g., Addis Ababa, Ethiopia"
                      value={formData.origin}
                      onChange={(e) => updateFormData('origin', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="ethnicity">Ethnicity</Label>
                  <Select value={formData.ethnicity} onValueChange={(value) => updateFormData('ethnicity', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select ethnicity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ethiopian">Ethiopian</SelectItem>
                      <SelectItem value="eritrean">Eritrean</SelectItem>
                      <SelectItem value="mixed">Mixed Heritage</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Faith & Values */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Church className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-2">Faith & Spirituality</h2>
                <p className="text-muted-foreground">Share your spiritual journey with us</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="faith">Religious Affiliation *</Label>
                  <Select value={formData.faith} onValueChange={(value) => updateFormData('faith', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select your faith" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="orthodox">Orthodox Christian</SelectItem>
                      <SelectItem value="catholic">Catholic</SelectItem>
                      <SelectItem value="protestant">Protestant</SelectItem>
                      <SelectItem value="muslim">Muslim</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.faith && formData.faith !== 'muslim' && formData.faith !== 'other' && (
                  <div>
                    <Label htmlFor="denomination">Denomination</Label>
                    <Input
                      id="denomination"
                      placeholder="e.g., Ethiopian Orthodox Tewahedo"
                      value={formData.denomination}
                      onChange={(e) => updateFormData('denomination', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                )}

                <div>
                  <Label>How important is faith in your life? *</Label>
                  <RadioGroup value={formData.faithImportance} onValueChange={(value) => updateFormData('faithImportance', value)} className="mt-3 space-y-3">
                    <div className="flex items-center space-x-3 p-4 border-2 border-border rounded-lg hover:border-primary cursor-pointer transition-colors">
                      <RadioGroupItem value="extremely" id="faith-extremely" />
                      <Label htmlFor="faith-extremely" className="flex-1 cursor-pointer">
                        <div className="font-semibold">Extremely Important</div>
                        <div className="text-sm text-muted-foreground">Faith guides all my decisions</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border-2 border-border rounded-lg hover:border-primary cursor-pointer transition-colors">
                      <RadioGroupItem value="very" id="faith-very" />
                      <Label htmlFor="faith-very" className="flex-1 cursor-pointer">
                        <div className="font-semibold">Very Important</div>
                        <div className="text-sm text-muted-foreground">Faith is central to my life</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border-2 border-border rounded-lg hover:border-primary cursor-pointer transition-colors">
                      <RadioGroupItem value="moderate" id="faith-moderate" />
                      <Label htmlFor="faith-moderate" className="flex-1 cursor-pointer">
                        <div className="font-semibold">Moderately Important</div>
                        <div className="text-sm text-muted-foreground">Faith matters but isn't everything</div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="churchAttendance">Church/Mosque Attendance</Label>
                  <Select value={formData.churchAttendance} onValueChange={(value) => updateFormData('churchAttendance', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="How often do you attend?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly or more</SelectItem>
                      <SelectItem value="monthly">Few times a month</SelectItem>
                      <SelectItem value="occasionally">Occasionally</SelectItem>
                      <SelectItem value="holidays">Only on holidays</SelectItem>
                      <SelectItem value="rarely">Rarely</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-3 block">Spiritual Practices (select all that apply)</Label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {['Daily prayer', 'Scripture reading', 'Fasting', 'Meditation', 'Church service', 'Charity work'].map((practice) => (
                      <div key={practice} className="flex items-center space-x-3 p-3 border-2 border-border rounded-lg hover:border-primary cursor-pointer transition-colors">
                        <Checkbox
                          id={practice}
                          checked={formData.spiritualPractices.includes(practice)}
                          onCheckedChange={() => toggleArrayItem('spiritualPractices', practice)}
                        />
                        <Label htmlFor={practice} className="flex-1 cursor-pointer">{practice}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Education & Career */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-2">Education & Career</h2>
                <p className="text-muted-foreground">Tell us about your professional life</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="education">Highest Education Level *</Label>
                  <Select value={formData.education} onValueChange={(value) => updateFormData('education', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select education level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high-school">High School</SelectItem>
                      <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                      <SelectItem value="masters">Master's Degree</SelectItem>
                      <SelectItem value="doctorate">Doctorate/PhD</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="profession">Current Profession *</Label>
                  <Input
                    id="profession"
                    placeholder="e.g., Software Engineer, Teacher, Doctor"
                    value={formData.profession}
                    onChange={(e) => updateFormData('profession', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="careerGoals">Career Goals</Label>
                  <Textarea
                    id="careerGoals"
                    placeholder="Where do you see yourself professionally in 5 years?"
                    value={formData.careerGoals}
                    onChange={(e) => updateFormData('careerGoals', e.target.value)}
                    className="mt-1 min-h-[100px]"
                  />
                </div>

                <div>
                  <Label>How important is career to you?</Label>
                  <RadioGroup value={formData.careerImportance} onValueChange={(value) => updateFormData('careerImportance', value)} className="mt-3 space-y-3">
                    <div className="flex items-center space-x-3 p-4 border-2 border-border rounded-lg hover:border-primary cursor-pointer transition-colors">
                      <RadioGroupItem value="primary" id="career-primary" />
                      <Label htmlFor="career-primary" className="flex-1 cursor-pointer">
                        <div className="font-semibold">Very Important</div>
                        <div className="text-sm text-muted-foreground">Career is a top priority</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border-2 border-border rounded-lg hover:border-primary cursor-pointer transition-colors">
                      <RadioGroupItem value="balanced" id="career-balanced" />
                      <Label htmlFor="career-balanced" className="flex-1 cursor-pointer">
                        <div className="font-semibold">Balanced</div>
                        <div className="text-sm text-muted-foreground">Career matters but family comes first</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border-2 border-border rounded-lg hover:border-primary cursor-pointer transition-colors">
                      <RadioGroupItem value="secondary" id="career-secondary" />
                      <Label htmlFor="career-secondary" className="flex-1 cursor-pointer">
                        <div className="font-semibold">Less Important</div>
                        <div className="text-sm text-muted-foreground">Family and personal life are priorities</div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Family & Lifestyle */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Home className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-2">Family & Lifestyle</h2>
                <p className="text-muted-foreground">Share your family values and plans</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>How important is family to you? *</Label>
                  <RadioGroup value={formData.familyValues} onValueChange={(value) => updateFormData('familyValues', value)} className="mt-3 space-y-3">
                    <div className="flex items-center space-x-3 p-4 border-2 border-border rounded-lg hover:border-primary cursor-pointer transition-colors">
                      <RadioGroupItem value="extremely" id="family-extremely" />
                      <Label htmlFor="family-extremely" className="flex-1 cursor-pointer">
                        <div className="font-semibold">Extremely Important</div>
                        <div className="text-sm text-muted-foreground">Family is everything to me</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border-2 border-border rounded-lg hover:border-primary cursor-pointer transition-colors">
                      <RadioGroupItem value="very" id="family-very" />
                      <Label htmlFor="family-very" className="flex-1 cursor-pointer">
                        <div className="font-semibold">Very Important</div>
                        <div className="text-sm text-muted-foreground">Family is a top priority</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border-2 border-border rounded-lg hover:border-primary cursor-pointer transition-colors">
                      <RadioGroupItem value="moderate" id="family-moderate" />
                      <Label htmlFor="family-moderate" className="flex-1 cursor-pointer">
                        <div className="font-semibold">Moderately Important</div>
                        <div className="text-sm text-muted-foreground">Family matters but I value independence</div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="familyPlans">Do you want children? *</Label>
                  <Select value={formData.familyPlans} onValueChange={(value) => updateFormData('familyPlans', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select your preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="definitely">Definitely want children</SelectItem>
                      <SelectItem value="probably">Probably want children</SelectItem>
                      <SelectItem value="maybe">Open to it</SelectItem>
                      <SelectItem value="probably-not">Probably not</SelectItem>
                      <SelectItem value="no">Don't want children</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(formData.familyPlans === 'definitely' || formData.familyPlans === 'probably') && (
                  <div>
                    <Label htmlFor="numberOfChildren">How many children?</Label>
                    <Select value={formData.numberOfChildren} onValueChange={(value) => updateFormData('numberOfChildren', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select number" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-2">1-2 children</SelectItem>
                        <SelectItem value="3-4">3-4 children</SelectItem>
                        <SelectItem value="5+">5 or more</SelectItem>
                        <SelectItem value="open">Open to discussion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <Label htmlFor="livingWithFamily">Living situation preference</Label>
                  <Select value={formData.livingWithFamily} onValueChange={(value) => updateFormData('livingWithFamily', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alone">Prefer to live alone as a couple</SelectItem>
                      <SelectItem value="with-parents">Open to living with parents</SelectItem>
                      <SelectItem value="nearby">Prefer to live near family</SelectItem>
                      <SelectItem value="flexible">Flexible / Open to discussion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-3 block">Cultural traditions important to you</Label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {['Coffee ceremonies', 'Orthodox holidays', 'Traditional clothing', 'Ethiopian/Eritrean cuisine', 'Church community', 'Cultural festivals'].map((tradition) => (
                      <div key={tradition} className="flex items-center space-x-3 p-3 border-2 border-border rounded-lg hover:border-primary cursor-pointer transition-colors">
                        <Checkbox
                          id={tradition}
                          checked={formData.culturalTraditions.includes(tradition)}
                          onCheckedChange={() => toggleArrayItem('culturalTraditions', tradition)}
                        />
                        <Label htmlFor={tradition} className="flex-1 cursor-pointer">{tradition}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Interests & Hobbies */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Coffee className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-2">Interests & Hobbies</h2>
                <p className="text-muted-foreground">What do you enjoy doing?</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="mb-3 block">Languages you speak * (select all that apply)</Label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {['English', 'Amharic', 'Tigrinya', 'Oromo', 'Italian', 'Arabic', 'French', 'Spanish'].map((language) => (
                      <div key={language} className="flex items-center space-x-3 p-3 border-2 border-border rounded-lg hover:border-primary cursor-pointer transition-colors">
                        <Checkbox
                          id={language}
                          checked={formData.languages.includes(language)}
                          onCheckedChange={() => toggleArrayItem('languages', language)}
                        />
                        <Label htmlFor={language} className="flex-1 cursor-pointer">{language}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block">Interests * (select at least 3)</Label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {['Travel', 'Cooking', 'Reading', 'Photography', 'Music', 'Sports', 'Arts & Crafts', 'Volunteering', 'Technology', 'Fashion', 'Fitness', 'Nature & Outdoors'].map((interest) => (
                      <div key={interest} className="flex items-center space-x-3 p-3 border-2 border-border rounded-lg hover:border-primary cursor-pointer transition-colors">
                        <Checkbox
                          id={interest}
                          checked={formData.interests.includes(interest)}
                          onCheckedChange={() => toggleArrayItem('interests', interest)}
                        />
                        <Label htmlFor={interest} className="flex-1 cursor-pointer">{interest}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block">Hobbies (select all that apply)</Label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {['Church choir', 'Cultural events', 'Mentoring youth', 'Hiking', 'Board games', 'Cooking traditional dishes', 'Language learning', 'Community service'].map((hobby) => (
                      <div key={hobby} className="flex items-center space-x-3 p-3 border-2 border-border rounded-lg hover:border-primary cursor-pointer transition-colors">
                        <Checkbox
                          id={hobby}
                          checked={formData.hobbies.includes(hobby)}
                          onCheckedChange={() => toggleArrayItem('hobbies', hobby)}
                        />
                        <Label htmlFor={hobby} className="flex-1 cursor-pointer">{hobby}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="musicPreference">Music preference</Label>
                  <Select value={formData.musicPreference} onValueChange={(value) => updateFormData('musicPreference', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="What music do you enjoy?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="traditional">Traditional Ethiopian/Eritrean</SelectItem>
                      <SelectItem value="gospel">Gospel/Religious music</SelectItem>
                      <SelectItem value="mix">Mix of traditional & modern</SelectItem>
                      <SelectItem value="western">Western music</SelectItem>
                      <SelectItem value="all">Open to all types</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Relationship Goals */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-2">Relationship Goals</h2>
                <p className="text-muted-foreground">What are you looking for?</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>What are you looking for? *</Label>
                  <RadioGroup value={formData.lookingFor} onValueChange={(value) => updateFormData('lookingFor', value)} className="mt-3 space-y-3">
                    <div className="flex items-center space-x-3 p-4 border-2 border-border rounded-lg hover:border-primary cursor-pointer transition-colors">
                      <RadioGroupItem value="marriage" id="looking-marriage" />
                      <Label htmlFor="looking-marriage" className="flex-1 cursor-pointer">
                        <div className="font-semibold">Serious relationship leading to marriage</div>
                        <div className="text-sm text-muted-foreground">Ready to settle down</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border-2 border-border rounded-lg hover:border-primary cursor-pointer transition-colors">
                      <RadioGroupItem value="long-term" id="looking-long-term" />
                      <Label htmlFor="looking-long-term" className="flex-1 cursor-pointer">
                        <div className="font-semibold">Long-term relationship</div>
                        <div className="text-sm text-muted-foreground">Taking it step by step</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border-2 border-border rounded-lg hover:border-primary cursor-pointer transition-colors">
                      <RadioGroupItem value="open" id="looking-open" />
                      <Label htmlFor="looking-open" className="flex-1 cursor-pointer">
                        <div className="font-semibold">Open to seeing where it goes</div>
                        <div className="text-sm text-muted-foreground">No rush, getting to know someone first</div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="relationshipTimeline">Marriage timeline *</Label>
                  <Select value={formData.relationshipTimeline} onValueChange={(value) => updateFormData('relationshipTimeline', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="When do you see yourself getting married?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="within-year">Within a year</SelectItem>
                      <SelectItem value="1-2-years">1-2 years</SelectItem>
                      <SelectItem value="2-3-years">2-3 years</SelectItem>
                      <SelectItem value="3+ years">3+ years</SelectItem>
                      <SelectItem value="no-timeline">No specific timeline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-3 block">Age preference for partner</Label>
                  <div className="px-4 py-6">
                    <div className="flex justify-between mb-3">
                      <span className="text-sm font-medium">{formData.agePreference[0]} years</span>
                      <span className="text-sm font-medium">{formData.agePreference[1]} years</span>
                    </div>
                    <Slider
                      value={formData.agePreference}
                      onValueChange={(value) => updateFormData('agePreference', value as [number, number])}
                      min={18}
                      max={60}
                      step={1}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="idealPartner">Describe your ideal partner (optional)</Label>
                  <Textarea
                    id="idealPartner"
                    placeholder="What qualities are you looking for in a partner?"
                    value={formData.idealPartner}
                    onChange={(e) => updateFormData('idealPartner', e.target.value)}
                    className="mt-1 min-h-[100px]"
                  />
                </div>

                <div>
                  <Label className="mb-3 block">Deal breakers (select all that apply)</Label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {['Different faith', 'Doesn\'t want children', 'Smoking', 'Excessive drinking', 'Different political views', 'Long distance'].map((dealbreaker) => (
                      <div key={dealbreaker} className="flex items-center space-x-3 p-3 border-2 border-border rounded-lg hover:border-red-400 cursor-pointer transition-colors">
                        <Checkbox
                          id={dealbreaker}
                          checked={formData.dealBreakers.includes(dealbreaker)}
                          onCheckedChange={() => toggleArrayItem('dealBreakers', dealbreaker)}
                        />
                        <Label htmlFor={dealbreaker} className="flex-1 cursor-pointer">{dealbreaker}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 7: About You */}
          {currentStep === 7 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-2">Tell Your Story</h2>
                <p className="text-muted-foreground">This is how others will get to know you</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="bio">About Me * (minimum 50 characters)</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself, your values, what makes you unique, and what you're looking for in a partner..."
                    value={formData.bio}
                    onChange={(e) => updateFormData('bio', e.target.value)}
                    className="mt-1 min-h-[150px]"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    {formData.bio.length} / 50 characters minimum
                  </p>
                </div>

                <div>
                  <Label htmlFor="height">Height</Label>
                  <Select value={formData.height} onValueChange={(value) => updateFormData('height', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select your height" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 25 }, (_, i) => {
                        const feet = Math.floor((60 + i) / 12);
                        const inches = (60 + i) % 12;
                        return (
                          <SelectItem key={i} value={`${feet}'${inches}"`}>
                            {feet}'{inches}" ({Math.round(((60 + i) * 2.54))} cm)
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-3 block">Personality traits (select all that apply)</Label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {['Outgoing', 'Introverted', 'Humorous', 'Serious', 'Adventurous', 'Homebody', 'Spontaneous', 'Planner', 'Creative', 'Analytical', 'Optimistic', 'Thoughtful'].map((trait) => (
                      <div key={trait} className="flex items-center space-x-3 p-3 border-2 border-border rounded-lg hover:border-primary cursor-pointer transition-colors">
                        <Checkbox
                          id={trait}
                          checked={formData.personalityTraits.includes(trait)}
                          onCheckedChange={() => toggleArrayItem('personalityTraits', trait)}
                        />
                        <Label htmlFor={trait} className="flex-1 cursor-pointer">{trait}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-800">
                  <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-2">Almost done!</h4>
                      <p className="text-sm text-muted-foreground">
                        After submitting, you can add photos and review your profile before it goes live. 
                        All information can be edited later in your settings.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </Card>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          {currentStep > 1 && (
            <Button
              variant="outline"
              onClick={prevStep}
              className="flex-1"
              size="lg"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
          )}
          
          <Button
            onClick={nextStep}
            className={`${currentStep === 1 ? 'w-full' : 'flex-1'} bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700`}
            size="lg"
          >
            {currentStep === totalSteps ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Complete Profile
              </>
            ) : (
              <>
                Next Step
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
            <div
              key={step}
              className={`transition-all ${
                step === currentStep
                  ? 'w-8 h-2 bg-primary rounded-full'
                  : step < currentStep
                  ? 'w-2 h-2 bg-green-500 rounded-full'
                  : 'w-2 h-2 bg-muted rounded-full'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MatchOnboarding;
