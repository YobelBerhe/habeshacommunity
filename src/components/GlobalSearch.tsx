import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchResult {
  type: 'listing' | 'event' | 'group' | 'mentor' | 'profile';
  id: string;
  title: string;
  description: string;
  image?: string;
}

interface GlobalSearchProps {
  className?: string;
}

export function GlobalSearch({ className = '' }: GlobalSearchProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length >= 2) {
        handleSearch(query);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (searchQuery: string) => {
    setSearching(true);
    try {
      const searches = await Promise.all([
        // Search listings
        supabase
          .from('listings')
          .select('id, title, description, images')
          .ilike('title', `%${searchQuery}%`)
          .eq('status', 'active')
          .limit(3),
        
        // Search events
        supabase
          .from('events')
          .select('id, title_en, description_en, cover_image')
          .ilike('title_en', `%${searchQuery}%`)
          .limit(3),
        
        // Search groups
        supabase
          .from('community_groups')
          .select('id, name, description, cover_image')
          .ilike('name', `%${searchQuery}%`)
          .limit(3),

        // Search mentors
        supabase
          .from('mentors')
          .select('id, title, bio, name')
          .or(`title.ilike.%${searchQuery}%,name.ilike.%${searchQuery}%`)
          .eq('available', true)
          .limit(3),
      ]);

      const combinedResults: SearchResult[] = [
        ...(searches[0].data || []).map(l => ({
          type: 'listing' as const,
          id: l.id,
          title: l.title,
          description: l.description?.substring(0, 60) || '',
          image: l.images?.[0]
        })),
        ...(searches[1].data || []).map(e => ({
          type: 'event' as const,
          id: e.id,
          title: e.title_en || 'Event',
          description: e.description_en?.substring(0, 60) || '',
          image: e.cover_image
        })),
        ...(searches[2].data || []).map(g => ({
          type: 'group' as const,
          id: g.id,
          title: g.name,
          description: g.description?.substring(0, 60) || '',
          image: g.cover_image
        })),
        ...(searches[3].data || []).map(m => ({
          type: 'mentor' as const,
          id: m.id,
          title: m.name || m.title || 'Mentor',
          description: m.bio?.substring(0, 60) || '',
        })),
      ];

      setResults(combinedResults);
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    const routes: Record<string, string> = {
      listing: `/marketplace/listing/${result.id}`,
      event: `/community/events/${result.id}`,
      group: `/community/groups/${result.id}`,
      mentor: `/mentor/${result.id}`,
      profile: `/profile/${result.id}`
    };
    
    navigate(routes[result.type]);
    setShowResults(false);
    setQuery('');
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'listing': return 'bg-marketplace text-white';
      case 'event': return 'bg-community text-white';
      case 'group': return 'bg-community text-white';
      case 'mentor': return 'bg-mentor text-white';
      default: return 'bg-muted';
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search everything..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setShowResults(true)}
          className="pl-10 pr-10"
        />
        {searching && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
        {query && !searching && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            onClick={() => {
              setQuery('');
              setResults([]);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {showResults && results.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-80 overflow-y-auto shadow-lg">
          {results.map((result, index) => (
            <div
              key={`${result.type}-${result.id}-${index}`}
              className="p-3 hover:bg-muted/50 cursor-pointer border-b last:border-b-0"
              onClick={() => handleResultClick(result)}
            >
              <div className="flex items-start gap-3">
                {result.image && (
                  <img 
                    src={result.image} 
                    alt="" 
                    className="w-12 h-12 rounded object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{result.title}</p>
                  {result.description && (
                    <p className="text-sm text-muted-foreground truncate">
                      {result.description}
                    </p>
                  )}
                  <Badge className={`mt-1 text-xs ${getTypeBadgeColor(result.type)}`}>
                    {result.type}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </Card>
      )}

      {showResults && query.length >= 2 && results.length === 0 && !searching && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 p-4 text-center">
          <p className="text-muted-foreground">No results found for "{query}"</p>
        </Card>
      )}
    </div>
  );
}