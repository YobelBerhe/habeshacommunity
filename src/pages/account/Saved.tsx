import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '@/store/auth';
import { supabase } from '@/integrations/supabase/client';
import ListingCard from '@/components/ListingCard';
import MobileHeader from '@/components/layout/MobileHeader';
import type { Listing } from '@/types';

export default function SavedListings() {
  const [favorites, setFavorites] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    
    const loadFavorites = async () => {
      try {
        const { data, error } = await supabase
          .from('favorites')
          .select(`
            listing_id,
            listings (
              id, title, description, price_cents, currency, city, category,
              subcategory, images, contact_method, contact_value, created_at,
              location_lat, location_lng, user_id, website_url, tags
            )
          `)
          .eq('user_id', user.id);

        if (error) throw error;

        const favListings = data
          ?.filter(f => f.listings)
          ?.map(f => {
            const l = f.listings as any;
            return {
              id: l.id,
              user_id: l.user_id || "",
              city: l.city,
              country: "",
              category: l.category,
              subcategory: l.subcategory,
              title: l.title,
              description: l.description || "",
              price: l.price_cents ? l.price_cents / 100 : null,
              currency: l.currency,
              contact_phone: l.contact_method === 'phone' ? l.contact_value : null,
              contact_whatsapp: l.contact_method === 'whatsapp' ? l.contact_value : null,
              contact_telegram: l.contact_method === 'telegram' ? l.contact_value : null,
              contact_email: l.contact_method === 'email' ? l.contact_value : null,
              website_url: l.website_url,
              tags: l.tags || [],
              images: l.images || [],
              lat: l.location_lat,
              lng: l.location_lng,
              created_at: l.created_at,
              contact: { phone: l.contact_value || "" },
              photos: l.images || [],
              lon: l.location_lng || undefined,
              createdAt: new Date(l.created_at).getTime(),
              updatedAt: new Date(l.created_at).getTime(),
              hasImage: !!(l.images?.length),
            } as Listing;
          }) || [];

        setFavorites(favListings);
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [user]);

  const handleRemoveFavorite = async (listingId: string) => {
    if (!user) return;
    
    try {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('listing_id', listingId);
      
      setFavorites(prev => prev.filter(f => f.id !== listingId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <MobileHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading your saved listings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader />
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Heart className="w-6 h-6 text-red-500 fill-red-500" />
          <h1 className="text-2xl font-bold">Saved Listings</h1>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-red-500 fill-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No saved listings yet</h2>
            <p className="text-muted-foreground mb-6">Start browsing to save listings you're interested in</p>
            <a 
              href="/browse" 
              className="btn-primary inline-block"
            >
              Start browsing
            </a>
          </div>
        ) : (
          <div className="grid gap-4">
            {favorites.map(listing => (
              <div key={listing.id} className="relative">
                <ListingCard 
                  listing={listing}
                  onSelect={() => window.location.href = `/l/${listing.id}`}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}