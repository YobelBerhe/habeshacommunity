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
import MessageMentorModal from '@/components/MessageMentorModal';

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
          <Button onClick={() => navigate('/mentor/onboarding')}>Become a Mentor</Button>
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
              {/* Profile Photo with Price Overlay */}
              <div className="relative">
                {mentor.photos?.[0] ? (
                  <ImageBox
                    src={mentor.photos[0]}
                    alt={mentor.display_name}
                    className="rounded-t-lg h-64 w-full object-cover"
                  />
                ) : (
                  <div className="rounded-t-lg h-64 w-full bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">No photo</span>
                  </div>
                )}
                {/* Price Overlay */}
                <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-full border">
                  <div className="flex items-center gap-1 text-xs font-semibold">
                    <DollarSign className="w-3 h-3" />
                    {formatPrice(mentor.price_cents, mentor.currency)}/hr
                  </div>
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{mentor.display_name}</span>
                    {mentor.country && (
                      <CountryFlag country={mentor.country} className="w-5 h-4" />
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
              
              <CardContent className="pb-3">
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                  {mentor.bio}
                </p>
                
                <div className="space-y-1.5">
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">Topics:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {mentor.topics?.slice(0, 2).map((topic) => (
                        <Badge key={topic} variant="secondary" className="text-xs px-1.5 py-0.5">
                          {topic}
                        </Badge>
                      ))}
                      {mentor.topics?.length > 2 && (
                        <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                          +{mentor.topics.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {mentor.languages?.length > 0 && (
                    <div>
                      <span className="text-xs font-medium text-muted-foreground">Languages:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {mentor.languages.slice(0, 2).map((lang) => (
                          <Badge key={lang} variant="outline" className="text-xs px-1.5 py-0.5">
                            {lang.toUpperCase()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="pt-2">
                <div className="flex gap-2 w-full">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedMentor(mentor);
                      setMessageModalOpen(true);
                    }}
                    className="flex-1"
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Message
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => navigate(`/mentor/${mentor.id}`)}
                    className="flex-1"
                  >
                    Book Session
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
        <MessageMentorModal
          isOpen={messageModalOpen}
          onClose={() => {
            setMessageModalOpen(false);
            setSelectedMentor(null);
          }}
          mentorId={selectedMentor.id}
          mentorName={selectedMentor.display_name}
          mentorUserId={selectedMentor.user_id}
        />
      )}
    </div>
  );
}