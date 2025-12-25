import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/store/auth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Video, MapPin, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface Session {
  id: string;
  mentor: {
    id: string;
    name: string;
    avatar: string;
    title: string;
  };
  date: Date;
  duration: number;
  type: 'video' | 'in-person';
  status: 'upcoming' | 'completed' | 'cancelled';
  location?: string;
  price: number;
}

export default function SessionsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSessions();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchSessions = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch user's booked sessions
      const { data: bookingsData, error } = await supabase
        .from('bookings')
        .select(`
          id,
          mentor_id,
          session_date,
          scheduled_time,
          duration_minutes,
          amount_cents,
          status,
          meeting_url,
          notes
        `)
        .eq('user_id', user.id)
        .order('session_date', { ascending: true });

      if (error) throw error;

      if (!bookingsData || bookingsData.length === 0) {
        setSessions([]);
        setLoading(false);
        return;
      }

      // Get mentor details
      const mentorIds = [...new Set(bookingsData.map(b => b.mentor_id))];
      
      const { data: mentorsData } = await supabase
        .from('mentors')
        .select(`
          id,
          name,
          display_name,
          title,
          avatar_url
        `)
        .in('id', mentorIds);

      const mentorMap = new Map();
      mentorsData?.forEach(m => {
        mentorMap.set(m.id, m);
      });

      // Format for UI
      const formatted: Session[] = bookingsData.map(booking => {
        const mentor = mentorMap.get(booking.mentor_id);
        const sessionDate = new Date(booking.session_date);
        const now = new Date();
        
        // Determine status based on date if not explicitly cancelled
        let status: 'upcoming' | 'completed' | 'cancelled' = 'upcoming';
        if (booking.status === 'cancelled') {
          status = 'cancelled';
        } else if (sessionDate < now) {
          status = 'completed';
        }

        return {
          id: booking.id,
          mentor: {
            id: booking.mentor_id,
            name: mentor?.display_name || mentor?.name || 'Mentor',
            avatar: mentor?.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
            title: mentor?.title || 'Professional Mentor'
          },
          date: sessionDate,
          duration: booking.duration_minutes || 60,
          type: 'video' as const,
          status: status,
          location: booking.meeting_url,
          price: booking.amount_cents ? booking.amount_cents / 100 : 0
        };
      });

      setSessions(formatted);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast.error('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const upcomingSessions = sessions.filter(s => s.status === 'upcoming');
  const completedSessions = sessions.filter(s => s.status === 'completed');

  const SessionCard = ({ session }: { session: Session }) => (
    <Card className="p-4">
      <div className="flex gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={session.mentor.avatar} alt={session.mentor.name} />
          <AvatarFallback>{session.mentor.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{session.mentor.name}</h3>
          <p className="text-sm text-muted-foreground">{session.mentor.title}</p>

          <div className="mt-3 space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{format(session.date, 'EEEE, MMMM d, yyyy')}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{format(session.date, 'h:mm a')} • {session.duration} min</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {session.type === 'video' ? (
                <>
                  <Video className="h-4 w-4" />
                  <span>Video Call</span>
                </>
              ) : (
                <>
                  <MapPin className="h-4 w-4" />
                  <span>{session.location}</span>
                </>
              )}
            </div>
          </div>

          {session.status === 'upcoming' && (
            <div className="flex gap-2 mt-4">
              <Button 
                className="flex-1 bg-mentor hover:bg-mentor/90"
                onClick={() => navigate(`/video/${session.id}`)}
              >
                Join Session
              </Button>
              <Button variant="outline" className="flex-1">
                Reschedule
              </Button>
            </div>
          )}

          {session.status === 'completed' && (
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => navigate(`/mentor/${session.mentor.id}`)}
            >
              Book Again
            </Button>
          )}
        </div>
      </div>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-mentor" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-foreground">My Sessions</h1>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-4 w-full">
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingSessions.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past ({completedSessions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-4">
            {upcomingSessions.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold text-foreground">No upcoming sessions</h3>
                <p className="text-muted-foreground mt-1">
                  Book a session with a mentor to get started
                </p>
                <Button 
                  className="mt-4 bg-mentor hover:bg-mentor/90"
                  onClick={() => navigate('/mentor/browse')}
                >
                  Browse Mentors
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingSessions.map(session => (
                  <SessionCard key={session.id} session={session} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="mt-4">
            {completedSessions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No past sessions yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {completedSessions.map(session => (
                  <SessionCard key={session.id} session={session} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
