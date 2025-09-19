import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Heart, MapPin, Calendar, Star, MoreHorizontal, EyeOff, Share2, Phone, Mail, MessageSquare, Globe, ChevronLeft, ChevronRight } from "lucide-react";
import { Listing } from "@/types";
import { TAXONOMY, LABELS } from "@/lib/taxonomy";
import { toggleFavorite, fetchFavorites } from "@/repo/favorites";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/store/auth";
import { useLanguage } from "@/store/language";
import ImageBox from "./ImageBox";
import MessageModal from "./MessageModal";
import { getListingImages } from "@/lib/listing";

interface ListingCardProps {
  listing: Listing;
  onSelect: (listing: Listing) => void;
  showJustPosted?: boolean;
  viewMode?: "list" | "grid" | "gallery" | "map";
}

const ListingCard = ({ listing, onSelect, showJustPosted, viewMode = "list" }: ListingCardProps) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    
    const loadFavoriteStatus = async () => {
      try {
        const favorites = await fetchFavorites(user.id);
        setIsFavorited(favorites.has(listing.id));
      } catch (error) {
        console.error('Error loading favorite status:', error);
      }
    };
    
    loadFavoriteStatus();
  }, [listing.id, user]);

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      toast({
        description: "Please log in to save favorites",
        duration: 2000,
      });
      return;
    }
    
    try {
      const newState = await toggleFavorite(listing.id, user.id);
      setIsFavorited(newState);
      toast({
        description: newState ? "Saved to favorites" : "Removed from favorites",
        duration: 2000,
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        description: "Failed to update favorites",
        duration: 2000,
      });
    }
  };

  const formatPrice = (price?: number) => {
    if (!price) return null;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const { language } = useLanguage();
  const langKey = language.toLowerCase() as 'en' | 'ti';
  
  const categoryName = TAXONOMY[listing.category as keyof typeof TAXONOMY]?.name[langKey] || listing.category;
  const subcategoryName = listing.subcategory ? (LABELS[listing.subcategory]?.[langKey] || listing.subcategory.replace(/_/g, ' ')) : null;

  // Check if contact is accessible
  const hasContactAccess = user && (
    listing.user_id === user.id || 
    (!(listing as any).contact_hidden && listing.contact_phone)
  );

  const handleContactAction = (e: React.MouseEvent, action: string) => {
    e.stopPropagation();
    
    if (action === 'message') {
      setMessageModalOpen(true);
    } else if (action === 'phone' && listing.contact_phone) {
      window.open(`tel:${listing.contact_phone}`, '_self');
    } else if (action === 'email' && (listing as any).contact_email) {
      window.open(`mailto:${(listing as any).contact_email}`, '_self');
    } else if (action === 'website' && (listing as any).website_url) {
      window.open((listing as any).website_url, '_blank');
    }
  };

  // Get all images for this listing
  const images = getListingImages(listing);
  const hasMultipleImages = images.length > 1;

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <Card 
        className="group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer bg-card border border-border/10 overflow-hidden rounded-2xl"
        onClick={() => {
          // Store current scroll position and URL for back navigation
          sessionStorage.setItem('hn.index.scrollY', String(window.scrollY));
          sessionStorage.setItem('hn.lastSearchUrl', window.location.pathname + window.location.search);
          onSelect(listing);
        }}
      >
        <CardContent className="p-0">
          {/* Vertical layout with image on top */}
          <div className="relative">
            {/* Image section */}
            <div className={`relative w-full group/image ${viewMode === "gallery" ? "h-56" : viewMode === "grid" ? "h-32" : viewMode === "list" ? "h-72 md:h-80 md:aspect-square" : "h-48"}`}>
              <ImageBox
                src={images[currentImageIndex] || images[0]}
                alt={listing.title}
                className="h-full w-full object-cover rounded-t-lg"
              />
              
              {/* Navigation arrows for multiple images */}
              {hasMultipleImages && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-black/50 hover:bg-black/70 rounded-full opacity-0 group-hover/image:opacity-100 transition-opacity"
                    onClick={handlePrevImage}
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-4 h-4 text-white" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-black/50 hover:bg-black/70 rounded-full opacity-0 group-hover/image:opacity-100 transition-opacity"
                    onClick={handleNextImage}
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-4 h-4 text-white" />
                  </Button>
                  
                  {/* Image dots indicator */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                    {images.map((_, index) => (
                      <div
                        key={index}
                        className={`w-1.5 h-1.5 rounded-full transition-colors ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
              
              {listing.price && (
                <div className="hidden md:block absolute top-2 left-2 z-10">
                  <Badge className="bg-black/70 text-white text-sm px-2 py-1 font-bold">
                    {formatPrice(listing.price)}
                  </Badge>
                </div>
              )}
              
              {viewMode !== "grid" && viewMode !== "gallery" && (
                <div className="absolute top-3 left-3 md:hidden">
                  <Badge className="bg-orange-500 text-white text-xs px-3 py-1 font-semibold rounded-full">
                    {formatDate(listing.createdAt || new Date(listing.created_at).getTime())}
                  </Badge>
                </div>
              )}
              
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 z-10 h-9 w-9 bg-white/90 hover:bg-white rounded-full backdrop-blur"
                onClick={handleFavoriteToggle}
                aria-label={isFavorited ? "Remove from favorites" : "Save to favorites"}
              >
                <Heart 
                  className={`w-5 h-5 transition-colors ${isFavorited ? 'fill-black text-black' : 'text-black'}`}
                  strokeWidth={1.8}
                />
              </Button>
            </div>
            
            {/* Content section below image */}
            <div className={`space-y-1 ${(viewMode === "grid" || viewMode === "gallery") ? "p-2" : "p-4"}`}>
              {/* Desktop layout - clean and minimal */}
              <div className="hidden md:block">
                {/* Title in one line with truncation */}
                <h3 className="text-sm font-medium text-foreground line-clamp-1 leading-tight">
                  {listing.title}
                </h3>
                
                {/* City/Country and time on same line */}
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span className="truncate">
                    {listing.city}{listing.country && `, ${listing.country}`}
                  </span>
                  <span className="ml-2 flex-shrink-0">
                    {formatDate(listing.createdAt || new Date(listing.created_at).getTime())}
                  </span>
                </div>
              </div>

              {/* Mobile layout - original design */}
              <div className="md:hidden">
                {(viewMode === "grid" || viewMode === "gallery") ? (
                  // Grid view layout for mobile
                  <>
                    {/* Title in one line with truncation */}
                    <h3 className="text-sm font-medium text-foreground line-clamp-1 leading-tight">
                      {listing.title}
                    </h3>
                    
                    {/* City/Country and time on same line */}
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span className="truncate">
                        {listing.city}{listing.country && `, ${listing.country}`}
                      </span>
                      <span className="ml-2 flex-shrink-0">
                        {formatDate(listing.createdAt || new Date(listing.created_at).getTime())}
                      </span>
                    </div>
                  </>
                ) : (
                  // Original layout for other views
                  <>
                    {/* Price */}
                    {listing.price && (
                      <div className="text-2xl font-extrabold tracking-tight text-foreground">
                        {formatPrice(listing.price)}
                      </div>
                    )}
                    
                    {/* Details */}
                    <div className="text-sm text-muted-foreground">
                      {listing.subcategory || "No category"}
                    </div>
                    
                    {/* Title/Address */}
                    <h3 className="text-[15px] text-foreground line-clamp-1 leading-tight">
                      {listing.title}
                    </h3>
                    
                    {/* Location */}
                    <div className="text-xs text-muted-foreground">
                      {listing.city}{listing.country && `, ${listing.country}`}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Message Modal */}
      <MessageModal
        isOpen={messageModalOpen}
        onClose={() => setMessageModalOpen(false)}
        listingId={listing.id}
        listingTitle={listing.title}
        listingOwnerId={listing.user_id}
      />
    </>
  );
};

export default ListingCard;