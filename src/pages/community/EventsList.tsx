import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { EventGrid } from '@/components/events/EventCard';
import { useAuth } from '@/store/auth';
import { toast } from 'sonner';
import { useSEO } from '@/hooks/useSEO';

export default function EventsList() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useSEO({
    title: 'Events | HabeshaCommunity',
    description: 'Discover and attend community events',
  });

  useEffect(() => {
    fetchEvents();
  }, [activeTab]);

  const fetchEvents = async () => {
    try {
      const now = new Date().toISOString();
      let query = supabase
        .from('events')
        .select('*')
        .eq('status', 'published');

      if (activeTab === 'upcoming') {
        query = query.gte('start_date', now).order('start_date', { ascending: true });
      } else {
        query = query.lt('start_date', now).order('start_date', { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;
      setEvents(data || []);
    } catch (error: any) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header with Tabs */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl md:text-5xl font-bold">Events</h1>
          
          <div className="flex gap-2 bg-muted rounded-lg p-1">
            <Button
              variant={activeTab === 'upcoming' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('upcoming')}
              className="rounded-md"
            >
              Upcoming
            </Button>
            <Button
              variant={activeTab === 'past' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('past')}
              className="rounded-md"
            >
              Past
            </Button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-32 h-32 mb-8 rounded-2xl bg-muted flex items-center justify-center">
              <CalendarIcon className="h-16 w-16 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-3">
              No {activeTab === 'upcoming' ? 'Upcoming' : 'Past'} Events
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              {activeTab === 'upcoming' 
                ? "You have no upcoming events. Why not host one?"
                : "No past events to show"}
            </p>
            {activeTab === 'upcoming' && user && (
              <Button asChild size="lg">
                <Link to="/community/events/create">
                  <Plus className="h-5 w-5 mr-2" />
                  Create Event
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <EventGrid>
            {events.map((event) => (
              <div key={event.id} className="bg-card rounded-lg overflow-hidden border hover:shadow-lg transition-shadow">
                <Link to={`/community/events/${event.id}`}>
                  {event.cover_image && (
                    <div className="aspect-video w-full overflow-hidden bg-muted">
                      <img 
                        src={event.cover_image} 
                        alt={event.title_en}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      {event.title_en || 'Untitled Event'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(event.start_date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </p>
                    {event.city && (
                      <p className="text-sm text-muted-foreground mt-1">{event.city}</p>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </EventGrid>
        )}
      </div>
    </div>
  );
}
