import { useState } from 'react';
import { 
  ArrowLeft, Award, Check, Upload, DollarSign,
  Clock, BookOpen, Star, Users, TrendingUp, Zap,
  ChevronRight, AlertCircle
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
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Step 2: Expertise
    category: '',
    expertise: '',
    yearsExperience: '',
    currentRole: '',
    company: '',
    education: '',
    certifications: '',
    
    // Step 3: Mentoring Details
    bio: '',
    mentoringSince: '',
    sessionsCompleted: '',
    specializations: [] as string[],
    languages: [] as string[],
    
    // Step 4: Availability & Pricing
    hourlyRate: '',
    availability: [] as string[],
    sessionDuration: '60',
    maxSessionsPerWeek: '',
    
    // Step 5: Additional Info
    linkedIn: '',
    website: '',
    achievements: '',
    agreedToTerms: false,
    backgroundCheck: false
  });

  const totalSteps = 5;

  const categories = [
    'Career Development',
    'Business & Entrepreneurship',
    'Technology & IT',
    'Finance & Investment',
    'Education & Academia',
    'Personal Development',
    'Marketing & Sales',
    'Healthcare & Medical',
    'Legal & Compliance',
    'Arts & Creative'
  ];

  const availabilityOptions = [
    'Monday Morning',
    'Monday Afternoon',
    'Monday Evening',
    'Tuesday Morning',
    'Tuesday Afternoon',
    'Tuesday Evening',
    'Wednesday Morning',
    'Wednesday Afternoon',
    'Wednesday Evening',
    'Thursday Morning',
    'Thursday Afternoon',
    'Thursday Evening',
    'Friday Morning',
    'Friday Afternoon',
    'Friday Evening',
    'Saturday Morning',
    'Saturday Afternoon',
    'Sunday Morning',
    'Sunday Afternoon'
  ];

  const languageOptions = [
    'English',
    'Tigrinya (ትግርኛ)',
    'Amharic (አማርኛ)',
    'Spanish',
    'French',
    'Arabic',
    'Italian',
    'German'
  ];

  const handleNext = () => {
    // Validate current step
    if (currentStep === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        toast.error('Please fill in all required fields');
        return;
      }
    }
    
    if (currentStep === 2) {
      if (!formData.category || !formData.expertise || !formData.yearsExperience) {
        toast.error('Please fill in all required fields');
        return;
      }
    }

    if (currentStep === 3) {
      if (!formData.bio || formData.specializations.length === 0 || formData.languages.length === 0) {
        toast.error('Please fill in all required fields');
        return;
      }
    }

    if (currentStep === 4) {
      if (!formData.hourlyRate || formData.availability.length === 0) {
        toast.error('Please fill in all required fields');
        return;
      }
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = () => {
    if (!formData.agreedToTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    if (!formData.backgroundCheck) {
      toast.error('Background check consent is required');
      return;
    }

    // Simulate submission
    toast.loading('Submitting your application...');

    setTimeout(() => {
      toast.dismiss();
      toast.success('Application submitted successfully!', {
        description: 'We will review your application and get back to you within 2-3 business days.'
      });

      setTimeout(() => {
        navigate('/mentor');
      }, 2000);
    }, 2000);
  };

  const toggleArrayItem = (array: string[], item: string) => {
    if (array.includes(item)) {
      return array.filter(i => i !== item);
    } else {
      return [...array, item];
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => navigate('/mentor')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Become a Mentor
              </h1>
              <p className="text-base md:text-lg opacity-90">
                Share your expertise and help others succeed
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="max-w-4xl">
            <div className="flex items-center justify-between mb-2">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div
                  key={index}
                  className={`flex items-center ${index < totalSteps - 1 ? 'flex-1' : ''}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all ${
                      currentStep > index + 1
                        ? 'bg-white text-blue-600'
                        : currentStep === index + 1
                        ? 'bg-white text-blue-600'
                        : 'bg-white/30 text-white'
                    }`}
                  >
                    {currentStep > index + 1 ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  {index < totalSteps - 1 && (
                    <div
                      className={`h-1 flex-1 mx-2 transition-all ${
                        currentStep > index + 1 ? 'bg-white' : 'bg-white/30'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between text-xs md:text-sm">
              <span>Basic Info</span>
              <span>Expertise</span>
              <span>Mentoring</span>
              <span>Pricing</span>
              <span>Review</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Basic Information</h2>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="John"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Doe"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john.doe@example.com"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                  className="mt-1"
                />
              </div>
            </div>
          </Card>
        )}

        {/* Step 2: Expertise */}
        {currentStep === 2 && (
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Your Expertise</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="expertise">Primary Expertise *</Label>
                <Input
                  id="expertise"
                  value={formData.expertise}
                  onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                  placeholder="e.g., Software Engineering, Digital Marketing"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="yearsExperience">Years of Experience *</Label>
                <Input
                  id="yearsExperience"
                  type="number"
                  value={formData.yearsExperience}
                  onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}
                  placeholder="10"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="currentRole">Current Role</Label>
                <Input
                  id="currentRole"
                  value={formData.currentRole}
                  onChange={(e) => setFormData({ ...formData, currentRole: e.target.value })}
                  placeholder="Senior Software Engineer"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Tech Corp"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="education">Education</Label>
                <Input
                  id="education"
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  placeholder="M.S. Computer Science - Stanford University"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="certifications">Certifications (comma separated)</Label>
                <Input
                  id="certifications"
                  value={formData.certifications}
                  onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                  placeholder="PMP, AWS Certified, Scrum Master"
                  className="mt-1"
                />
              </div>
            </div>
          </Card>
        )}

        {/* Step 3: Mentoring Details */}
        {currentStep === 3 && (
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Mentoring Details</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="bio">Professional Bio *</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell us about your professional journey, expertise, and what you can help mentees with..."
                  className="mt-1 min-h-[150px]"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.bio.length}/500 characters
                </p>
              </div>

              <div>
                <Label>Languages You Can Mentor In * (Select all that apply)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                  {languageOptions.map((lang) => (
                    <div key={lang} className="flex items-center space-x-2">
                      <Checkbox
                        id={`lang-${lang}`}
                        checked={formData.languages.includes(lang)}
                        onCheckedChange={() => {
                          setFormData({
                            ...formData,
                            languages: toggleArrayItem(formData.languages, lang)
                          });
                        }}
                      />
                      <label
                        htmlFor={`lang-${lang}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {lang}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="achievements">Key Achievements</Label>
                <Textarea
                  id="achievements"
                  value={formData.achievements}
                  onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                  placeholder="List your notable achievements, awards, or recognitions..."
                  className="mt-1"
                />
              </div>
            </div>
          </Card>
        )}

        {/* Step 4: Availability & Pricing */}
        {currentStep === 4 && (
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Availability & Pricing</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="hourlyRate">Hourly Rate (USD) *</Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="hourlyRate"
                    type="number"
                    value={formData.hourlyRate}
                    onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                    placeholder="75"
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Suggested range: $50-$200 per hour based on experience
                </p>
              </div>

              <div>
                <Label htmlFor="sessionDuration">Default Session Duration</Label>
                <Select value={formData.sessionDuration} onValueChange={(value) => setFormData({ ...formData, sessionDuration: value })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                    <SelectItem value="90">90 minutes</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="maxSessions">Maximum Sessions Per Week</Label>
                <Input
                  id="maxSessions"
                  type="number"
                  value={formData.maxSessionsPerWeek}
                  onChange={(e) => setFormData({ ...formData, maxSessionsPerWeek: e.target.value })}
                  placeholder="5"
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Availability * (Select all time slots you're available)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 max-h-64 overflow-y-auto p-2 border rounded-lg">
                  {availabilityOptions.map((slot) => (
                    <div key={slot} className="flex items-center space-x-2">
                      <Checkbox
                        id={`avail-${slot}`}
                        checked={formData.availability.includes(slot)}
                        onCheckedChange={() => {
                          setFormData({
                            ...formData,
                            availability: toggleArrayItem(formData.availability, slot)
                          });
                        }}
                      />
                      <label
                        htmlFor={`avail-${slot}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {slot}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Step 5: Review & Submit */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Review Your Application</h2>
              
              <div className="space-y-6">
                {/* Basic Info Review */}
                <div>
                  <h3 className="font-bold text-lg mb-3 flex items-center">
                    <Check className="w-5 h-5 mr-2 text-green-600" />
                    Basic Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Name:</span>
                      <p className="font-semibold">{formData.firstName} {formData.lastName}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Email:</span>
                      <p className="font-semibold">{formData.email}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Phone:</span>
                      <p className="font-semibold">{formData.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Expertise Review */}
                <div>
                  <h3 className="font-bold text-lg mb-3 flex items-center">
                    <Check className="w-5 h-5 mr-2 text-green-600" />
                    Expertise
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Category:</span>
                      <p className="font-semibold">{formData.category}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Primary Expertise:</span>
                      <p className="font-semibold">{formData.expertise}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Experience:</span>
                      <p className="font-semibold">{formData.yearsExperience} years</p>
                    </div>
                    {formData.currentRole && (
                      <div>
                        <span className="text-muted-foreground">Current Role:</span>
                        <p className="font-semibold">{formData.currentRole}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pricing Review */}
                <div>
                  <h3 className="font-bold text-lg mb-3 flex items-center">
                    <Check className="w-5 h-5 mr-2 text-green-600" />
                    Pricing & Availability
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Hourly Rate:</span>
                      <p className="font-semibold">${formData.hourlyRate}/hour</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Session Duration:</span>
                      <p className="font-semibold">{formData.sessionDuration} minutes</p>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-muted-foreground">Available Time Slots:</span>
                      <p className="font-semibold">{formData.availability.length} slots selected</p>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div>
                  <Label htmlFor="linkedIn">LinkedIn Profile (Optional)</Label>
                  <Input
                    id="linkedIn"
                    value={formData.linkedIn}
                    onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="website">Personal Website (Optional)</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://yourwebsite.com"
                    className="mt-1"
                  />
                </div>
              </div>
            </Card>

            {/* Terms and Conditions */}
            <Card className="p-6 border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={formData.agreedToTerms}
                    onCheckedChange={(checked) => setFormData({ ...formData, agreedToTerms: checked as boolean })}
                  />
                  <div className="flex-1">
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      I agree to the Mentor Terms of Service and Code of Conduct
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">
                      By becoming a mentor, you agree to maintain professional standards and provide quality mentorship
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="background"
                    checked={formData.backgroundCheck}
                    onCheckedChange={(checked) => setFormData({ ...formData, backgroundCheck: checked as boolean })}
                  />
                  <div className="flex-1">
                    <label
                      htmlFor="background"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      I consent to a background check (if required)
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">
                      This helps us maintain a safe and trusted community
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentStep < totalSteps ? (
            <Button onClick={handleNext}>
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              disabled={!formData.agreedToTerms || !formData.backgroundCheck}
            >
              Submit Application
              <Check className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BecomeMentor;
