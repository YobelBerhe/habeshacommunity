// src/components/ListingCardHorizontal.tsx
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ListingLite } from '@/lib/trending';
import { fallbackImage } from '@/lib/trending';
import { timeAgo } from '@/lib/time';

export function ListingCardHorizontal({ item }: { item: ListingLite }) {
  const [saved, setSaved] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();
  const images = item.images || [fallbackImage];
  const hasMultipleImages = images.length > 1;
  
  const price = item.price_cents ? item.price_cents / 100 : null;

  const handleCardClick = () => {
    navigate(`/l/${item.id}`);
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSaved(!saved);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      onClick={handleCardClick}
      className="w-[320px] min-w-[320px] snap-start rounded-2xl overflow-hidden bg-card border border-border/10 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
    >
      {/* Vertical layout with image on top */}
      <div className="relative">
        {/* Image section */}
        <div className="relative h-48 w-full group/image">
          <img 
            src={images[currentImageIndex]} 
            alt={item.title} 
            className="h-full w-full object-cover rounded-t-2xl" 
          />
          
          {/* Navigation arrows for multiple images */}
          {hasMultipleImages && (
            <>
              <button
                type="button"
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-black/50 hover:bg-black/70 rounded-full opacity-0 group-hover/image:opacity-100 transition-opacity"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4 text-white" />
              </button>
              <button
                type="button"
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-black/50 hover:bg-black/70 rounded-full opacity-0 group-hover/image:opacity-100 transition-opacity"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
              
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
          
          {/* Time badge */}
          <div className="absolute top-3 left-3">
            <span className="text-xs px-3 py-1 rounded-full bg-orange-500 text-white font-semibold">
              {timeAgo(new Date(item.created_at).getTime())}
            </span>
          </div>
          
          {/* Big heart in top right corner */}
          <button
            type="button"
            onClick={handleSaveClick}
            className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center transition-colors"
          >
            <Heart className={`w-5 h-5 ${saved ? 'fill-gray-800 text-white' : 'text-white'}`} strokeWidth={2.5} />
          </button>
        </div>
        
        {/* Content section below image */}
        <div className="p-4 space-y-1">
          {/* Price */}
          {price != null && (
            <div className="text-2xl font-extrabold tracking-tight text-foreground">
              ${price.toLocaleString()}
            </div>
          )}
          
          {/* Details */}
          <div className="text-sm text-muted-foreground">
            {item.subcategory || 'No category'}
          </div>
          
          {/* Title/Address */}
          <div className="text-[15px] text-foreground line-clamp-1 leading-tight">
            {item.title}
          </div>
          
          {/* Location */}
          <div className="text-xs text-muted-foreground">
            {item.city && item.country ? `${item.city}, ${item.country}` : item.city || item.country || ''}
          </div>
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