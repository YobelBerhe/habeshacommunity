import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  MapPin,
  Filter,
  Heart
} from 'lucide-react';

interface Listing {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
  location: string;
  distance: string;
  seller: {
    name: string;
    verified: boolean;
  };
  isFree: boolean;
  saved: boolean;
}

export default function BrowseMarketplace() {
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    setListings([
      {
        id: '1',
        title: 'Studio Apartment - Downtown SF',
        price: 2200,
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
        category: 'Housing',
        location: 'San Francisco, CA',
        distance: '2 miles away',
        seller: { name: 'Sarah K.', verified: true },
        isFree: false,
        saved: false
      },
      {
        id: '2',
        title: 'Software Engineer Position',
        price: 0,
        image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400',
        category: 'Jobs',
        location: 'Mountain View, CA',
        distance: '15 miles away',
        seller: { name: 'TechCorp', verified: true },
        isFree: true,
        saved: false
      },
      {
        id: '3',
        title: 'Traditional Netela - Hand Woven',
        price: 150,
        image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400',
        category: 'Products',
        location: 'Oakland, CA',
        distance: '8 miles away',
        seller: { name: 'Meron T.', verified: false },
        isFree: false,
        saved: true
      },
      {
        id: '4',
        title: '2015 Honda Accord - Clean Title',
        price: 12500,
        image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=400',
        category: 'Vehicles',
        location: 'San Jose, CA',
        distance: '25 miles away',
        seller: { name: 'Daniel A.', verified: true },
        isFree: false,
        saved: false
      },
      {
        id: '5',
        title: 'House Cleaning Services',
        price: 80,
        image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400',
        category: 'Services',
        location: 'Berkeley, CA',
        distance: '5 miles away',
        seller: { name: 'Clean Team', verified: true },
        isFree: false,
        saved: false
      },
      {
        id: '6',
        title: 'Ethiopian Coffee Set - Complete',
        price: 45,
        image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400',
        category: 'Products',
        location: 'San Francisco, CA',
        distance: '3 miles away',
        seller: { name: 'Habesha Store', verified: true },
        isFree: false,
        saved: false
      },
    ]);
  };

  const categories = ['All', 'Housing', 'Jobs', 'Products', 'Services', 'Vehicles'];

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || listing.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleSave = (id: string) => {
    setListings(prev => prev.map(item => 
      item.id === id ? { ...item, saved: !item.saved } : item
    ));
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
            {filteredListings.length} items • Near you
          </p>
        </div>

        {/* Listings Grid */}
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
                />
                <button
                  className="absolute top-2 right-2 p-1.5 bg-background/80 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSave(listing.id);
                  }}
                >
                  <Heart className={`h-4 w-4 ${listing.saved ? 'fill-red-500 text-red-500' : 'text-foreground'}`} />
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
                <p className="text-xs text-muted-foreground mt-0.5">{listing.distance}</p>
              </div>
            </Card>
          ))}
        </div>

        {filteredListings.length === 0 && (
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
