import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/store/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Star, MapPin, DollarSign, MessageCircle, ArrowLeft, Calendar, Heart, Linkedin, Globe, Clock, CheckCircle, Phone, Twitter, Github, Youtube, ExternalLink } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { getAppState } from '@/utils/storage';
import CountryFlag from '@/components/CountryFlag';
import ImageBox from '@/components/ImageBox';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { timeAgo } from '@/utils/ui';

interface Mentor {
  id: string;
  user_id: string;
  display_name: string;
  bio: string;
  topics: string[];
  languages: string[];
  city: string;
  country: string;
  price_cents: number;
  currency: string;
  rating: number;
  photos: string[];
  social_links: any;
  website_url?: string;
  plan_description?: string;
}

export default function MentorDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [booking, setBooking] = useState(false);
  const [isFree, setIsFree] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [lastSeen, setLastSeen] = useState<string | null>(null);
  const appState = getAppState();

  useEffect(() => {
    if (id) {
      fetchMentor();
      if (user) {
        checkFavoriteStatus();
      }
    }
  }, [id, user]);

  useEffect(() => {
    if (mentor?.user_id) {
      fetchPresence();
    }
  }, [mentor?.user_id]);

  useEffect(() => {
    if (!mentor?.user_id) return;
    const interval = setInterval(() => fetchPresence(), 60000);
    return () => clearInterval(interval);
  }, [mentor?.user_id]);

  const fetchMentor = async () => {
    try {
      const { data, error } = await supabase
        .from('mentors')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setMentor(data);
    } catch (error) {
      console.error('Error fetching mentor:', error);
      toast({
        title: 'Error',
        description: 'Failed to load mentor profile',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const checkFavoriteStatus = async () => {
    if (!user || !id) return;
    try {
      const { data } = await supabase
        .from('mentor_favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('mentor_id', id)
        .maybeSingle();
      setIsFavorited(!!data);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const fetchPresence = async () => {
    try {
      const { data, error } = await supabase
        .from('presence')
        .select('last_seen')
        .eq('user_id', mentor?.user_id)
        .single();

      if (data) {
        setLastSeen(data.last_seen);
      }
    } catch (error) {
      console.error('Error fetching presence:', error);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to save mentors',
        variant: 'destructive',
      });
      navigate('/auth/login');
      return;
    }

    if (!id) return;

    try {
      if (isFavorited) {
        const { error } = await supabase
          .from('mentor_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('mentor_id', id);
        if (error) throw error;
        setIsFavorited(false);
        toast({ title: 'Removed', description: 'Mentor removed from favorites' });
      } else {
        const { error } = await supabase
          .from('mentor_favorites')
          .insert({ user_id: user.id, mentor_id: id });
        if (error) throw error;
        setIsFavorited(true);
        toast({ title: 'Saved!', description: 'Mentor saved to favorites' });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: 'Error',
        description: 'Failed to update favorites',
        variant: 'destructive',
      });
    }
  };

  const handleBooking = async () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to request a mentor session',
        variant: 'destructive',
      });
      navigate('/auth/login');
      return;
    }

    if (!mentor) return;

    setBooking(true);
    try {
      const { bookMentorSession } = await import('@/utils/stripeActions');
      const result = await bookMentorSession(mentor.id);
      if (result.redirectUrl) {
        navigate(result.redirectUrl);
      }
    } catch (error) {
      console.error('Error booking session:', error);
      toast({
        title: 'Error',
        description: 'Failed to book session. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setBooking(false);
    }
  };

  const formatPrice = (cents: number, currency: string) => {
    const amount = cents / 100;
    return `${currency} ${amount.toFixed(0)}`;
  };

  const getActivityStatus = () => {
    if (!lastSeen) return 'Active last week';
    
    const lastSeenDate = new Date(lastSeen);
    const now = new Date();
    const diffMs = now.getTime() - lastSeenDate.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 5) return 'Active now';
    if (diffMinutes < 60) return `Active ${diffMinutes}m ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `Active ${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `Active ${diffDays}d ago`;
    
    const diffWeeks = Math.floor(diffDays / 7);
    return `Active ${diffWeeks}w ago`;
  };

  const getSocialMediaIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'linkedin': return Linkedin;
      case 'twitter': return Twitter;
      case 'github': return Github;
      case 'youtube': return Youtube;
      default: return ExternalLink;
    }
  };

  const renderSocialButtons = () => {
    const buttons = [];
    
    // Add social media buttons
    if (mentor?.social_links && typeof mentor.social_links === 'object') {
      Object.entries(mentor.social_links).forEach(([platform, url]) => {
        if (url && typeof url === 'string' && url.trim()) {
          const Icon = getSocialMediaIcon(platform);
          buttons.push(
            <Button 
              key={platform}
              variant="outline" 
              size="sm"
              onClick={() => window.open(url, '_blank')}
            >
              <Icon className="w-4 h-4" />
            </Button>
          );
        }
      });
    }
    
    // Add website button if exists
    if (mentor?.website_url) {
      buttons.push(
        <Button 
          key="website"
          variant="outline" 
          size="sm"
          onClick={() => window.open(mentor.website_url, '_blank')}
        >
          <Globe className="w-4 h-4" />
        </Button>
      );
    }
    
    return buttons;
  };

  const getFirstSocialLink = (): string => {
    if (mentor?.social_links && typeof mentor.social_links === 'object') {
      const firstLink = Object.values(mentor.social_links).find(url => 
        url && typeof url === 'string' && url.trim()
      ) as string;
      if (firstLink) return firstLink;
    }
    return mentor?.website_url || '#';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading mentor profile...</div>
        </div>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p>Mentor not found</p>
            <Button onClick={() => navigate('/browse?category=mentor')} className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Mentors
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/browse?category=mentor')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Mentors
        </Button>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-8">
          {/* Left - Photo */}
          <div className="lg:col-span-3">
            <div className="relative">
              {mentor.photos?.[0] ? (
                <ImageBox
                  src={mentor.photos[0]}
                  alt={mentor.display_name}
                  className="w-full h-96 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center">
                  <span className="text-muted-foreground">No photo</span>
                </div>
              )}
            </div>
          </div>

          {/* Center - Main Info */}
          <div className="lg:col-span-6 space-y-6">
            {/* New Mentor Badge & Name */}
            <div className="space-y-4">
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-emerald-200">
                ✨ New Mentor
              </Badge>
              
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold">{mentor.display_name}</h1>
                  {mentor.country && (
                    <CountryFlag country={mentor.country} className="w-8 h-5" />
                  )}
                </div>
                <p className="text-lg text-muted-foreground font-medium">{mentor.bio}</p>
              </div>

              {/* Save & Social Media */}
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleFavoriteToggle}
                  className={isFavorited ? 'text-destructive' : ''}
                >
                  <Heart className={`w-4 h-4 mr-2 ${isFavorited ? 'fill-current' : ''}`} />
                  {isFavorited ? 'Saved' : 'Save'}
                </Button>
                {renderSocialButtons()}
              </div>
            </div>

            {/* Professional Title */}
            <div>
              <h2 className="text-xl font-semibold mb-2">Career and Life Coach, Sr. Technical Product and Program Manager</h2>
            </div>

            {/* Location & Details */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Globe className="w-4 h-4" />
                <span>{mentor.city}{mentor.country && `, ${mentor.country}`}</span>
              </div>
              
              {mentor.languages?.length > 0 && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MessageCircle className="w-4 h-4" />
                  <span>Speaks {mentor.languages.join(', ')}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{getActivityStatus()}</span>
              </div>
            </div>

            {/* Skills */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {mentor.topics?.slice(0, 6).map((topic) => (
                  <Badge key={topic} variant="outline" className="bg-secondary/20 text-sm py-2 px-4">
                    {topic}
                  </Badge>
                ))}
                {mentor.topics && mentor.topics.length > 6 && (
                  <Badge variant="outline" className="bg-secondary/20 text-sm py-2 px-4">
                    + {mentor.topics.length - 6} more
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Right - Pricing Card */}
          <div className="lg:col-span-3">
            <Card className="sticky top-8">
              <CardHeader className="pb-2">
                <Tabs defaultValue="mentorship" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="mentorship">Mentorship plans</TabsTrigger>
                    <TabsTrigger value="sessions">Sessions</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="mentorship" className="mt-6">
                    <div className="space-y-6">
                      <div>
                        <div className="text-3xl font-bold text-primary">
                          {formatPrice(mentor.price_cents, mentor.currency)}
                          <span className="text-lg font-normal text-muted-foreground"> / month</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          The most popular way to get mentored, let's work towards your goals!
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                          <span>{mentor.plan_description || '2 calls per month (30min/call)'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                          <span>Unlimited Q&A via chat</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                          <span>Expect responses in 2 days</span>
                        </div>
                      </div>

                      <Button 
                        onClick={handleBooking}
                        disabled={booking}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        size="lg"
                      >
                        {booking ? 'Processing...' : 'Apply now'}
                      </Button>

                      <p className="text-xs text-center text-muted-foreground">
                        7-day free trial, cancel anytime. <span className="underline cursor-pointer">What's included?</span>
                      </p>

                      <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>Lock in this price now!</span>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="sessions" className="mt-6">
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">Book individual sessions as needed</p>
                      <div className="text-2xl font-bold">
                        {formatPrice(mentor.price_cents, mentor.currency)} / session
                      </div>
                      <Button 
                        onClick={handleBooking}
                        disabled={booking}
                        className="w-full"
                        size="lg"
                      >
                        Book Session
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden space-y-6">
          {/* Photo */}
          <div className="relative">
            {mentor.photos?.[0] ? (
              <ImageBox
                src={mentor.photos[0]}
                alt={mentor.display_name}
                className="w-full h-80 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-80 bg-muted rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground">No photo</span>
              </div>
            )}
          </div>

          {/* New Mentor Badge */}
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-emerald-200 w-fit">
            ✨ New Mentor
          </Badge>

          {/* Name & Title */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{mentor.display_name}</h1>
              {mentor.country && (
                <CountryFlag country={mentor.country} className="w-6 h-4" />
              )}
            </div>
            <p className="text-base text-muted-foreground font-medium">{mentor.bio}</p>
          </div>

          {/* Save & Social Media */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleFavoriteToggle}
              className={isFavorited ? 'text-destructive' : ''}
            >
              <Heart className={`w-4 h-4 mr-2 ${isFavorited ? 'fill-current' : ''}`} />
              {isFavorited ? 'Saved' : 'Save'}
            </Button>
            {renderSocialButtons()}
          </div>

          {/* Professional Title */}
          <h2 className="text-lg font-semibold">Career and Life Coach, Sr. Technical Product and Program Manager</h2>

          {/* Location & Details */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Globe className="w-4 h-4" />
              <span>{mentor.city}{mentor.country && `, ${mentor.country}`}</span>
            </div>
            
            {mentor.languages?.length > 0 && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MessageCircle className="w-4 h-4" />
                <span>Speaks {mentor.languages.join(', ')}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{getActivityStatus()}</span>
            </div>
          </div>

          {/* Skills */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {mentor.topics?.map((topic) => (
                <Badge key={topic} variant="outline" className="bg-secondary/20 text-sm py-1.5 px-3">
                  {topic}
                </Badge>
              ))}
            </div>
          </div>

          {/* Mobile Pricing Card */}
          <Card>
            <CardHeader className="pb-2">
              <Tabs defaultValue="mentorship" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="mentorship">Mentorship plans</TabsTrigger>
                  <TabsTrigger value="sessions">Sessions</TabsTrigger>
                </TabsList>
                
                <TabsContent value="mentorship" className="mt-6">
                  <div className="space-y-6">
                    <div>
                      <div className="text-3xl font-bold text-primary">
                        {formatPrice(mentor.price_cents, mentor.currency)}
                        <span className="text-lg font-normal text-muted-foreground"> / month</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        The most popular way to get mentored, let's work towards your goals!
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span>{mentor.plan_description || '2 calls per month (30min/call)'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span>Unlimited Q&A via chat</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span>Expect responses in 2 days</span>
                      </div>
                    </div>

                    <Button 
                      onClick={handleBooking}
                      disabled={booking}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      size="lg"
                    >
                      {booking ? 'Processing...' : 'Apply now'}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      7-day free trial, cancel anytime. <span className="underline cursor-pointer">What's included?</span>
                    </p>

                    <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>Lock in this price now!</span>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="sessions" className="mt-6">
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">Book individual sessions as needed</p>
                    <div className="text-2xl font-bold">
                      {formatPrice(mentor.price_cents, mentor.currency)} / session
                    </div>
                    <Button 
                      onClick={handleBooking}
                      disabled={booking}
                      className="w-full"
                      size="lg"
                    >
                      Book Session
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardHeader>
          </Card>
        </div>

        {/* Additional Sections */}
        <div className="mt-12 space-y-8">
          {/* About Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">About</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">Hi All,</p>
                <p className="text-muted-foreground leading-relaxed">
                  I'm a Senior Technical Product & Program Manager with 10+ years of experience across leading tech companies - 
                  including Google, Samsung, e-commerce, and financial companies - as well as a Career, Job Search, and Life
                </p>
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-primary underline"
                  onClick={() => {
                    const link = getFirstSocialLink();
                    if (link && link !== '#') {
                      window.open(link, '_blank');
                    }
                  }}
                >
                  Read more
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Open to inquiries */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="w-3 h-3 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">Open to inquiries</h3>
                    <p className="text-muted-foreground">
                      You can message {mentor.display_name} to ask questions before booking their services
                    </p>
                    <div className="space-y-2">
                      <Textarea
                        placeholder={`Write a message to ${mentor.display_name}...`}
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        rows={3}
                      />
                      <div className="flex justify-end">
                        <Button 
                          variant="outline" 
                          onClick={async () => {
                            if (!user) {
                              navigate('/auth/login');
                              return;
                            }
                            const body = contactMessage.trim();
                            if (!body) {
                              toast({
                                title: 'Message required',
                                description: 'Please type a message before sending',
                                variant: 'destructive',
                              });
                              return;
                            }
                            try {
                              const { sendMessage } = await import('@/utils/matchActions');
                              await sendMessage(mentor.user_id, body);
                              setContactMessage('');
                              toast({ title: 'Message sent', description: 'Your message was sent to the mentor.' });
                            } catch (error) {
                              console.error('Failed to send message:', error);
                              toast({
                                title: 'Error',
                                description: 'Failed to send message. Please try again.',
                                variant: 'destructive',
                              });
                            }
                          }}
                          className="border-primary text-primary hover:bg-primary hover:text-white"
                        >
                          Send
                        </Button>
                      </div>
                    </div>
                  </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}