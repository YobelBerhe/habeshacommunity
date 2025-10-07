import { useState, useEffect } from 'react';
import { Heart, X, Star, MapPin, Briefcase, GraduationCap, Church, Users, Sliders, ArrowLeft, Info, Sparkles, Filter, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { likeUser, passUser } from '@/utils/matchActions';

interface MatchProfile {
  id: string;
  name: string;
  age: number;
  location: string;
  origin: string;
  profession: string;
  education: string;
  faith: string;
  languages: string[];
  interests: string[];
  bio: string;
  compatibility: number;
  verified: boolean;
  photos: string[];
  lookingFor: string;
}

interface Filters {
  ageRange: [number, number];
  location: string;
  faith: string;
  education: string;
  distance: number;
}

const MatchDiscover = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [profiles, setProfiles] = useState<MatchProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    ageRange: [22, 35],
    location: 'all',
    faith: 'all',
    education: 'all',
    distance: 50,
  });

  useEffect(() => {
    loadProfiles();
  }, [filters]);

  const loadProfiles = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Please sign in to view matches');
        navigate('/auth/login');
        return;
      }

      // Build query with filters
      let query = supabase
        .from('match_profiles')
        .select('*')
        .eq('active', true)
        .neq('user_id', user.id) // Don't show own profile
        .gte('age', filters.ageRange[0])
        .lte('age', filters.ageRange[1]);

      // Apply location filter
      if (filters.location !== 'all') {
        query = query.eq('city', filters.location);
      }

      // Apply faith filter (would need to add to match_profiles if not exists)
      if (filters.faith !== 'all') {
        query = query.contains('interests', [filters.faith]);
      }

      const { data, error } = await query.limit(20);

      if (error) throw error;

      // Transform database data to MatchProfile format
      const transformedProfiles: MatchProfile[] = (data || []).map(profile => ({
        id: profile.id,
        name: profile.name,
        age: profile.age || 25,
        location: `${profile.city}, ${profile.country || 'Unknown'}`,
        origin: profile.city,
        profession: 'Professional', // Would need to add to DB
        education: 'University Graduate', // Would need to add to DB
        faith: 'Christian', // Would need to add to DB
        languages: ['English'], // Would use profile data if available
        interests: profile.interests || [],
        bio: profile.bio || 'No bio available',
        compatibility: Math.floor(Math.random() * 20) + 80, // TODO: Calculate real compatibility
        verified: false, // Would need verification system
        photos: profile.photos || [],
        lookingFor: profile.looking_for || 'Meaningful connection'
      }));

      setProfiles(transformedProfiles);
      setLoading(false);
    } catch (error) {
      console.error('Error loading profiles:', error);
      toast.error('Failed to load profiles');
      setLoading(false);
    }
  };

  const handleSwipe = async (direction: 'left' | 'right') => {
    setSwipeDirection(direction);
    
    try {
      if (direction === 'right') {
        await likeUser(currentProfile.id);
        toast.success('Like sent! 💙', {
          description: `We'll let you know if ${currentProfile.name} likes you back`
        });
      } else {
        await passUser(currentProfile.id);
      }
      
      setTimeout(() => {
        if (currentIndex < profiles.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          // Reload profiles when we run out
          loadProfiles();
          setCurrentIndex(0);
        }
        setSwipeDirection(null);
      }, 300);
    } catch (error) {
      console.error('Error handling swipe:', error);
      toast.error('Something went wrong');
      setSwipeDirection(null);
    }
  };

  const handleSuperLike = () => {
    toast.success('Super Like sent! ⭐', {
      description: `${currentProfile.name} will see you liked them`
    });
    handleSwipe('right');
  };

  const currentProfile = profiles[currentIndex];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Finding your matches...</p>
        </div>
      </div>
    );
  }

  if (!currentProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md">
          <Sparkles className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">No more profiles</h2>
          <p className="text-muted-foreground mb-4">
            Check back later for new matches, or adjust your filters to see more people.
          </p>
          <Button onClick={() => setShowFilters(true)} className="w-full">
            <Sliders className="w-4 h-4 mr-2" />
            Adjust Filters
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-blue-50/30 dark:via-blue-950/10 to-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/match/matches')}
              className="lg:hidden"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white fill-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Discover</h1>
                <p className="text-xs text-muted-foreground">Find your match</p>
              </div>
            </div>

            <Sheet open={showFilters} onOpenChange={setShowFilters}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <Filter className="w-4 h-4" />
                  {(filters.faith !== 'all' || filters.education !== 'all') && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <FilterPanel filters={filters} setFilters={setFilters} />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Profile Card */}
        <div className={`relative transition-all duration-300 ${
          swipeDirection === 'left' ? 'animate-slide-out-left' : 
          swipeDirection === 'right' ? 'animate-slide-out-right' : 
          'animate-scale-in'
        }`}>
          <Card className="overflow-hidden shadow-xl border-2">
            {/* Image Section */}
            <div className="relative h-96 bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 flex items-center justify-center">
              {/* Compatibility Badge */}
              <div className="absolute top-4 left-4 z-10">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2">
                  <Sparkles className="w-5 h-5" />
                  <span className="font-bold text-lg">{currentProfile.compatibility}% Match</span>
                </div>
              </div>

              {/* Verified Badge */}
              {currentProfile.verified && (
                <div className="absolute top-4 right-4 bg-white dark:bg-card rounded-full px-4 py-2 flex items-center space-x-2 shadow-lg z-10">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">Verified</span>
                </div>
              )}

              {/* Profile Photo Placeholder */}
              <div className="w-48 h-48 bg-white dark:bg-card rounded-full shadow-2xl flex items-center justify-center">
                <Users className="w-24 h-24 text-muted-foreground" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="p-6 space-y-6">
              {/* Name & Basic Info */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-3xl font-bold">{currentProfile.name}, {currentProfile.age}</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/match/profile/${currentProfile.id}`)}
                  >
                    <Info className="w-5 h-5" />
                  </Button>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{currentProfile.location}</span>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-xl p-4 border border-blue-200/50 dark:border-blue-800/50">
                  <div className="flex items-center space-x-2 mb-2">
                    <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-semibold text-blue-900 dark:text-blue-100">Profession</span>
                  </div>
                  <p className="font-medium text-sm text-foreground">{currentProfile.profession}</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl p-4 border border-purple-200/50 dark:border-purple-800/50">
                  <div className="flex items-center space-x-2 mb-2">
                    <GraduationCap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-xs font-semibold text-purple-900 dark:text-purple-100">Education</span>
                  </div>
                  <p className="font-medium text-sm text-foreground">{currentProfile.education}</p>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-xl p-4 border border-amber-200/50 dark:border-amber-800/50">
                  <div className="flex items-center space-x-2 mb-2">
                    <Church className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span className="text-xs font-semibold text-amber-900 dark:text-amber-100">Faith</span>
                  </div>
                  <p className="font-medium text-sm text-foreground">{currentProfile.faith}</p>
                </div>

                <div className="bg-gradient-to-br from-teal-50 to-green-50 dark:from-teal-950/30 dark:to-green-950/30 rounded-xl p-4 border border-teal-200/50 dark:border-teal-800/50">
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    <span className="text-xs font-semibold text-teal-900 dark:text-teal-100">Origin</span>
                  </div>
                  <p className="font-medium text-sm text-foreground">{currentProfile.origin}</p>
                </div>
              </div>

              {/* Bio */}
              <div>
                <h3 className="font-bold text-foreground mb-3 flex items-center">
                  <Info className="w-5 h-5 mr-2 text-muted-foreground" />
                  About
                </h3>
                <p className="text-foreground leading-relaxed bg-muted/50 rounded-xl p-4 border border-border">
                  {currentProfile.bio}
                </p>
              </div>

              {/* Languages */}
              <div>
                <h3 className="font-bold text-foreground mb-3">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {currentProfile.languages.map((lang, idx) => (
                    <Badge key={idx} variant="secondary" className="px-3 py-1">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div>
                <h3 className="font-bold text-foreground mb-3">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {currentProfile.interests.map((interest, idx) => (
                    <Badge key={idx} className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 px-3 py-1">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Match Reasons */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl p-5 border border-green-200/50 dark:border-green-800/50">
                <h3 className="font-bold text-foreground mb-4 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                  Why You Match
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span className="text-foreground">Shared {currentProfile.faith} faith</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span className="text-foreground">Similar family values</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span className="text-foreground">Compatible life goals</span>
                  </li>
                </ul>
              </div>

              {/* Looking For */}
              <div className="bg-purple-50 dark:bg-purple-950/30 rounded-xl p-4 border border-purple-200/50 dark:border-purple-800/50">
                <p className="text-foreground">
                  <span className="font-bold text-purple-900 dark:text-purple-100">Looking for: </span>
                  <span>{currentProfile.lookingFor}</span>
                </p>
              </div>
            </div>
          </Card>

          {/* Action Buttons - Desktop */}
          <div className="hidden md:flex items-center justify-center space-x-6 mt-8">
            <Button
              size="lg"
              variant="outline"
              className="w-20 h-20 rounded-full border-4 border-red-200 hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all shadow-lg group"
              onClick={() => handleSwipe('left')}
            >
              <X className="w-10 h-10 text-red-400 group-hover:text-red-500 transition-colors" />
            </Button>

            <Button
              size="lg"
              className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 hover:shadow-2xl transition-all shadow-lg"
              onClick={handleSuperLike}
            >
              <Star className="w-9 h-9 text-white" />
            </Button>

            <Button
              size="lg"
              className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 hover:shadow-2xl transition-all shadow-xl transform hover:scale-110"
              onClick={() => handleSwipe('right')}
            >
              <Heart className="w-12 h-12 text-white fill-white" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="w-20 h-20 rounded-full border-4 border-purple-200 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-all shadow-lg group"
              onClick={() => navigate(`/inbox?user=${currentProfile.id}`)}
            >
              <MessageCircle className="w-9 h-9 text-purple-400 group-hover:text-purple-500 transition-colors" />
            </Button>
          </div>

          {/* Action Buttons - Mobile (Fixed Bottom) */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border p-4 z-50">
            <div className="flex items-center justify-center space-x-4 max-w-md mx-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-16 h-16 rounded-full border-2 border-red-200 hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
                onClick={() => handleSwipe('left')}
              >
                <X className="w-8 h-8 text-red-400" />
              </Button>

              <Button
                size="lg"
                className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500"
                onClick={handleSuperLike}
              >
                <Star className="w-7 h-7 text-white" />
              </Button>

              <Button
                size="lg"
                className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 shadow-xl"
                onClick={() => handleSwipe('right')}
              >
                <Heart className="w-10 h-10 text-white fill-white" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="w-16 h-16 rounded-full border-2 border-purple-200 hover:border-purple-400"
                onClick={() => navigate(`/inbox?user=${currentProfile.id}`)}
              >
                <MessageCircle className="w-7 h-7 text-purple-400" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="container mx-auto px-4 pb-24 md:pb-8 max-w-2xl">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-800">
          <h3 className="font-bold text-foreground mb-3 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
            Tips for Better Matches
          </h3>
          <ul className="space-y-2 text-sm text-foreground">
            <li>• Complete your profile to increase compatibility scores</li>
            <li>• Use filters to find people who share your values</li>
            <li>• Super likes get you noticed faster</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

// Filter Panel Component
const FilterPanel = ({ filters, setFilters }: { 
  filters: Filters; 
  setFilters: (filters: Filters) => void;
}) => {
  return (
    <div className="space-y-6 py-6">
      {/* Age Range */}
      <div>
        <label className="text-sm font-semibold mb-3 block">
          Age Range: {filters.ageRange[0]} - {filters.ageRange[1]}
        </label>
        <Slider
          value={filters.ageRange}
          onValueChange={(value) => setFilters({ ...filters, ageRange: value as [number, number] })}
          min={18}
          max={60}
          step={1}
          className="mb-2"
        />
      </div>

      {/* Location */}
      <div>
        <label className="text-sm font-semibold mb-2 block">Location</label>
        <Select value={filters.location} onValueChange={(value) => setFilters({ ...filters, location: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="us-east">USA - East Coast</SelectItem>
            <SelectItem value="us-west">USA - West Coast</SelectItem>
            <SelectItem value="canada">Canada</SelectItem>
            <SelectItem value="uk">United Kingdom</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Faith */}
      <div>
        <label className="text-sm font-semibold mb-2 block">Faith</label>
        <Select value={filters.faith} onValueChange={(value) => setFilters({ ...filters, faith: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Faiths</SelectItem>
            <SelectItem value="orthodox">Orthodox Christian</SelectItem>
            <SelectItem value="catholic">Catholic</SelectItem>
            <SelectItem value="protestant">Protestant</SelectItem>
            <SelectItem value="muslim">Muslim</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Education */}
      <div>
        <label className="text-sm font-semibold mb-2 block">Education Level</label>
        <Select value={filters.education} onValueChange={(value) => setFilters({ ...filters, education: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Education</SelectItem>
            <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
            <SelectItem value="masters">Master's Degree</SelectItem>
            <SelectItem value="doctorate">Doctorate</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Distance */}
      <div>
        <label className="text-sm font-semibold mb-3 block">
          Maximum Distance: {filters.distance} miles
        </label>
        <Slider
          value={[filters.distance]}
          onValueChange={(value) => setFilters({ ...filters, distance: value[0] })}
          min={5}
          max={500}
          step={5}
          className="mb-2"
        />
      </div>

      {/* Reset Button */}
      <Button
        variant="outline"
        className="w-full"
        onClick={() => setFilters({
          ageRange: [22, 35],
          location: 'all',
          faith: 'all',
          education: 'all',
          distance: 50,
        })}
      >
        Reset Filters
      </Button>
    </div>
  );
};

export default MatchDiscover;
