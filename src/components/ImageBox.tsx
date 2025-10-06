import { Camera } from "lucide-react";
import { useState } from "react";

interface ImageBoxProps {
  src?: string;
  alt: string;
  className?: string;
  showOverlay?: boolean;
}

const ImageBox = ({ src, alt, className = "", showOverlay = false }: ImageBoxProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className={`relative overflow-hidden rounded-lg bg-gradient-to-br from-muted via-muted/80 to-muted/60 ${className.includes('h-') ? '' : 'aspect-[4/3]'} ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center">
              <Camera className="w-8 h-8 text-primary/50" />
            </div>
            <p className="text-sm font-medium">No image</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className.includes('rounded-t-lg') ? 'rounded-t-lg' : 'rounded-lg'} bg-muted ${className.includes('h-') ? '' : 'aspect-[4/3]'} ${className} group`}>
      {isLoading && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-muted via-muted/80 to-muted/60" />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-500 ${
          showOverlay ? 'group-hover:scale-105' : ''
        }`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        style={{ opacity: isLoading ? 0 : 1 }}
      />
      {showOverlay && !isLoading && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
    </div>
  );
};

export default ImageBox;
