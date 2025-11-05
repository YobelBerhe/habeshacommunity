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
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          Community Events
        </h1>
        <p className="text-lg text-muted-foreground">
          Discover events happening in the Habesha community
        </p>
      </div>

      {/* Search & Create Button */}
      <Card className="p-6 mb-8 shadow-lg border-border/50">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events..."
              className="pl-10 h-12 text-base"
            />
          </div>
          {user && (
            <Button 
              asChild
              size="lg"
              className="h-12 px-6"
            >
              <Link to="/community/events/create">
                <Plus className="h-5 w-5 mr-2" />
                Create Event
              </Link>
            </Button>
          )}
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
                  cover_image: event.cover_image || event.featured_image,
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
