import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Heart, Share2, MoreHorizontal, MapPin, Calendar, Phone, Mail, MessageCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Listing } from "@/types";
import { fetchListingById } from "@/repo/listings";
import { getListingContact } from "@/repo/contacts";
import { toggleFavorite, fetchFavorites } from "@/repo/favorites";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/store/auth";
import { useLanguage } from "@/store/language";
import { t } from "@/lib/i18n";
import { TAXONOMY } from "@/lib/taxonomy";
import MapMini from "@/components/MapMini";
import ImageBox from "@/components/ImageBox";
import { timeAgo } from "@/lib/time";
import { bumpListingView } from "@/lib/trending";

interface ListingSimilar {
  id: string;
  title: string;
  price?: number;
  image?: string;
  city: string;
}

export default function ListingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { language } = useLanguage();
  
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportText, setReportText] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [similarListings, setSimilarListings] = useState<ListingSimilar[]>([]);

  // Load listing data
  useEffect(() => {
    if (!id) return;

    const loadListing = async () => {
      try {
        setLoading(true);
        const row = await fetchListingById(id);
        const contact = user ? await getListingContact(id) : null;

        const listingData: Listing = {
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
          contact_phone: (contact?.contact_method === 'phone') ? contact.contact_value : null,
          contact_whatsapp: (contact?.contact_method === 'whatsapp') ? contact.contact_value : null,
          contact_telegram: (contact?.contact_method === 'telegram') ? contact.contact_value : null,
          contact_email: (contact?.contact_method === 'email') ? contact.contact_value : null,
          website_url: row.website_url,
          tags: row.tags || [],
          images: row.images || [],
          lat: row.location_lat,
          lng: row.location_lng,
          created_at: row.created_at,
          contact: { phone: contact?.contact_value || "" },
          photos: row.images || [],
          lon: row.location_lng || undefined,
          createdAt: new Date(row.created_at).getTime(),
          updatedAt: new Date(row.updated_at).getTime(),
          hasImage: !!(row.images?.length),
        };

        setListing(listingData);

        // Track view for trending algorithm
        await bumpListingView(id);
        
        // Track view for user analytics
        if (user) {
          await supabase.rpc('track_listing_view', { listing_id: id });
        }

        // Load similar listings
        await loadSimilarListings(listingData);

      } catch (error) {
        console.error("Failed to load listing:", error);
        toast.error("Listing not found");
        navigate('/', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    loadListing();
  }, [id, navigate, user]);

  // Load favorites status
  useEffect(() => {
    if (!user || !listing) return;

    const loadFavoriteStatus = async () => {
      try {
        const favorites = await fetchFavorites(user.id);
        setIsFavorited(favorites.has(listing.id));
      } catch (error) {
        console.error('Error loading favorite status:', error);
      }
    };

    loadFavoriteStatus();
  }, [listing?.id, user]);

  const loadSimilarListings = async (currentListing: Listing) => {
    try {
      console.log('Loading similar listings for:', currentListing.city, currentListing.category);
      const { data, error } = await supabase
        .from('listings')
        .select('id, title, price_cents, images, city')
        .eq('status', 'active')
        .eq('city', currentListing.city)
        .eq('category', currentListing.category)
        .neq('id', currentListing.id)
        .limit(6);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Similar listings data:', data);
      setSimilarListings(data.map(item => ({
        id: item.id,
        title: item.title,
        price: item.price_cents ? item.price_cents / 100 : undefined,
        image: item.images?.[0],
        city: item.city,
      })));
    } catch (error) {
      console.error('Error loading similar listings:', error);
    }
  };

  const handleBack = () => {
    // Try to get the last search URL from sessionStorage
    const lastSearchUrl = sessionStorage.getItem('hn.lastSearchUrl');
    const scrollY = sessionStorage.getItem('hn.index.scrollY');
    
    if (lastSearchUrl) {
      navigate(lastSearchUrl, { replace: true });
      // Restore scroll position after navigation
      setTimeout(() => {
        if (scrollY) {
          window.scrollTo(0, parseInt(scrollY));
        }
      }, 100);
    } else {
      navigate(-1);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!user || !listing) {
      toast.error("Please log in to save favorites");
      return;
    }

    try {
      const newState = await toggleFavorite(listing.id, user.id);
      setIsFavorited(newState);
      toast.success(newState ? "Saved to favorites" : "Removed from favorites");
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error("Failed to update favorites");
    }
  };

  const handleShare = async () => {
    if (!listing) return;

    const url = window.location.href;
    const text = `${listing.title} • ${listing.city}`;

    try {
      if (navigator.share) {
        await navigator.share({ title: listing.title, text, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
      } catch {
        toast.error("Failed to share listing");
      }
    }
  };

  const handleReport = async () => {
    if (!listing) return;

    try {
      const { error } = await supabase
        .from('reports')
        .insert({
          listing_id: listing.id,
          reporter_id: user?.id || null,
          reason: 'other',
          details: reportText,
        });

      if (error) throw error;

      toast.success("Thank you for your report. Our team will review it.");
      setReportOpen(false);
      setReportText("");
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error("Failed to submit report");
    }
  };

  const formatPrice = (price?: number | null, currency = 'USD') => {
    if (!price) return null;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getContactButtons = () => {
    if (!listing) return [];

    const buttons = [];
    
    if (listing.contact_phone) {
      buttons.push({
        icon: Phone,
        label: "Call",
        href: `tel:${listing.contact_phone}`,
        variant: "default" as const,
      });
    }
    
    if (listing.contact_whatsapp) {
      buttons.push({
        icon: MessageCircle,
        label: "WhatsApp",
        href: `https://wa.me/${listing.contact_whatsapp.replace(/\D/g, '')}`,
        variant: "outline" as const,
      });
    }
    
    if (listing.contact_telegram) {
      buttons.push({
        icon: MessageCircle,
        label: "Telegram",
        href: `https://t.me/${listing.contact_telegram}`,
        variant: "outline" as const,
      });
    }
    
    if (listing.contact_email) {
      buttons.push({
        icon: Mail,
        label: "Email",
        href: `mailto:${listing.contact_email}`,
        variant: "outline" as const,
      });
    }

    return buttons;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading listing...</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Listing not found</h1>
          <p className="text-muted-foreground mb-4">The listing you're looking for doesn't exist or has been removed.</p>
          <Button onClick={handleBack}>Go back</Button>
        </div>
      </div>
    );
  }

  const langKey = language.toLowerCase() as 'en' | 'ti';
  const categoryName = TAXONOMY[listing.category as keyof typeof TAXONOMY]?.name[langKey] || listing.category;

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile-first Zillow-style layout */}
      <div className="relative">
        {/* Full-screen Image Gallery */}
        {listing.images && listing.images.length > 0 && (
          <div className="relative h-[60vh] md:h-[50vh]">
            <ImageBox
              src={listing.images[activeImageIndex]}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
            
            {/* Navigation Overlay */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <button
                onClick={handleBack}
                className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5 text-gray-800" />
              </button>
              
              <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                <button
                  onClick={handleFavoriteToggle}
                  className={`${isFavorited ? "text-red-500" : "text-gray-700 hover:text-red-500"} transition-colors`}
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                </button>
                
                <button onClick={handleShare} className="text-gray-700 hover:text-gray-900 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-gray-700 hover:text-gray-900 transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setReportOpen(true)}>
                      Report
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            {/* Image Counter */}
            {listing.images.length > 1 && (
              <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                {activeImageIndex + 1} of {listing.images.length}
              </div>
            )}
            
            {/* Image Navigation Arrows */}
            {listing.images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImageIndex(activeImageIndex > 0 ? activeImageIndex - 1 : listing.images.length - 1)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setActiveImageIndex(activeImageIndex < listing.images.length - 1 ? activeImageIndex + 1 : 0)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <ArrowLeft className="w-6 h-6 rotate-180" />
                </button>
              </>
            )}
          </div>
        )}
        
        {/* Map and Street View buttons */}
        <div className="sticky top-0 z-40 bg-white border-b flex">
          <button className="flex-1 py-3 text-center text-primary font-medium border-b-2 border-primary bg-blue-50">
            Map
          </button>
          <button className="flex-1 py-3 text-center text-gray-600 font-medium hover:bg-gray-50">
            Street View
          </button>
        </div>
        
        {/* Content Container */}
        <div className="bg-white">
          {/* Property Title and Address */}
          <div className="px-4 py-6 border-b">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{listing.title}</h1>
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <p className="text-gray-600">{listing.city}{listing.country && `, ${listing.country}`}</p>
          </div>
          
          {/* Action Buttons */}
          <div className="px-4 py-4 flex gap-3">
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3">
              Tour
            </Button>
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3">
              Apply
            </Button>
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3">
              Email
            </Button>
          </div>
          
          {/* Property Details Grid */}
          <div className="px-4 py-4 grid grid-cols-2 gap-4 border-b">
            {/* Building Type */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0v-4a2 2 0 012-2h4a2 2 0 012 2v4z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Building Type</p>
                <p className="font-medium text-gray-900">{categoryName}</p>
              </div>
            </div>
            
            {/* Beds */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Bedrooms</p>
                <p className="font-medium text-gray-900">
                  {listing.price ? `${Math.floor(listing.price / 1000)} bed` : 'Studio'}
                </p>
              </div>
            </div>
            
            {/* Price */}
            {listing.price && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Rent</p>
                  <p className="font-medium text-gray-900">{formatPrice(listing.price, listing.currency)}</p>
                </div>
              </div>
            )}
            
            {/* Amenities */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Pet-friendly</p>
                <p className="font-medium text-gray-900">Yes</p>
              </div>
            </div>
          </div>
          
          {/* What's Available Section */}
          <div className="px-4 py-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">What's available</h2>
            <div className="flex gap-4">
              <button className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-medium bg-blue-50">
                Matches
              </button>
              <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">
                2 bd
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-4">Price may not include required fees and charges.</p>
          </div>
          
          {/* Description */}
          {listing.description && (
            <div className="px-4 py-6 border-t">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{listing.description}</p>
            </div>
          )}
          
          {/* Tags */}
          {listing.tags && listing.tags.length > 0 && (
            <div className="px-4 py-6 border-t">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Features</h2>
              <div className="flex flex-wrap gap-2">
                {listing.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="py-1 px-3">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Map Section */}
          {listing.lat && listing.lng && (
            <div className="px-4 py-6 border-t">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Location</h2>
              <div className="h-64 rounded-lg overflow-hidden border">
                <MapMini lat={listing.lat} lng={listing.lng} />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Coordinates: {listing.lat.toFixed(4)}, {listing.lng.toFixed(4)}
              </p>
            </div>
          )}
          
          {/* Similar Listings */}
          {similarListings.length > 0 && (
            <div className="px-4 py-6 border-t">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Similar Listings</h2>
              <div className="grid grid-cols-2 gap-4">
                {similarListings.slice(0, 4).map((similar) => (
                  <button
                    key={similar.id}
                    onClick={() => navigate(`/l/${similar.id}`)}
                    className="text-left hover:opacity-80 transition-opacity"
                  >
                    <div className="aspect-video rounded-lg overflow-hidden mb-2">
                      {similar.image ? (
                        <ImageBox
                          src={similar.image}
                          alt={similar.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-500 text-sm">No image</span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-medium text-sm mb-1 line-clamp-2">{similar.title}</h3>
                    {similar.price && (
                      <p className="text-sm font-semibold text-blue-600">
                        {formatPrice(similar.price)}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Costs & Fees Section */}
          <div className="px-4 py-6 border-t">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Costs & fees breakdown</h2>
            <p className="text-gray-600">Contact the property for detailed pricing information.</p>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Listing</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">
                Reason for reporting:
              </label>
              <Textarea
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                placeholder="Please describe why you're reporting this listing..."
                className="mt-1"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleReport} disabled={!reportText.trim()}>
                Submit Report
              </Button>
              <Button variant="outline" onClick={() => setReportOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}