import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { EventCard, EventGrid } from '@/components/events/EventCard';
import { useAuth } from '@/store/auth';
import { toast } from 'sonner';
import { useSEO } from '@/hooks/useSEO';

export default function EventsList() {
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useSEO({
    title: 'Community Events | HabeshaCommunity',
    description: 'Discover and attend community events in your area',
  });

  useEffect(() => {
    fetchEvents();
  }, [searchQuery]);

  const fetchEvents = async () => {
    try {
      let query = supabase
        .from('events')
        .select('*')
        .eq('status', 'published')
        .gte('start_date', new Date().toISOString())
        .order('start_date', { ascending: true });

      if (searchQuery) {
        query = query.ilike('title_en', `%${searchQuery}%`);
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
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Community Events</h1>
            <p className="text-muted-foreground">
              Discover events happening in the Habesha community
            </p>
          </div>
          
          {user && (
            <Button asChild className="mt-4 md:mt-0">
              <Link to="/community/events/create">
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Link>
            </Button>
          )}
        </div>

        {/* Search */}
        <Card className="p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>

        {/* Events Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <Card className="p-12 text-center">
            <h3 className="text-xl font-semibold mb-2">No Events Found</h3>
            <p className="text-muted-foreground mb-6">
              There are no upcoming events matching your search.
            </p>
            {user && (
              <Button asChild>
                <Link to="/community/events/create">Create the First Event</Link>
              </Button>
            )}
          </Card>
        ) : (
          <EventGrid>
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={{
                  id: event.id,
                  slug: event.id,
                  title: event.title_en || 'Untitled Event',
                  cover_image: event.featured_image,
                  start_date: event.start_date,
                  city: event.city,
                  rsvp_count: 0,
                  capacity: event.max_attendees,
                }}
              />
            ))}
          </EventGrid>
        )}
      </div>
    </div>
  );
}
