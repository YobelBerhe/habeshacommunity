import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/store/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, DollarSign, ArrowLeft, Calendar, Star } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { getAppState } from '@/utils/storage';
import { VerificationBadge } from '@/components/VerificationBadge';
import MentorReviews from '@/components/MentorReviews';

export default function MentorDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [mentor, setMentor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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
        description: 'Failed to load mentor details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading mentor details...</div>
      </div>
    );
  }

  if (!mentor) {
    return (
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
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/mentor')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Mentors
        </Button>

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

              <div className="pt-4">
                <Button 
                  onClick={() => {
                    if (!user) {
                      navigate('/auth/login');
                      return;
                    }
                    toast({
                      title: "Contact Mentor",
                      description: "Booking system requires additional database setup",
                    });
                  }}
                  className="w-full"
                  size="lg"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book a Session
                </Button>
              </div>
            </CardContent>
          </Card>

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
