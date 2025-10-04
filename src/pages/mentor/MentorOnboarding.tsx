import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import MentorHeader from '@/components/MentorHeader';
import { getAppState } from '@/utils/storage';
import { supabase } from '@/integrations/supabase/client';
import PhotoUpload from '@/components/PhotoUpload';
import CountryFlag from '@/components/CountryFlag';
import MentorSkillsEditor from '@/components/MentorSkillsEditor';
import { toast } from 'sonner';

const popularTopics = [
  'Career Development', 'Technical Skills', 'Leadership', 'Entrepreneurship',
  'Software Engineering', 'Data Science', 'Product Management', 'Marketing',
  'Finance', 'Design', 'Business Strategy', 'Personal Development'
];

const popularSkills = [
  'React', 'Python', 'JavaScript', 'AI/ML', 'Career Coaching', 'Leadership',
  'Product Strategy', 'Data Analysis', 'UX Design', 'Business Development',
  'Marketing Strategy', 'Public Speaking', 'Fundraising', 'Team Building'
];

const industries = [
  'Technology', 'Healthcare', 'Finance', 'Education', 'E-commerce',
  'SaaS', 'Consulting', 'Non-Profit', 'Media', 'Real Estate',
  'Manufacturing', 'Retail', 'Hospitality', 'Legal', 'Startups'
];

const languages = ['English', 'Amharic', 'Tigrinya', 'Oromo', 'Arabic', 'Spanish', 'French', 'German'];

