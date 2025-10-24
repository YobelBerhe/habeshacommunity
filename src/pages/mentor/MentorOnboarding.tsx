import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, CheckCircle, Upload, Award, Zap, Shield,
  ChevronRight, User, Briefcase, DollarSign, Calendar,
  Video, FileText, Camera, AlertCircle, Lock, Youtube
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const MentorOnboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState({
    // Basic Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Expertise
    category: '',
    expertise: '',
    yearsExperience: '',
    currentRole: '',
    company: '',
    education: '',
    
    // About & Video
    bio: '',
    youtubeIntroVideo: '', // NEW - YouTube video link
    
    // Pricing
    hourlyRate: '',
    
    // Verification - NEW
    idFrontImage: null as File | null,
    idBackImage: null as File | null,
    selfieVideo: null as File | null,
    
    // Agreement
    agreedToTerms: false,
    agreedToBackgroundCheck: false,
    agreedToEscrow: false, // NEW - Escrow agreement
  });

  const totalSteps = 7; // Added verification step

  const categories = [
    'Career Development',
    'Business & Entrepreneurship',
    'Technology & IT',
    'Finance & Investment',
    'Education & Academia',
    'Personal Development',
    'Language',
    'Health & Wellness',
    'Immigration'
  ];

  // Extract YouTube video ID from URL
  const extractYouTubeId = (url: string) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  const handleFileUpload = (field: string, file: File) => {
    if (field === 'selfieVideo') {
      // Check video size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        toast.error('Video must be less than 50MB');
        return;
      }
    } else {
      // Check image size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }
    }
    
    setFormData({ ...formData, [field]: file });
    toast.success('File uploaded successfully!');
  };

  const handleNext = () => {
    // Step validations
    if (currentStep === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email) {
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
      if (!formData.bio || formData.bio.length < 100) {
        toast.error('Bio must be at least 100 characters');
        return;
      }
    }

    if (currentStep === 4) {
      if (!formData.hourlyRate) {
        toast.error('Please set your hourly rate');
        return;
      }
    }

    if (currentStep === 5) {
      // Verification step - all required
      if (!formData.idFrontImage || !formData.idBackImage || !formData.selfieVideo) {
        toast.error('All verification documents are required for safety');
        return;
      }
    }

    if (currentStep === 6) {
      if (!formData.agreedToTerms || !formData.agreedToBackgroundCheck || !formData.agreedToEscrow) {
        toast.error('Please agree to all terms');
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
    toast.loading('Submitting your application for verification...');

    // In production, upload files to Supabase storage here
    setTimeout(() => {
      toast.dismiss();
      toast.success('Application submitted successfully!', {
        description: 'Our team will review your verification documents within 24-48 hours.'
      });

      setTimeout(() => {
        navigate('/mentor/dashboard');
      }, 2000);
    }, 2000);
  };

  const youtubeVideoId = formData.youtubeIntroVideo ? extractYouTubeId(formData.youtubeIntroVideo) : null;

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 text-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/20 mb-4"
            onClick={() => navigate('/mentor')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Mentors
          </Button>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-1">
                Become a Verified Mentor
              </h1>
              <p className="text-base md:text-lg opacity-90">
                Join our trusted community of professionals
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
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                      currentStep > index + 1
                        ? 'bg-white text-green-600'
                        : currentStep === index + 1
                        ? 'bg-white text-green-600'
                        : 'bg-white/30 text-white'
                    }`}
                  >
                    {currentStep > index + 1 ? (
                      <CheckCircle className="w-5 h-5" />
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
            <div className="flex items-center justify-between text-xs">
              <span>Info</span>
              <span>Expertise</span>
              <span>Bio</span>
              <span>Pricing</span>
              <span>Verify</span>
              <span>Terms</span>
              <span>Review</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
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
                  placeholder="Google, Amazon, etc."
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="education">Education</Label>
                <Input
                  id="education"
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  placeholder="M.S. Computer Science - Stanford"
                  className="mt-1"
                />
              </div>
            </div>
          </Card>
        )}

        {/* Step 3: Bio & YouTube Video */}
        {currentStep === 3 && (
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">About You & Introduction Video</h2>
            <div className="space-y-6">
              <div>
                <Label htmlFor="bio">Professional Bio *</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell us about your professional journey, expertise, and what you can help mentees with..."
                  className="mt-1 min-h-[200px]"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.bio.length}/500 characters (minimum 100)
                </p>
              </div>

              <Separator />

              <div>
                <Label htmlFor="youtubeIntroVideo" className="flex items-center gap-2">
                  <Youtube className="w-5 h-5 text-red-600" />
                  YouTube Introduction Video (Optional but Recommended)
                </Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Add a 1-2 minute intro video to showcase your personality and expertise
                </p>
                <Input
                  id="youtubeIntroVideo"
                  value={formData.youtubeIntroVideo}
                  onChange={(e) => setFormData({ ...formData, youtubeIntroVideo: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="mt-1"
                />

                {youtubeVideoId && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold mb-2">Video Preview:</p>
                    <div className="aspect-video rounded-lg overflow-hidden">
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                )}

                <div className="mt-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900 dark:text-blue-100">
                      <p className="font-semibold mb-1">Why add a video?</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Mentees can see your communication style</li>
                        <li>Builds trust and authenticity</li>
                        <li>Increases booking rate by 3x</li>
                        <li>No storage cost - hosted on YouTube</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Step 4: Pricing */}
        {currentStep === 4 && (
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Pricing & Payment Terms</h2>
            <div className="space-y-6">
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

              <Separator />

              {/* Escrow Payment Info */}
              <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-green-900 dark:text-green-100">
                    <p className="font-semibold mb-2">🔒 Secure Escrow Payment System</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Payment is held securely when session is booked</li>
                      <li>You receive payment 24 hours after session completion</li>
                      <li>Mentee can request refund if session wasn't delivered</li>
                      <li>Similar to Amazon - funds released after service confirmed</li>
                      <li>10% platform fee deducted from your earnings</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Step 5: Verification Documents */}
        {currentStep === 5 && (
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <h2 className="text-2xl font-bold">Identity Verification</h2>
                <p className="text-sm text-muted-foreground">Required for trust and safety</p>
              </div>
            </div>

            <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-900 dark:text-amber-100">
                  <p className="font-semibold mb-1">Why Verification?</p>
                  <p className="text-xs">
                    We verify all mentors to ensure safety and trust. Your documents are encrypted and only used for verification. This protects both mentors and mentees.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* ID Front */}
              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4" />
                  Government ID - Front * (Driver's License, Passport, etc.)
                </Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                  <input
                    type="file"
                    id="idFront"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files && handleFileUpload('idFrontImage', e.target.files[0])}
                  />
                  <label htmlFor="idFront" className="cursor-pointer">
                    {formData.idFrontImage ? (
                      <div className="flex items-center justify-center gap-2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-semibold">{formData.idFrontImage.name}</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm font-semibold mb-1">Click to upload ID front</p>
                        <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* ID Back */}
              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4" />
                  Government ID - Back *
                </Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                  <input
                    type="file"
                    id="idBack"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files && handleFileUpload('idBackImage', e.target.files[0])}
                  />
                  <label htmlFor="idBack" className="cursor-pointer">
                    {formData.idBackImage ? (
                      <div className="flex items-center justify-center gap-2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-semibold">{formData.idBackImage.name}</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm font-semibold mb-1">Click to upload ID back</p>
                        <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Selfie Video */}
              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <Camera className="w-4 h-4" />
                  Selfie Verification Video * (5-10 seconds)
                </Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Record a short video saying: "I am [Your Name] and I want to become a mentor on Habesha Community"
                </p>
                <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                  <input
                    type="file"
                    id="selfieVideo"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => e.target.files && handleFileUpload('selfieVideo', e.target.files[0])}
                  />
                  <label htmlFor="selfieVideo" className="cursor-pointer">
                    {formData.selfieVideo ? (
                      <div className="flex items-center justify-center gap-2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-semibold">{formData.selfieVideo.name}</span>
                      </div>
                    ) : (
                      <>
                        <Video className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm font-semibold mb-1">Click to upload verification video</p>
                        <p className="text-xs text-muted-foreground">MP4, MOV up to 50MB</p>
                      </>
                    )}
                  </label>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Step 6: Terms & Agreements */}
        {currentStep === 6 && (
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Terms & Agreements</h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 border rounded-lg">
                <Checkbox
                  id="terms"
                  checked={formData.agreedToTerms}
                  onCheckedChange={(checked) => setFormData({ ...formData, agreedToTerms: checked as boolean })}
                />
                <div className="flex-1">
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    I agree to the Mentor Terms of Service and Code of Conduct *
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Maintain professionalism, provide quality mentorship, and respect all mentees
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 border rounded-lg">
                <Checkbox
                  id="background"
                  checked={formData.agreedToBackgroundCheck}
                  onCheckedChange={(checked) => setFormData({ ...formData, agreedToBackgroundCheck: checked as boolean })}
                />
                <div className="flex-1">
                  <label
                    htmlFor="background"
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    I consent to identity verification and background check *
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    This helps us maintain a safe and trusted community
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 border rounded-lg bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                <Checkbox
                  id="escrow"
                  checked={formData.agreedToEscrow}
                  onCheckedChange={(checked) => setFormData({ ...formData, agreedToEscrow: checked as boolean })}
                />
                <div className="flex-1">
                  <label
                    htmlFor="escrow"
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    I understand and agree to the Escrow Payment System *
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Payments are held securely and released 24 hours after session completion. Platform fee: 10%
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Step 7: Review */}
        {currentStep === 7 && (
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Review Your Application</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-lg mb-3 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                    Basic Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3 text-sm pl-7">
                    <div>
                      <span className="text-muted-foreground">Name:</span>
                      <p className="font-semibold">{formData.firstName} {formData.lastName}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Email:</span>
                      <p className="font-semibold">{formData.email}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-bold text-lg mb-3 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                    Expertise
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3 text-sm pl-7">
                    <div>
                      <span className="text-muted-foreground">Category:</span>
                      <p className="font-semibold">{formData.category}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Experience:</span>
                      <p className="font-semibold">{formData.yearsExperience} years</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-bold text-lg mb-3 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                    Pricing
                  </h3>
                  <div className="pl-7 text-sm">
                    <span className="text-muted-foreground">Hourly Rate:</span>
                    <p className="font-semibold text-xl text-green-600">${formData.hourlyRate}/hour</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-bold text-lg mb-3 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                    Verification Status
                  </h3>
                  <div className="pl-7 space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        ID Uploaded
                      </Badge>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Video Uploaded
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      ⏱️ Verification typically takes 24-48 hours
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    What Happens Next?
                  </h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>✅ Our team will review your documents (24-48 hours)</li>
                    <li>✅ You'll receive an email once verified</li>
                    <li>✅ Your profile will get a verified badge</li>
                    <li>✅ You can start accepting mentorship sessions!</li>
                  </ul>
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
            size="lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentStep < totalSteps ? (
            <Button onClick={handleNext} size="lg">
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              size="lg"
              className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Submit for Verification
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorOnboarding;
