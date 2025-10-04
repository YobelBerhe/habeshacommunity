import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/store/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, DollarSign, Calendar, Ticket } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { VerificationBadge } from '@/components/VerificationBadge';
import MentorReviews from '@/components/MentorReviews';
import MentorHeader from '@/components/MentorHeader';
import { BundlePurchase } from '@/components/BundlePurchase';
import { CreditsDisplay } from '@/components/CreditsDisplay';
import { bookSessionWithCredit, checkAvailableCredits } from '@/utils/bundleActions';

export default function MentorDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [mentor, setMentor] = useState<any>(null);
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
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className="text-2xl">{mentor.display_name || mentor.name}</CardTitle>
                    {mentor.is_verified && <VerificationBadge isVerified={true} showText />}
                  </div>
                  {mentor.title && (
                    <p className="text-muted-foreground mt-1">{mentor.title}</p>
                  )}
                </div>
                {mentor.price_cents && (
                  <div className="text-right">
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
            ratingAvg={mentor.rating_avg}
            ratingCount={mentor.rating_count}
          />
        </div>
      </div>
    </div>
  );
}
