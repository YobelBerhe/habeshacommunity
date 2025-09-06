import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, MapPin, DollarSign, MessageCircle } from 'lucide-react';
import MobileHeader from '@/components/layout/MobileHeader';
import Header from '@/components/Header';
import { getAppState } from '@/utils/storage';
import CountryFlag from '@/components/CountryFlag';
import ImageBox from '@/components/ImageBox';
import MessageModal from '@/components/MessageModal';

interface Mentor {
  id: string;
  user_id: string;
  display_name: string;
  bio: string;
  topics: string[];
  languages: string[];
  city: string;
  country: string;
  price_cents: number;
  currency: string;
  rating: number;
  photos: string[];
  website_url: string;
  social_links: any;
}

export default function MentorList() {
  const navigate = useNavigate();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [topicFilter, setTopicFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('');
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const appState = getAppState();

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      const { data, error } = await supabase
        .from('mentors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMentors(data || []);
    } catch (error) {
      console.error('Error fetching mentors:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = !searchTerm || 
      mentor.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.bio?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTopic = !topicFilter || topicFilter === 'all' || mentor.topics?.includes(topicFilter);
    const matchesCity = !cityFilter || mentor.city?.toLowerCase().includes(cityFilter.toLowerCase());
    
    return matchesSearch && matchesTopic && matchesCity;
  });

  const formatPrice = (cents: number, currency: string) => {
    const amount = cents / 100;
    return `${currency} ${amount.toFixed(0)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <MobileHeader />
        <Header 
          currentCity={appState.city}
          onCityChange={() => {}}
          onAccountClick={() => {}}
          onLogoClick={() => navigate('/')}
        />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading mentors...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader />
      <Header 
        currentCity={appState.city}
        onCityChange={() => {}}
        onAccountClick={() => {}}
        onLogoClick={() => navigate('/')}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Find a Mentor</h1>
          <Button onClick={() => navigate('/mentor/become')}>Become a Mentor</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Input
            placeholder="Search mentors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={topicFilter} onValueChange={setTopicFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Topic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Topics</SelectItem>
              <SelectItem value="language">Language</SelectItem>
              <SelectItem value="health">Health</SelectItem>
              <SelectItem value="career">Career</SelectItem>
              <SelectItem value="tech">Tech</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="immigration">Immigration</SelectItem>
              <SelectItem value="business">Business</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="City"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          />
          <Button variant="outline" onClick={() => {
            setSearchTerm('');
            setTopicFilter('all');
            setCityFilter('');
          }}>
            Clear Filters
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.map((mentor) => (
            <Card key={mentor.id} className="hover:shadow-lg transition-shadow">
              {/* Profile Photo */}
              {mentor.photos?.[0] && (
                <ImageBox
                  src={mentor.photos[0]}
                  alt={mentor.display_name}
                  className="rounded-t-lg h-48 w-full object-cover"
                />
              )}
              
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{mentor.display_name}</span>
                    {mentor.country && (
                      <CountryFlag country={mentor.country} className="w-5 h-3.5" />
                    )}
                  </div>
                  {mentor.rating > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{mentor.rating.toFixed(1)}</span>
                    </div>
                  )}
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{mentor.city}{mentor.country && `, ${mentor.country}`}</span>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {mentor.bio}
                </p>
                
                <div className="space-y-2">
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">Topics:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {mentor.topics?.slice(0, 3).map((topic) => (
                        <Badge key={topic} variant="secondary" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                      {mentor.topics?.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{mentor.topics.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {mentor.languages?.length > 0 && (
                    <div>
                      <span className="text-xs font-medium text-muted-foreground">Languages:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {mentor.languages.slice(0, 3).map((lang) => (
                          <Badge key={lang} variant="outline" className="text-xs">
                            {lang.toUpperCase()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-medium">
                    {formatPrice(mentor.price_cents, mentor.currency)}/hour
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedMentor(mentor);
                      setMessageModalOpen(true);
                    }}
                  >
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => navigate(`/mentor/${mentor.id}`)}
                  >
                    Request Session
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredMentors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No mentors found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Message Modal */}
      {selectedMentor && (
        <MessageModal
          isOpen={messageModalOpen}
          onClose={() => {
            setMessageModalOpen(false);
            setSelectedMentor(null);
          }}
          listingId={selectedMentor.id}
          listingTitle={`Mentorship with ${selectedMentor.display_name}`}
          listingOwnerId={selectedMentor.user_id}
        />
      )}
    </div>
  );
}