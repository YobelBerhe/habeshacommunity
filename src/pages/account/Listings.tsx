import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Package, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/store/auth';
import { supabase } from '@/integrations/supabase/client';
import ListingCard from '@/components/ListingCard';
import MobileHeader from '@/components/layout/MobileHeader';
import PostModal from '@/components/PostModal';
import { toast } from 'sonner';
import { useLanguage } from '@/store/language';
import { t } from '@/lib/i18n';
import type { Listing } from '@/types';

export default function MyListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, openPost } = useAuth();
  const { language } = useLanguage();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    const loadMyListings = async () => {
      try {
        const { data: listings, error: listingsError } = await supabase
          .from('listings')
          .select(`
            *,
            listing_contacts (
              id,
              contact_method,
              contact_value,
              created_at
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (listingsError) throw listingsError;

        const myListings = listings?.map(l => ({
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
          updatedAt: new Date(l.updated_at).getTime(),
          hasImage: !!(l.images?.length),
        } as Listing)) || [];

        setListings(myListings);
      } catch (error) {
        console.error('Error loading my listings:', error);
        toast.error('Failed to load your listings');
      } finally {
        setLoading(false);
      }
    };

    loadMyListings();
  }, [user]);

  const handleListingPosted = (updatedListing: Listing) => {
    // Refresh listings after edit or create
    setListings(prev => {
      const existingIndex = prev.findIndex(l => l.id === updatedListing.id);
      if (existingIndex >= 0) {
        // Update existing listing
        const newListings = [...prev];
        newListings[existingIndex] = updatedListing;
        return newListings;
      } else {
        // Add new listing
        return [updatedListing, ...prev];
      }
    });
  };

  const handleEdit = (listing: Listing) => {
    useAuth.getState().openEditPost(listing);
  };

  const handleDelete = async (listingId: string) => {
    if (!confirm('Delete this listing? This action cannot be undone.')) return;
    
    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', listingId)
        .eq('user_id', user?.id);

      if (error) throw error;
      
      setListings(prev => prev.filter(l => l.id !== listingId));
      toast.success('Listing deleted successfully');
    } catch (error) {
      console.error('Error deleting listing:', error);
      toast.error('Failed to delete listing');
    }
  };

  if (!user && !loading) {
    return (
      <div className="min-h-screen bg-background">
        <MobileHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Sign in required</h2>
            <p className="text-muted-foreground mb-6">Please sign in to view and edit your listings</p>
            <a 
              href="/auth/login" 
              className="btn-primary inline-block"
            >
              Sign In
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <MobileHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading your listings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader />
      
      <div className="container mx-auto px-4 py-6">
        <div className="relative flex items-center mb-8">
          {/* Back Arrow */}
          <button 
            onClick={() => window.history.back()}
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          
          {/* Centered Title */}
          <div className="flex-1 flex justify-center">
            <h1 className="text-xl md:text-2xl font-bold text-foreground">{t(language, "my_listings")}</h1>
          </div>
          
          {/* Small New Post Button */}
          <button 
            onClick={openPost}
            className="btn-primary flex items-center justify-center w-10 h-10 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-sm"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {listings.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No listings yet</h2>
            <p className="text-muted-foreground mb-6">Create your first listing to get started</p>
            <button 
              onClick={openPost}
              className="btn-primary"
            >
              {t(language, "post_listing")}
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {listings.map(listing => (
              <div key={listing.id} className="relative">
                <ListingCard 
                  listing={listing}
                  onSelect={() => window.location.href = `/l/${listing.id}`}
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(listing);
                    }}
                    className="p-2 bg-background/80 hover:bg-background rounded-full shadow-md"
                  >
                    <Edit className="w-4 h-4 text-primary" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(listing.id);
                    }}
                    className="p-2 bg-background/80 hover:bg-background rounded-full shadow-md"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <PostModal 
        city={listings[0]?.city || "Unknown"} 
        onPosted={handleListingPosted}
      />
    </div>
  );
}