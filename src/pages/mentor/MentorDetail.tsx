import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MapPin, Globe, Star, MessageCircle, Calendar, Ticket, Share2 } from 'lucide-react';
import MentorHeader from '@/components/MentorHeader';
import { VerificationBadge } from '@/components/VerificationBadge';
import { BundlePurchase } from '@/components/BundlePurchase';
import { CreditsDisplay } from '@/components/CreditsDisplay';
import MentorReviews from '@/components/MentorReviews';
import { bookSessionWithCredit, checkAvailableCredits } from '@/utils/bundleActions';
import { useAuth } from '@/store/auth';

export default function MentorDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [mentor, setMentor] = useState<any>(null);
  const [badges, setBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [availableCredits, setAvailableCredits] = useState({ hasCredits: false, totalCredits: 0 });

  useEffect(() => {
    if (id) {
      fetchMentor();
      if (user) {
        loadCredits();
      }
    }
  }, [id, user]);

  const loadCredits = async () => {
    if (!id) return;
    const credits = await checkAvailableCredits(id);
    setAvailableCredits(credits);
  };

  const handleShareProfile = async () => {
    const shareUrl = `${window.location.origin}/mentor/${id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied!",
        description: "Profile link has been copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleMessageMentor = async () => {
    if (!user) {
      navigate('/auth/login');
      return;
    }

    if (!mentor.is_verified) {
      toast({
        title: "Cannot message mentor",
        description: "You can only message verified mentors",
        variant: "destructive",
      });
      return;
    }

    try {
      // Check if conversation already exists
      const { data: existingConv } = await supabase
        .from('conversations')
        .select('id')
        .or(`and(participant1_id.eq.${user.id},participant2_id.eq.${mentor.user_id}),and(participant1_id.eq.${mentor.user_id},participant2_id.eq.${user.id})`)
        .limit(1)
        .single();

      if (existingConv) {
        navigate('/inbox');
        return;
      }

      // Create new conversation
      const participants = [user.id, mentor.user_id].sort();
      const { error } = await supabase.from('conversations').insert({
        participant1_id: participants[0],
        participant2_id: participants[1],
      } as any);

      if (error) throw error;

      toast({
        title: "Conversation started",
        description: "You can now message this mentor",
      });
      navigate('/inbox');
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: "Failed to start conversation",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const fetchMentor = async () => {
    try {
      const { data, error } = await supabase
        .from('mentors')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setMentor(data);

      // Fetch badges
      const { data: badgesData } = await supabase
        .from('mentor_badges')
        .select('*')
        .eq('mentor_id', id)
        .order('earned_at', { ascending: false });

      if (badgesData) {
        setBadges(badgesData);
      }
    } catch (error) {
      console.error('Error fetching mentor:', error);
      toast({
        title: 'Error',
        description: 'Failed to load mentor details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <MentorHeader title="Mentor Profile" backPath="/mentor" />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading mentor details...</div>
        </div>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="min-h-screen bg-background">
        <MentorHeader title="Mentor Profile" backPath="/mentor" />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground mb-4">Mentor not found</p>
              <Button onClick={() => navigate('/mentor')}>
                Back to Mentors
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MentorHeader title={mentor.display_name || mentor.name} backPath="/mentor" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <CardTitle className="text-2xl">{mentor.display_name || mentor.name}</CardTitle>
                    {mentor.is_verified && <VerificationBadge isVerified={true} showText />}
                    {badges.length > 0 && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                        {badges.length} Badge{badges.length > 1 ? 's' : ''}
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleShareProfile}
                      className="ml-auto"
                      title="Share profile"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                  {mentor.title && (
                    <p className="text-muted-foreground mt-1">{mentor.title}</p>
                  )}
                  {badges.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {badges.map((badge) => (
                        <span 
                          key={badge.id}
                          className="px-3 py-1 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 text-yellow-800 rounded-full text-sm flex items-center gap-1.5 font-medium"
                        >
                          <span className="text-base">{badge.icon}</span>
                          {badge.label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {mentor.price_cents && (
                  <div className="text-right ml-4">
                    <div className="text-2xl font-bold">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: mentor.currency || 'USD'
                      }).format(mentor.price_cents / 100)}
                    </div>
                    <p className="text-sm text-muted-foreground">per session</p>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {(mentor.city || mentor.country) && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{mentor.city}{mentor.country && `, ${mentor.country}`}</span>
                </div>
              )}

              {mentor.bio && (
                <div>
                  <h3 className="font-semibold mb-2">About</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{mentor.bio}</p>
                </div>
              )}

              {mentor.topics && mentor.topics.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    {mentor.topics.map((topic: string) => (
                      <Badge key={topic} variant="secondary">{topic}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {mentor.languages && mentor.languages.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {mentor.languages.map((lang: string) => (
                      <Badge key={lang} variant="outline">{lang}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 space-y-3">
                {availableCredits.hasCredits && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-primary/10 p-3 rounded-lg">
                    <Ticket className="w-4 h-4 text-primary" />
                    <span>You have {availableCredits.totalCredits} credits available</span>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button 
                    onClick={async () => {
                      if (!user) {
                        navigate('/auth/login');
                        return;
                      }
                      
                      setBookingLoading(true);
                      try {
                        const result = await bookSessionWithCredit(id!);
                        
                        if (result.needsPurchase) {
                          toast({
                            title: "No credits available",
                            description: "Purchase a bundle or book a single session below",
                          });
                        } else if (result.success) {
                          toast({
                            title: "Session booked!",
                            description: `You have ${result.creditsLeft} credits remaining`,
                          });
                          loadCredits();
                          navigate('/mentor/bookings');
                        }
                      } catch (error) {
                        toast({
                          title: "Booking failed",
                          description: error instanceof Error ? error.message : "Please try again",
                          variant: "destructive",
                        });
                      } finally {
                        setBookingLoading(false);
                      }
                    }}
                    className="w-full"
                    size="lg"
                    disabled={bookingLoading}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    {bookingLoading ? 'Processing...' : availableCredits.hasCredits ? 'Book with Credit' : 'Book a Session'}
                  </Button>

                  {mentor.is_verified && (
                    <Button
                      onClick={handleMessageMentor}
                      variant="outline"
                      size="lg"
                      className="w-full"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Message Mentor
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User's Credits for this Mentor */}
          {user && (
            <CreditsDisplay userId={user.id} mentorId={id} showActions={false} />
          )}

          {/* Bundle Purchase Section */}
          {mentor.price_cents && (
            <BundlePurchase
              mentorId={mentor.id}
              singleSessionPrice={mentor.price_cents}
              currency={mentor.currency}
            />
          )}

          {/* Reviews Section */}
          <MentorReviews
            mentorId={mentor.id}
            mentorName={mentor.display_name || mentor.name}
            ratingAvg={mentor.rating_avg}
            ratingCount={mentor.rating_count}
          />
        </div>
      </div>
    </div>
  );
}
