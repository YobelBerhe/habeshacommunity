import { useState } from 'react';
import { 
  ArrowLeft, ArrowRight, CheckCircle, Award, DollarSign,
  Clock, Users, Sparkles, Upload, X, Info, Star,
  Globe, MapPin, Briefcase, GraduationCap, Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const BecomeMentor = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    timezone: '',
    languages: [] as string[],
    
    // Step 2: Professional Background
    currentTitle: '',
    currentCompany: '',
    yearsExperience: '',
    linkedinUrl: '',
    websiteUrl: '',
    education: '',
    
    // Step 3: Expertise & Categories
    categories: [] as string[],
    expertise: [] as string[],
    certifications: '',
    achievements: '',
    
    // Step 4: Mentorship Details
    bio: '',
    mentorshipGoals: '',
    idealMentee: '',
    sessionTypes: [] as string[],
    availability: '',
    
    // Step 5: Pricing & Availability
    pricing30min: '',
    pricing60min: '',
    pricing90min: '',
    availability_days: [] as string[],
    preferredTimes: [] as string[],
    agreedToTerms: false
  });

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: string, value: string) => {
    const currentArray = formData[field as keyof typeof formData] as string[];
    if (currentArray.includes(value)) {
      updateFormData(field, currentArray.filter(item => item !== value));
    } else {
      updateFormData(field, [...currentArray, value]);
    }
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.location) {
          toast.error('Please fill in all required fields');
          return false;
        }
        if (formData.languages.length === 0) {
          toast.error('Please select at least one language');
          return false;
        }
        break;
      case 2:
        if (!formData.currentTitle || !formData.currentCompany || !formData.yearsExperience) {
          toast.error('Please complete your professional background');
          return false;
        }
        break;
      case 3:
        if (formData.categories.length === 0 || formData.expertise.length === 0) {
          toast.error('Please select at least one category and expertise area');
          return false;
        }
        break;
      case 4:
        if (!formData.bio || formData.bio.length < 100) {
          toast.error('Please write a bio (at least 100 characters)');
          return false;
        }
        if (formData.sessionTypes.length === 0) {
          toast.error('Please select at least one session type');
          return false;
        }
        break;
      case 5:
        if (!formData.pricing60min) {
          toast.error('Please set your pricing');
          return false;
        }
        if (formData.availability_days.length === 0) {
          toast.error('Please select your available days');
          return false;
        }
        if (!formData.agreedToTerms) {
          toast.error('Please agree to the terms and conditions');
          return false;
        }
        break;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      if (step < totalSteps) {
        setStep(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        handleSubmit();
      }
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    try {
      // TODO: Submit to Supabase
      toast.success('Application submitted! 🎉', {
        description: 'We\'ll review your application and get back to you within 48 hours'
      });

      setTimeout(() => {
        navigate('/mentor');
      }, 2000);
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application. Please try again.');
    }
  };

  const progressPercentage = (step / totalSteps) * 100;

  const categories = [
    'Business & Entrepreneurship',
    'Technology & Software',
    'Career Development',
    'Education & Learning',
    'Life & Personal Growth',
    'Finance & Investing',
    'Marketing & Sales',
    'Design & Creative'
  ];

  const expertiseAreas = [
    'Software Engineering',
    'Product Management',
    'Data Science',
    'UI/UX Design',
    'Marketing Strategy',
    'Business Strategy',
    'Fundraising',
    'Career Coaching',
    'Technical Interviews',
    'Leadership',
    'Entrepreneurship',
    'Immigration'
  ];

  const languages = [
    'Tigrinya',
    'Amharic',
    'English',
    'Arabic',
    'Italian',
    'French',
    'Spanish'
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const times = ['Morning (6am-12pm)', 'Afternoon (12pm-6pm)', 'Evening (6pm-10pm)', 'Night (10pm-2am)'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-purple-50/20 dark:via-purple-950/10 to-background pb-20 md:pb-8">
      {/* Header */}
      <div className="sticky top-14 md:top-16 z-40 bg-background/95 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => step === 1 ? navigate(-1) : prevStep()}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-bold">Become a Mentor</h1>
                <p className="text-xs text-muted-foreground">Step {step} of {totalSteps}</p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-600 transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <Card className="p-6 md:p-8 animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Tell Us About Yourself</h2>
              <p className="text-muted-foreground">Let's start with the basics</p>
            </div>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    placeholder="Your first name"
                    value={formData.firstName}
                    onChange={(e) => updateFormData('firstName', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    placeholder="Your last name"
                    value={formData.lastName}
                    onChange={(e) => updateFormData('lastName', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location *</Label>
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
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={formData.timezone} onValueChange={(value) => updateFormData('timezone', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pst">PST (UTC-8)</SelectItem>
                      <SelectItem value="est">EST (UTC-5)</SelectItem>
                      <SelectItem value="gmt">GMT (UTC+0)</SelectItem>
                      <SelectItem value="eat">EAT (UTC+3)</SelectItem>
                      <SelectItem value="cet">CET (UTC+1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="mb-3 block">Languages you speak * (select all)</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {languages.map((language) => (
                    <div key={language} className="flex items-center space-x-2 p-3 border-2 border-border rounded-lg hover:border-primary cursor-pointer transition-colors">
                      <Checkbox
                        id={language}
                        checked={formData.languages.includes(language)}
                        onCheckedChange={() => toggleArrayItem('languages', language)}
                      />
                      <Label htmlFor={language} className="flex-1 cursor-pointer text-sm">{language}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Step 2: Professional Background */}
        {step === 2 && (
          <Card className="p-6 md:p-8 animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Professional Background</h2>
              <p className="text-muted-foreground">Share your experience and credentials</p>
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor="currentTitle">Current Job Title *</Label>
                <Input
                  id="currentTitle"
                  placeholder="e.g., Senior Software Engineer"
                  value={formData.currentTitle}
                  onChange={(e) => updateFormData('currentTitle', e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="currentCompany">Current Company *</Label>
                <Input
                  id="currentCompany"
                  placeholder="e.g., Google"
                  value={formData.currentCompany}
                  onChange={(e) => updateFormData('currentCompany', e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="yearsExperience">Years of Experience *</Label>
                <Select value={formData.yearsExperience} onValueChange={(value) => updateFormData('yearsExperience', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-3">1-3 years</SelectItem>
                    <SelectItem value="3-5">3-5 years</SelectItem>
                    <SelectItem value="5-10">5-10 years</SelectItem>
                    <SelectItem value="10+">10+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="education">Highest Education Level</Label>
                <Select value={formData.education} onValueChange={(value) => updateFormData('education', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select education" />
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
                <Label htmlFor="linkedinUrl">LinkedIn Profile URL</Label>
                <Input
                  id="linkedinUrl"
                  type="url"
                  placeholder="https://linkedin.com/in/yourprofile"
                  value={formData.linkedinUrl}
                  onChange={(e) => updateFormData('linkedinUrl', e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="websiteUrl">Personal Website (optional)</Label>
                <Input
                  id="websiteUrl"
                  type="url"
                  placeholder="https://yourwebsite.com"
                  value={formData.websiteUrl}
                  onChange={(e) => updateFormData('websiteUrl', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </Card>
        )}

        {/* Step 3: Expertise & Categories */}
        {step === 3 && (
          <Card className="p-6 md:p-8 animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Your Expertise</h2>
              <p className="text-muted-foreground">What can you help mentees with?</p>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="mb-3 block">Mentorship Categories * (select all that apply)</Label>
                <div className="grid md:grid-cols-2 gap-3">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-3 p-3 border-2 border-border rounded-lg hover:border-primary cursor-pointer transition-colors">
                      <Checkbox
                        id={category}
                        checked={formData.categories.includes(category)}
                        onCheckedChange={() => toggleArrayItem('categories', category)}
                      />
                      <Label htmlFor={category} className="flex-1 cursor-pointer text-sm">{category}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="mb-3 block">Specific Expertise Areas * (select at least 3)</Label>
                <div className="grid md:grid-cols-2 gap-3">
                  {expertiseAreas.map((area) => (
                    <div key={area} className="flex items-center space-x-3 p-3 border-2 border-border rounded-lg hover:border-primary cursor-pointer transition-colors">
                      <Checkbox
                        id={area}
                        checked={formData.expertise.includes(area)}
                        onCheckedChange={() => toggleArrayItem('expertise', area)}
                      />
                      <Label htmlFor={area} className="flex-1 cursor-pointer text-sm">{area}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="certifications">Certifications & Awards (optional)</Label>
                <Textarea
                  id="certifications"
                  placeholder="List any relevant certifications, awards, or achievements..."
                  value={formData.certifications}
                  onChange={(e) => updateFormData('certifications', e.target.value)}
                  className="mt-1 min-h-[100px]"
                />
              </div>

              <div>
                <Label htmlFor="achievements">Notable Achievements (optional)</Label>
                <Textarea
                  id="achievements"
                  placeholder="Share any notable achievements or milestones in your career..."
                  value={formData.achievements}
                  onChange={(e) => updateFormData('achievements', e.target.value)}
                  className="mt-1 min-h-[100px]"
                />
              </div>
            </div>
          </Card>
        )}

        {/* Step 4: Mentorship Details */}
        {step === 4 && (
          <Card className="p-6 md:p-8 animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Your Mentorship Approach</h2>
              <p className="text-muted-foreground">Help mentees understand what to expect</p>
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor="bio">About Me * (minimum 100 characters)</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell potential mentees about yourself, your experience, your mentorship style, and what you're passionate about..."
                  value={formData.bio}
                  onChange={(e) => updateFormData('bio', e.target.value)}
                  className="mt-1 min-h-[150px]"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {formData.bio.length} / 100 characters minimum
                </p>
              </div>

              <div>
                <Label htmlFor="mentorshipGoals">What are your mentorship goals?</Label>
                <Textarea
                  id="mentorshipGoals"
                  placeholder="What do you hope to achieve as a mentor? What impact do you want to make?"
                  value={formData.mentorshipGoals}
                  onChange={(e) => updateFormData('mentorshipGoals', e.target.value)}
                  className="mt-1 min-h-[100px]"
                />
              </div>

              <div>
                <Label htmlFor="idealMentee">Describe your ideal mentee</Label>
                <Textarea
                  id="idealMentee"
                  placeholder="Who do you work best with? What qualities do you look for in a mentee?"
                  value={formData.idealMentee}
                  onChange={(e) => updateFormData('idealMentee', e.target.value)}
                  className="mt-1 min-h-[100px]"
                />
              </div>

              <div>
                <Label className="mb-3 block">Session Types Offered * (select all)</Label>
                <div className="space-y-3">
                  {[
                    { value: 'one-on-one', label: 'One-on-One Coaching', desc: 'Individual mentorship sessions' },
                    { value: 'career', label: 'Career Guidance', desc: 'Career planning and development' },
                    { value: 'interview', label: 'Interview Preparation', desc: 'Mock interviews and feedback' },
                    { value: 'resume', label: 'Resume Review', desc: 'Review and improve resumes' },
                    { value: 'project', label: 'Project Review', desc: 'Review code or projects' }
                  ].map((type) => (
                    <div key={type.value} className="flex items-center space-x-3 p-4 border-2 border-border rounded-lg hover:border-primary cursor-pointer transition-colors">
                      <Checkbox
                        id={type.value}
                        checked={formData.sessionTypes.includes(type.value)}
                        onCheckedChange={() => toggleArrayItem('sessionTypes', type.value)}
                      />
                      <Label htmlFor={type.value} className="flex-1 cursor-pointer">
                        <div className="font-semibold">{type.label}</div>
                        <div className="text-sm text-muted-foreground">{type.desc}</div>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Step 5: Pricing & Availability */}
        {step === 5 && (
          <Card className="p-6 md:p-8 animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradie
