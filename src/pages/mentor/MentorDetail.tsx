import { PageTransition } from '@/components/PageTransition';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MapPin, Globe, Star, MessageCircle, Calendar as CalendarIcon, Ticket, ArrowUpFromLine, Heart } from 'lucide-react';
import MentorHeader from '@/components/MentorHeader';
import { VerifiedBadge } from '@/components/VerifiedBadge';
import { BundlePurchase } from '@/components/BundlePurchase';
import { CreditsDisplay } from '@/components/CreditsDisplay';
import MentorReviews from '@/components/MentorReviews';
import { bookSessionWithCredit, checkAvailableCredits } from '@/utils/bundleActions';
import { bookMentorSession } from '@/utils/stripeActions';
import { useAuth } from '@/store/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import TimeSlotPicker from '@/components/mentor/TimeSlotPicker';
import MentorIntroVideo from '@/components/mentor/MentorIntroVideo';
import { ScrollReveal } from '@/components/ScrollReveal';

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
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedSlotId, setSelectedSlotId] = useState<string>();
  const [selectedTimeRange, setSelectedTimeRange] = useState<{ start: string; end: string }>();

  useEffect(() => {
    if (id) {
      fetchMentor();
      if (user) {
        loadCredits();
        checkFavoriteStatus();
      }
    }
  }, [id, user]);

  const checkFavoriteStatus = async () => {
    if (!id || !user) return;
    
    const { data } = await supabase
      .from('mentor_favorites')
      .select('*')
      .eq('user_id', user.id)
      .eq('mentor_id', id)
      .maybeSingle();
    
    setIsFavorite(!!data);
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      navigate('/auth/login');
      return;
    }

    try {
      if (isFavorite) {
        // Remove from favorites
        await supabase
          .from('mentor_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('mentor_id', id!);
        
        setIsFavorite(false);
        toast({
          title: "Removed from favorites",
          description: "Mentor removed from your favorites",
        });
      } else {
        // Add to favorites
        await supabase
          .from('mentor_favorites')
          .insert({
            user_id: user.id,
            mentor_id: id!,
          });
        
        setIsFavorite(true);
        toast({
          title: "Added to favorites",
          description: "Mentor saved to your favorites",
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive",
      });
    }
  };

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

    // Prevent messaging yourself
    if (mentor?.user_id === user.id) {
      toast({
        title: 'Cannot message yourself',
        description: 'You can’t start a conversation with your own profile.',
        variant: 'destructive',
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
        // Navigate to inbox with conversation state
        navigate('/inbox', { state: { openConversationId: existingConv.id, mentorName: mentor.display_name || mentor.name } });
        return;
      }

      // Create new conversation
      const participants = [user.id, mentor.user_id].sort();
      const { data: newConv, error: convError } = await supabase
        .from('conversations')
        .insert({
          participant1_id: participants[0],
          participant2_id: participants[1],
        } as any)
        .select()
        .single();

      if (convError) throw convError;

      // Send initial greeting message
      const { error: msgError } = await supabase
        .from('messages')
        .insert({
          conversation_id: newConv.id,
          sender_id: user.id,
          content: `Hi ${mentor.display_name || mentor.name}, I'm interested in your mentorship. Looking forward to connecting with you!`,
        } as any);

      if (msgError) throw msgError;

      toast({
        title: "Conversation started",
        description: "Your message has been sent",
      });
      
      // Navigate to inbox and open the conversation
      navigate('/inbox', { state: { openConversationId: newConv.id, mentorName: mentor.display_name || mentor.name } });
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: "Failed to start conversation",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleSlotSelect = (slotId: string, startTime: string, endTime: string) => {
    setSelectedSlotId(slotId);
    setSelectedTimeRange({ start: startTime, end: endTime });
  };

  const handleBookSingleSession = async () => {
    if (!user) {
      navigate('/auth/login');
      return;
    }

    if (!selectedDate || !selectedSlotId) {
      toast({
        title: "Select date and time",
        description: "Please select a date and time slot to book",
        variant: "destructive",
      });
      return;
    }
    
    setBookingLoading(true);
    try {
      const result = await bookMentorSession(id!, selectedSlotId);
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
      <PageTransition>
      <div className="min-h-screen bg-background">
        <MentorHeader title="Mentor Profile" backPath="/mentor" />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading mentor details...</div>
        </div>
      </div>
      </PageTransition>
    );
  }

  if (!mentor) {
    return (
      <PageTransition>
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
      </PageTransition>
    );
  }

  return (
    <PageTransition>
    <div className="min-h-screen bg-background">
      <MentorHeader title="Mentor Profile" backPath="/mentor" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Profile & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header Card */}
            <ScrollReveal direction="up">
              <Card>
                <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  {/* Larger profile photo on mobile */}
                  <Avatar className="w-32 h-32 lg:w-24 lg:h-24 rounded-lg">
                    <AvatarImage 
                      src={mentor.photos?.[0] || mentor.profile_picture_url || mentor.avatar_url} 
                      alt={mentor.display_name || mentor.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="rounded-lg text-3xl lg:text-2xl">{(mentor.display_name || mentor.name)?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <VerifiedBadge isVerified={mentor.is_verified} />
                    </div>
                    
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
        </ScrollReveal>

        {/* Skills */}
        {mentor.topics && mentor.topics.length > 0 && (
          <ScrollReveal direction="up" delay={0.1}>
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
          </ScrollReveal>
        )}

        {/* About */}
        {mentor.bio && (
          <ScrollReveal direction="up" delay={0.2}>
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
          </ScrollReveal>
        )}

            {/* YouTube Intro Video */}
            <MentorIntroVideo youtubeLink={mentor.youtube_link} />

            {/* Three Action Buttons in One Row */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-2">
                  <Button
                    onClick={handleMessageMentor}
                    variant="outline"
                    className="flex-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleToggleFavorite}
                    className={isFavorite ? "text-red-500 hover:text-red-600 border-red-200" : "text-blue-600 hover:text-blue-700 border-blue-200"}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleShareProfile}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
                  >
                    <ArrowUpFromLine className="w-4 h-4" />
                  </Button>
                </div>
                
                <p className="text-xs text-center text-muted-foreground mt-3">
                  Need a different time?
                </p>
                <Button
                  onClick={handleMessageMentor}
                  variant="outline"
                  className="w-full mt-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
                >
                  Message
                </Button>
              </CardContent>
            </Card>

            {/* Reviews Section - Desktop only */}
            <div className="hidden lg:block">
              <MentorReviews
                mentorId={mentor.id}
                mentorName={mentor.display_name || mentor.name}
                ratingAvg={mentor.rating_avg}
                ratingCount={mentor.rating_count}
              />
            </div>
          </div>

          {/* Right Column - Sticky Services Card */}
          <div className="lg:sticky lg:top-8 h-fit space-y-6">
            {/* Availability Calendar */}
            <Card>
              <CardHeader>
                <CardTitle>Select Date & Time</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date);
                    setSelectedSlotId(undefined);
                    setSelectedTimeRange(undefined);
                  }}
                  className="rounded-md border"
                  disabled={(date) => date < new Date()}
                />
                {selectedDate && (
                  <div className="pt-4 border-t">
                    <TimeSlotPicker
                      mentorId={id!}
                      selectedDate={selectedDate}
                      onSlotSelect={handleSlotSelect}
                      selectedSlotId={selectedSlotId}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border">
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
                    <CalendarIcon className="w-4 h-4 mt-0.5 text-primary" />
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

                        if (!selectedDate || !selectedSlotId) {
                          toast({
                            title: "Select date and time",
                            description: "Please select a date and time slot to book",
                            variant: "destructive",
                          });
                          return;
                        }
                        
                        setBookingLoading(true);
                        try {
                          const result = await bookSessionWithCredit(id!, selectedSlotId);
                          
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
                      disabled={bookingLoading || !selectedSlotId}
                    >
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {bookingLoading ? 'Processing...' : 'Book with Credit'}
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleBookSingleSession}
                      className="w-full"
                      size="lg"
                      disabled={bookingLoading || !selectedSlotId}
                    >
                      <CalendarIcon className="w-4 h-4 mr-2" />
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
    </PageTransition>
  );
}
