// src/components/ListingCardHorizontal.tsx
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ListingLite } from '@/lib/trending';
import { fallbackImage } from '@/lib/trending';
import { timeAgo } from '@/lib/time';

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
      className="w-full snap-start rounded-lg overflow-hidden bg-card border hover:shadow-lg transition-all duration-200 cursor-pointer group"
    >
      {/* Horizontal layout similar to reference */}
      <div className="flex h-28">
        {/* Image section */}
        <div className="relative w-32 flex-shrink-0">
          <img 
            src={img} 
            alt={item.title} 
            className="h-full w-full object-cover rounded-l-lg group-hover:scale-105 transition-transform duration-200" 
          />
          
          {/* Time badge */}
          <div className="absolute top-2 left-2">
            <span className="text-xs px-2 py-1 rounded bg-red-500 text-white font-medium">
              {timeAgo(new Date(item.created_at).getTime())}
            </span>
          </div>
        </div>
        
        {/* Content section */}
        <div className="flex-1 p-3 flex flex-col justify-between relative">
          {/* Top section */}
          <div className="space-y-1">
            {/* Price */}
            {price != null && (
              <div className="text-lg font-bold text-foreground">
                ${price.toLocaleString()}
              </div>
            )}
            
            {/* Details */}
            <div className="text-sm text-muted-foreground">
              2 bds | 1 ba | 875 sqft | Active
            </div>
            
            {/* Title/Address */}
            <div className="text-sm font-semibold line-clamp-1 text-foreground">
              {item.title}
            </div>
            
            {/* Location */}
            <div className="text-xs text-muted-foreground">
              {item.city && item.country ? `${item.city}, ${item.country}` : item.city || item.country || ''}
            </div>
          </div>
          
          {/* Big heart in top right corner */}
          <button
            type="button"
            onClick={handleSaveClick}
            className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center hover:bg-muted/50 rounded transition-colors"
          >
            <Heart className={`w-6 h-6 ${saved ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function HorizontalRail({ items }: { items: ListingLite[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollByPage = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.9 * dir;
    el.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <div className="relative group">
      {/* Desktop arrow buttons */}
      <button
        type="button"
        onClick={() => scrollByPage(-1)}
        className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full w-9 h-9 items-center justify-center bg-background/80 border shadow hover:bg-background transition opacity-0 group-hover:opacity-100"
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div
        ref={scrollerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide snap-x pb-2"
      >
        {items.map(item => (
          <ListingCardHorizontal key={item.id} item={item} />
        ))}
      </div>

      <button
        type="button"
        onClick={() => scrollByPage(1)}
        className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full w-9 h-9 items-center justify-center bg-background/80 border shadow hover:bg-background transition opacity-0 group-hover:opacity-100"
        aria-label="Scroll right"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}