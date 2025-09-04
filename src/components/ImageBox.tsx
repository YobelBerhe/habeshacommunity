import { Camera } from "lucide-react";
import { useState } from "react";

interface ImageBoxProps {
  src?: string;
  alt: string;
  className?: string;
}

const ImageBox = ({ src, alt, className = "" }: ImageBoxProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className={`relative overflow-hidden rounded-lg bg-muted ${className.includes('h-') ? '' : 'aspect-[4/3]'} ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-primary/10 rounded-full flex items-center justify-center">
              <Camera className="w-6 h-6" />
            </div>
            <p className="text-sm">No image</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className.includes('rounded-t-lg') ? 'rounded-t-lg' : 'rounded-lg'} bg-muted ${className.includes('h-') ? '' : 'aspect-[4/3]'} ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 animate-pulse bg-muted" />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-300"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        style={{ opacity: isLoading ? 0 : 1 }}
      />
    </div>
  );
};

export default ImageBox;