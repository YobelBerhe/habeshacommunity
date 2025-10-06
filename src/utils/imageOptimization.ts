export function getOptimizedImageUrl(url: string, width?: number): string {
  if (!url) return '';
  
  // If using Supabase Storage, add transformation params
  if (url.includes('supabase')) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}width=${width || 800}&quality=80`;
  }
  
  // For external URLs, return as-is
  return url;
}

export function generateSrcSet(url: string): string {
  if (!url) return '';
  
  const widths = [320, 640, 768, 1024, 1280];
  return widths
    .map(w => `${getOptimizedImageUrl(url, w)} ${w}w`)
    .join(', ');
}

export const imageSizes = {
  thumbnail: '(max-width: 640px) 100vw, 320px',
  card: '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw',
  hero: '100vw',
  avatar: '(max-width: 640px) 96px, 128px',
};
