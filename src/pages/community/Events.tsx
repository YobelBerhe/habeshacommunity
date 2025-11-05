import { useState } from 'react';
import { 
  Calendar, MapPin, Clock, Users, Search, Filter,
  Heart, Share2, Bookmark, Plus, TrendingUp,
  DollarSign, Video, Music, Utensils, GraduationCap,
  Briefcase, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useNavigate, Link } from 'react-router-dom';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  endTime?: string;
  location: string;
  address?: string;
  type: 'in-person' | 'online' | 'hybrid';
  category: string;
  organizer: string;
  organizerAvatar: string;
  attendees: number;
  maxAttendees?: number;
  price: number;
  image: string;
  featured: boolean;
  trending: boolean;
}

const Events = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = [
    { id: 'all', name: 'All Events', icon: Calendar },
    { id: 'cultural', name: 'Cultural', icon: Music },
    { id: 'food', name: 'Food & Dining', icon: Utensils },
    { id: 'education', name: 'Education', icon: GraduationCap },
    { id: 'networking', name: 'Networking', icon: Briefcase },
    { id: 'entertainment', name: 'Entertainment', icon: Video }
  ];

  // Demo events
  const events: Event[] = [
    {
      id: '1',
      title: 'Ethiopian New Year Celebration 2025',
      description: 'Join us for a grand celebration of Enkutatash with traditional food, music, and dance',
      date: '2025-09-11',
      time: '6:00 PM',
      endTime: '11:00 PM',
      location: 'Washington DC',
      address: '1234 Cultural Center Dr, Washington DC 20001',
      type: 'in-person',
      category: 'cultural',
      organizer: 'Habesha Events DC',
      organizerAvatar: 'HE',
      attendees: 234,
      maxAttendees: 500,
      price: 0,
      image: 'event1',
      featured: true,
      trending: true
    },
    {
      id: '2',
      title: 'Tigrinya Language Workshop - Beginner Level',
      description: 'Learn the basics of Tigrinya language with experienced instructors',
      date: '2025-01-15',
      time: '10:00 AM',
      endTime: '12:00 PM',
      location: 'Online',
      type: 'online',
      category: 'education',
      organizer: 'Language Learning Group',
      organizerAvatar: 'LL',
      attendees: 45,
      maxAttendees: 50,
      price: 15,
      image: 'event2',
      featured: false,
      trending: true
    },
    {
      id: '3',
      title: 'Coffee Ceremony & Cultural Night',
      description: 'Experience authentic Ethiopian coffee ceremony and cultural performances',
      date: '2025-01-20',
      time: '7:00 PM',
      endTime: '10:00 PM',
      location: 'Seattle, WA',
      address: '567 Community St, Seattle WA 98101',
      type: 'in-person',
      category: 'cultural',
      organizer: 'Seattle Habesha Community',
      organizerAvatar: 'SC',
      attendees: 89,
      maxAttendees: 150,
      price: 20,
      image: 'event3',
      featured: true,
      trending: true
    },
    {
      id: '4',
      title: 'Networking Mixer for Young Professionals',
      description: 'Connect with Habesha professionals in tech, business, and entrepreneurship',
      date: '2025-01-25',
      time: '6:30 PM',
      endTime: '9:30 PM',
      location: 'Toronto, Canada',
      address: '890 Business Plaza, Toronto ON M5H 2N2',
      type: 'hybrid',
      category: 'networking',
      organizer: 'Habesha Professionals Network',
      organizerAvatar: 'HP',
      attendees: 67,
      maxAttendees: 100,
      price: 0,
      image: 'event4',
      featured: false,
      trending: false
    },
    {
      id: '5',
      title: 'Traditional Ethiopian Cooking Class',
      description: 'Learn to cook authentic Ethiopian dishes with Chef Meron',
      date: '2025-02-01',
      time: '2:00 PM',
      endTime: '5:00 PM',
      location: 'Oakland, CA',
      address: '123 Culinary Ave, Oakland CA 94612',
      type: 'in-person',
      category: 'food',
      organizer: 'Chef Meron Kidane',
      organizerAvatar: 'MK',
      attendees: 23,
      maxAttendees: 30,
      price: 50,
      image: 'event5',
      featured: false,
      trending: false
    },
    {
      id: '6',
      title: 'Habesha Film Festival 2025',
      description: 'Screening of award-winning films by Habesha filmmakers',
      date: '2025-02-10',
      time: '1:00 PM',
      endTime: '8:00 PM',
      location: 'Atlanta, GA',
      address: '456 Cinema Blvd, Atlanta GA 30303',
      type: 'in-person',
      category: 'entertainment',
      organizer: 'Habesha Film Society',
      organizerAvatar: 'HF',
      attendees: 156,
      maxAttendees: 300,
      price: 25,
      image: 'event6',
      featured: true,
      trending: false
    }
  ];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    const matchesType = selectedType === 'all' || event.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'in-person': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'online': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'hybrid': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Community Events</h1>
              <p className="text-base md:text-lg opacity-90">
                Discover and join events near you
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                asChild
                variant="outline"
                size="lg"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Link to="/community/events">
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Browse All Events
                </Link>
              </Button>
              <Button
                size="lg"
                onClick={() => navigate('/community/events/create')}
                className="bg-white text-green-600 hover:bg-gray-100"
              >
                <Plus className="w-5 h-5 mr-2" />
                <span className="hidden sm:inline">Create Event</span>
                <span className="sm:hidden">Create</span>
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-full bg-background text-foreground border-0"
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <section className="py-6 border-b bg-background/95 backdrop-blur sticky top-14 md:top-16 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.id;
              
              return (
                <Button
                  key={category.id}
                  variant={isActive ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex-shrink-0"
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {category.name}
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Filters */}
        <Card className="p-4 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredEvents.length}</span> events
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Event Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="in-person">In-Person</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Events Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Card
              key={event.id}
              className="overflow-hidden hover:shadow-2xl transition-all cursor-pointer group"
              onClick={() => navigate(`/community/events/${event.id}`)}
            >
              {/* Image */}
              <div className="relative h-48 bg-gradient-to-br from-muted to-muted/50">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Calendar className="w-16 h-16 text-muted-foreground" />
                </div>

                {event.featured && (
                  <Badge className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}

                <div className="absolute top-3 right-3 flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-background/80 hover:bg-background"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-background/80 hover:bg-background"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="p-4 space-y-3">
                {/* Date Badge */}
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex flex-col items-center justify-center text-white flex-shrink-0">
                    <div className="text-xs font-semibold">
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                    </div>
                    <div className="text-xl font-bold">
                      {new Date(event.date).getDate()}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <Badge className={getTypeColor(event.type)}>
                      {event.type === 'online' && <Video className="w-3 h-3 mr-1" />}
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                    </Badge>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-bold text-lg group-hover:text-primary transition-colors line-clamp-2">
                  {event.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {event.description}
                </p>

                {/* Info */}
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {event.time} {event.endTime && `- ${event.endTime}`}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="truncate">{event.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    {event.attendees} attending
                    {event.maxAttendees && ` / ${event.maxAttendees} max`}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8 border-2 border-primary/20">
                      <AvatarFallback className="bg-gradient-to-br from-green-500 to-teal-500 text-white text-xs font-bold">
                        {event.organizerAvatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-xs text-muted-foreground">by</div>
                      <div className="text-sm font-semibold">{event.organizer}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    {event.price === 0 ? (
                      <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                        Free
                      </Badge>
                    ) : (
                      <div>
                        <div className="text-xs text-muted-foreground">From</div>
                        <div className="text-lg font-bold text-primary">${event.price}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <Card className="p-12 text-center">
            <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">No events found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your filters or create a new event
            </p>
            <Button onClick={() => navigate('/community/create-event')}>
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </Card>
        )}
      </div>

      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Events;
