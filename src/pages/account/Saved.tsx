import { GridSkeleton } from '@/components/LoadingStates';
import { EmptyState } from '@/components/EmptyState';
import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '@/store/auth';
import { supabase } from '@/integrations/supabase/client';
import ListingCard from '@/components/ListingCard';
import MentorHeader from '@/components/MentorHeader';
import { useLanguage } from '@/store/language';
import { t } from '@/lib/i18n';
import type { Listing } from '@/types';

export default function SavedListings() {
  const [favorites, setFavorites] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { language } = useLanguage();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    const loadFavorites = async () => {
      try {
        console.log('Loading favorites for user:', user.id);
        const { data, error } = await supabase
          .from('favorites')
          .select(`
            listing_id,
            listings (
              id, title, description, price_cents, currency, city, country,
              category, subcategory, images, created_at, updated_at,
              location_lat, location_lng, user_id, website_url, tags,
              listing_contacts (
                id,
                contact_method,
                contact_value
              )
            )
          `)
          .eq('user_id', user.id);

        console.log('Favorites query result:', { data, error });
        if (error) throw error;

        const favListings = data
          ?.filter(f => f.listings)
          ?.map(f => {
            const l = f.listings as any;
            return {
              id: l.id,
              user_id: l.user_id || "",
              city: l.city,
              country: l.country || "",
              category: l.category,
              subcategory: l.subcategory,
              title: l.title,
              description: l.description || "",
              price: l.price_cents ? l.price_cents / 100 : null,
              currency: l.currency,
              contact_phone: l.listing_contacts?.[0]?.contact_method === 'phone' ? l.listing_contacts[0].contact_value : null,
              contact_whatsapp: l.listing_contacts?.[0]?.contact_method === 'whatsapp' ? l.listing_contacts[0].contact_value : null,
              contact_telegram: l.listing_contacts?.[0]?.contact_method === 'telegram' ? l.listing_contacts[0].contact_value : null,
              contact_email: l.listing_contacts?.[0]?.contact_method === 'email' ? l.listing_contacts[0].contact_value : null,
              website_url: l.website_url,
              tags: l.tags || [],
              images: l.images || [],
              lat: l.location_lat,
              lng: l.location_lng,
              created_at: l.created_at,
              contact: { phone: l.listing_contacts?.[0]?.contact_value || "" },
              photos: l.images || [],
              lon: l.location_lng || undefined,
              createdAt: new Date(l.created_at).getTime(),
              updatedAt: new Date(l.updated_at || l.created_at).getTime(),
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

 if (!user && !loading) {
  return (
    <div className="min-h-screen bg-background">
      <MentorHeader title="Saved Listings" backPath="/" />
      <div className="container mx-auto px-4 py-8">
        <EmptyState
          icon={Heart}
          title="Sign in required"
          description="Please sign in to view your saved listings"
          action={{
            label: 'Sign In',
            onClick: () => window.location.href = '/auth/login',
          }}
        />
      </div>
    </div>
  );
}

  if (loading) {
  return (
    <div className="min-h-screen bg-background">
      <MentorHeader title={t(language, "saved_listings")} backPath="/" />
      <div className="container mx-auto px-4 py-8">
        <GridSkeleton count={6} />
      </div>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-background">
      <MentorHeader title={t(language, "saved_listings")} backPath="/" />
      
      <div className="container mx-auto px-4 py-6">

       {favorites.length === 0 ? (
  <EmptyState
    icon={Heart}
    title={t(language, "no_saved_listings_yet")}
    description="Start browsing to save listings you're interested in"
    action={{
      label: 'Start browsing',
      onClick: () => window.location.href = '/browse',
    }}
  />
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
