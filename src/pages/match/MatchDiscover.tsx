import { useState } from 'react';
import { 
  Heart, X, Star, MapPin, Briefcase, GraduationCap,
  Info, Filter, Zap, Sparkles, ArrowLeft,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { MatchBottomNav } from '@/components/match/MatchBottomNav';

interface Profile {
  id: string;
  name: string;
  age: number;
  avatar: string;
  location: string;
  occupation: string;
  education: string;
  bio: string;
  interests: string[];
  photos: number;
  distance: number;
  matchScore: number;
  religion: string;
  height: string;
  verified: boolean;
}

const MatchDiscover = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    ageRange: [22, 35] as [number, number],
    distance: 50,
    education: 'any',
    religion: 'any',
    verified: false,
    hasPhotos: false
  });

  // All profiles (simulated database)
  const allProfiles: Profile[] = [
    {
      id: '1',
      name: 'Sara Mehretab',
      age: 27,
      avatar: 'SM',
      location: 'Washington DC',
      occupation: 'Software Engineer',
      education: 'Masters Degree',
      bio: 'Love hiking, coffee, and meaningful conversations. Looking for someone who values family and has ambition.',
      interests: ['Hiking', 'Coffee', 'Travel', 'Music'],
      photos: 5,
      distance: 5,
      matchScore: 94,
      religion: 'Orthodox',
      height: '5\'6"',
      verified: true
    },
    {
      id: '2',
      name: 'Meron Kidane',
      age: 29,
      avatar: 'MK',
      location: 'Silver Spring, MD',
      occupation: 'Marketing Manager',
      education: 'Bachelors Degree',
      bio: 'Passionate about fitness, food, and family. Seeking genuine connection.',
      interests: ['Fitness', 'Cooking', 'Reading', 'Yoga'],
      photos: 6,
      distance: 12,
      matchScore: 89,
      religion: 'Orthodox',
      height: '5\'5"',
      verified: true
    },
    {
      id: '3',
      name: 'Rahel Woldu',
      age: 26,
      avatar: 'RW',
      location: 'Arlington, VA',
      occupation: 'Product Designer',
      education: 'Bachelors Degree',
      bio: 'Creative soul who loves art, music, and good food. Looking for someone authentic.',
      interests: ['Art', 'Design', 'Music', 'Photography'],
      photos: 4,
      distance: 8,
      matchScore: 87,
      religion: 'Catholic',
      height: '5\'7"',
      verified: false
    },
    {
      id: '4',
      name: 'Senait Tesfay',
      age: 31,
      avatar: 'ST',
      location: 'Bethesda, MD',
      occupation: 'Doctor',
      education: 'Doctorate',
      bio: 'Healthcare professional who values compassion and intelligence. Love traveling and trying new restaurants.',
      interests: ['Travel', 'Medicine', 'Food', 'Volunteering'],
      photos: 5,
      distance: 15,
      matchScore: 92,
      religion: 'Orthodox',
      height: '5\'8"',
      verified: true
    },
    {
      id: '5',
      name: 'Hanna Berhe',
      age: 24,
      avatar: 'HB',
      location: 'Alexandria, VA',
      occupation: 'Teacher',
      education: 'Bachelors Degree',
      bio: 'Educator with a passion for making a difference. Looking for kindness and humor.',
      interests: ['Teaching', 'Books', 'Dance', 'Community Service'],
      photos: 3,
      distance: 10,
      matchScore: 85,
      religion: 'Protestant',
      height: '5\'4"',
      verified: false
    },
    {
      id: '6',
      name: 'Eden Haile',
      age: 28,
      avatar: 'EH',
      location: 'Rockville, MD',
      occupation: 'Financial Analyst',
      education: 'Masters Degree',
      bio: 'Numbers by day, adventurer by night. Seeking someone ambitious and fun-loving.',
      interests: ['Finance', 'Hiking', 'Wine', 'Traveling'],
      photos: 5,
      distance: 18,
      matchScore: 88,
      religion: 'Orthodox',
      height: '5\'6"',
      verified: true
    },
    {
      id: '7',
      name: 'Liya Solomon',
      age: 32,
      avatar: 'LS',
      location: 'Washington DC',
      occupation: 'Lawyer',
      education: 'Doctorate',
      bio: 'Advocate for justice with a soft heart. Love deep conversations and good wine.',
      interests: ['Law', 'Reading', 'Wine', 'Politics'],
      photos: 4,
      distance: 3,
      matchScore: 91,
      religion: 'Catholic',
      height: '5\'7"',
      verified: true
    },
    {
      id: '8',
      name: 'Nardos Gebre',
      age: 25,
      avatar: 'NG',
      location: 'Falls Church, VA',
      occupation: 'Nurse',
      education: 'Bachelors Degree',
      bio: 'Caring professional who loves helping others. Looking for genuine connection.',
      interests: ['Healthcare', 'Fitness', 'Family', 'Church'],
      photos: 6,
      distance: 14,
      matchScore: 86,
      religion: 'Orthodox',
      height: '5\'5"',
      verified: false
    }
  ];

  // Apply filters to profiles
  const filteredProfiles = allProfiles.filter(profile => {
    // Age filter
    if (profile.age < filters.ageRange[0] || profile.age > filters.ageRange[1]) {
      return false;
    }

    // Distance filter
    if (profile.distance > filters.distance) {
      return false;
    }

    // Education filter
    if (filters.education !== 'any') {
      if (filters.education === 'bachelors' && !profile.education.includes('Bachelors')) {
        return false;
      }
      if (filters.education === 'masters' && !profile.education.includes('Masters')) {
        return false;
      }
      if (filters.education === 'doctorate' && !profile.education.includes('Doctorate')) {
        return false;
      }
    }

    // Religion filter
    if (filters.religion !== 'any' && profile.religion.toLowerCase() !== filters.religion.toLowerCase()) {
      return false;
    }

    // Verified filter
    if (filters.verified && !profile.verified) {
      return false;
    }

    // Has photos filter
    if (filters.hasPhotos && profile.photos < 3) {
      return false;
    }

    return true;
  });

  const currentProfile = filteredProfiles[currentIndex];

  const handleLike = () => {
    if (!currentProfile) return;

    toast.success('Liked!', {
      description: `You liked ${currentProfile.name}`
    });

    if (currentIndex < filteredProfiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      toast('No more profiles', {
        description: 'Check back later for new matches!'
      });
    }
  };

  const handlePass = () => {
    if (!currentProfile) return;

    if (currentIndex < filteredProfiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      toast('No more profiles', {
        description: 'Check back later for new matches!'
      });
    }
  };

  const handleSuperLike = () => {
    if (!currentProfile) return;

    toast.success('Super Like! ⭐', {
      description: `You sent a Super Like to ${currentProfile.name}`
    });

    if (currentIndex < filteredProfiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredProfiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const applyFilters = () => {
    setCurrentIndex(0); // Reset to first profile
    setFiltersOpen(false);
    toast.success('Filters applied!', {
      description: `Found ${filteredProfiles.length} matches`
    });
  };

  const resetFilters = () => {
    setFilters({
      ageRange: [22, 35],
      distance: 50,
      education: 'any',
      religion: 'any',
      verified: false,
      hasPhotos: false
    });
    setCurrentIndex(0);
    toast.success('Filters reset');
  };

  if (!currentProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-12 text-center max-w-md">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No More Profiles</h2>
          <p className="text-muted-foreground mb-6">
            Try adjusting your filters or check back later for new matches!
          </p>
          <div className="flex gap-3">
            <Button onClick={resetFilters} variant="outline" className="flex-1">
              Reset Filters
            </Button>
            <Button onClick={() => navigate('/match')} className="flex-1">
              Go Back
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-pink-950/20 dark:via-purple-950/20 dark:to-blue-950/20 pb-20 md:pb-0">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate('/match')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {currentIndex + 1} / {filteredProfiles.length}
              </Badge>

              {/* Filter Button */}
              <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                    {(filters.education !== 'any' || filters.religion !== 'any' || filters.verified || filters.hasPhotos) && (
                      <span className="ml-2 w-2 h-2 bg-primary rounded-full" />
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Discovery Filters</SheetTitle>
                    <SheetDescription>
                      Customize your match preferences
                    </SheetDescription>
                  </SheetHeader>

                  <div className="space-y-6 mt-6">
                    {/* Age Range */}
                    <div>
                      <Label className="mb-3 block">
                        Age Range: {filters.ageRange[0]} - {filters.ageRange[1]}
                      </Label>
                      <Slider
                        min={18}
                        max={50}
                        step={1}
                        value={filters.ageRange}
                        onValueChange={(value) => setFilters({ ...filters, ageRange: value as [number, number] })}
                        className="w-full"
                      />
                    </div>

                    {/* Distance */}
                    <div>
                      <Label className="mb-3 block">
                        Maximum Distance: {filters.distance} miles
                      </Label>
                      <Slider
                        min={5}
                        max={100}
                        step={5}
                        value={[filters.distance]}
                        onValueChange={(value) => setFilters({ ...filters, distance: value[0] })}
                        className="w-full"
                      />
                    </div>

                    {/* Education Level */}
                    <div>
                      <Label htmlFor="education" className="mb-2 block">Education Level</Label>
                      <Select value={filters.education} onValueChange={(value) => setFilters({ ...filters, education: value })}>
                        <SelectTrigger id="education">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any Education</SelectItem>
                          <SelectItem value="bachelors">Bachelors Degree</SelectItem>
                          <SelectItem value="masters">Masters Degree</SelectItem>
                          <SelectItem value="doctorate">Doctorate</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Religion */}
                    <div>
                      <Label htmlFor="religion" className="mb-2 block">Religion</Label>
                      <Select value={filters.religion} onValueChange={(value) => setFilters({ ...filters, religion: value })}>
                        <SelectTrigger id="religion">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any Religion</SelectItem>
                          <SelectItem value="orthodox">Orthodox</SelectItem>
                          <SelectItem value="catholic">Catholic</SelectItem>
                          <SelectItem value="protestant">Protestant</SelectItem>
                          <SelectItem value="muslim">Muslim</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Verified Only */}
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <Label htmlFor="verified" className="font-semibold">Verified Only</Label>
                        <p className="text-xs text-muted-foreground">Show only verified profiles</p>
                      </div>
                      <Switch
                        id="verified"
                        checked={filters.verified}
                        onCheckedChange={(checked) => setFilters({ ...filters, verified: checked })}
                      />
                    </div>

                    {/* Has Photos */}
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <Label htmlFor="hasPhotos" className="font-semibold">Has Photos</Label>
                        <p className="text-xs text-muted-foreground">Show profiles with 3+ photos</p>
                      </div>
                      <Switch
                        id="hasPhotos"
                        checked={filters.hasPhotos}
                        onCheckedChange={(checked) => setFilters({ ...filters, hasPhotos: checked })}
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <Button variant="outline" onClick={resetFilters} className="flex-1">
                        Reset
                      </Button>
                      <Button onClick={applyFilters} className="flex-1">
                        Apply Filters
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Profile Card */}
        <Card className="overflow-hidden shadow-2xl">
          {/* Profile Image Area */}
          <div className="relative h-96 bg-gradient-to-br from-blue-400 to-purple-400">
            <div className="absolute inset-0 flex items-center justify-center">
              <Avatar className="w-64 h-64 border-4 border-white">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-6xl font-bold">
                  {currentProfile.avatar}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Match Score */}
            <div className="absolute top-4 right-4">
              <Badge className="bg-gradient-to-r from-green-500 to-teal-500 text-white text-lg px-4 py-2">
                <Sparkles className="w-5 h-5 mr-2" />
                {currentProfile.matchScore}% Match
              </Badge>
            </div>

            {/* Verified Badge */}
            {currentProfile.verified && (
              <div className="absolute top-4 left-4">
                <Badge className="bg-blue-500 text-white">
                  <Zap className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              </div>
            )}

            {/* Navigation Arrows */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4">
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full shadow-lg"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full shadow-lg"
                onClick={handleNext}
                disabled={currentIndex === filteredProfiles.length - 1}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            {/* Photo Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
              <div className="flex gap-1">
                {Array.from({ length: currentProfile.photos }).map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-white rounded-full opacity-70" />
                ))}
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="p-6">
            <div className="mb-4">
              <h2 className="text-3xl font-bold mb-2">
                {currentProfile.name}, {currentProfile.age}
              </h2>
              <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {currentProfile.location} ({currentProfile.distance} mi)
                </div>
                <div className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                  {currentProfile.occupation}
                </div>
                <div className="flex items-center gap-1">
                  <GraduationCap className="w-4 h-4" />
                  {currentProfile.education}
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2">About</h3>
              <p className="text-sm text-muted-foreground">{currentProfile.bio}</p>
            </div>

            {/* Interests */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {currentProfile.interests.map((interest, index) => (
                  <Badge key={index} variant="secondary">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Height:</span>
                <p className="font-semibold">{currentProfile.height}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Religion:</span>
                <p className="font-semibold">{currentProfile.religion}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <Button
            size="lg"
            variant="outline"
            onClick={handlePass}
            className="w-16 h-16 rounded-full border-2"
          >
            <X className="w-8 h-8 text-red-500" />
          </Button>

          <Button
            size="lg"
            onClick={handleSuperLike}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
          >
            <Star className="w-8 h-8" />
          </Button>

          <Button
            size="lg"
            onClick={handleLike}
            className="w-20 h-20 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
          >
            <Heart className="w-10 h-10" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate(`/match/profile/${currentProfile.id}`)}
            className="w-16 h-16 rounded-full border-2"
          >
            <Info className="w-8 h-8 text-blue-500" />
          </Button>
        </div>

        {/* Button Labels */}
        <div className="flex items-center justify-center gap-4 mt-2 text-xs text-muted-foreground">
          <span className="w-16 text-center">Pass</span>
          <span className="w-16 text-center">Super Like</span>
          <span className="w-20 text-center">Like</span>
          <span className="w-16 text-center">Info</span>
        </div>
      </div>

      {/* Bottom Navigation */}
      <MatchBottomNav />
    </div>
  );
};

export default MatchDiscover;
