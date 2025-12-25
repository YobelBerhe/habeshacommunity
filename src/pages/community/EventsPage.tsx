import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/store/auth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search, 
  Plus, 
  Calendar,
  MapPin,
  Users,
  Filter,
  Clock,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  type: 'in-person' | 'online';
  image: string;
  organizer: {
    name: string;
    avatar: string;
  };
  attendees: number;
  maxAttendees?: number;
  category: string;
  price: number;
  isAttending: boolean;
}

export default function EventsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, [user]);

  const fetchEvents = async () => {
    try {
      setLoading(true);

      // Fetch published events
      const { data: eventsData, error } = await supabase
        .from('events')
        .select(`
          id,
          title_en,
          description_en,
          start_date,
          end_date,
          venue_name,
          address,
          city,
          state,
          event_type,
          location_type,
          cover_image,
          featured_image,
          max_attendees,
          organizer_id,
          created_at
        `)
        .eq('status', 'published')
        .gte('start_date', new Date().toISOString())
        .order('start_date', { ascending: true })
        .limit(30);

      if (error) throw error;

      if (!eventsData || eventsData.length === 0) {
        setEvents([]);
        setLoading(false);
        return;
      }

      // Get organizer profiles
      const organizerIds = [...new Set(eventsData.map(e => e.organizer_id).filter(Boolean))];
      
      let profilesMap: Record<string, any> = {};
      if (organizerIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, display_name, avatar_url')
          .in('id', organizerIds);

        profiles?.forEach(p => {
          profilesMap[p.id] = p;
        });
      }

      // Get attendee counts from event_rsvps
      const eventIds = eventsData.map(e => e.id);
      const { data: rsvpData } = await supabase
        .from('event_rsvps')
        .select('event_id, user_id')
        .in('event_id', eventIds)
        .eq('status', 'going');

      const attendeeMap = new Map<string, number>();
      rsvpData?.forEach(r => {
        attendeeMap.set(r.event_id, (attendeeMap.get(r.event_id) || 0) + 1);
      });

      // Check if current user is attending
      let userAttendingSet = new Set<string>();
      if (user) {
        const { data: userRsvps } = await supabase
          .from('event_rsvps')
          .select('event_id')
          .eq('user_id', user.id)
          .eq('status', 'going');
        
        userAttendingSet = new Set(userRsvps?.map(r => r.event_id) || []);
      }

      // Format for UI
      const formatted: Event[] = eventsData.map(event => {
        const organizer = profilesMap[event.organizer_id];
        
        return {
          id: event.id,
          title: event.title_en,
          description: event.description_en || '',
          date: new Date(event.start_date),
          time: format(new Date(event.start_date), 'h:mm a'),
          location: event.venue_name || event.address || `${event.city || ''}, ${event.state || ''}`.replace(/^, |, $/g, '') || 'TBD',
          type: (event.location_type === 'virtual' ? 'online' : 'in-person') as 'in-person' | 'online',
          image: event.cover_image || event.featured_image || 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400',
          organizer: {
            name: organizer?.display_name || 'Community Organizer',
            avatar: organizer?.avatar_url || ''
          },
          attendees: attendeeMap.get(event.id) || 0,
          maxAttendees: event.max_attendees || undefined,
          category: event.event_type || 'Social',
          price: 0,
          isAttending: userAttendingSet.has(event.id)
        };
      });

      setEvents(formatted);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleAttend = async (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please sign in to RSVP');
      return;
    }

    try {
      const event = events.find(ev => ev.id === eventId);
      if (!event) return;

      if (event.isAttending) {
        // Remove attendance
        await supabase
          .from('event_rsvps')
          .delete()
          .eq('event_id', eventId)
          .eq('user_id', user.id);
        
        toast.success('Removed from event');
      } else {
        // Add attendance
        await supabase
          .from('event_rsvps')
          .insert({
            event_id: eventId,
            user_id: user.id,
            status: 'going'
          });
        
        toast.success("You're attending!");
      }

      // Refresh events
      fetchEvents();
    } catch (error) {
      console.error('Error updating attendance:', error);
      toast.error('Something went wrong');
    }
  };

  const categories = ['All', 'Cultural', 'Social', 'Professional', 'Religious', 'Educational', 'Sports'];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || event.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex-1 pb-20">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Loading events...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-40 border-b border-border">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Events</h1>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={() => navigate('/community/events/create')}
              >
                <Plus className="h-4 w-4 mr-1" />
                Create
              </Button>
              <Button variant="ghost" size="icon">
                <Filter className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              className="shrink-0"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Results */}
        <p className="text-sm text-muted-foreground">
          {filteredEvents.length} upcoming events
        </p>

        {/* Events List */}
        <div className="space-y-4">
          {filteredEvents.map((event) => (
            <Card
              key={event.id}
              className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/community/events/${event.id}`)}
            >
              <div className="flex flex-col sm:flex-row">
                {/* Image */}
                <div className="relative w-full sm:w-48 h-40 sm:h-auto shrink-0">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  {event.price === 0 && (
                    <Badge className="absolute top-2 left-2 bg-green-500">Free</Badge>
                  )}
                  {event.type === 'online' && (
                    <Badge className="absolute top-2 right-2 bg-blue-500">Online</Badge>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex-1 space-y-3">
                  {/* Date Badge */}
                  <div className="flex items-start gap-3">
                    <div className="text-center bg-primary/10 rounded-lg p-2 min-w-[50px]">
                      <p className="text-xs font-medium text-primary uppercase">
                        {format(event.date, 'MMM')}
                      </p>
                      <p className="text-xl font-bold text-primary">
                        {format(event.date, 'd')}
                      </p>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg line-clamp-2">{event.title}</h3>
                      <Badge variant="secondary" className="mt-1">{event.category}</Badge>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {format(event.date, 'EEEE, MMMM d')} at {event.time}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>
                        {event.attendees} going
                        {event.maxAttendees && ` • ${event.maxAttendees - event.attendees} spots left`}
                      </span>
                    </div>
                  </div>

                  {/* Organizer */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={event.organizer.avatar} />
                        <AvatarFallback>{event.organizer.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">
                        by {event.organizer.name}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant={event.isAttending ? 'outline' : 'default'}
                      onClick={(e) => handleAttend(event.id, e)}
                    >
                      {event.isAttending ? 'Attending' : 'Attend'}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No events found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}