import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Clock
} from 'lucide-react';
import { format } from 'date-fns';

interface Event {
  id: string;
  title: string;
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
}

export default function EventsPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setEvents([
      {
        id: '1',
        title: 'Ethiopian New Year Celebration',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        time: '6:00 PM',
        location: 'Oakland Community Center',
        type: 'in-person',
        image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400',
        organizer: {
          name: 'Habesha Cultural Association',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100'
        },
        attendees: 87,
        maxAttendees: 150,
        category: 'Cultural',
        price: 0
      },
      {
        id: '2',
        title: 'Tech Career Workshop',
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        time: '2:00 PM',
        location: 'Online via Zoom',
        type: 'online',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
        organizer: {
          name: 'Habesha Professionals Network',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
        },
        attendees: 124,
        category: 'Professional',
        price: 0
      },
      {
        id: '3',
        title: 'Coffee Ceremony & Networking',
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        time: '10:00 AM',
        location: 'San Francisco, CA',
        type: 'in-person',
        image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400',
        organizer: {
          name: 'SF Bay Area Habesha Group',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'
        },
        attendees: 23,
        maxAttendees: 30,
        category: 'Social',
        price: 0
      },
      {
        id: '4',
        title: 'Tigrinya Language Class',
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        time: '7:00 PM',
        location: 'Berkeley Public Library',
        type: 'in-person',
        image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400',
        organizer: {
          name: 'Language Learning Circle',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
        },
        attendees: 15,
        maxAttendees: 20,
        category: 'Educational',
        price: 15
      },
    ]);
  };

  const categories = ['All', 'Cultural', 'Social', 'Professional', 'Religious', 'Educational', 'Sports'];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/community/events/${event.id}`);
                      }}
                    >
                      Attend
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
