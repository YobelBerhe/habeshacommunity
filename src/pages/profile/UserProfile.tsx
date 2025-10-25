import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/store/auth';
import { supabase } from '@/integrations/supabase/client';
import {
  ArrowLeft, MapPin, Calendar, Star, Heart, Share2,
  MessageCircle, Award, Briefcase, Users, TrendingUp,
  Edit, Settings, CheckCircle, Mail, Globe, Phone,
  Instagram, Twitter, Linkedin, Github, Clock, Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface UserProfileData {
  id: string;
  display_name: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  city?: string;
  country?: string;
  gender?: string;
  phone?: string;
  website?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  github?: string;
  created_at: string;
  role?: string;
  is_verified?: boolean;
  // Stats
  totalMatches?: number;
  totalSessions?: number;
  totalListings?: number;
  memberSince?: string;
}

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');
  const [isFavorited, setIsFavorited] = useState(false);

  const isOwnProfile = user?.id === id;

  useEffect(() => {
    loadProfile();
  }, [id]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      // Load additional stats
      const [matchesRes, sessionsRes, listingsRes] = await Promise.all([
        supabase.from('matches').select('id', { count: 'exact', head: true }).eq('user_id', id),
        supabase.from('mentor_bookings').select('id', { count: 'exact', head: true }).eq('mentee_id', id),
        supabase.from('listings').select('id', { count: 'exact', head: true }).eq('user_id', id)
      ]);

      setProfile({
        ...data,
        totalMatches: matchesRes.count || 0,
        totalSessions: sessionsRes.count || 0,
        totalListings: listingsRes.count || 0,
        memberSince: new Date(data.created_at).toLocaleDateString('en-US', { 
          month: 'long', 
          year: 'numeric' 
        })
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleMessage = () => {
    navigate(`/inbox?user=${id}&name=${profile?.display_name}`);
  };

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile?.display_name} - Habesha Community`,
          text: `Check out ${profile?.display_name}'s profile!`,
          url: url
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    toast.success(isFavorited ? 'Removed from favorites' : 'Added to favorites');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
          <p className="text-muted-foreground mb-4">The profile you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  const displayName = profile.display_name || profile.email;
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Cover Image & Header */}
      <div className="relative">
        {/* Cover Photo */}
        <div className="h-48 md:h-64 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
          {/* Optional: Add cover photo here */}
        </div>

        {/* Profile Header */}
        <div className="container mx-auto px-4">
          <div className="relative -mt-20 md:-mt-24">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-4 md:gap-6">
              {/* Avatar */}
              <div className="relative">
                <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-background shadow-xl">
                  {profile.avatar_url ? (
                    <AvatarImage src={profile.avatar_url} alt={displayName} />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-5xl md:text-6xl font-bold">
                      {initials}
                    </AvatarFallback>
                  )}
                </Avatar>
                {profile.is_verified && (
                  <div className="absolute bottom-2 right-2 bg-green-500 rounded-full p-2 border-4 border-background">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>

              {/* Name & Actions */}
              <div className="flex-1 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl md:text-3xl font-bold">{displayName}</h1>
                    {profile.role && profile.role !== 'user' && (
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                        {profile.role.toUpperCase()}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-2">
                    {profile.city && profile.country && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{profile.city}, {profile.country}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {profile.memberSince}</span>
                    </div>
                  </div>

                  {profile.bio && (
                    <p className="text-muted-foreground max-w-2xl">{profile.bio}</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {isOwnProfile ? (
                    <>
                      <Button onClick={() => navigate('/account/settings')}>
                        <Settings className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                      <Button variant="outline" onClick={() => navigate('/dashboard')}>
                        <Award className="w-4 h-4 mr-2" />
                        Dashboard
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button onClick={handleMessage} className="bg-gradient-to-r from-blue-500 to-cyan-500">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                      <Button variant="outline" onClick={handleFavorite}>
                        <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current text-red-500' : ''}`} />
                      </Button>
                      <Button variant="outline" onClick={handleShare}>
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 mt-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Stats & Info */}
          <div className="space-y-6">
            {/* Stats Card */}
            <Card className="p-6">
              <h2 className="font-bold text-lg mb-4">Activity Stats</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/20 rounded-lg flex items-center justify-center">
                      <Heart className="w-5 h-5 text-pink-600" />
                    </div>
                    <div>
                      <p className="font-semibold">{profile.totalMatches}</p>
                      <p className="text-xs text-muted-foreground">Matches</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                      <Award className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold">{profile.totalSessions}</p>
                      <p className="text-xs text-muted-foreground">Sessions</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold">{profile.totalListings}</p>
                      <p className="text-xs text-muted-foreground">Listings</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Contact Info */}
            {(profile.email || profile.phone || profile.website) && (
              <Card className="p-6">
                <h2 className="font-bold text-lg mb-4">Contact Information</h2>
                <div className="space-y-3">
                  {profile.email && (
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <a href={`mailto:${profile.email}`} className="text-blue-600 hover:underline">
                        {profile.email}
                      </a>
                    </div>
                  )}
                  {profile.phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <a href={`tel:${profile.phone}`} className="text-blue-600 hover:underline">
                        {profile.phone}
                      </a>
                    </div>
                  )}
                  {profile.website && (
                    <div className="flex items-center gap-3 text-sm">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {profile.website}
                      </a>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Social Links */}
            {(profile.instagram || profile.twitter || profile.linkedin || profile.github) && (
              <Card className="p-6">
                <h2 className="font-bold text-lg mb-4">Social Media</h2>
                <div className="flex gap-3">
                  {profile.instagram && (
                    <a 
                      href={`https://instagram.com/${profile.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center hover:scale-110 transition-transform"
                    >
                      <Instagram className="w-5 h-5 text-white" />
                    </a>
                  )}
                  {profile.twitter && (
                    <a 
                      href={`https://twitter.com/${profile.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center hover:scale-110 transition-transform"
                    >
                      <Twitter className="w-5 h-5 text-white" />
                    </a>
                  )}
                  {profile.linkedin && (
                    <a 
                      href={`https://linkedin.com/in/${profile.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center hover:scale-110 transition-transform"
                    >
                      <Linkedin className="w-5 h-5 text-white" />
                    </a>
                  )}
                  {profile.github && (
                    <a 
                      href={`https://github.com/${profile.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center hover:scale-110 transition-transform"
                    >
                      <Github className="w-5 h-5 text-white dark:text-gray-900" />
                    </a>
                  )}
                </div>
              </Card>
            )}
          </div>

          {/* Right Column - Tabs Content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full">
                <TabsTrigger value="about" className="flex-1">About</TabsTrigger>
                <TabsTrigger value="activity" className="flex-1">Activity</TabsTrigger>
                <TabsTrigger value="reviews" className="flex-1">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="mt-6">
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4">About</h2>
                  {profile.bio ? (
                    <p className="text-muted-foreground leading-relaxed">{profile.bio}</p>
                  ) : (
                    <p className="text-muted-foreground italic">No bio added yet.</p>
                  )}
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="mt-6">
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Heart className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">New Match</p>
                        <p className="text-xs text-muted-foreground">Connected with Sara W.</p>
                        <p className="text-xs text-muted-foreground mt-1">2 days ago</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Award className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Session Completed</p>
                        <p className="text-xs text-muted-foreground">Career mentoring with Daniel T.</p>
                        <p className="text-xs text-muted-foreground mt-1">1 week ago</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">New Listing</p>
                        <p className="text-xs text-muted-foreground">Posted a product in Marketplace</p>
                        <p className="text-xs text-muted-foreground mt-1">2 weeks ago</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4">Reviews</h2>
                  <div className="text-center py-8">
                    <Star className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No reviews yet</p>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
