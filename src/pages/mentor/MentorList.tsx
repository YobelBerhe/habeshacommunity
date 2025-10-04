import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, MapPin, DollarSign, MessageCircle, CheckCircle2 } from 'lucide-react';
import MentorHeader from '@/components/MentorHeader';
import CountryFlag from '@/components/CountryFlag';
import ImageBox from '@/components/ImageBox';
import MessageMentorModal from '@/components/MessageMentorModal';
import { VerificationBadge } from '@/components/VerificationBadge';

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
  rating_avg?: number;
  rating_count?: number;
  photos: string[];
  website_url: string;
  social_links?: any;
  is_verified: boolean;
  created_at?: string;
}

export default function MentorList() {
  const navigate = useNavigate();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [topicFilter, setTopicFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [minRating, setMinRating] = useState('0');
  const [sortBy, setSortBy] = useState('verified');
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('mentors')
        .select(`
          *,
          mentor_skills(skill)
        `)
        .eq('available', true)
        .order('is_verified', { ascending: false })
        .order('rating_avg', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMentors(data || []);
    } catch (error) {
      console.error('Error fetching mentors:', error);
      toast.error('Failed to load mentors');
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort mentors
  const filteredAndSortedMentors = mentors.filter((mentor) => {
    const lowerQuery = searchTerm.toLowerCase();
    const skills = (mentor as any).mentor_skills?.map((s: any) => s.skill.toLowerCase()) || [];
    
    const matchesSearch =
      !searchTerm ||
      mentor.display_name?.toLowerCase().includes(lowerQuery) ||
      mentor.bio?.toLowerCase().includes(lowerQuery) ||
      mentor.topics?.some(t => t.toLowerCase().includes(lowerQuery)) ||
      skills.some(s => s.includes(lowerQuery));

    const matchesTopic = !topicFilter || mentor.topics?.includes(topicFilter);
    const matchesCity = !cityFilter || mentor.city?.toLowerCase() === cityFilter.toLowerCase();
    const matchesVerified = !verifiedOnly || mentor.is_verified;
    const matchesRating = mentor.rating_avg >= parseFloat(minRating);

    return matchesSearch && matchesTopic && matchesCity && matchesVerified && matchesRating;
  }).sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating_avg ?? 0) - (a.rating_avg ?? 0);
        case 'newest':
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        case 'price_low':
          return (a.price_cents ?? Infinity) - (b.price_cents ?? Infinity);
        case 'price_high':
          return (b.price_cents ?? 0) - (a.price_cents ?? 0);
        case 'verified':
        default:
          // Verified first, then rating, then newest
          if (a.is_verified !== b.is_verified) {
            return b.is_verified ? 1 : -1;
          }
          if ((b.rating_avg ?? 0) !== (a.rating_avg ?? 0)) {
            return (b.rating_avg ?? 0) - (a.rating_avg ?? 0);
          }
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      }
    });

  const formatPrice = (cents: number, currency: string) => {
    const amount = cents / 100;
    return `${currency} ${amount.toFixed(0)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <MentorHeader title="Find a Mentor" backPath="/" />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading mentors...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MentorHeader title="Find a Mentor" backPath="/" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Find a Mentor</h1>
          <Button onClick={() => navigate('/mentor/onboarding')}>Become a Mentor</Button>
        </div>

        {/* Filter Bar */}
        <div className="space-y-4 mb-6">
          {/* Verified Only Toggle */}
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={verifiedOnly} 
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
              />
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Show only verified mentors</span>
            </label>
          </div>

          {/* Search and Filters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <Input
              placeholder="Search mentors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="md:col-span-2"
            />
            <Select value={topicFilter} onValueChange={setTopicFilter}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Topic" />
              </SelectTrigger>
              <SelectContent className="bg-background z-50">
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
            <Select value={minRating} onValueChange={setMinRating}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Min Rating" />
              </SelectTrigger>
              <SelectContent className="bg-background z-50">
                <SelectItem value="0">All Ratings</SelectItem>
                <SelectItem value="4">⭐ 4.0+</SelectItem>
                <SelectItem value="4.5">⭐ 4.5+</SelectItem>
                <SelectItem value="5">⭐ 5.0 only</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent className="bg-background z-50">
                <SelectItem value="verified">Verified First</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest Mentors</SelectItem>
                <SelectItem value="price_low">Lowest Price</SelectItem>
                <SelectItem value="price_high">Highest Price</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters Button */}
          <Button variant="outline" onClick={() => {
            setSearchTerm('');
            setTopicFilter('all');
            setCityFilter('');
            setVerifiedOnly(false);
            setMinRating('0');
            setSortBy('verified');
          }}>
            Clear All Filters
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedMentors.map((mentor) => (
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
                    {mentor.is_verified && <VerificationBadge isVerified={true} />}
                    {mentor.country && (
                      <CountryFlag country={mentor.country} className="w-5 h-4" />
                    )}
                  </div>
                  {(mentor.rating_avg ?? 0) > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{mentor.rating_avg?.toFixed(1)}</span>
                      <span className="text-xs text-muted-foreground">({mentor.rating_count})</span>
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
                  {/* Skills Section */}
                  {(mentor as any).mentor_skills && (mentor as any).mentor_skills.length > 0 ? (
                    <div>
                      <span className="text-xs font-medium text-muted-foreground">Skills:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(mentor as any).mentor_skills.slice(0, 3).map((skillObj: any) => (
                          <Badge key={skillObj.skill} variant="secondary" className="text-xs px-1.5 py-0.5">
                            {skillObj.skill}
                          </Badge>
                        ))}
                        {(mentor as any).mentor_skills.length > 3 && (
                          <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                            +{(mentor as any).mentor_skills.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ) : (
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
                  )}
                  
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

        {filteredAndSortedMentors.length === 0 && (
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