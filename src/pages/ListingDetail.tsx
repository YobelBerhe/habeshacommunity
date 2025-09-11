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
import ContactButton from "@/components/ContactButton";
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
          await supabase.rpc('track_listing_view', { p_listing_id: id });
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
      {/* Image Section with Overlay Controls */}
      <div className="relative">
        {listing.images && listing.images.length > 0 && (
          <div className="relative h-[70vh] bg-muted">
            <ImageBox
              src={listing.images[activeImageIndex]}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
            
            {/* Top Overlay Controls */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
              <button
                onClick={handleBack}
                className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={handleFavoriteToggle}
                  className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <Heart className={`w-5 h-5 text-white ${isFavorited ? 'fill-current' : ''}`} />
                </button>
                
                <button 
                  onClick={handleShare} 
                  className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <Share2 className="w-5 h-5 text-white" />
                </button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-colors">
                      <MoreHorizontal className="w-5 h-5 text-white" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white">
                    <DropdownMenuItem onClick={() => setReportOpen(true)}>
                      Report
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            {/* Image Navigation */}
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
                
                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {activeImageIndex + 1} / {listing.images.length}
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
                {/* Add ContactButton here next to address */}
                <ContactButton 
                  contact={listing.contact_phone || listing.contact_whatsapp || listing.contact_telegram || listing.contact_email} 
                  className="ml-2"
                />
              </div>
            </div>
            {listing.price && (
              <div className="text-right">
                <div className="text-2xl font-bold text-foreground">
                  {formatPrice(listing.price, listing.currency)}
                </div>
              </div>
            )}
          </div>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant="secondary">{categoryName}</Badge>
            {listing.subcategory && (
              <Badge variant="outline">{listing.subcategory}</Badge>
            )}
            {listing.tags?.map((tag) => (
              <Badge key={tag} variant="outline">{tag}</Badge>
            ))}
          </div>
          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Description</h3>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {listing.description}
            </p>
          </div>
          
          {/* Contact Buttons */}
          {getContactButtons().length > 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-3">
                {getContactButtons().map((button, index) => (
                  <Button
                    key={index}
                    variant={button.variant}
                    className="flex items-center gap-2"
                    onClick={() => window.open(button.href, '_blank', 'noopener,noreferrer')}
                  >
                    <button.icon className="h-4 w-4" />
                    {button.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {/* Website Link */}
          {listing.website_url && (
            <div className="mb-6">
              <Button
                variant="outline"
                className="w-full justify-center gap-2"
                onClick={() => window.open(listing.website_url, '_blank', 'noopener,noreferrer')}
              >
                <ExternalLink className="h-4 w-4" />
                Visit Website
              </Button>
            </div>
          )}
          {/* Additional Details */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-muted-foreground">Category</p>
              <p className="font-medium">{categoryName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Posted</p>
              <p className="font-medium">{timeAgo(new Date(listing.created_at).getTime())}</p>
            </div>
          </div>

          {/* Map */}
          {listing.lat && listing.lng && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Location</h3>
              <div className="h-48 bg-muted rounded-lg overflow-hidden">
                <MapMini lat={listing.lat} lng={listing.lng} />
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Report Modal */}
      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Listing</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Please describe the issue..."
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setReportOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleReport} disabled={!reportText.trim()}>
                Submit Report
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}