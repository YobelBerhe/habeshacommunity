import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Calendar, Star } from "lucide-react";
import { Listing } from "@/types";
import { TAXONOMY, LABELS } from "@/lib/taxonomy";
import { toggleFavorite, fetchFavorites } from "@/repo/favorites";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/store/auth";
import ImageBox from "./ImageBox";

interface ListingCardProps {
  listing: Listing;
  onSelect: (listing: Listing) => void;
  showJustPosted?: boolean;
}

const ListingCard = ({ listing, onSelect, showJustPosted }: ListingCardProps) => {
  const [isFavorited, setIsFavorited] = useState(false);
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

  const categoryName = TAXONOMY[listing.category as keyof typeof TAXONOMY]?.name.en || listing.category;
  const subcategoryName = listing.subcategory ? (LABELS[listing.subcategory]?.en || listing.subcategory.replace(/_/g, ' ')) : null;

  return (
    <Card 
      className="group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:scale-[1.02] cursor-pointer bg-gradient-card border-border/50"
      onClick={() => onSelect(listing)}
    >
      <CardContent className="p-0">
        {/* Image */}
        <div className="relative group-hover:scale-105 transition-transform duration-300">
          <ImageBox
            src={(listing as any).photos?.[0] || (listing as any).images?.[0]}
            alt={listing.title}
            className="rounded-t-lg"
          />
          
          {/* Overlay actions */}
          <div className="absolute top-3 right-3 flex gap-2">
            {showJustPosted && (
              <Badge className="bg-green-500 text-white border-0 animate-pulse">
                Posted just now
              </Badge>
            )}
            {listing.featured && (
              <Badge className="bg-gradient-primary text-primary-foreground border-0">
                <Star className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 bg-white/80 hover:bg-white/90 backdrop-blur-sm"
              onClick={handleFavoriteToggle}
              aria-label={isFavorited ? "Remove from favorites" : "Save to favorites"}
            >
              <Heart 
                className={`w-4 h-4 transition-colors ${isFavorited ? 'fill-red-500 text-red-500' : 'text-muted-foreground hover:text-red-500'}`} 
              />
            </Button>
          </div>

          {/* Price overlay */}
          {listing.price && (
            <div className="absolute bottom-3 left-3">
              <Badge className="bg-gradient-primary text-primary-foreground border-0 font-bold text-sm">
                {formatPrice(listing.price)}
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Title and Category */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
              {listing.title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{categoryName}</span>
              {subcategoryName && (
                <>
                  <span>•</span>
                  <span>{subcategoryName}</span>
                </>
              )}
            </div>
          </div>

          {/* Description */}
          {listing.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {listing.description}
            </p>
          )}

          {/* Tags */}
          {listing.tags && listing.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {listing.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
              {listing.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{listing.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span>{listing.city}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(listing.createdAt || 0)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ListingCard;