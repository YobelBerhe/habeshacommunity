import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ZoomIn, ZoomOut } from "lucide-react";

interface ImageCropperProps {
  imageUrl: string;
  onCropComplete: (croppedImage: Blob) => void;
  onCancel: () => void;
}

export const ImageCropper = ({ imageUrl, onCropComplete, onCancel }: ImageCropperProps) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCrop = async () => {
    if (!imageRef.current || !containerRef.current) return;

    const canvas = document.createElement('canvas');
    const size = 400;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    const img = imageRef.current;
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();

    // Calculate the source coordinates
    const scaleRatio = img.naturalWidth / (img.width * scale);
    const sourceX = (-position.x) * scaleRatio;
    const sourceY = (-position.y) * scaleRatio;
    const sourceSize = containerRect.width * scaleRatio;

    // Draw circular crop
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(
      img,
      sourceX,
      sourceY,
      sourceSize,
      sourceSize,
      0,
      0,
      size,
      size
    );

    canvas.toBlob((blob) => {
      if (blob) {
        onCropComplete(blob);
      }
    }, 'image/jpeg', 0.9);
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Position Your Photo</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div
            ref={containerRef}
            className="relative w-64 h-64 mx-auto overflow-hidden rounded-full bg-muted cursor-move border-4 border-primary/20"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img
              ref={imageRef}
              src={imageUrl}
              alt="Crop preview"
              className="absolute pointer-events-none select-none"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transformOrigin: '0 0',
                maxWidth: 'none',
              }}
              draggable={false}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ZoomOut className="w-4 h-4 text-muted-foreground" />
              <Slider
                value={[scale]}
                onValueChange={(values) => setScale(values[0])}
                min={0.5}
                max={3}
                step={0.1}
                className="flex-1"
              />
              <ZoomIn className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Drag to reposition • Use slider to zoom
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleCrop}>
            Save Photo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
