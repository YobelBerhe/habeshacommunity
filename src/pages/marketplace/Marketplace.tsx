import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, DollarSign, Clock, Search } from 'lucide-react';
import MobileHeader from '@/components/layout/MobileHeader';
import Header from '@/components/Header';
import { getAppState } from '@/utils/storage';
import { LABELS } from '@/lib/taxonomy';

interface MarketplaceListing {
  id: string;
  title: string;
  description: string;
  subcategory: string;
  price_cents: number;
  currency: string;
  city: string;
  country: string;
  images: string[];
  created_at: string;
  user_id: string;
}

const MARKETPLACE_SUBCATEGORIES = [
  'electronics',
  'furniture', 
  'vehicles',
  'clothing',
  'services',
  'home_garden',
  'jobs_gigs',
  'tickets'
];

export default function Marketplace() {
  const navigate = useNavigate();
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [subcategoryFilter, setSubcategoryFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const appState = getAppState();

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('category', 'marketplace')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      console.error('Error fetching marketplace listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredListings = listings.filter(listing => {
    const matchesSearch = !searchTerm || 
      listing.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubcategory = !subcategoryFilter || listing.subcategory === subcategoryFilter;
    const matchesCity = !cityFilter || listing.city?.toLowerCase().includes(cityFilter.toLowerCase());
    
    const minPrice = priceRange.min ? parseFloat(priceRange.min) * 100 : 0;
    const maxPrice = priceRange.max ? parseFloat(priceRange.max) * 100 : Infinity;
    const matchesPrice = listing.price_cents >= minPrice && listing.price_cents <= maxPrice;
    
    return matchesSearch && matchesSubcategory && matchesCity && matchesPrice;
  });

  const formatPrice = (cents: number, currency: string) => {
    const amount = cents / 100;
    return `${currency} ${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <MobileHeader />
        <Header 
          currentCity={appState.city}
          onCityChange={() => {}}
          onAccountClick={() => {}}
          onLogoClick={() => navigate('/')}
        />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading marketplace...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader />
      <Header 
        currentCity={appState.city}
        onCityChange={() => {}}
        onAccountClick={() => {}}
        onLogoClick={() => navigate('/')}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Marketplace</h1>
          <Button onClick={() => navigate('/?category=marketplace')}>Post Item</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Input
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="md:col-span-2"
          />
          <Select value={subcategoryFilter} onValueChange={setSubcategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {MARKETPLACE_SUBCATEGORIES.map(sub => (
                <SelectItem key={sub} value={sub}>
                  {LABELS[sub]?.en || sub}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="City"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          />
          <div className="flex gap-2">
            <Input
              placeholder="Min $"
              type="number"
              value={priceRange.min}
              onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
              className="w-20"
            />
            <Input
              placeholder="Max $"
              type="number"
              value={priceRange.max}
              onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
              className="w-20"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredListings.map((listing) => (
            <Card key={listing.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <div 
                onClick={() => navigate(`/market/${listing.id}`)}
                className="contents"
              >
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center relative overflow-hidden">
                  {listing.images?.[0] ? (
                    <img 
                      src={listing.images[0]} 
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-4xl opacity-30">📦</div>
                  )}
                  {listing.subcategory && (
                    <Badge className="absolute top-2 left-2" variant="secondary">
                      {LABELS[listing.subcategory]?.en || listing.subcategory}
                    </Badge>
                  )}
                </div>
                
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg line-clamp-1">{listing.title}</CardTitle>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-primary font-bold">
                      <DollarSign className="w-4 h-4" />
                      {formatPrice(listing.price_cents, listing.currency)}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {listing.city}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {listing.description}
                  </p>
                </CardContent>
              </div>
              
              <CardFooter className="pt-0">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {formatDate(listing.created_at)}
                  </div>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/market/${listing.id}`);
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredListings.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No items found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or be the first to post in this category.
            </p>
            <Button onClick={() => navigate('/?category=marketplace')}>
              Post First Item
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}