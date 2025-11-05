import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSEO } from '@/hooks/useSEO';
import { 
  Monitor, Coffee, Brain, Palette, Leaf, Dumbbell, 
  Flower2, Bitcoin, MapPin, ChevronRight
} from 'lucide-react';

// Mock data
const CATEGORIES = [
  { id: 'tech', name: 'Tech', count: '756 Events', icon: Monitor, color: 'from-orange-500 to-orange-600' },
  { id: 'food', name: 'Food & Drink', count: '27 Events', icon: Coffee, color: 'from-orange-500 to-orange-600' },
  { id: 'ai', name: 'AI', count: '2K Events', icon: Brain, color: 'from-pink-500 to-pink-600' },
  { id: 'arts', name: 'Arts & Culture', count: '1K Events', icon: Palette, color: 'from-green-500 to-green-600' },
  { id: 'climate', name: 'Climate', count: '571 Events', icon: Leaf, color: 'from-green-500 to-green-600' },
  { id: 'fitness', name: 'Fitness', count: '860 Events', icon: Dumbbell, color: 'from-orange-500 to-red-600' },
  { id: 'wellness', name: 'Wellness', count: '1K Events', icon: Flower2, color: 'from-teal-500 to-teal-600' },
  { id: 'crypto', name: 'Crypto', count: '1K Events', icon: Bitcoin, color: 'from-purple-500 to-purple-600' },
];

const POPULAR_EVENTS = [
  {
    id: '1',
    title: 'AI Agents Meetup: LangChain + Rippling',
    time: 'Today, 6:00 PM',
    location: '501 2nd St suite 120',
    image: '/lovable-uploads/b4a1d9ff-6ada-4004-84e1-e2a43ad47cc5.png',
    isLive: true,
  },
  {
    id: '2',
    title: 'v0 x Founders Cafe Coworking + Demo Night',
    time: 'Tomorrow, 3:00 PM',
    location: '',
    image: '/lovable-uploads/d2261896-ec85-45d6-8ecf-9928fb132004.png',
    isLive: false,
  },
];

const FEATURED_CALENDARS = [
  { id: '1', name: 'Generative AI San Francisco and Bay Area', location: 'San Francisco', description: 'GenerativeAISF.com - the biggest...', image: '/lovable-uploads/b4a1d9ff-6ada-4004-84e1-e2a43ad47cc5.png' },
  { id: '2', name: 'Big Brain Lectures', location: 'San Francisco', description: 'A lecture series hosted in San Francisco\'s...', image: '/lovable-uploads/d2261896-ec85-45d6-8ecf-9928fb132004.png' },
  { id: '3', name: '[SF] Bay Area Builders', location: 'San Francisco', description: 'Bringing together the hottest tech for the...', image: '/lovable-uploads/b4a1d9ff-6ada-4004-84e1-e2a43ad47cc5.png' },
];

const CONTINENTS = [
  { id: 'north-america', name: 'North America' },
  { id: 'asia', name: 'Asia & Pacific' },
  { id: 'south-america', name: 'South America' },
  { id: 'europe', name: 'Europe' },
  { id: 'africa', name: 'Africa' },
];

