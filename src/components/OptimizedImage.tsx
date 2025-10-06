import { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
}

export function OptimizedImage({ 
  src, 
  alt, 
  className = '',
  aspectRatio = '4/3' 
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div 
        className={`bg-muted flex items-center justify-center ${className}`}
        style={{ aspectRatio }}
      >
        <span className="text-muted-foreground text-sm">No image</span>
      </div>
    );
  }

  return (
    <div className="relative" style={{ aspectRatio }}>
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-muted via-muted/80 to-muted animate-pulse" />
      )}
      
      <LazyLoadImage
        src={src}
        alt={alt}
        className={className}
        effect="blur"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setError(true);
          setIsLoading(false);
        }}
        placeholderSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23f3f4f6' width='400' height='300'/%3E%3C/svg%3E"
        style={{ aspectRatio }}
      />
    </div>
  );
}
