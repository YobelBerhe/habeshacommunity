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

        // Track view
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
      const { data, error } = await supabase
        .from('listings')
        .select('id, title, price_cents, images, city')
        .eq('status', 'active')
        .eq('city', currentListing.city)
        .eq('category', currentListing.category)
        .neq('id', currentListing.id)
        .limit(6);

      if (error) throw error;

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
      {/* Header Bar */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleFavoriteToggle}
              className={isFavorited ? "text-red-500" : ""}
            >
              <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
            </Button>
            
            <Button variant="ghost" size="icon" onClick={handleShare}>
              <Share2 className="w-5 h-5" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setReportOpen(true)}>
                  Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Photo Gallery - Move to top, Zillow style */}
            {listing.images && listing.images.length > 0 && (
              <Card>
                <CardContent className="p-0">
                  <div className="relative">
                    <ImageBox
                      src={listing.images[activeImageIndex]}
                      alt={listing.title}
                      className="w-full h-96 object-cover rounded-t-lg"
                    />
                    
                    {listing.images.length > 1 && (
                      <>
                        <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
                          {activeImageIndex + 1} / {listing.images.length}
                        </div>
                        
                        <div className="flex gap-2 p-4 overflow-x-auto">
                          {listing.images.map((image, index) => (
                            <button
                              key={index}
                              onClick={() => setActiveImageIndex(index)}
                              className={`flex-shrink-0 w-20 h-20 rounded border-2 overflow-hidden ${
                                index === activeImageIndex ? 'border-primary' : 'border-border'
                              }`}
                            >
                              <ImageBox
                                src={image}
                                alt={`${listing.title} - Image ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Title & Price - Move below photos, Zillow style */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold leading-tight">{listing.title}</h1>
                {listing.price && (
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {formatPrice(listing.price, listing.currency)}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{listing.city}{listing.country && `, ${listing.country}`}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{timeAgo(new Date(listing.created_at).getTime())}</span>
                </div>
                <Badge variant="secondary">{categoryName}</Badge>
              </div>
            </div>

            {/* Tags */}
            {listing.tags && listing.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {listing.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Description */}
            {listing.description && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Description</h2>
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap">{listing.description}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Map */}
            {listing.lat && listing.lng && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Location</h2>
                  <div className="h-64 rounded-lg overflow-hidden">
                    <MapMini lat={listing.lat} lng={listing.lng} />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Similar Listings */}
            {similarListings.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Similar Listings</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {similarListings.map((similar) => (
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
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <span className="text-muted-foreground text-sm">No image</span>
                            </div>
                          )}
                        </div>
                        <h3 className="font-medium text-sm line-clamp-2 mb-1">{similar.title}</h3>
                        {similar.price && (
                          <p className="text-sm font-semibold text-primary">
                            {formatPrice(similar.price)}
                          </p>
                        )}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Contact</h2>
                
                <div className="space-y-3">
                  {getContactButtons().map((button, index) => (
                    <Button
                      key={index}
                      variant={button.variant}
                      className="w-full justify-start"
                      asChild
                    >
                      <a href={button.href} target="_blank" rel="noopener noreferrer">
                        <button.icon className="w-4 h-4 mr-2" />
                        {button.label}
                      </a>
                    </Button>
                  ))}
                  
                  {listing.website_url && (
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <a href={listing.website_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Visit Website
                      </a>
                    </Button>
                  )}
                </div>

                <Separator className="my-4" />
                
                <div className="text-xs text-muted-foreground">
                  <p className="font-medium mb-1">Safety Tips:</p>
                  <ul className="space-y-1">
                    <li>• Meet in a public place</li>
                    <li>• Don't send money in advance</li>
                    <li>• Trust your instincts</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
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