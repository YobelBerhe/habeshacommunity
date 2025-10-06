import { AnimatedList, AnimatedListItem } from '@/components/AnimatedList';
import { PageTransition } from '@/components/PageTransition';
import { useState, useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '@/hooks/useDebounce';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, MapPin, DollarSign, MessageCircle, X, SlidersHorizontal, Sparkles, TrendingUp } from 'lucide-react';
import MentorHeader from '@/components/MentorHeader';
import CountryFlag from '@/components/CountryFlag';
import ImageBox from '@/components/ImageBox';
import MessageMentorModal from '@/components/MessageMentorModal';
import { VerificationBadge } from '@/components/VerificationBadge';
import MentorCardSkeleton from '@/components/MentorCardSkeleton';

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

// Memoized MentorCard component for better performance
const MentorCard = memo(({ 
  mentor, 
  badges, 
  onMessage, 
  onViewProfile,
  formatPrice 
}: { 
  mentor: Mentor; 
  badges: any[]; 
  onMessage: () => void; 
  onViewProfile: () => void;
  formatPrice: (cents: number, currency: string) => string;
}) => {
  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Enhanced Image with Overlay */}
      <div className="relative">
        <ImageBox
          src={mentor.photos?.[0]}
          alt={mentor.display_name}
          className="rounded-t-lg h-64 w-full"
          showOverlay
        />

        {/* Price Badge */}
        <div className="absolute top-3 right-3 bg-background/95 backdrop-blur-md px-3 py-1.5 rounded-full border shadow-lg">
          <div className="flex items-center gap-1 text-sm font-bold">
            <DollarSign className="w-4 h-4 text-primary" />
            {formatPrice(mentor.price_cents, mentor.currency)}
          </div>
        </div>

        {/* Featured Badge */}
        {(mentor as any).is_featured && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Featured
          </div>
        )}

        {/* Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      <CardHeader className="space-y-3">
        {/* Name Row */}
        <CardTitle className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <span className="truncate">{mentor.display_name}</span>
            {mentor.is_verified && <VerificationBadge isVerified={true} />}
            {mentor.country && <CountryFlag country={mentor.country} className="w-5 h-4 shrink-0" />}
          </div>
          {(mentor.rating_avg ?? 0) > 0 && (
            <div className="flex items-center gap-1 shrink-0">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-semibold">{mentor.rating_avg?.toFixed(1)}</span>
            </div>
          )}
        </CardTitle>

        {/* Badges Display */}
        {badges && badges.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {badges.slice(0, 4).map((badge) => (
                <span
                  key={badge.id}
                  title={badge.label}
                  className="text-lg hover:scale-125 transition-transform"
                >
                  {badge.icon}
                </span>
              ))}
            </div>
            {badges.length > 4 && (
              <Badge variant="secondary" className="text-xs h-5">
                +{badges.length - 4}
              </Badge>
            )}
          </div>
        )}

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span className="truncate">
            {mentor.city}{mentor.country && `, ${mentor.country}`}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Bio */}
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {mentor.bio}
        </p>

        {/* Skills/Topics */}
        <div>
          {(mentor as any).mentor_skills && (mentor as any).mentor_skills.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {(mentor as any).mentor_skills.slice(0, 3).map((skillObj: any) => (
                <Badge key={skillObj.skill} variant="secondary" className="text-xs">
                  {skillObj.skill}
                </Badge>
              ))}
              {(mentor as any).mentor_skills.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{(mentor as any).mentor_skills.length - 3}
                </Badge>
              )}
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {mentor.topics?.slice(0, 2).map(topic => (
                <Badge key={topic} variant="secondary" className="text-xs">
                  {topic}
                </Badge>
              ))}
              {mentor.topics?.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{mentor.topics.length - 2}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Languages */}
        {mentor.languages?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {mentor.languages.slice(0, 2).map(lang => (
              <Badge key={lang} variant="outline" className="text-xs">
                {lang}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="gap-2 bg-muted/30">
        <Button
          variant="outline"
          size="sm"
          onClick={onMessage}
          className="flex-1"
        >
          <MessageCircle className="w-4 h-4 mr-1.5" />
          Message
        </Button>
        <Button
          size="sm"
          onClick={onViewProfile}
          className="flex-1"
        >
          View Profile
        </Button>
      </CardFooter>
    </Card>
  );
});

export default function MentorList() {
  const navigate = useNavigate();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [mentorBadges, setMentorBadges] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const searchTerm = useDebounce(searchInput, 500);
  const [showFilters, setShowFilters] = useState(false);
  const [skillFilter, setSkillFilter] = useState('all');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('');
  const [minRating, setMinRating] = useState('0');
  const [sortBy, setSortBy] = useState('featured');
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
        .select(`*, mentor_skills(skill)`)
        .eq('available', true)
        .order('is_featured', { ascending: false })
        .order('badges_count', { ascending: false })
        .order('is_verified', { ascending: false })
        .order('rating_avg', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMentors(data || []);

      if (data && data.length > 0) {
        const mentorIds = data.map(m => m.id);
        const { data: badgesData } = await supabase
          .from('mentor_badges')
          .select('*')
          .in('mentor_id', mentorIds)
          .order('earned_at', { ascending: false });

        if (badgesData) {
          const badgesByMentor = badgesData.reduce((acc, badge) => {
            if (!acc[badge.mentor_id]) acc[badge.mentor_id] = [];
            acc[badge.mentor_id].push(badge);
            return acc;
          }, {} as Record<string, any[]>);
          setMentorBadges(badgesByMentor);
        }
      }
    } catch (error) {
      console.error('Error fetching mentors:', error);
      toast.error('Failed to load mentors');
    } finally {
      setLoading(false);
    }
  };

  // Active filters
  const activeFilters = [
    searchTerm && { label: `Search: "${searchTerm}"`, clear: () => setSearchInput('') },
    skillFilter !== 'all' && { label: `Skill: ${skillFilter}`, clear: () => setSkillFilter('all') },
    languageFilter !== 'all' && { label: `Language: ${languageFilter}`, clear: () => setLanguageFilter('all') },
    cityFilter && { label: `City: ${cityFilter}`, clear: () => setCityFilter('') },
    minRating !== '0' && { label: `${minRating}+ stars`, clear: () => setMinRating('0') },
  ].filter(Boolean);

  const clearAllFilters = () => {
    setSearchInput('');
    setSkillFilter('all');
    setLanguageFilter('all');
    setCityFilter('');
    setMinRating('0');
    setSortBy('featured');
  };

  // Filter and sort logic
  const filteredAndSortedMentors = mentors
    .filter(mentor => {
      const lowerQuery = searchTerm.toLowerCase();
      const skills = (mentor as any).mentor_skills?.map((s: any) => s.skill.toLowerCase()) || [];
      const mentorSkills = (mentor as any).skills || [];
      const mentorLanguages = mentor.languages || [];

      const matchesSearch = !searchTerm || 
        mentor.display_name?.toLowerCase().includes(lowerQuery) ||
        mentor.bio?.toLowerCase().includes(lowerQuery) ||
        mentor.topics?.some(t => t.toLowerCase().includes(lowerQuery)) ||
        skills.some(s => s.includes(lowerQuery)) ||
        mentorSkills.some((s: string) => s.toLowerCase().includes(lowerQuery));

      const matchesSkill = !skillFilter || skillFilter === 'all' || 
        mentorSkills.some((s: string) => s.toLowerCase().includes(skillFilter.toLowerCase()));

      const matchesLanguage = !languageFilter || languageFilter === 'all' ||
        mentorLanguages.some((l: string) => l.toLowerCase().includes(languageFilter.toLowerCase()));

      const matchesCity = !cityFilter || mentor.city?.toLowerCase() === cityFilter.toLowerCase();
      const matchesRating = mentor.rating_avg >= parseFloat(minRating);

      return matchesSearch && matchesSkill && matchesLanguage && matchesCity && matchesRating;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'featured':
          if ((a as any).is_featured !== (b as any).is_featured) {
            return (b as any).is_featured ? 1 : -1;
          }
          return (b.rating_avg ?? 0) - (a.rating_avg ?? 0);
        case 'rating':
          return (b.rating_avg ?? 0) - (a.rating_avg ?? 0);
        case 'newest':
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        case 'price_low':
          return (a.price_cents ?? Infinity) - (b.price_cents ?? Infinity);
        case 'price_high':
          return (b.price_cents ?? 0) - (a.price_cents ?? 0);
        default:
          return 0;
      }
    });

  const formatPrice = (cents: number, currency: string) => {
    const amount = cents / 100;
    return `${currency} ${amount.toFixed(0)}`;
  };

  return (
    <PageTransition>
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3 border-b">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="h-8 w-8">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
          </Button>
          <h1 className="text-lg font-semibold">Find Your Mentor</h1>
          <div className="ml-auto">
            <Badge variant="secondary" className="text-xs">
              {filteredAndSortedMentors.length} mentors
            </Badge>
          </div>
        </div>

        {/* Search & Filter Toggle */}
        <div className="px-4 py-3 space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Search by name, skills, topics..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className="flex-1"
            />
            <Button
              variant={showFilters ? "default" : "outline"}
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className="shrink-0"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </Button>
          </div>

          {/* Active Filters Chips */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-muted-foreground">Active filters:</span>
              {activeFilters.map((filter: any, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="gap-1 pr-1 cursor-pointer hover:bg-destructive/20 transition-colors"
                  onClick={filter.clear}
                >
                  {filter.label}
                  <X className="w-3 h-3" />
                </Badge>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="h-6 text-xs"
              >
                Clear all
              </Button>
            </div>
          )}

          {/* Collapsible Filters */}
          {showFilters && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 pt-2 border-t animate-fade-in">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="rating">Top Rated</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price_low">Low Price</SelectItem>
                  <SelectItem value="price_high">High Price</SelectItem>
                </SelectContent>
              </Select>

              <Select value={skillFilter} onValueChange={setSkillFilter}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Skill" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Skills</SelectItem>
                  <SelectItem value="React">React</SelectItem>
                  <SelectItem value="AI">AI</SelectItem>
                  <SelectItem value="Career">Career</SelectItem>
                  <SelectItem value="Leadership">Leadership</SelectItem>
                </SelectContent>
              </Select>

              <Select value={languageFilter} onValueChange={setLanguageFilter}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Tigrinya">Tigrinya</SelectItem>
                  <SelectItem value="Amharic">Amharic</SelectItem>
                </SelectContent>
              </Select>

              <Select value={minRating} onValueChange={setMinRating}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">All Ratings</SelectItem>
                  <SelectItem value="4">4.0+</SelectItem>
                  <SelectItem value="4.5">4.5+</SelectItem>
                  <SelectItem value="5">5.0</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="City"
                value={cityFilter}
                onChange={e => setCityFilter(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 pb-24 md:pb-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <MentorCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredAndSortedMentors.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-primary/50" />
                </div>
                <h3 className="text-xl font-semibold">No mentors found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters or search terms
                </p>
                <Button onClick={clearAllFilters} variant="outline">
                  Clear all filters
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
        <AnimatedList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedMentors.map(mentor => (
          <AnimatedListItem key={mentor.id}>
            <MentorCard
              mentor={mentor}
              badges={mentorBadges[mentor.id] || []}
              onMessage={() => {
                setSelectedMentor(mentor);
                setMessageModalOpen(true);
              }}
              onViewProfile={() => navigate(`/mentor/${mentor.id}`)}
              formatPrice={formatPrice}
            />
          </AnimatedListItem>
            ))}
          </AnimatedList>
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

      {/* Mobile CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t shadow-lg z-50">
        <Button onClick={() => navigate('/mentor/onboarding')} className="w-full" size="lg">
          <Sparkles className="w-4 h-4 mr-2" />
          Become a Mentor
        </Button>
      </div>
    </div>
    </PageTransition>
  );
}
