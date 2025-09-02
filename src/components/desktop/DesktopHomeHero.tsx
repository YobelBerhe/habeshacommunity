import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Briefcase, Wrench, Users } from 'lucide-react';
import CitySearchBar from '@/components/CitySearchBar';
import WorldMapHero from '@/components/WorldMapHero';
import ListingCard from '@/components/ListingCard';
import { getStarPoints } from '@/services/activeUsers';
import { fetchListings } from '@/repo/listings';
import { Lang } from '@/lib/i18n';
import type { Listing } from '@/types';

type Props = {
  lang?: Lang;
};

export function DesktopHomeHero({ lang = 'EN' }: Props) {
  const navigate = useNavigate();
  const [totalUsers, setTotalUsers] = useState(0);
  const [featuredListings, setFeaturedListings] = useState<Listing[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getStarPoints();
        setTotalUsers(data.points.length);
      } catch (error) {
        console.error('Failed to load star points:', error);
      }
    };

    loadData();
    const interval = setInterval(loadData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadFeaturedListings = async () => {
      try {
        // Load recent listings from major cities as featured
        const data = await fetchListings({ 
          limit: 6 // Show 6 featured listings
        });
        setFeaturedListings(data.map(row => ({
          id: row.id,
          user_id: row.user_id || "",
          city: row.city,
          country: row.country,
          category: row.category as string,
          subcategory: row.subcategory,
          title: row.title,
          description: row.description || "",
          price: row.price_cents ? row.price_cents / 100 : null,
          currency: row.currency,
          contact_phone: null,
          contact_whatsapp: null,
          contact_telegram: null,
          contact_email: null,
          website_url: row.website_url,
          tags: row.tags || [],
          images: row.images || [],
          lat: row.location_lat,
          lng: row.location_lng,
          created_at: row.created_at,
          // Legacy compatibility
          contact: { phone: "" },
          photos: row.images || [],
          lon: row.location_lng || undefined,
          createdAt: new Date(row.created_at).getTime(),
          updatedAt: new Date(row.updated_at).getTime(),
          hasImage: !!(row.images?.length),
        })));
      } catch (error) {
        console.error('Failed to load featured listings:', error);
      }
    };

    loadFeaturedListings();
  }, []);

  const handleCitySelect = (city: string) => {
    navigate(`/browse?city=${encodeURIComponent(city)}`);
  };

  const handleCategoryClick = (category: string) => {
    navigate(`/browse?category=${category}`);
  };

  const handleListingSelect = (listing: Listing) => {
    navigate(`/l/${listing.id}`);
  };

  const categories = [
    {
      key: 'housing',
      label: 'Housing/Rentals',
      icon: Building2,
      color: 'text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100'
    },
    {
      key: 'jobs',
      label: 'Jobs + Gigs',
      icon: Briefcase,
      color: 'text-green-600 border-green-200 bg-green-50 hover:bg-green-100'
    },
    {
      key: 'services',
      label: 'Services',
      icon: Wrench,
      color: 'text-purple-600 border-purple-200 bg-purple-50 hover:bg-purple-100'
    },
    {
      key: 'community',
      label: 'Community',
      icon: Users,
      color: 'text-orange-600 border-orange-200 bg-orange-50 hover:bg-orange-100'
    }
  ];

  return (
    <div className="hidden md:block relative">
      {/* Background Map - Faded */}
      <div className="absolute inset-0 opacity-30">
        <WorldMapHero 
          lang={lang}
          onBrowseHousing={() => handleCategoryClick('housing')}
          onFindJobs={() => handleCategoryClick('jobs')}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-12">
          {/* Headline */}
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-foreground">
              Find your next home, job, or service
            </h1>
            <p className="text-xl text-muted-foreground">
              Connecting the global Habesha community
            </p>
            
            {totalUsers > 0 && (
              <p className="text-sm text-muted-foreground mt-4">
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                  {totalUsers} users online now
                </span>
              </p>
            )}
          </div>

          {/* Search Bar - Full Width */}
          <div className="max-w-2xl mx-auto mb-8">
            <CitySearchBar 
              placeholder="Enter an address, neighborhood, city, or ZIP code"
              onCitySelect={handleCitySelect}
              className="text-lg py-4 w-full"
            />
          </div>

          {/* Category Navigation - Zillow Style */}
          <div className="flex justify-center mb-12">
            <div className="flex gap-2 bg-background/90 backdrop-blur rounded-xl p-2 border shadow-lg">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.key}
                    onClick={() => handleCategoryClick(category.key)}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all hover:bg-primary/10 hover:text-primary"
                  >
                    <Icon className="w-5 h-5" />
                    <span>{category.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Featured Listings Section */}
        {featuredListings.length > 0 && (
          <div className="bg-background/95 backdrop-blur border-y">
            <div className="container mx-auto px-4 py-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Featured Listings</h2>
                <button 
                  onClick={() => navigate('/browse')}
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  View all listings →
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredListings.map((listing) => (
                  <div key={listing.id} className="w-full">
                    <ListingCard 
                      listing={listing}
                      onSelect={handleListingSelect}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}