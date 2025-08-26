import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Calendar, Star } from "lucide-react";
import { Listing } from "@/types";
import { getCategoryName, getJobSubcategoryName } from "@/data/categories";

interface ListingCardProps {
  listing: Listing;
  onSelect: (listing: Listing) => void;
  onFavorite?: (listingId: string) => void;
  isFavorited?: boolean;
}

const ListingCard = ({ listing, onSelect, onFavorite, isFavorited }: ListingCardProps) => {
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

  const categoryName = getCategoryName(listing.category);
  const subcategoryName = listing.jobSubcategory ? getJobSubcategoryName(listing.jobSubcategory) : null;

  return (
    <Card 
      className="group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:scale-[1.02] cursor-pointer bg-gradient-card border-border/50"
      onClick={() => onSelect(listing)}
    >
      <CardContent className="p-0">
        {/* Image */}
        <div className="aspect-[16/10] relative overflow-hidden rounded-t-lg bg-gradient-to-br from-muted to-muted/50">
          {listing.images && listing.images[0] ? (
            <img 
              src={listing.images[0]} 
              alt={listing.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-xl">📷</span>
                </div>
                <p className="text-sm">No image</p>
              </div>
            </div>
          )}
          
          {/* Overlay actions */}
          <div className="absolute top-3 right-3 flex gap-2">
            {listing.featured && (
              <Badge className="bg-gradient-primary text-primary-foreground border-0">
                <Star className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
            {onFavorite && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 bg-white/80 hover:bg-white/90 backdrop-blur-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onFavorite(listing.id);
                }}
              >
                <Heart 
                  className={`w-4 h-4 ${isFavorited ? 'fill-destructive text-destructive' : 'text-muted-foreground'}`} 
                />
              </Button>
            )}
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
            <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
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
              <span>{formatDate(listing.createdAt)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ListingCard;