const CITIES = {
  'north-america': [
    { name: 'Atlanta', count: '18 Events', color: 'bg-blue-500' },
    { name: 'Austin', count: '9 Events', color: 'bg-orange-500' },
    { name: 'Boston', count: '12 Events', color: 'bg-orange-600' },
    { name: 'Calgary', count: '5 Events', color: 'bg-cyan-500' },
    { name: 'Chicago', count: '18 Events', color: 'bg-pink-500' },
    { name: 'Dallas', count: '7 Events', color: 'bg-orange-400' },
    { name: 'Denver', count: '8 Events', color: 'bg-orange-500' },
    { name: 'Houston', count: '3 Events', color: 'bg-orange-600' },
    { name: 'Las Vegas', count: '7 Events', color: 'bg-yellow-500' },
    { name: 'Los Angeles', count: '33 Events', color: 'bg-green-600' },
    { name: 'Mexico City', count: '11 Events', color: 'bg-orange-500' },
    { name: 'Miami', count: '14 Events', color: 'bg-cyan-500' },
    { name: 'Montréal', count: '12 Events', color: 'bg-blue-500' },
    { name: 'New York', count: '52 Events', color: 'bg-orange-500' },
    { name: 'Philadelphia', count: '11 Events', color: 'bg-orange-600' },
    { name: 'Phoenix', count: '8 Events', color: 'bg-red-500' },
    { name: 'Portland', count: '4 Events', color: 'bg-rose-400' },
    { name: 'Salt Lake City', count: '7 Events', color: 'bg-yellow-600' },
    { name: 'San Diego', count: '7 Events', color: 'bg-blue-500' },
    { name: 'San Francisco', count: '43 Events', color: 'bg-orange-600' },
    { name: 'Seattle', count: '9 Events', color: 'bg-indigo-500' },
    { name: 'Toronto', count: '21 Events', color: 'bg-blue-500' },
    { name: 'Vancouver', count: '15 Events', color: 'bg-yellow-600' },
    { name: 'Washington, DC', count: '12 Events', color: 'bg-gray-400' },
    { name: 'Waterloo', count: '6 Events', color: 'bg-lime-600' },
  ],
  'asia': [
    { name: 'Bangkok', count: '14 Events', color: 'bg-orange-500' },
    { name: 'Bengaluru', count: '13 Events', color: 'bg-yellow-600' },
    { name: 'Brisbane', count: '5 Events', color: 'bg-blue-500' },
    { name: 'Dubai', count: '7 Events', color: 'bg-purple-500' },
    { name: 'Ho Chi Minh City', count: '7 Events', color: 'bg-red-500' },
    { name: 'Hong Kong', count: '17 Events', color: 'bg-cyan-500' },
    { name: 'Honolulu', count: '4 Events', color: 'bg-blue-500' },
    { name: 'Jakarta', count: '3 Events', color: 'bg-yellow-700' },
    { name: 'Kuala Lumpur', count: '5 Events', color: 'bg-purple-600' },
    { name: 'Manila', count: '11 Events', color: 'bg-teal-500' },
    { name: 'Melbourne', count: '11 Events', color: 'bg-lime-500' },
    { name: 'Mumbai', count: '3 Events', color: 'bg-orange-600' },
    { name: 'New Delhi', count: '7 Events', color: 'bg-rose-400' },
    { name: 'Seoul', count: '11 Events', color: 'bg-blue-400' },
    { name: 'Singapore', count: '13 Events', color: 'bg-lime-700' },
    { name: 'Sydney', count: '11 Events', color: 'bg-orange-500' },
    { name: 'Taipei', count: '9 Events', color: 'bg-indigo-500' },
    { name: 'Tel Aviv-Yafo', count: '15 Events', color: 'bg-orange-500' },
    { name: 'Tokyo', count: '18 Events', color: 'bg-rose-300' },
  ],
};

export default function EventsDiscover() {
  const [selectedContinent, setSelectedContinent] = useState('north-america');

  useSEO({
    title: 'Discover Events | HabeshaCommunity',
    description: 'Explore popular events near you, browse by category, or check out some of the great community calendars.',
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Events</h1>
          <p className="text-lg text-muted-foreground">
            Explore popular events near you, browse by category, or check out some of the great community calendars.
          </p>
        </div>

        {/* Popular Events */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">Popular Events</h2>
              <p className="text-muted-foreground">San Francisco</p>
            </div>
            <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
              <Link to="/community/events">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {POPULAR_EVENTS.map((event) => (
              <Link 
                key={event.id} 
                to={`/community/events/${event.id}`}
                className="group"
              >
                <Card className="overflow-hidden transition-all hover:shadow-xl hover:scale-[1.02]">
                  <div className="flex gap-4 p-4">
                    <div className="relative flex-shrink-0 w-32 h-32 rounded-lg overflow-hidden bg-muted">
                      {event.image ? (
                        <img 
                          src={event.image} 
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5" />
                      )}
                      {event.isLive && (
                        <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                          ● LIVE
                        </Badge>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-1">{event.time}</p>
                      {event.location && (
                        <p className="text-sm text-muted-foreground">{event.location}</p>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Browse by Category */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map((category) => {
              const Icon = category.icon;
              return (
                <Link 
                  key={category.id}
                  to={`/community/events?category=${category.id}`}
                >
                  <Card className="p-6 hover:bg-accent transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold group-hover:text-primary transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">{category.count}</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Featured Calendars */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Featured Calendars</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {FEATURED_CALENDARS.map((calendar) => (
              <Card key={calendar.id} className="p-6">
                <div className="flex gap-4 mb-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    {calendar.image && (
                      <img 
                        src={calendar.image} 
                        alt={calendar.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <Button variant="secondary" size="sm" className="float-right">
                      Subscribe
                    </Button>
                  </div>
                </div>
                <h3 className="font-semibold mb-2 line-clamp-2">{calendar.name}</h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                  <MapPin className="h-3 w-3" />
                  <span>{calendar.location}</span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{calendar.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Explore Local Events */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Explore Local Events</h2>
          
          {/* Continent Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {CONTINENTS.map((continent) => (
              <Button
                key={continent.id}
                variant={selectedContinent === continent.id ? 'default' : 'ghost'}
                onClick={() => setSelectedContinent(continent.id)}
                className="whitespace-nowrap"
              >
                {continent.name}
              </Button>
            ))}
          </div>

          {/* Cities Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CITIES[selectedContinent as keyof typeof CITIES]?.map((city) => (
              <Link 
                key={city.name}
                to={`/community/events?city=${encodeURIComponent(city.name)}`}
              >
                <Card className="p-4 hover:bg-accent transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${city.color} flex items-center justify-center flex-shrink-0`}>
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold group-hover:text-primary transition-colors truncate">
                        {city.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{city.count}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
