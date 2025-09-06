import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import MobileHeader from '@/components/layout/MobileHeader';
import Header from '@/components/Header';
import { getAppState } from '@/utils/storage';
import { supabase } from '@/integrations/supabase/client';

const popularTopics = [
  'Career Development', 'Technical Skills', 'Leadership', 'Entrepreneurship',
  'Software Engineering', 'Data Science', 'Product Management', 'Marketing',
  'Finance', 'Design', 'Business Strategy', 'Personal Development'
];

const languages = ['English', 'Amharic', 'Tigrinya', 'Oromo', 'Arabic', 'Spanish', 'French', 'German'];

export default function MentorOnboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
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
    custom_topic: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to become a mentor',
        variant: 'destructive',
      });
      navigate('/auth/login');
      return;
    }

    if (!formData.display_name.trim() || !formData.bio.trim() || formData.topics.length === 0) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('mentors')
        .insert({
          user_id: user.id,
          display_name: formData.display_name.trim(),
          bio: formData.bio.trim(),
          city: formData.city.trim() || null,
          country: formData.country.trim() || null,
          price_cents: formData.price_cents ? parseInt(formData.price_cents) * 100 : 5000, // Default $50/hr
          currency: formData.currency,
          topics: formData.topics,
          languages: formData.languages.length > 0 ? formData.languages : ['English'],
          rating: 0
        });

      if (error) throw error;

      toast({
        title: 'Success!',
        description: 'Your mentor profile has been created successfully.',
      });
      
      navigate('/mentor');
    } catch (error) {
      console.error('Error creating mentor profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to create mentor profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addTopic = (topic: string) => {
    if (topic && !formData.topics.includes(topic)) {
      setFormData(prev => ({
        ...prev,
        topics: [...prev.topics, topic]
      }));
    }
  };

  const removeTopic = (topic: string) => {
    setFormData(prev => ({
      ...prev,
      topics: prev.topics.filter(t => t !== topic)
    }));
  };

  const addCustomTopic = () => {
    if (formData.custom_topic.trim()) {
      addTopic(formData.custom_topic.trim());
      setFormData(prev => ({ ...prev, custom_topic: '' }));
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

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader />
      <Header 
        currentCity={appState.city}
        onCityChange={() => {}}
        onAccountClick={() => {}}
        onLogoClick={() => navigate('/')}
      />
      
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/mentor')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Mentors
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Become a Mentor</CardTitle>
            <p className="text-muted-foreground">
              Share your expertise and help others grow in their careers and personal development.
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-sm font-medium">Display Name *</label>
                <Input
                  value={formData.display_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
                  placeholder="How would you like to be known?"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">Bio *</label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell potential mentees about your background, experience, and what you can help with..."
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">City</label>
                  <Input
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="Your city"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Country</label>
                  <Input
                    value={formData.country}
                    onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                    placeholder="Your country"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Hourly Rate (USD)</label>
                  <Input
                    type="number"
                    value={formData.price_cents}
                    onChange={(e) => setFormData(prev => ({ ...prev, price_cents: e.target.value }))}
                    placeholder="50"
                    min="1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Leave blank for $50/hour default</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Currency</label>
                  <Select value={formData.currency} onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="ETB">ETB</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Expertise Areas *</label>
                <div className="mt-2 mb-4">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.topics.map((topic) => (
                      <Badge key={topic} variant="default" className="pr-1">
                        {topic}
                        <button
                          type="button"
                          onClick={() => removeTopic(topic)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                    {popularTopics.map((topic) => (
                      <Button
                        key={topic}
                        type="button"
                        variant={formData.topics.includes(topic) ? "default" : "outline"}
                        size="sm"
                        onClick={() => formData.topics.includes(topic) ? removeTopic(topic) : addTopic(topic)}
                        className="text-xs"
                      >
                        {topic}
                      </Button>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      value={formData.custom_topic}
                      onChange={(e) => setFormData(prev => ({ ...prev, custom_topic: e.target.value }))}
                      placeholder="Add custom expertise area"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomTopic())}
                    />
                    <Button type="button" onClick={addCustomTopic} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Languages</label>
                <div className="mt-2">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {languages.map((language) => (
                      <Button
                        key={language}
                        type="button"
                        variant={formData.languages.includes(language) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleLanguage(language)}
                        className="text-xs"
                      >
                        {language}
                      </Button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Select all languages you can mentor in</p>
                </div>
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
      </div>
    </div>
  );
}