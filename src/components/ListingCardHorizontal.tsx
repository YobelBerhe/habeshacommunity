// src/components/ListingCardHorizontal.tsx
import { Heart } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ListingLite } from '@/lib/trending';
import { fallbackImage } from '@/lib/trending';

export function ListingCardHorizontal({ item }: { item: ListingLite }) {
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();
  const img = item.images?.[0] || fallbackImage;
  
  const price = item.price_cents ? item.price_cents / 100 : null;

  const handleCardClick = () => {
    navigate(`/l/${item.id}`);
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSaved(!saved);
  };

  return (
    <div
      onClick={handleCardClick}
      className="min-w-[260px] max-w-[260px] snap-start rounded-xl overflow-hidden bg-card border hover:shadow-lg transition-all duration-200 cursor-pointer group"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={img} 
          alt={item.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" 
        />
        <button
          type="button"
          onClick={handleSaveClick}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
        >
          <Heart className={`w-4 h-4 ${saved ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
        </button>
        
        {/* Category pill */}
        <div className="absolute bottom-3 left-3">
          <span className="text-xs px-2 py-1 rounded-full bg-background/80 backdrop-blur-sm text-foreground font-medium">
            {item.category}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-2">
        <div className="text-sm font-semibold line-clamp-2 text-foreground min-h-[2.5rem]">
          {item.title}
        </div>
        
        <div className="text-xs text-muted-foreground">
          {item.city && item.country ? `${item.city}, ${item.country}` : item.city || item.country || ''}
        </div>
        
        <div className="flex items-center justify-between pt-1">
          <span className="text-sm font-bold text-foreground">
            {price != null ? `$${price.toLocaleString()}` : ''}
          </span>
          
          {item.views && item.views > 0 && (
            <span className="text-xs text-muted-foreground">
              {item.views} views
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function HorizontalRail({ items }: { items: ListingLite[] }) {
  return (
    <div className="relative">
      <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x pb-2">
        {items.map(item => (
          <ListingCardHorizontal key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}