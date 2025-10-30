import { useState, useEffect } from 'react';
import { 
  Search, ShoppingBag, Home, Briefcase, Wrench,
  MapPin, DollarSign, Clock, Heart, Filter,
  TrendingUp, Star, Plus, Grid, List, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Listing {
  id: string;
  type: 'product' | 'housing' | 'job' | 'service';
  title: string;
  description: string;
  price?: number;
  salary?: string;
  location: string;
  seller: string;
  image?: string;
  postedAt: string;
  featured: boolean;
  category: string;
}

const MarketplaceHome = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('recent');
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch listings from database
  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Map database listings to UI format
      const mappedListings: Listing[] = (data || []).map(listing => {
        // Map DB category to UI type
        const typeMap: Record<string, 'product' | 'housing' | 'job' | 'service'> = {
          'forsale': 'product',
          'housing': 'housing',
          'jobs': 'job',
          'services': 'service',
          'product': 'product',
          'job': 'job',
          'service': 'service'
        };

        const type = typeMap[listing.category] || 'product';
        
        // Calculate time ago
        const postedDate = new Date(listing.created_at);
        const now = new Date();
        const diffMs = now.getTime() - postedDate.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        let postedAt = 'Just now';
        if (diffMins < 60) postedAt = `${diffMins} mins ago`;
        else if (diffHours < 24) postedAt = `${diffHours} hours ago`;
        else if (diffDays === 1) postedAt = '1 day ago';
        else if (diffDays < 7) postedAt = `${diffDays} days ago`;
        else postedAt = `${Math.floor(diffDays / 7)} weeks ago`;

        return {
          id: listing.id,
          type,
          title: listing.title,
          description: listing.description,
          price: listing.price_cents ? listing.price_cents / 100 : undefined,
          salary: listing.salary || undefined,
          location: listing.city || 'Unknown',
          seller: 'Community Member',
          image: listing.images?.[0],
          postedAt,
          featured: listing.featured || false,
          category: listing.subcategory || 'Other'
        };
      });

      setListings(mappedListings);
    } catch (error: any) {
      console.error('Error fetching listings:', error);
      toast.error('Failed to load listings');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate category counts
  const categoryCounts = {
    all: listings.length,
    products: listings.filter(l => l.type === 'product').length,
    housing: listings.filter(l => l.type === 'housing').length,
    jobs: listings.filter(l => l.type === 'job').length,
    services: listings.filter(l => l.type === 'service').length
  };

  const categories = [
    { id: 'all', name: 'All', name_ti: 'ኩሉ', icon: ShoppingBag, color: 'from-blue-500 to-cyan-500', count: categoryCounts.all },
    { id: 'products', name: 'Products', name_ti: 'ኣቕሑ', icon: ShoppingBag, color: 'from-green-500 to-emerald-500', count: categoryCounts.products },
    { id: 'housing', name: 'Housing', name_ti: 'ገዛ', icon: Home, color: 'from-purple-500 to-pink-500', count: categoryCounts.housing },
    { id: 'jobs', name: 'Jobs & Gigs', name_ti: 'ስራሕ', icon: Briefcase, color: 'from-amber-500 to-orange-500', count: categoryCounts.jobs },
    { id: 'services', name: 'Services', name_ti: 'ኣገልግሎት', icon: Wrench, color: 'from-rose-500 to-red-500', count: categoryCounts.services }
  ];

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           selectedCategory === 'products' && listing.type === 'product' ||
                           listing.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'product': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'housing': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'job': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
      case 'service': return 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'product': return ShoppingBag;
      case 'housing': return Home;
      case 'job': return Briefcase;
      case 'service': return Wrench;
      default: return ShoppingBag;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Habesha Marketplace
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8">
              Buy, sell, rent, and find opportunities within our community
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for items, housing, jobs, services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 md:h-16 pl-12 md:pl-16 pr-4 md:pr-6 text-base md:text-lg rounded-full bg-background text-foreground border-0 shadow-xl"
              />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 md:gap-8 mt-8 max-w-2xl mx-auto">
              <div>
                <div className="text-2xl md:text-4xl font-bold">5.2K+</div>
                <div className="text-sm md:text-base opacity-90">Active Listings</div>
              </div>
              <div>
                <div className="text-2xl md:text-4xl font-bold">2.1K+</div>
                <div className="text-sm md:text-base opacity-90">Sellers</div>
              </div>
              <div>
                <div className="text-2xl md:text-4xl font-bold">8.5K+</div>
                <div className="text-sm md:text-base opacity-90">Transactions</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-6 md:py-8 border-b bg-background/95 backdrop-blur sticky top-14 md:top-16 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.id;
              
              return (
                <Button
                  key={category.id}
                  variant={isActive ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex-shrink-0 ${isActive ? `bg-gradient-to-r ${category.color}` : ''}`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  <span className="hidden md:inline">{category.name}</span>
                  <span className="md:hidden">{category.name_ti}</span>
                  <Badge variant="secondary" className="ml-2">
                    {category.count}
                  </Badge>
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Filters & View Toggle */}
      <section className="py-4 md:py-6 border-b bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredListings.length}</span> listings
            </div>
            
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>

              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              <Button
                onClick={() => navigate('/marketplace/create')}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                Post Listing
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Listings Grid */}
      <section className="py-6 md:py-8">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1,2,3,4,5,6,7,8].map(i => (
                <Card key={i} className="overflow-hidden animate-pulse">
                  <div className="h-48 bg-muted" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-muted rounded w-1/2" />
                    <div className="h-6 bg-muted rounded" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className={`grid gap-4 md:gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {filteredListings.map((listing) => {
              const TypeIcon = getTypeIcon(listing.type);
              
              return (
                <Card
                  key={listing.id}
                  className="group overflow-hidden hover:shadow-2xl transition-all cursor-pointer"
                  onClick={() => navigate(`/marketplace/${listing.type}/${listing.id}`)}
                >
                  {/* Image */}
                  <div className="relative h-48 bg-gradient-to-br from-muted to-muted/50">
                    {listing.image ? (
                      <img 
                        src={listing.image} 
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <TypeIcon className="w-16 h-16 text-muted-foreground" />
                      </div>
                    )}
                    
                    {listing.featured && (
                      <Badge className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                        <Star className="w-3 h-3 mr-1 fill-white" />
                        Featured
                      </Badge>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-3 right-3 bg-background/80 hover:bg-background"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="p-4 space-y-3">
                    {/* Type Badge */}
                    <Badge className={getTypeColor(listing.type)}>
                      <TypeIcon className="w-3 h-3 mr-1" />
                      {listing.type.charAt(0).toUpperCase() + listing.type.slice(1)}
                    </Badge>

                    {/* Title & Description */}
                    <div>
                      <h3 className="font-bold text-lg group-hover:text-primary transition-colors line-clamp-1 mb-1">
                        {listing.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {listing.description}
                      </p>
                    </div>

                    {/* Price/Salary */}
                    <div className="text-2xl font-bold text-primary">
                      {listing.price && `$${listing.price.toLocaleString()}`}
                      {listing.salary && listing.salary}
                      {listing.type === 'housing' && listing.price && <span className="text-sm text-muted-foreground">/mo</span>}
                      {listing.type === 'service' && listing.price && <span className="text-sm text-muted-foreground">/hr</span>}
                    </div>

                    {/* Location & Time */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="truncate">{listing.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{listing.postedAt}</span>
                      </div>
                    </div>

                    {/* Seller */}
                    <div className="pt-3 border-t flex items-center justify-between">
                      <div className="text-sm">
                        <span className="text-muted-foreground">by </span>
                        <span className="font-semibold">{listing.seller}</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        View Details
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
              })}
            </div>
          )}

          {/* Empty State */}
          {filteredListings.length === 0 && (
            <Card className="p-12 text-center">
              <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">No listings found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filters
              </p>
              <Button onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}>
                Clear Filters
              </Button>
            </Card>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white mx-4 md:mx-0 rounded-2xl md:rounded-none">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">
            Have Something to Sell or Offer?
          </h2>
          <p className="text-base md:text-xl opacity-90 mb-6 md:mb-8 max-w-2xl mx-auto">
            List your products, housing, job openings, or services on our marketplace
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/marketplace/create')}
            className="bg-white text-purple-600 hover:bg-gray-100"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Listing
          </Button>
        </div>
      </section>

      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default MarketplaceHome;
