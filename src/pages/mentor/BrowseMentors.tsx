import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Star, 
  MapPin, 
  DollarSign, 
  Filter,
  Clock,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

interface Mentor {
  id: string;
  name: string;
  avatar: string;
  title: string;
  expertise: string[];
  rating: number;
  reviewCount: number;
  pricePerHour: number;
  location: string;
  verified: boolean;
  responseTime: string;
}

export default function BrowseMentors() {
  const navigate = useNavigate();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      setLoading(true);

      // Fetch available mentors
      const { data: mentorsData, error } = await supabase
        .from('mentors')
        .select(`
          id,
          user_id,
          name,
          display_name,
          title,
          bio,
          expertise,
          hourly_rate_cents,
          avatar_url,
          city,
          country,
          is_verified,
          available,
          rating_avg,
          rating_count
        `)
        .eq('available', true)
        .order('is_verified', { ascending: false })
        .limit(30);

      if (error) throw error;

      if (!mentorsData || mentorsData.length === 0) {
        setMentors([]);
        setLoading(false);
        return;
      }

      // Format for UI
      const formatted: Mentor[] = mentorsData.map(mentor => ({
        id: mentor.id,
        name: mentor.display_name || mentor.name || 'Mentor',
        avatar: mentor.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
        title: mentor.title || 'Professional Mentor',
        expertise: Array.isArray(mentor.expertise) ? mentor.expertise : ['General'],
        rating: mentor.rating_avg ? Number(mentor.rating_avg) : 4.5,
        reviewCount: mentor.rating_count || 0,
        pricePerHour: mentor.hourly_rate_cents ? mentor.hourly_rate_cents / 100 : 75,
        location: mentor.city && mentor.country ? `${mentor.city}, ${mentor.country}` : (mentor.city || 'Remote'),
        verified: mentor.is_verified || false,
        responseTime: 'Usually responds in 2 hours'
      }));

      setMentors(formatted);
    } catch (error) {
      console.error('Error fetching mentors:', error);
      toast.error('Failed to load mentors');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Career', 'Immigration', 'Business', 'Education', 'Finance', 'Life Skills'];

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.expertise.some(e => e.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || 
      mentor.expertise.some(e => e.toLowerCase().includes(selectedCategory.toLowerCase()));
    
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-mentor" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-foreground">Find a Mentor</h1>
            <Button variant="ghost" size="icon">
              <Filter className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            <Search className="h-4 w-4" />
          </div>
          <Input
            placeholder="Search by name, expertise..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              className="cursor-pointer whitespace-nowrap"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Results Count */}
        <p className="text-sm text-muted-foreground">
          {filteredMentors.length} mentors available
        </p>

        {/* Mentor Cards */}
        <div className="space-y-4">
          {filteredMentors.map((mentor) => (
            <Card
              key={mentor.id}
              className="p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/mentor/${mentor.id}`)}
            >
              <div className="flex gap-4">
                {/* Avatar */}
                <div className="relative">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={mentor.avatar} alt={mentor.name} />
                    <AvatarFallback>{mentor.name[0]}</AvatarFallback>
                  </Avatar>
                  {mentor.verified && (
                    <div className="absolute -bottom-1 -right-1 bg-background rounded-full">
                      <CheckCircle className="h-5 w-5 text-mentor fill-mentor/20" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{mentor.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">{mentor.title}</p>

                  {/* Expertise Tags */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {mentor.expertise.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-3 mt-2 text-sm">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="font-medium">{mentor.rating.toFixed(1)}</span>
                      {mentor.reviewCount > 0 && (
                        <span className="text-muted-foreground">({mentor.reviewCount})</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{mentor.location}</span>
                    </div>
                  </div>

                  {/* Price & Response Time */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1 text-foreground font-semibold">
                      <DollarSign className="h-4 w-4" />
                      <span>{mentor.pricePerHour}</span>
                      <span className="text-muted-foreground font-normal text-sm">/session</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{mentor.responseTime}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Button 
                className="w-full mt-4 bg-mentor hover:bg-mentor/90"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/mentor/book/${mentor.id}`);
                }}
              >
                Book Session
              </Button>
            </Card>
          ))}
        </div>

        {filteredMentors.length === 0 && !loading && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No mentors found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
