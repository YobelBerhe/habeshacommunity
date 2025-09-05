import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/store/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, DollarSign, Clock, MessageCircle, Share2, Heart } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
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

export default function MarketplaceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [listing, setListing] = useState<MarketplaceListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const appState = getAppState();

  useEffect(() => {
    if (id) {
      fetchListing();
    }
  }, [id]);

  const fetchListing = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .eq('category', 'marketplace')
        .single();

      if (error) throw error;
      setListing(data);
    } catch (error) {
      console.error('Error fetching listing:', error);
      toast({
        title: 'Error',
        description: 'Failed to load listing',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: listing?.title,
          text: listing?.description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: 'Copied to clipboard',
          description: 'Link copied to clipboard',
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to save items',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: user.id,
          listing_id: id
        });

      if (error) throw error;

      toast({
        title: 'Saved!',
        description: 'Item saved to your favorites',
      });
    } catch (error) {
      console.error('Error saving listing:', error);
      toast({
        title: 'Error',
        description: 'Failed to save item',
        variant: 'destructive',
      });
    }
  };

  const formatPrice = (cents: number, currency: string) => {
    const amount = cents / 100;
    return `${currency} ${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
          <div className="text-center">Loading listing...</div>
        </div>
      </div>
    );
  }

  if (!listing) {
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
          <div className="text-center">
            <p>Listing not found</p>
            <Button onClick={() => navigate('/market')} className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Marketplace
            </Button>
          </div>
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
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/market')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Marketplace
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="aspect-square bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg overflow-hidden mb-4">
              {listing.images?.[currentImageIndex] ? (
                <img 
                  src={listing.images[currentImageIndex]} 
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-6xl opacity-30">📦</div>
                </div>
              )}
            </div>
            
            {listing.images && listing.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {listing.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded border-2 overflow-hidden ${
                      index === currentImageIndex ? 'border-primary' : 'border-border'
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={`${listing.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl mb-2">{listing.title}</CardTitle>
                    {listing.subcategory && (
                      <Badge variant="secondary" className="mb-2">
                        {LABELS[listing.subcategory]?.en || listing.subcategory}
                      </Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-2xl font-bold text-primary">
                      <DollarSign className="w-6 h-6" />
                      {formatPrice(listing.price_cents, listing.currency)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{listing.city}{listing.country && `, ${listing.country}`}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>Posted {formatDate(listing.created_at)}</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{listing.description}</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => navigate(`/inbox?listing=${listing.id}`)}
                    className="flex-1"
                    disabled={user?.id === listing.user_id}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contact Seller
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleSave}
                    disabled={user?.id === listing.user_id}
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleShare}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>

                {user?.id === listing.user_id && (
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">
                      This is your listing
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/account/listings`)}
                      className="w-full"
                    >
                      Manage Listing
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}