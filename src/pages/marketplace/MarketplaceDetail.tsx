import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/store/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, DollarSign, Clock, MessageCircle, Share2, Heart, MoreHorizontal } from 'lucide-react';
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
        .eq('category', 'forsale' as any)
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
      {/* Image Section with Overlay Controls */}
      <div className="relative">
        {listing.images && listing.images.length > 0 && (
          <div className="relative h-[70vh] bg-muted">
            <img 
              src={listing.images[currentImageIndex]} 
              alt={listing.title}
              className="w-full h-full object-cover"
            />
            
            {/* Top Overlay Controls */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
              <button
                onClick={() => navigate('/market')}
                className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSave}
                  className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                  disabled={user?.id === listing.user_id}
                >
                  <Heart className="w-5 h-5 text-white" />
                </button>
                
                <button 
                  onClick={handleShare} 
                  className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <Share2 className="w-5 h-5 text-white" />
                </button>
                
                <button className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-colors">
                  <MoreHorizontal className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
            
            {/* Image Navigation */}
            {listing.images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImageIndex(currentImageIndex > 0 ? currentImageIndex - 1 : listing.images.length - 1)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setCurrentImageIndex(currentImageIndex < listing.images.length - 1 ? currentImageIndex + 1 : 0)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <ArrowLeft className="w-6 h-6 rotate-180" />
                </button>
                
                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {currentImageIndex + 1} / {listing.images.length}
                </div>
              </>
            )}
          </div>
        )}
        
        {/* Main Content */}
        <div className="bg-background px-4 py-6">
          {/* Title and Price */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground mb-2">{listing.title}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{listing.city}{listing.country && `, ${listing.country}`}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-foreground">
                {formatPrice(listing.price_cents, listing.currency)}
              </div>
            </div>
          </div>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant="secondary">marketplace</Badge>
            {listing.subcategory && (
              <Badge variant="outline">{LABELS[listing.subcategory]?.en || listing.subcategory}</Badge>
            )}
          </div>
          
          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Description</h3>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {listing.description}
            </p>
          </div>
          
          {/* Additional Details */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-muted-foreground">Category</p>
              <p className="font-medium">{LABELS[listing.subcategory]?.en || listing.subcategory}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Posted</p>
              <p className="font-medium">{formatDate(listing.created_at)}</p>
            </div>
          </div>
          
          {/* Contact Buttons */}
          <div className="mb-6">
            <div className="flex flex-col gap-3">
              <Button
                onClick={async () => {
                  if (!user) {
                    navigate('/auth/login');
                    return;
                  }
                  try {
                    const { getOrCreateConversation } = await import('@/utils/conversations');
                    const { conversationId } = await getOrCreateConversation(listing.user_id);
                    navigate('/inbox', { state: { openConversationId: conversationId, mentorName: listing.title } });
                  } catch (e: any) {
                    console.error('Failed to start conversation:', e);
                  }
                }}
                className="w-full"
                disabled={user?.id === listing.user_id}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Seller
              </Button>
              
              {user?.id === listing.user_id && (
                <Button
                  variant="outline"
                  onClick={() => navigate(`/account/listings`)}
                  className="w-full"
                >
                  Manage Listing
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}