export default function MentorOnboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [createdMentorId, setCreatedMentorId] = useState<string | null>(null);
  const appState = getAppState();

  const [formData, setFormData] = useState({
    display_name: '',
    bio: '',
    city: '',
    country: '',
    price_cents: '',
    currency: 'USD',
    topics: [] as string[],
    languages: [] as string[],
    skills: [] as string[],
    industries: [] as string[],
    custom_topic: '',
    custom_skill: '',
    custom_industry: '',
    photos: [] as string[],
    website_url: '',
    plan_description: '2 calls per month (30min/call)',
    social_links: {
      twitter: '',
      linkedin: '',
      instagram: '',
      facebook: ''
    }
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.display_name || !formData.bio || !formData.city || !formData.price_cents) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('mentors')
        .insert([{
          user_id: user.id,
          name: formData.display_name,
          display_name: formData.display_name,
          bio: formData.bio,
          city: formData.city,
          country: formData.country,
          price_cents: parseInt(formData.price_cents) * 100,
          currency: formData.currency,
          topics: formData.topics,
          languages: formData.languages,
          skills: formData.skills,
          industries: formData.industries,
          photos: formData.photos,
          website_url: formData.website_url || null,
          available: true,
          title: formData.plan_description
        }])
        .select();

      if (error) throw error;

      // Set the created mentor ID for skills editor
      if (data && data.length > 0) {
        setCreatedMentorId(data[0].id);
        toast.success('Mentor profile created! Now add your skills.');
      } else {
        throw new Error('Failed to get mentor ID');
      }
    } catch (error) {
      console.error('Error creating mentor profile:', error);
      toast.error('Failed to create mentor profile');
      setLoading(false);
    }
  };

  const addTopic = (topic: string) => {
    if (!formData.topics.includes(topic)) {
      setFormData({ ...formData, topics: [...formData.topics, topic] });
    }
  };

  const removeTopic = (topic: string) => {
    setFormData({ ...formData, topics: formData.topics.filter(t => t !== topic) });
  };

  const addCustomTopic = () => {
    if (formData.custom_topic.trim() && !formData.topics.includes(formData.custom_topic.trim())) {
      setFormData({ 
        ...formData, 
        topics: [...formData.topics, formData.custom_topic.trim()],
        custom_topic: ''
      });
    }
  };

  const toggleLanguage = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }));
  };

  const addSkill = (skill: string) => {
    if (!formData.skills.includes(skill)) {
      setFormData({ ...formData, skills: [...formData.skills, skill] });
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
  };

  const addCustomSkill = () => {
    if (formData.custom_skill.trim() && !formData.skills.includes(formData.custom_skill.trim())) {
      setFormData({ 
        ...formData, 
        skills: [...formData.skills, formData.custom_skill.trim()],
        custom_skill: ''
      });
    }
  };

  const addIndustry = (industry: string) => {
    if (!formData.industries.includes(industry)) {
      setFormData({ ...formData, industries: [...formData.industries, industry] });
    }
  };

  const removeIndustry = (industry: string) => {
    setFormData({ ...formData, industries: formData.industries.filter(i => i !== industry) });
  };

  const addCustomIndustry = () => {
    if (formData.custom_industry.trim() && !formData.industries.includes(formData.custom_industry.trim())) {
      setFormData({ 
        ...formData, 
        industries: [...formData.industries, formData.custom_industry.trim()],
        custom_industry: ''
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <MentorHeader 
        title="Become a Mentor" 
        backPath="/mentor" 
      />
      
      <div className="container max-w-3xl mx-auto px-4 py-8">

        {!createdMentorId ? (
          <Card>
            <CardHeader>
              <CardTitle>Become a Mentor</CardTitle>
              <CardDescription>Share your expertise and help others grow</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2">Profile Photo *</label>
                  <PhotoUpload
                    photos={formData.photos}
                    onPhotosChange={(photos) => setFormData({ ...formData, photos })}
                    maxPhotos={1}
                  />
                </div>

                {/* Display Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">Display Name *</label>
                  <Input
                    value={formData.display_name}
                    onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                    placeholder="How should mentees call you?"
                    required
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium mb-2">Bio *</label>
                  <Textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell us about your experience and what you can help with..."
                    rows={4}
                    required
                  />
                </div>

                {/* Location */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">City *</label>
                    <Input
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g., New York"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Country</label>
                    <Input
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      placeholder="e.g., USA"
                    />
                  </div>
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Session Price *</label>
                    <Input
                      type="number"
                      value={formData.price_cents}
                      onChange={(e) => setFormData({ ...formData, price_cents: e.target.value })}
                      placeholder="50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Currency</label>
                    <Select
                      value={formData.currency}
                      onValueChange={(value) => setFormData({ ...formData, currency: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Plan Details */}
                <div>
                  <label className="block text-sm font-medium mb-2">Plan Details</label>
                  <Input
                    value={formData.plan_description}
                    onChange={(e) => setFormData({ ...formData, plan_description: e.target.value })}
                    placeholder="e.g., 2 calls per month (30min/call)"
                  />
                </div>

                {/* Expertise Areas */}
                <div>
                  <label className="block text-sm font-medium mb-2">Expertise Areas</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {popularTopics.map(topic => (
                      <Badge
                        key={topic}
                        variant={formData.topics.includes(topic) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => formData.topics.includes(topic) ? removeTopic(topic) : addTopic(topic)}
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      value={formData.custom_topic}
                      onChange={(e) => setFormData({ ...formData, custom_topic: e.target.value })}
                      placeholder="Add custom topic"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomTopic())}
                    />
                    <Button type="button" variant="outline" onClick={addCustomTopic}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {formData.topics.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.topics.map(topic => (
                        <Badge key={topic} variant="secondary">
                          {topic}
                          <button
                            type="button"
                            onClick={() => removeTopic(topic)}
                            className="ml-2 hover:text-destructive"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Languages */}
                <div>
                  <label className="block text-sm font-medium mb-2">Languages</label>
                  <div className="flex flex-wrap gap-2">
                    {languages.map(lang => (
                      <Badge
                        key={lang}
                        variant={formData.languages.includes(lang) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleLanguage(lang)}
                      >
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-sm font-medium mb-2">Key Skills</label>
                  <p className="text-sm text-muted-foreground mb-3">Select or add your key skills that mentees can filter by</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {popularSkills.map(skill => (
                      <Badge
                        key={skill}
                        variant={formData.skills.includes(skill) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => formData.skills.includes(skill) ? removeSkill(skill) : addSkill(skill)}
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      value={formData.custom_skill}
                      onChange={(e) => setFormData({ ...formData, custom_skill: e.target.value })}
                      placeholder="Add custom skill"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSkill())}
                    />
                    <Button type="button" variant="outline" onClick={addCustomSkill}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {formData.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.skills.map(skill => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="ml-2 hover:text-destructive"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Industries */}
                <div>
                  <label className="block text-sm font-medium mb-2">Industries</label>
                  <p className="text-sm text-muted-foreground mb-3">Select industries you have experience in</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {industries.map(industry => (
                      <Badge
                        key={industry}
                        variant={formData.industries.includes(industry) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => formData.industries.includes(industry) ? removeIndustry(industry) : addIndustry(industry)}
                      >
                        {industry}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      value={formData.custom_industry}
                      onChange={(e) => setFormData({ ...formData, custom_industry: e.target.value })}
                      placeholder="Add custom industry"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomIndustry())}
                    />
                    <Button type="button" variant="outline" onClick={addCustomIndustry}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {formData.industries.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.industries.map(industry => (
                        <Badge key={industry} variant="secondary">
                          {industry}
                          <button
                            type="button"
                            onClick={() => removeIndustry(industry)}
                            className="ml-2 hover:text-destructive"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Social Links */}
                <div>
                  <label className="block text-sm font-medium mb-2">Website / Portfolio</label>
                  <Input
                    value={formData.website_url}
                    onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                  placeholder="https://yourwebsite.com"
                  />
                </div>

                {/* Badge System Preview */}
                <div className="p-6 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950 dark:to-amber-950 rounded-xl border-2 border-yellow-200 dark:border-yellow-800">
                  <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                    🏆 Badge System
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Earn badges as you grow! These badges increase your visibility and trust in the community.
                  </p>

                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="text-2xl shrink-0">🥉</span>
                      <div>
                        <strong>Bronze Mentor</strong>
                        <p className="text-sm text-muted-foreground">Complete 10 sessions</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-2xl shrink-0">🥈</span>
                      <div>
                        <strong>Silver Mentor</strong>
                        <p className="text-sm text-muted-foreground">Complete 50 sessions</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-2xl shrink-0">🥇</span>
                      <div>
                        <strong>Gold Mentor</strong>
                        <p className="text-sm text-muted-foreground">Complete 100 sessions</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-2xl shrink-0">⭐</span>
                      <div>
                        <strong>Top Rated</strong>
                        <p className="text-sm text-muted-foreground">Maintain 4.8+ average rating</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-2xl shrink-0">⚡</span>
                      <div>
                        <strong>Responsive Mentor</strong>
                        <p className="text-sm text-muted-foreground">Fast replies under 1 hour</p>
                      </div>
                    </li>
                  </ul>

                  <Button
                    type="button"
                    variant="link"
                    className="mt-4 px-0 text-sm"
                    onClick={() => window.open('/badges', '_blank')}
                  >
                    Learn more about badges →
                  </Button>
                </div>

                <Button
                  type="submit" 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Creating Profile...' : 'Create Mentor Profile'}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Add Your Skills</CardTitle>
              <CardDescription>
                Select or add skills that showcase your expertise. These help mentees find you!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MentorSkillsEditor 
                mentorId={createdMentorId}
                onSkillsUpdated={() => {
                  toast.success('Skills saved! Redirecting to dashboard...');
                  setTimeout(() => navigate('/mentor/dashboard'), 1500);
                }}
              />
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => {
                  toast.info('Redirecting to dashboard...');
                  navigate('/mentor/dashboard');
                }}
              >
                Skip for Now
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
