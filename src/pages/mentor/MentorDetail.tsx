import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/store/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Star, MapPin, DollarSign, MessageCircle, ArrowLeft, Calendar } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import MobileHeader from '@/components/layout/MobileHeader';
import Header from '@/components/Header';
import { getAppState } from '@/utils/storage';
import CountryFlag from '@/components/CountryFlag';
import ImageBox from '@/components/ImageBox';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

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
}

export default function MentorDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [booking, setBooking] = useState(false);
  const [isFree, setIsFree] = useState(false);
  const appState = getAppState();

  useEffect(() => {
    if (id) {
      fetchMentor();
    }
  }, [id]);

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

    if (!message.trim()) {
      toast({
        title: 'Message Required',
        description: 'Please write a message describing what you need help with',
        variant: 'destructive',
      });
      return;
    }

    setBooking(true);
    try {
      const { requestMentorBooking } = await import('@/utils/mentorActions');
      await requestMentorBooking(mentor.id, message.trim());

      toast({
        title: 'Request Sent!',
        description: 'Your mentoring session request has been sent successfully.',
      });
      setMessage('');
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: 'Error',
        description: 'Failed to send request. Please try again.',
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
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/browse?category=mentor')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Mentors
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            {/* Profile Photo */}
            <div className="relative mb-6">
              {mentor.photos?.[0] ? (
                <div className="relative">
                  <ImageBox
                    src={mentor.photos[0]}
                    alt={mentor.display_name}
                    className="w-full h-80 object-cover rounded-lg"
                  />
                  {/* Price Overlay */}
                  <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full border">
                    <div className="flex items-center gap-1 text-sm font-semibold">
                      {isFree ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        <>
                          <DollarSign className="w-4 h-4" />
                          {formatPrice(mentor.price_cents, mentor.currency)}/hr
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-80 bg-muted rounded-lg flex items-center justify-center">
                  <span className="text-muted-foreground">No photo</span>
                </div>
              )}
            </div>

            {/* Free Toggle */}
            <Card className="mb-4">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Switch id="free-mode" checked={isFree} onCheckedChange={setIsFree} />
                  <Label htmlFor="free-mode">Free Session</Label>
                </div>
              </CardContent>
            </Card>

            {/* Contact Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Request Session
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Tell the mentor what you'd like to learn or discuss..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                />
                <Button 
                  onClick={handleBooking}
                  disabled={booking}
                  className="w-full"
                >
                  {booking ? 'Sending Request...' : 'Request Mentoring Session'}
                </Button>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardContent className="pt-6">
                <Button
                  variant="outline"
                  onClick={async () => {
                    if (!user) {
                      navigate('/auth/login');
                      return;
                    }
                    try {
                      const { sendMessage } = await import('@/utils/matchActions');
                      const res = await sendMessage(mentor.user_id, 'Hello! I\'m interested in your mentoring services.');
                      navigate(`/inbox?thread=${res.chatId}`);
                    } catch (error) {
                      console.error('Failed to send message:', error);
                      toast({
                        title: 'Error',
                        description: 'Failed to send message. Please try again.',
                        variant: 'destructive',
                      });
                    }
                  }}
                  className="w-full"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-2xl">{mentor.display_name}</CardTitle>
                      {mentor.country && (
                        <CountryFlag country={mentor.country} className="w-6 h-4" />
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{mentor.city}{mentor.country && `, ${mentor.country}`}</span>
                      </div>
                      {mentor.rating > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{mentor.rating.toFixed(1)} rating</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 text-base">About</h3>
                  <p className="text-muted-foreground text-sm">{mentor.bio}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 text-base">Expertise Areas</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {mentor.topics?.map((topic) => (
                      <Badge key={topic} variant="secondary" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>

                {mentor.languages?.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2 text-base">Languages</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {mentor.languages.map((lang) => (
                        <Badge key={lang} variant="outline" className="text-xs">
                          {lang.toUpperCase()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}