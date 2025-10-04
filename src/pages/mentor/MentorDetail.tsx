import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MapPin, Globe, Star, MessageCircle, Calendar, Ticket, ArrowUpFromLine } from 'lucide-react';
import MentorHeader from '@/components/MentorHeader';
import { VerificationBadge } from '@/components/VerificationBadge';
import { BundlePurchase } from '@/components/BundlePurchase';
import { CreditsDisplay } from '@/components/CreditsDisplay';
import MentorReviews from '@/components/MentorReviews';
import { bookSessionWithCredit, checkAvailableCredits } from '@/utils/bundleActions';
import { bookMentorSession } from '@/utils/stripeActions';
import { useAuth } from '@/store/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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

  const handleBookSingleSession = async () => {
    if (!user) {
      navigate('/auth/login');
      return;
    }
    
    setBookingLoading(true);
    try {
      const result = await bookMentorSession(id!);
      if (result.redirectUrl) {
        window.location.href = result.redirectUrl;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to book session";
      
      // Provide user-friendly messages for common errors
      let displayMessage = errorMessage;
      if (errorMessage.includes("payout account")) {
        displayMessage = "This mentor is still setting up their payment account. Please try again later or contact them directly.";
      } else if (errorMessage.includes("payout setup")) {
        displayMessage = "This mentor is completing their payment setup. Please check back soon!";
      }
      
      toast({
        title: "Booking unavailable",
        description: displayMessage,
        variant: "destructive",
      });
    } finally {
      setBookingLoading(false);
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
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Profile & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar className="w-24 h-24 rounded-lg">
                    <AvatarImage 
                      src={mentor.photos?.[0] || mentor.profile_picture_url || mentor.avatar_url} 
                      alt={mentor.display_name || mentor.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="rounded-lg text-2xl">{(mentor.display_name || mentor.name)?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      {mentor.is_verified && (
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
                          ✓ Quick Responder
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleShareProfile}
                        className="ml-auto"
                        title="Share profile"
                      >
                        <ArrowUpFromLine className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <h1 className="text-3xl font-bold mb-1">{mentor.display_name || mentor.name}</h1>
                    {mentor.title && (
                      <p className="text-lg text-emerald-600 dark:text-emerald-400 mb-3">{mentor.title}</p>
                    )}
                    
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      {mentor.rating_avg > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{mentor.rating_avg}</span>
                          <span className="text-muted-foreground text-sm">({mentor.rating_count} reviews)</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      {mentor.country && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {mentor.city && `${mentor.city}, `}{mentor.country}
                        </span>
                      )}
                      {mentor.available && (
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>
                          Active today
                        </span>
                      )}
                    </div>
                    
                    {badges.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {badges.map((badge) => (
                          <Badge 
                            key={badge.id}
                            variant="outline"
                            className="bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200 text-yellow-800"
                          >
                            <span className="mr-1">{badge.icon}</span>
                            {badge.label}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            {mentor.topics && mentor.topics.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-3">Skills & Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {mentor.topics.map((topic: string) => (
                      <Badge key={topic} variant="secondary" className="px-3 py-1">{topic}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* About */}
            {mentor.bio && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-3">About</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{mentor.bio}</p>
                  
                  {mentor.languages && mentor.languages.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-semibold text-sm mb-2">Languages</h4>
                      <div className="flex flex-wrap gap-2">
                        {mentor.languages.map((lang: string) => (
                          <Badge key={lang} variant="outline">{lang}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Inquiries */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-2">Open to inquiries</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  You can message {mentor.display_name || mentor.name} to ask questions before booking a session.
                </p>
                <Button
                  onClick={handleMessageMentor}
                  variant="default"
                  className="w-full sm:w-auto"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Get in touch
                </Button>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <MentorReviews
              mentorId={mentor.id}
              mentorName={mentor.display_name || mentor.name}
              ratingAvg={mentor.rating_avg}
              ratingCount={mentor.rating_count}
            />
          </div>

          {/* Right Column - Sticky Services Card */}
          <div className="lg:sticky lg:top-8 h-fit space-y-6">
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-3">Mentorship Plans</h3>
                
                {mentor.price_cents && (
                  <div className="mb-4">
                    <div className="text-3xl font-bold text-foreground">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: mentor.currency || 'USD'
                      }).format(mentor.price_cents / 100)}
                    </div>
                    <p className="text-sm text-muted-foreground">per session</p>
                  </div>
                )}

                <ul className="space-y-2 mb-6 text-sm">
                  <li className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 mt-0.5 text-primary" />
                    <span>1-on-1 video calls</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <MessageCircle className="w-4 h-4 mt-0.5 text-primary" />
                    <span>Direct messaging support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Star className="w-4 h-4 mt-0.5 text-primary" />
                    <span>Personalized guidance</span>
                  </li>
                </ul>

                {availableCredits.hasCredits && (
                  <div className="flex items-center gap-2 text-sm bg-primary/10 p-3 rounded-lg mb-4">
                    <Ticket className="w-4 h-4 text-primary" />
                    <span className="font-medium">You have {availableCredits.totalCredits} credits available</span>
                  </div>
                )}
                
                <div className="space-y-3">
                  {availableCredits.hasCredits ? (
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
                              description: "Purchase a bundle below",
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
                      {bookingLoading ? 'Processing...' : 'Book with Credit'}
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleBookSingleSession}
                      className="w-full"
                      size="lg"
                      disabled={bookingLoading}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      {bookingLoading ? 'Processing...' : 'Book Single Session'}
                    </Button>
                  )}
                  
                  <p className="text-xs text-center text-muted-foreground">
                    Secure payment • Cancel anytime
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* User's Credits for this Mentor */}
            {user && (
              <div className="mt-6">
                <CreditsDisplay userId={user.id} mentorId={id} showActions={false} />
              </div>
            )}

            {/* Bundle Purchase Section */}
            {mentor.price_cents && (
              <BundlePurchase
                mentorId={mentor.id}
                singleSessionPrice={mentor.price_cents}
                currency={mentor.currency}
              />
            )}

            {/* Reviews Section - Shows in mobile after services */}
            <div className="lg:hidden">
              <MentorReviews
                mentorId={mentor.id}
                mentorName={mentor.display_name || mentor.name}
                ratingAvg={mentor.rating_avg}
                ratingCount={mentor.rating_count}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
