import { Link } from "react-router-dom";
import { MapPin, Phone, Globe, Calendar, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Church, ChurchWithDistance } from "@/types/church-finder";

interface ChurchCardProps {
  church: Church | ChurchWithDistance;
  showDistance?: boolean;
  onFavorite?: (churchId: number) => void;
  isFavorite?: boolean;
}

export function ChurchCard({
  church,
  showDistance = false,
  onFavorite,
  isFavorite = false,
}: ChurchCardProps) {
  const hasDistance = 'distance_meters' in church;
  const distance = hasDistance ? church.distance_km : null;

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'Orthodox':
        return 'bg-primary/10 text-primary';
      case 'Catholic':
        return 'bg-secondary/10 text-secondary';
      case 'Protestant':
        return 'bg-accent/10 text-accent';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <Link to={`/churches/${church.slug}`}>
        {church.main_image_url && (
          <div className="h-48 relative overflow-hidden">
            <img
              src={church.main_image_url}
              alt={church.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            {church.is_verified && (
              <Badge className="absolute top-3 right-3">
                ✓ Verified
              </Badge>
            )}
            {showDistance && distance && (
              <Badge className="absolute top-3 left-3 bg-background/90">
                {distance.toFixed(1)} km away
              </Badge>
            )}
          </div>
        )}
      </Link>
      
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <Link to={`/churches/${church.slug}`} className="flex-1">
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {church.name}
            </h3>
          </Link>
          {onFavorite && (
            <Button
              size="icon"
              variant="ghost"
              onClick={(e) => {
                e.preventDefault();
                onFavorite(church.id);
              }}
              className="shrink-0"
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current text-primary' : ''}`} />
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {church.denomination && (
            <Badge variant="secondary" className={getCategoryColor(church.denomination.category)}>
              {church.denomination.name}
            </Badge>
          )}
          {church.has_livestream && (
            <Badge variant="outline">🎥 Livestream</Badge>
          )}
        </div>

        <div className="space-y-1.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="line-clamp-1">
              {church.city}, {church.country}
            </span>
          </div>

          {church.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0" />
              <span className="line-clamp-1">{church.phone}</span>
            </div>
          )}

          {church.website && (
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 shrink-0" />
              <a
                href={church.website}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="line-clamp-1 hover:text-primary transition-colors"
              >
                Visit Website
              </a>
            </div>
          )}
        </div>

        {church.rating_count > 0 && (
          <div className="flex items-center gap-2 pt-2 border-t">
            <div className="flex items-center gap-1">
              <span className="text-primary">★</span>
              <span className="font-semibold">{church.rating_average.toFixed(1)}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              ({church.rating_count} reviews)
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
