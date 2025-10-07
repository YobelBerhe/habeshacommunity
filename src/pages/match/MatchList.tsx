import { useState, useEffect } from 'react';
import { Heart, MessageCircle, MapPin, Star, Users, Filter, Search, ArrowLeft, Sparkles, Eye, Clock, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface Match {
  id: string;
  name: string;
  age: number;
  location: string;
  origin: string;
  profession: string;
  faith: string;
  compatibility: number;
  matchedAt: string;
  lastActive: string;
  online: boolean;
  mutual: boolean;
  unreadMessages: number;
  favorite: boolean;
  verified: boolean;
  bio: string;
}

const MatchList = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<Match[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Demo matches (replace with real Supabase data)
  const demoMatches: Match[] = [
    {
      id: '1',
      name: 'Sara Desta',
      age: 27,
      location: 'Washington DC',
      origin: 'Addis Ababa',
      profession: 'Healthcare Administrator',
      faith: 'Orthodox Christian',
      compatibility: 92,
      matchedAt: '2024-01-15T10:30:00Z',
      lastActive: '5 min ago',
      online: true,
      mutual: true,
      unreadMessages: 3,
      favorite: true,
      verified: true,
      bio: 'Looking for someone who values tradition and family'
    },
    {
      id: '2',
      name: 'Michael Tesfaye',
      age: 30,
      location: 'San Francisco',
      origin: 'Asmara',
      profession: 'Software Engineer',
      faith: 'Catholic',
      compatibility: 88,
      matchedAt: '2024-01-14T15:20:00Z',
      lastActive: '2 hours ago',
      online: false,
      mutual: true,
      unreadMessages: 0,
      favorite: false,
      verified: true,
      bio: 'Engineer by day, chef by night'
    },
    {
      id: '3',
      name: 'Rahel Yohannes',
      age: 25,
      location: 'Toronto',
      origin: 'Mekelle',
      profession: 'Elementary Teacher',
      faith: 'Protestant',
      compatibility: 95,
      matchedAt: '2024-01-13T08:45:00Z',
      lastActive: '1 day ago',
      online: false,
      mutual: true,
      unreadMessages: 1,
      favorite: true,
      verified: true,
      bio: 'Passionate about education and faith'
    },
    {
      id: '4',
      name: 'Daniel Abraha',
      age: 29,
      location: 'New York',
      origin: 'Gondar',
      profession: 'Business Analyst',
      faith: 'Orthodox Christian',
      compatibility: 85,
      matchedAt: '2024-01-12T14:30:00Z',
      lastActive: 'Just now',
      online: true,
      mutual: false,
      unreadMessages: 0,
      favorite: false,
      verified: true,
      bio: 'Building a future rooted in culture and faith'
    },
    {
      id: '5',
      name: 'Meron Kidane',
      age: 26,
      location: 'Atlanta',
      origin: 'Asmara',
      profession: 'Nurse',
      faith: 'Catholic',
      compatibility: 90,
      matchedAt: '2024-01-11T09:15:00Z',
      lastActive: '3 hours ago',
      online: false,
      mutual: true,
      unreadMessages: 0,
      favorite: false,
      verified: true,
      bio: 'Healthcare professional seeking meaningful connection'
    },
    {
      id: '6',
      name: 'Yohannes Mehari',
      age: 31,
      location: 'Seattle',
      origin: 'Axum',
      profession: 'Civil Engineer',
      faith: 'Orthodox Christian',
      compatibility: 87,
      matchedAt: '2024-01-10T16:00:00Z',
      lastActive: '1 hour ago',
      online: false,
      mutual: false,
      unreadMessages: 2,
      favorite: false,
      verified: true,
      bio: 'Traditional values, modern mindset'
    }
  ];

  useEffect(() => {
    loadMatches();
  }, []);

  useEffect(() => {
    filterMatches();
  }, [matches, searchQuery, activeTab]);

  const loadMatches = async () => {
    setLoading(true);
    try {
      // TODO: Replace with real Supabase query
      // const { data, error } = await supabase
      //   .from('matches')
      //   .select('*')
      //   .order('matched_at', { ascending: false });
      
      setTimeout(() => {
        setMatches(demoMatches);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error loading matches:', error);
      setLoading(false);
    }
  };

  const filterMatches = () => {
    let filtered = [...matches];

    // Filter by tab
    if (activeTab === 'mutual') {
      filtered = filtered.filter(m => m.mutual);
    } else if (activeTab === 'recent') {
      filtered = filtered.slice(0, 3);
    } else if (activeTab === 'favorites') {
      filtered = filtered.filter(m => m.favorite);
    }

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(m =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.profession.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by compatibility
    filtered.sort((a, b) => b.compatibility - a.compatibility);

    setFilteredMatches(filtered);
  };

  const toggleFavorite = (matchId: string) => {
    setMatches(matches.map(m =>
      m.id === matchId ? { ...m, favorite: !m.favorite } : m
    ));
  };

  const getMatchStats = () => {
    return {
      total: matches.length,
      mutual: matches.filter(m => m.mutual).length,
      unread: matches.reduce((sum, m) => sum + m.unreadMessages, 0),
      favorites: matches.filter(m => m.favorite).length
    };
  };

  const stats = getMatchStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your matches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-blue-50/20 dark:via-blue-950/10 to-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/match/discover')}
                className="lg:hidden"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white fill-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">My Matches</h1>
                <p className="text-xs text-muted-foreground">{stats.total} connections</p>
              </div>
            </div>

            <Button
              onClick={() => navigate('/match/discover')}
              className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Discover More
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, location, or profession..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Matches</p>
              </div>
              <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.mutual}</p>
                <p className="text-xs text-muted-foreground">Mutual Matches</p>
              </div>
              <CheckCheck className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.unread}</p>
                <p className="text-xs text-muted-foreground">New Messages</p>
              </div>
              <MessageCircle className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200 dark:border-amber-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.favorites}</p>
                <p className="text-xs text-muted-foreground">Favorites</p>
              </div>
              <Star className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="all" className="text-xs sm:text-sm">
              All ({matches.length})
            </TabsTrigger>
            <TabsTrigger value="mutual" className="text-xs sm:text-sm">
              Mutual ({stats.mutual})
            </TabsTrigger>
            <TabsTrigger value="recent" className="text-xs sm:text-sm">
              Recent (3)
            </TabsTrigger>
            <TabsTrigger value="favorites" className="text-xs sm:text-sm">
              Favorites ({stats.favorites})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {filteredMatches.length === 0 ? (
              <EmptyState activeTab={activeTab} searchQuery={searchQuery} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {filteredMatches.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    onToggleFavorite={toggleFavorite}
                    onViewProfile={() => navigate(`/match/profile/${match.id}`)}
                    onMessage={() => navigate(`/inbox?user=${match.id}`)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Match Card Component
const MatchCard = ({
  match,
  onToggleFavorite,
  onViewProfile,
  onMessage
}: {
  match: Match;
  onToggleFavorite: (id: string) => void;
  onViewProfile: () => void;
  onMessage: () => void;
}) => {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group border-2 hover:border-primary/50">
      {/* Image Section */}
      <div className="relative h-56 bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 flex items-center justify-center">
        {/* Online Status */}
        {match.online && (
          <div className="absolute top-3 left-3 bg-green-500 rounded-full px-3 py-1 flex items-center space-x-1 shadow-lg z-10">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-white text-xs font-bold">Online</span>
          </div>
        )}

        {/* Compatibility Badge */}
        <div className="absolute top-3 right-3 bg-white dark:bg-card rounded-full px-3 py-1.5 shadow-lg z-10">
          <span className={`font-bold text-sm ${
            match.compatibility >= 90 ? 'text-green-600 dark:text-green-400' :
            match.compatibility >= 80 ? 'text-blue-600 dark:text-blue-400' :
            'text-amber-600 dark:text-amber-400'
          }`}>
            {match.compatibility}%
          </span>
        </div>

        {/* Mutual Match Badge */}
        {match.mutual && (
          <div className="absolute bottom-3 left-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full px-3 py-1 shadow-lg z-10">
            <span className="text-white text-xs font-bold flex items-center">
              <CheckCheck className="w-3 h-3 mr-1" />
              Mutual
            </span>
          </div>
        )}

        {/* Verified Badge */}
        {match.verified && (
          <div className="absolute bottom-3 right-3 bg-blue-500 rounded-full p-1.5 shadow-lg z-10">
            <CheckCheck className="w-3 h-3 text-white" />
          </div>
        )}

        {/* Avatar */}
        <Avatar className="w-32 h-32 border-4 border-white shadow-2xl">
          <AvatarFallback className="text-4xl font-bold bg-gradient-to-br from-blue-500 to-purple-500 text-white">
            {match.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>

        {/* Favorite Button */}
        <Button
          size="icon"
          variant="secondary"
          className="absolute top-3 right-14 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(match.id);
          }}
        >
          <Star className={`w-4 h-4 ${match.favorite ? 'fill-amber-400 text-amber-400' : ''}`} />
        </Button>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Name & Location */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-xl font-bold text-foreground">{match.name}, {match.age}</h3>
            {match.unreadMessages > 0 && (
              <Badge className="bg-red-500 text-white">
                {match.unreadMessages}
              </Badge>
            )}
          </div>
          <div className="flex items-center text-sm text-muted-foreground mb-1">
            <MapPin className="w-3 h-3 mr-1" />
            <span>{match.location}</span>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="w-3 h-3 mr-1" />
            <span>Active {match.lastActive}</span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-muted/50 rounded-lg p-2">
            <p className="text-xs text-muted-foreground mb-0.5">Origin</p>
            <p className="text-sm font-semibold text-foreground truncate">{match.origin}</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-2">
            <p className="text-xs text-muted-foreground mb-0.5">Faith</p>
            <p className="text-sm font-semibold text-foreground truncate">{match.faith}</p>
          </div>
        </div>

        {/* Profession */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-lg p-3 border border-blue-200/50 dark:border-blue-800/50">
          <p className="text-xs text-muted-foreground mb-1">Profession</p>
          <p className="text-sm font-semibold text-foreground">{match.profession}</p>
        </div>

        {/* Bio Preview */}
        <p className="text-sm text-muted-foreground line-clamp-2">{match.bio}</p>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={onViewProfile}
            variant="outline"
            className="flex-1 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Profile
          </Button>
          <Button
            onClick={onMessage}
            className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Message
          </Button>
        </div>
      </div>
    </Card>
  );
};

// Empty State Component
const EmptyState = ({ activeTab, searchQuery }: { activeTab: string; searchQuery: string }) => {
  const getMessage = () => {
    if (searchQuery) {
      return {
        title: 'No matches found',
        description: `No results for "${searchQuery}". Try a different search term.`,
        icon: Search
      };
    }

    switch (activeTab) {
      case 'mutual':
        return {
          title: 'No mutual matches yet',
          description: 'Keep swiping right to find people who also like you!',
          icon: CheckCheck
        };
      case 'favorites':
        return {
          title: 'No favorites yet',
          description: 'Mark your favorite matches with a star to see them here.',
          icon: Star
        };
      case 'recent':
        return {
          title: 'No recent matches',
          description: 'Start discovering people to see your recent matches here.',
          icon: Clock
        };
      default:
        return {
          title: 'No matches yet',
          description: 'Start discovering people to find your perfect match!',
          icon: Heart
        };
    }
  };

  const { title, description, icon: Icon } = getMessage();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-full flex items-center justify-center mb-6">
        <Icon className="w-12 h-12 text-blue-600 dark:text-blue-400" />
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground text-center max-w-md mb-6">{description}</p>
      {!searchQuery && (
        <Button
          onClick={() => window.location.href = '/match/discover'}
          className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Start Discovering
        </Button>
      )}
    </div>
  );
};

export default MatchList;
