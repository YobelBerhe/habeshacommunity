import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar, MapPin, Users, Share2, Clock, Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/store/auth';
import { toast } from 'sonner';
import { useSEO } from '@/hooks/useSEO';

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rsvpStatus, setRsvpStatus] = useState<'going' | 'maybe' | 'not_going' | null>(null);
  const [rsvpCount, setRsvpCount] = useState(0);
  const [isRsvping, setIsRsvping] = useState(false);

  useSEO({
    title: event ? `${event.title_en} | Events` : 'Event',
    description: event?.description_en || 'Join this community event',
  });

  useEffect(() => {
    if (id) {
      fetchEvent();
      if (user) {
        fetchRsvpStatus();
      }
    }
  }, [id, user]);

  const fetchEvent = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setEvent(data);
      
      // Fetch RSVP count
      const { count } = await supabase
        .from('rsvps')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', id)
        .eq('status', 'going');
      
      setRsvpCount(count || 0);
    } catch (error: any) {
      toast.error('Event not found');
      navigate('/community/events');
    } finally {
      setLoading(false);
    }
  };

  const fetchRsvpStatus = async () => {
    if (!user) return;
    
    try {
      const { data } = await supabase
        .from('rsvps')
        .select('status')
        .eq('event_id', id)
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (data) {
        setRsvpStatus(data.status as 'going' | 'maybe' | 'not_going');
      }
    } catch (error) {
      console.error('Error fetching RSVP:', error);
    }
  };

  const handleRsvp = async (status: 'going' | 'maybe' | 'not_going') => {
    if (!user) {
      toast.error('Please sign in to RSVP');
      return;
    }

    setIsRsvping(true);
    try {
      const { error } = await supabase
        .from('rsvps')
        .upsert({
          event_id: id!,
          user_id: user.id,
          status,
        }, {
          onConflict: 'event_id,user_id'
        });

      if (error) throw error;

      setRsvpStatus(status);
      toast.success(
        status === 'going' ? "You're going!" :
        status === 'maybe' ? 'Marked as maybe' :
        'RSVP updated'
      );
      
      // Refresh counts
      fetchEvent();
    } catch (error: any) {
      toast.error(error.message || 'Failed to RSVP');
    } finally {
      setIsRsvping(false);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: event.title_en,
          text: event.description_en,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading event...</p>
      </div>
    );
  }

  if (!event) return null;

  const startDate = new Date(event.start_date);
  const endDate = new Date(event.end_date);

  return (
    <div className="min-h-screen bg-background">
      {/* Cover Image */}
      <div className="relative h-96 bg-gradient-to-br from-primary/10 to-primary/5">
        {event.cover_image || event.featured_image ? (
          <img
            src={event.cover_image || event.featured_image}
            alt={event.title_en}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Calendar className="h-24 w-24 text-muted-foreground/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Event Header Card */}
          <Card className="p-8 mb-8">
            <h1 className="text-4xl font-bold mb-4">{event.title_en}</h1>
            
            <div className="flex flex-wrap gap-6 mb-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>{format(startDate, 'EEEE, MMMM d, yyyy')}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>
                  {format(startDate, 'h:mm a')} - {format(endDate, 'h:mm a')}
                </span>
              </div>
              
              {(event.venue_name || event.city) && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span>{event.venue_name || event.city}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {!rsvpStatus || rsvpStatus !== 'going' ? (
                <Button
                  onClick={() => handleRsvp('going')}
                  disabled={isRsvping}
                  size="lg"
                  className="flex-1"
                >
                  <Check className="h-4 w-4 mr-2" />
                  {isRsvping ? 'Processing...' : "I'm Going"}
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  size="lg"
                  className="flex-1"
                  disabled
                >
                  <Check className="h-4 w-4 mr-2" />
                  You're Going!
                </Button>
              )}
              
              {rsvpStatus === 'going' && (
                <Button
                  onClick={() => handleRsvp('not_going')}
                  disabled={isRsvping}
                  variant="outline"
                  size="lg"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel RSVP
                </Button>
              )}
              
              <Button
                onClick={handleShare}
                variant="outline"
                size="lg"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
              <Users className="h-4 w-4" />
              <span>{rsvpCount} {rsvpCount === 1 ? 'person is' : 'people are'} going</span>
            </div>
          </Card>

          {/* Event Details */}
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">About This Event</h2>
            <div className="prose max-w-none">
              <p className="text-muted-foreground whitespace-pre-wrap">
                {event.description_en}
              </p>
            </div>

            {event.meeting_url && (
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <p className="font-medium mb-2">Virtual Event Link:</p>
                <a
                  href={event.meeting_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Join Meeting
                </a>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
