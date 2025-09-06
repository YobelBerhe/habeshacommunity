import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Heart, MapPin, Calendar, Star, MoreHorizontal, EyeOff, Share2, Phone, Mail, MessageSquare, Globe } from "lucide-react";
import { Listing } from "@/types";
import { TAXONOMY, LABELS } from "@/lib/taxonomy";
import { toggleFavorite, fetchFavorites } from "@/repo/favorites";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/store/auth";
import { useLanguage } from "@/store/language";
import ImageBox from "./ImageBox";
import MessageModal from "./MessageModal";

interface ListingCardProps {
  listing: Listing;
  onSelect: (listing: Listing) => void;
  showJustPosted?: boolean;
}

const ListingCard = ({ listing, onSelect, showJustPosted }: ListingCardProps) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
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

  return (
    <>
      <Card 
        className="group hover:shadow-lg transition-all duration-200 cursor-pointer bg-background border border-border/50 overflow-hidden"
        onClick={() => {
          // Store current scroll position and URL for back navigation
          sessionStorage.setItem('hn.index.scrollY', String(window.scrollY));
          sessionStorage.setItem('hn.lastSearchUrl', window.location.pathname + window.location.search);
          onSelect(listing);
        }}
      >
        <CardContent className="p-0">
          {/* Zillow-style elongated image */}
          <div className="relative">
            <ImageBox
              src={(listing as any).photos?.[0] || (listing as any).images?.[0]}
              alt={listing.title}
              className="rounded-t-lg h-40 w-full object-cover"
            />
            
            {/* Price overlay - top left with dark background */}
            {listing.price && (
              <div className="absolute top-2 left-2">
                <div className="bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-sm font-bold text-white shadow-lg">
                  {formatPrice(listing.price)}
                </div>
              </div>
            )}
            
            {/* Overlay actions - top right */}
            <div className="absolute top-2 right-2 flex gap-1">
              {showJustPosted && (
                <Badge className="bg-green-500 text-white border-0 animate-pulse text-xs px-2 py-1">
                  Posted
                </Badge>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 bg-transparent hover:bg-white/10"
                onClick={handleFavoriteToggle}
                aria-label={isFavorited ? "Remove from favorites" : "Save to favorites"}
              >
                <Heart 
                  className={`w-7 h-7 transition-colors ${isFavorited ? 'fill-red-500 text-red-500' : 'text-white/90 hover:text-red-500'}`}
                  style={{
                    filter: 'drop-shadow(0 0 3px rgba(0,0,0,0.8)) drop-shadow(0 0 1px rgba(0,0,0,0.9))',
                    WebkitTextStroke: '0.5px rgba(0,0,0,0.5)'
                  }}
                />
              </Button>
            </div>

            {/* Photo count - Zillow style */}
            {((listing as any).photos?.length > 1 || (listing as any).images?.length > 1) && (
              <div className="absolute bottom-2 right-2">
                <Badge className="bg-black/70 text-white text-xs px-2 py-1 backdrop-blur-sm">
                  {(listing as any).photos?.length || (listing as any).images?.length} photos
                </Badge>
              </div>
            )}
          </div>

          {/* Compact Craigslist-style content */}
          <div className="p-2.5 space-y-1">
            {/* Title - compact */}
            <h3 className="font-medium text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2">
              {listing.title}
            </h3>

            {/* Location and time - simple line */}
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span className="line-clamp-1">
                {listing.city}{listing.country && `, ${listing.country}`}
              </span>
              <span className="text-[10px] whitespace-nowrap">
                {formatDate(listing.createdAt || 0)}
              </span>
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