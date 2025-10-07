import { useState, useEffect } from 'react';
import { 
  Heart, X, Star, MapPin, Briefcase, GraduationCap, Church, 
  Users, Globe, MessageCircle, ArrowLeft, Share2, Flag, 
  Sparkles, Info, Calendar, Clock, CheckCircle, Phone, Video,
  Coffee, Book, Music, Camera, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

interface MatchProfile {
  id: string;
  name: string;
  age: number;
  location: string;
  origin: string;
  ethnicity: string;
  profession: string;
  education: string;
  faith: string;
  denomination: string;
  churchAttendance: string;
  languages: string[];
  interests: string[];
  hobbies: string[];
  values: string[];
  bio: string;
  lookingFor: string;
  relationshipGoals: string;
  familyPlans: string;
  height: string;
  compatibility: number;
  verified: boolean;
  lastActive: string;
  memberSince: string;
  photos: string[];
  matchReasons: string[];
  likedBy?: boolean;
  mutual?: boolean;
}

const MatchProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<MatchProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Demo profile (replace with real Supabase data)
  const demoProfile: MatchProfile = {
    id: '1',
    name: 'Sara Desta',
    age: 27,
    location: 'Washington DC, USA',
    origin: 'Addis Ababa, Ethiopia',
    ethnicity: 'Ethiopian',
    profession: 'Healthcare Administrator',
    education: 'Masters in Public Health',
    faith: 'Orthodox Christian',
    denomination: 'Ethiopian Orthodox Tewahedo',
    churchAttendance: 'Weekly',
    languages: ['English', 'Amharic', 'Tigrinya'],
    interests: ['Coffee ceremonies', 'Traditional music', 'Volunteering', 'Reading', 'Cooking', 'Travel'],
    hobbies: ['Church choir', 'Ethiopian cultural events', 'Mentoring youth', 'Hiking'],
    values: ['Family-oriented', 'Faith-centered', 'Traditional values', 'Community service', 'Education'],
    bio: 'Born in Ethiopia and raised between two worlds, I cherish my heritage and faith while building my career in healthcare. I value deep conversations, shared laughter, and building meaningful connections. My faith guides my decisions, and family is at the center of everything I do. Looking for someone who understands the importance of maintaining our beautiful culture while growing together in life.',
    lookingFor: 'Serious relationship leading to marriage',
    relationshipGoals: 'Marriage within 2-3 years',
    familyPlans: 'Want children (2-3)',
    height: '5\'6"',
    compatibility: 92,
    verified: true,
    lastActive: '5 minutes ago',
    memberSince: 'January 2024',
    photos: [],
    matchReasons: [
      'Shared Orthodox Christian faith',
      'Similar family values and traditions',
      'Both value education and career growth',
      'Compatible life goals and timeline',
      'Strong cultural connection',
      'Aligned communication styles'
    ],
    likedBy: false,
    mutual: false
  };

  useEffect(() => {
    loadProfile();
  }, [id]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      // TODO: Replace with real Supabase query
      // const { data, error } = await supabase
      //   .from('match_profiles')
      //   .select('*')
      //   .eq('id', id)
      //   .single();
      
      setTimeout(() => {
        setProfile(demoProfile);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error loading profile:', error);
      setLoading(false);
    }
  };

  const handleLike = () => {
    toast.success("You liked Sara! 💙", {
      description: "We'll notify them if it's a match"
    });
    setProfile(prev => prev ? { ...prev, likedBy: true } : null);
  };

  const handleSuperLike = () => {
    toast.success("Super Like sent! ⭐", {
      description: "Sara will see you really like them"
    });
    setProfile(prev => prev ? { ...prev, likedBy: true } : null);
  };

  const handleMessage = () => {
    if (profile?.mutual) {
      navigate(`/inbox?user=${profile.id}`);
    } else {
      toast.error("Match required", {
        description: "You need to match first before messaging"
      });
    }
  };

  const handleShareWithFamily = () => {
    toast.success("Shared with family! 👨‍👩‍👧", {
      description: "Your family can now review this profile"
    });
    navigate(`/match/family-mode/${id}`);
  };

  const handleReport = () => {
    toast.info("Report submitted", {
      description: "We'll review this profile within 24 hours"
    });
  };

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => 
      prev === (profile?.photos.length || 0) - 1 ? 0 : prev + 1
    );
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => 
      prev === 0 ? (profile?.photos.length || 0) - 1 : prev - 1
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md">
          <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Profile not found</h2>
          <p className="text-muted-foreground mb-4">
            This profile may have been removed or is no longer available.
          </p>
          <Button onClick={() => navigate('/match/discover')}>
            Back to Discover
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-blue-50/20 dark:via-blue-950/10 to-background pb-24 lg:pb-8">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="relative"
              >
                <Share2 className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleReport}
              >
                <Flag className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Photo Section */}
        <Card className="overflow-hidden mb-6 border-2">
          <div className="relative h-96 bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 flex items-center justify-center">
            {/* Compatibility Badge */}
            <div className="absolute top-4 left-4 z-20">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-5 py-2 rounded-full shadow-lg flex items-center space-x-2">
                <Sparkles className="w-5 h-5" />
                <span className="font-bold text-lg">{profile.compatibility}% Match</span>
              </div>
              <div className="mt-2 bg-white dark:bg-card px-4 py-1 rounded-full shadow-md">
                <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                  Excellent Match
                </span>
              </div>
            </div>

            {/* Verified Badge */}
            {profile.verified && (
              <div className="absolute top-4 right-4 bg-white dark:bg-card rounded-full px-4 py-2 flex items-center space-x-2 shadow-lg z-20">
                <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">Verified</span>
              </div>
            )}

            {/* Profile Photo */}
            <Avatar className="w-56 h-56 border-4 border-white shadow-2xl">
              <AvatarFallback className="text-6xl font-bold bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                {profile.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>

            {/* Photo Navigation (if multiple photos) */}
            {profile.photos.length > 1 && (
              <>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full shadow-lg"
                  onClick={prevPhoto}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full shadow-lg"
                  onClick={nextPhoto}
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
                
                {/* Photo Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {profile.photos.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-2 h-2 rounded-full transition-all ${
                        idx === currentPhotoIndex 
                          ? 'bg-white w-6' 
                          : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Name & Basic Info */}
        <Card className="p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">{profile.name}, {profile.age}</h1>
              <div className="space-y-1 text-muted-foreground">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{profile.location}</span>
                </div>
                <div className="flex items-center">
                  <Globe className="w-4 h-4 mr-2" />
                  <span>From {profile.origin}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Active {profile.lastActive}</span>
                </div>
              </div>
            </div>

            {profile.mutual && (
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                <CheckCircle className="w-4 h-4 mr-1" />
                It's a Match!
              </Badge>
            )}
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-xl p-4 border border-blue-200/50 dark:border-blue-800/50">
              <div className="flex items-center space-x-2 mb-2">
                <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-semibold text-blue-900 dark:text-blue-100">Profession</span>
              </div>
              <p className="font-medium text-sm text-foreground">{profile.profession}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl p-4 border border-purple-200/50 dark:border-purple-800/50">
              <div className="flex items-center space-x-2 mb-2">
                <GraduationCap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-xs font-semibold text-purple-900 dark:text-purple-100">Education</span>
              </div>
              <p className="font-medium text-sm text-foreground">{profile.education}</p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-xl p-4 border border-amber-200/50 dark:border-amber-800/50">
              <div className="flex items-center space-x-2 mb-2">
                <Church className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="text-xs font-semibold text-amber-900 dark:text-amber-100">Faith</span>
              </div>
              <p className="font-medium text-sm text-foreground">{profile.faith}</p>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-green-50 dark:from-teal-950/30 dark:to-green-950/30 rounded-xl p-4 border border-teal-200/50 dark:border-teal-800/50">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span className="text-xs font-semibold text-teal-900 dark:text-teal-100">Height</span>
              </div>
              <p className="font-medium text-sm text-foreground">{profile.height}</p>
            </div>
          </div>

          {/* Match Reasons */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl p-5 border border-green-200/50 dark:border-green-800/50">
            <h3 className="font-bold text-foreground mb-4 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
              Why You Match
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {profile.matchReasons.map((reason, idx) => (
                <div key={idx} className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span className="text-sm text-foreground">{reason}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Tabbed Content */}
        <Tabs defaultValue="about" className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
            <TabsTrigger value="looking">Looking For</TabsTrigger>
          </TabsList>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-6 mt-6">
            {/* Bio */}
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <Info className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                About Me
              </h3>
              <p className="text-foreground leading-relaxed">{profile.bio}</p>
            </Card>

            {/* Languages */}
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                Languages
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.languages.map((lang, idx) => (
                  <Badge key={idx} variant="secondary" className="px-4 py-2 text-sm">
                    {lang}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Interests */}
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                Interests
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, idx) => (
                  <Badge 
                    key={idx} 
                    className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 px-4 py-2 text-sm"
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Values */}
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                Core Values
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {profile.values.map((value, idx) => (
                  <div key={idx} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg border border-border">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <span className="text-foreground font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Lifestyle Tab */}
          <TabsContent value="lifestyle" className="space-y-6 mt-6">
            {/* Faith Details */}
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <Church className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                Faith & Spirituality
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                  <span className="text-muted-foreground">Religion</span>
                  <span className="font-semibold text-foreground">{profile.faith}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                  <span className="text-muted-foreground">Denomination</span>
                  <span className="font-semibold text-foreground">{profile.denomination}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                  <span className="text-muted-foreground">Church Attendance</span>
                  <span className="font-semibold text-foreground">{profile.churchAttendance}</span>
                </div>
              </div>
            </Card>

            {/* Hobbies */}
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <Coffee className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                Hobbies & Activities
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {profile.hobbies.map((hobby, idx) => (
                  <div key={idx} className="flex items-center space-x-3 p-3 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-lg border border-blue-200/50 dark:border-blue-800/50">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Music className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-foreground font-medium">{hobby}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Background */}
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                Background & Heritage
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                  <span className="text-muted-foreground">Ethnicity</span>
                  <span className="font-semibold text-foreground">{profile.ethnicity}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                  <span className="text-muted-foreground">Place of Origin</span>
                  <span className="font-semibold text-foreground">{profile.origin}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                  <span className="text-muted-foreground">Current Location</span>
                  <span className="font-semibold text-foreground">{profile.location}</span>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Looking For Tab */}
          <TabsContent value="looking" className="space-y-6 mt-6">
            {/* Relationship Goals */}
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                Relationship Goals
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg border border-purple-200/50 dark:border-purple-800/50">
                  <p className="text-sm text-muted-foreground mb-1">Looking For</p>
                  <p className="font-semibold text-lg text-foreground">{profile.lookingFor}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-lg border border-blue-200/50 dark:border-blue-800/50">
                  <p className="text-sm text-muted-foreground mb-1">Timeline</p>
                  <p className="font-semibold text-lg text-foreground">{profile.relationshipGoals}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-200/50 dark:border-green-800/50">
                  <p className="text-sm text-muted-foreground mb-1">Family Plans</p>
                  <p className="font-semibold text-lg text-foreground">{profile.familyPlans}</p>
                </div>
              </div>
            </Card>

            {/* What I'm Looking For */}
            <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-amber-600 dark:text-amber-400" />
                Ideal Partner
              </h3>
              <p className="text-foreground leading-relaxed">
                Looking for someone who shares my faith, values family traditions, and is ready to build a future together. 
                Someone who appreciates Ethiopian culture, enjoys meaningful conversations, and has strong moral values. 
                A partner who is career-driven but also prioritizes family and faith above all.
              </p>
            </Card>

            {/* Deal Breakers */}
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center text-red-600 dark:text-red-400">
                <X className="w-5 h-5 mr-2" />
                Important Preferences
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-foreground">Must share the same faith</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-foreground">Looking for serious commitment only</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-foreground">Family involvement is important</span>
                </li>
              </ul>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Member Info */}
        <Card className="p-4 bg-muted/50">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Member since {profile.memberSince}</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
              <span>Profile verified</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Fixed Action Bar - Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border p-4 z-50 lg:hidden">
        <div className="flex items-center justify-center space-x-3 max-w-md mx-auto">
          <Button
            size="lg"
            variant="outline"
            className="flex-1 border-2 hover:bg-red-50 dark:hover:bg-red-950/30"
            onClick={() => navigate('/match/discover')}
          >
            <X className="w-5 h-5 mr-2 text-red-500" />
            Pass
          </Button>

          <Button
            size="lg"
            className="flex-1 bg-gradient-to-br from-yellow-400 to-amber-500 hover:shadow-xl"
            onClick={handleSuperLike}
          >
            <Star className="w-5 h-5 mr-2" />
            Super Like
          </Button>

          <Button
            size="lg"
            className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
            onClick={handleLike}
            disabled={profile.likedBy}
          >
            <Heart className={`w-5 h-5 mr-2 ${profile.likedBy ? 'fill-white' : ''}`} />
            {profile.likedBy ? 'Liked' : 'Like'}
          </Button>
        </div>

        <div className="flex gap-2 mt-3 max-w-md mx-auto">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleMessage}
            disabled={!profile.mutual}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Message
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleShareWithFamily}
          >
            <Users className="w-4 h-4 mr-2" />
            Share with Family
          </Button>
        </div>
      </div>

      {/* Action Buttons - Desktop */}
      <div className="hidden lg:block fixed bottom-8 right-8 space-y-3">
        <div className="flex space-x-3">
          <Button
            size="lg"
            variant="outline"
            className="w-16 h-16 rounded-full border-4 border-red-200 hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 shadow-xl"
            onClick={() => navigate('/match/discover')}
          >
            <X className="w-8 h-8 text-red-400" />
          </Button>

          <Button
            size="lg"
            className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 shadow-xl"
            onClick={handleSuperLike}
          >
            <Star className="w-7 h-7 text-white" />
          </Button>

          <Button
            size="lg"
            className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-cyan-600 shadow-xl"
            onClick={handleLike}
            disabled={profile.likedBy}
          >
            <Heart className={`w-10 h-10 text-white ${profile.likedBy ? 'fill-white' : ''}`} />
          </Button>

          <Button
            size="lg"
            className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 shadow-xl"
            onClick={handleMessage}
            disabled={!profile.mutual}
          >
            <MessageCircle className="w-7 h-7 text-white" />
          </Button>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={handleShareWithFamily}
        >
          <Users className="w-4 h-4 mr-2" />
          Share with Family
        </Button>
      </div>
    </div>
  );
};

export default MatchProfile;
