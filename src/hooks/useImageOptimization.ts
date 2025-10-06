import { useState, useEffect } from 'react';

interface ImageOptimizationOptions {
  src: string;
  width?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
}

/**
 * Hook for optimizing images with lazy loading and format selection
 */
export function useImageOptimization({
  src,
  width,
  quality = 80,
  format = 'webp',
}: ImageOptimizationOptions) {
  const [optimizedSrc, setOptimizedSrc] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // For Supabase storage URLs, we can add transformation params
    if (src.includes('supabase.co/storage')) {
      const url = new URL(src);
      const params = new URLSearchParams();
      
      if (width) params.append('width', width.toString());
      params.append('quality', quality.toString());
      if (format) params.append('format', format);
      
      url.search = params.toString();
      setOptimizedSrc(url.toString());
    } else {
      // For other URLs, use as-is
      setOptimizedSrc(src);
    }
  }, [src, width, quality, format]);

  useEffect(() => {
    if (!optimizedSrc) return;

    const img = new Image();
    img.onload = () => setIsLoaded(true);
    img.onerror = () => setError('Failed to load image');
    img.src = optimizedSrc;
  }, [optimizedSrc]);

  return {
    src: optimizedSrc,
    isLoaded,
    error,
    placeholder: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23eee" width="400" height="300"/%3E%3C/svg%3E',
  };
}
