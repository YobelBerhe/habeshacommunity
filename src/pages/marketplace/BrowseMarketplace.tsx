import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Search, 
  Plus, 
  MapPin,
  Filter,
  Heart
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/store/auth';
import { toast } from 'sonner';

interface Listing {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
  location: string;
  isFree: boolean;
  saved: boolean;
  seller: {
    name: string;
    verified: boolean;
  };
}

export default function BrowseMarketplace() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchListings();
    if (user) fetchSavedListings();
  }, [user]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('listings')
        .select(`
          id,
          title,
          price_cents,
          images,
          category,
          city,
          user_id
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(30);

      if (error) throw error;

      // Get unique user IDs to fetch profiles
      const userIds = [...new Set(data?.map(l => l.user_id).filter(Boolean))] as string[];
      
      let profilesMap: Record<string, { display_name: string }> = {};
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, display_name')
          .in('id', userIds);
        
        profiles?.forEach(p => {
          profilesMap[p.id] = { display_name: p.display_name || 'Anonymous' };
        });
      }

      const formattedListings: Listing[] = (data || []).map(item => ({
        id: item.id,
        title: item.title,
        price: (item.price_cents || 0) / 100,
        image: item.images?.[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400',
        category: formatCategory(item.category),
        location: item.city || 'Unknown',
        isFree: !item.price_cents || item.price_cents === 0,
        saved: false,
        seller: {
          name: profilesMap[item.user_id!]?.display_name || 'Anonymous',
          verified: false
        }
      }));

      setListings(formattedListings);
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast.error('Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedListings = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('favorites')
      .select('listing_id')
      .eq('user_id', user.id);
    
    if (data) {
      setSavedIds(new Set(data.map(f => f.listing_id)));
    }
  };

  const formatCategory = (category: string): string => {
    const categoryMap: Record<string, string> = {
      'housing': 'Housing',
      'jobs': 'Jobs',
      'job': 'Jobs',
      'services': 'Services',
      'service': 'Services',
      'forsale': 'Products',
      'product': 'Products',
      'community': 'Community'
    };
    return categoryMap[category] || category;
  };

  const categories = ['All', 'Housing', 'Jobs', 'Products', 'Services'];

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || listing.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleSave = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please sign in to save listings');
      return;
    }

    const isSaved = savedIds.has(id);

    try {
      if (isSaved) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('listing_id', id);
        
        setSavedIds(prev => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        toast.success('Removed from saved');
      } else {
        await supabase
          .from('favorites')
          .insert({ user_id: user.id, listing_id: id });
        
        setSavedIds(prev => new Set(prev).add(id));
        toast.success('Saved to favorites');
      }
    } catch (error) {
      console.error('Error toggling save:', error);
      toast.error('Failed to update saved listings');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-foreground">Marketplace</h1>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/marketplace/create')}
              >
                <Plus className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Filter className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-4 space-y-4 w-full">
        {/* Search */}
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search marketplace..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
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
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {loading ? 'Loading...' : `${filteredListings.length} items`}
          </p>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-square w-full" />
                <div className="p-3 space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Listings Grid */}
        {!loading && (
          <div className="grid grid-cols-2 gap-3">
            {filteredListings.map((listing) => (
              <Card
                key={listing.id}
                className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/marketplace/listing/${listing.id}`)}
              >
                {/* Image */}
                <div className="relative aspect-square">
                  <img
                    src={listing.image}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <button
                    className="absolute top-2 right-2 p-1.5 bg-background/80 rounded-full"
                    onClick={(e) => toggleSave(listing.id, e)}
                  >
                    <Heart className={`h-4 w-4 ${savedIds.has(listing.id) ? 'fill-red-500 text-red-500' : 'text-foreground'}`} />
                  </button>
                  {listing.isFree && (
                    <Badge className="absolute bottom-2 left-2 bg-green-500">Free</Badge>
                  )}
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="font-semibold text-foreground">
                    {listing.isFree ? 'Free' : `$${listing.price.toLocaleString()}`}
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {listing.title}
                  </p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {listing.location}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredListings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No items found matching your search.</p>
          </div>
        )}

        {/* Floating Create Button */}
        <Button
          className="fixed bottom-24 right-4 shadow-lg rounded-full"
          onClick={() => navigate('/marketplace/create')}
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Listing
        </Button>
      </div>
    </div>
  );
}
