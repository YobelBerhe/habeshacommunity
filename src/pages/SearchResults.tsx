import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import {
  ArrowLeft, Search, Heart, Award, ShoppingBag,
  Users, MapPin, Calendar,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VerifiedBadge } from '@/components/VerifiedBadge';

interface SearchResult {
  id: string;
  type: 'mentor' | 'match' | 'listing' | 'event';
  title: string;
  description: string;
  image?: string;
  tags?: string[];
  relevance: number;
  metadata?: any;
}

export default function SearchResults() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(query);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    mentors: 0,
    matches: 0,
    listings: 0,
    events: 0
  });

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);

    try {
      const [mentorsRes, matchesRes, listingsRes] = await Promise.all([
        searchMentors(searchTerm),
        searchMatches(searchTerm),
        searchListings(searchTerm)
      ]);

      const allResults = [
        ...mentorsRes,
        ...matchesRes,
        ...listingsRes
      ].sort((a, b) => b.relevance - a.relevance);

      setResults(allResults);
      setStats({
        total: allResults.length,
        mentors: mentorsRes.length,
        matches: matchesRes.length,
        listings: listingsRes.length,
        events: 0
      });
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchMentors = async (term: string): Promise<SearchResult[]> => {
    try {
      const { data: mentors } = await supabase
        .from('mentors')
        .select(`
          id,
          user_id,
          name,
          title,
          bio,
          expertise,
          price_cents,
          city,
          avatar_url,
          is_verified,
          rating_avg
        `)
        .eq('available', true);

      if (!mentors) return [];

      const lowerTerm = term.toLowerCase();
      const filtered = mentors.filter(mentor => {
        const searchStr = [
          mentor.name,
          mentor.title,
          mentor.bio,
          ...(mentor.expertise || [])
        ].join(' ').toLowerCase();
        return searchStr.includes(lowerTerm);
      });

      return filtered.map(mentor => {
        const relevance = calculateRelevance(term, [
          mentor.name,
          mentor.title,
          mentor.bio,
          ...(mentor.expertise || [])
        ]);

        return {
          id: mentor.id,
          type: 'mentor' as const,
          title: mentor.name,
          description: `${mentor.title} • ${mentor.expertise?.slice(0, 2).join(', ') || ''}`,
          image: mentor.avatar_url,
          tags: mentor.expertise?.slice(0, 3) || [],
          relevance,
          metadata: {
            userId: mentor.user_id,
            price: mentor.price_cents ? mentor.price_cents / 100 : null,
            city: mentor.city,
            isVerified: mentor.is_verified,
            rating: mentor.rating_avg
          }
        };
      });
    } catch (error) {
      console.error('Mentor search error:', error);
      return [];
    }
  };

  const searchMatches = async (term: string): Promise<SearchResult[]> => {
    try {
      const { data: matchProfiles } = await supabase
        .from('match_profiles')
        .select(`
          id,
          user_id,
          name,
          display_name,
          bio,
          seeking,
          interests,
          city,
          photos
        `)
        .eq('active', true);

      if (!matchProfiles) return [];

      const lowerTerm = term.toLowerCase();
      const filtered = matchProfiles.filter(profile => {
        const searchStr = [
          profile.name,
          profile.display_name,
          profile.bio,
          profile.seeking,
          ...(profile.interests || [])
        ].join(' ').toLowerCase();
        return searchStr.includes(lowerTerm);
      });

      return filtered.map(profile => {
        const relevance = calculateRelevance(term, [
          profile.name,
          profile.display_name,
          profile.bio,
          profile.seeking,
          ...(profile.interests || [])
        ]);

        return {
          id: profile.id,
          type: 'match' as const,
          title: profile.display_name || profile.name,
          description: `${profile.seeking || 'Looking to connect'} • ${profile.city || ''}`,
          image: profile.photos?.[0],
          tags: profile.interests?.slice(0, 3) || [],
          relevance,
          metadata: {
            userId: profile.user_id,
            city: profile.city,
            seeking: profile.seeking
          }
        };
      });
    } catch (error) {
      console.error('Match search error:', error);
      return [];
    }
  };

  const searchListings = async (term: string): Promise<SearchResult[]> => {
    try {
      const { data: listings } = await supabase
        .from('listings')
        .select('*')
        .eq('status', 'active');

      if (!listings) return [];

      const lowerTerm = term.toLowerCase();
      const filtered = listings.filter(listing => {
        const searchStr = [
          listing.title,
          listing.description,
          listing.category,
          listing.city
        ].join(' ').toLowerCase();
        return searchStr.includes(lowerTerm);
      });

      return filtered.map(listing => {
        const relevance = calculateRelevance(term, [
          listing.title,
          listing.description,
          listing.category,
          listing.city
        ]);

        return {
          id: listing.id,
          type: 'listing' as const,
          title: listing.title,
          description: listing.description || '',
          image: listing.images?.[0],
          tags: [listing.category].filter(Boolean),
          relevance,
          metadata: {
            price: listing.price_cents ? listing.price_cents / 100 : null,
            city: listing.city,
            category: listing.category
          }
        };
      });
    } catch (error) {
      console.error('Listing search error:', error);
      return [];
    }
  };

  const calculateRelevance = (searchTerm: string, fields: any[]): number => {
    const term = searchTerm.toLowerCase();
    let score = 0;

    fields.forEach((field, index) => {
      if (!field) return;

      const fieldStr = Array.isArray(field) ? field.join(' ') : String(field);
      const lowerField = fieldStr.toLowerCase();

      if (index === 0 && lowerField.includes(term)) {
        score += 100;
      } else if (lowerField.includes(term)) {
        score += 50 / (index + 1);
      } else {
        const words = term.split(' ');
        words.forEach(word => {
          if (lowerField.includes(word)) {
            score += 10 / (index + 1);
          }
        });
      }
    });

    return score;
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery });
      performSearch(searchQuery);
    }
  };

  const filteredResults = activeTab === 'all' 
    ? results 
    : results.filter(r => r.type === activeTab);

  const handleResultClick = (result: SearchResult) => {
    switch (result.type) {
      case 'mentor':
        navigate(`/mentor/${result.metadata.userId}`);
        break;
      case 'match':
        navigate(`/match/profile/${result.metadata.userId}`);
        break;
      case 'listing':
        navigate(`/listing/${result.id}`);
        break;
    }
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() 
        ? <mark key={i} className="bg-yellow-200 dark:bg-yellow-800">{part}</mark>
        : part
    );
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-3 max-w-4xl">
          <div className="flex items-center gap-3 mb-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>

            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search everything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 h-12 text-base"
                autoFocus
              />
            </div>

            <Button onClick={handleSearch} disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>

          {!loading && query && (
            <p className="text-sm text-muted-foreground">
              About {stats.total.toLocaleString()} results for "{query}"
            </p>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="p-4">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-muted rounded-lg animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
                    <div className="h-3 bg-muted rounded w-full animate-pulse" />
                    <div className="h-3 bg-muted rounded w-2/3 animate-pulse" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : results.length === 0 && query ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No results found</h3>
            <p className="text-muted-foreground mb-4">
              Try different keywords or check your spelling
            </p>
            <div className="space-y-2">
              <p className="text-sm font-semibold">Suggestions:</p>
              <div className="flex flex-wrap justify-center gap-2">
                <Button variant="outline" size="sm" onClick={() => { setSearchQuery('software engineer'); handleSearch(); }}>
                  Software Engineer
                </Button>
                <Button variant="outline" size="sm" onClick={() => { setSearchQuery('mentor'); handleSearch(); }}>
                  Mentors
                </Button>
                <Button variant="outline" size="sm" onClick={() => { setSearchQuery('housing'); handleSearch(); }}>
                  Housing
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">
                  All ({stats.total})
                </TabsTrigger>
                <TabsTrigger value="mentor">
                  Mentors ({stats.mentors})
                </TabsTrigger>
                <TabsTrigger value="match">
                  People ({stats.matches})
                </TabsTrigger>
                <TabsTrigger value="listing">
                  Market ({stats.listings})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="space-y-4">
              {filteredResults.map((result) => (
                <Card
                  key={`${result.type}-${result.id}`}
                  className="p-4 cursor-pointer hover:shadow-lg transition-all group"
                  onClick={() => handleResultClick(result)}
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      {result.type === 'mentor' || result.type === 'match' ? (
                        <Avatar className="w-16 h-16">
                          {result.image ? (
                            <AvatarImage src={result.image} />
                          ) : (
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xl font-bold">
                              {result.title.charAt(0)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                      ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg flex items-center justify-center">
                          <ShoppingBag className="w-8 h-8 text-blue-600" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="text-xs">
                          {result.type === 'mentor' && <Award className="w-3 h-3 mr-1" />}
                          {result.type === 'match' && <Heart className="w-3 h-3 mr-1" />}
                          {result.type === 'listing' && <ShoppingBag className="w-3 h-3 mr-1" />}
                          {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                        </Badge>
                        {result.metadata?.isVerified && (
                          <VerifiedBadge isVerified={true} size="sm" />
                        )}
                      </div>

                      <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                        {highlightText(result.title, query)}
                      </h3>

                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {highlightText(result.description, query)}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        {result.metadata?.city && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{result.metadata.city}</span>
                          </div>
                        )}
                        {result.metadata?.price && (
                          <div className="font-semibold text-primary">
                            ${result.metadata.price}
                          </div>
                        )}
                      </div>

                      {result.tags && result.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {result.tags.map((tag, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex-shrink-0 self-center">
                      <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
