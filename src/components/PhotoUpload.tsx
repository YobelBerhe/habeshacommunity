import { useState, useRef } from 'react';
import { Camera, X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { uploadListingImages } from '@/utils/upload';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/store/auth';
import ImageBox from './ImageBox';

interface PhotoUploadProps {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  maxPhotos?: number;
  bucketName?: string;
}

export default function PhotoUpload({ 
  photos, 
  onPhotosChange, 
  maxPhotos = 6,
  bucketName = 'mentor-photos'
}: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('🔄 Photo upload started');
    const files = Array.from(event.target.files || []);
    console.log('📁 Files selected:', files.length, files.map(f => f.name));
    
    if (!files.length) {
      console.log('❌ No files selected');
      return;
    }
    
    if (!user) {
      console.log('❌ No authenticated user');
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to upload photos',
        variant: 'destructive',
      });
      return;
    }
    
    console.log('👤 User authenticated:', user.id);

    const remainingSlots = maxPhotos - photos.length;
    if (files.length > remainingSlots) {
      console.log('❌ Too many files:', files.length, 'remaining slots:', remainingSlots);
      toast({
        title: 'Too many photos',
        description: `You can only upload ${remainingSlots} more photo(s)`,
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    try {
      console.log('🚀 Starting upload to bucket:', bucketName);
      const newUrls = await uploadListingImages(files, user.id, bucketName);
      console.log('✅ Upload successful, URLs:', newUrls);
      onPhotosChange([...photos, ...newUrls]);
      toast({
        title: 'Success',
        description: `${files.length} photo(s) uploaded successfully`,
      });
    } catch (error) {
      console.error('❌ Error uploading photos:', error);
      toast({
        title: 'Upload failed',
        description: `Failed to upload photos: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    onPhotosChange(newPhotos);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Photos *</label>
        <span className="text-xs text-muted-foreground">
          ({photos.length}/{maxPhotos})
        </span>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* Existing photos */}
        {photos.map((photo, index) => (
          <div key={index} className="relative group">
            <ImageBox
              src={photo}
              alt={`Photo ${index + 1}`}
              className="aspect-square h-32"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removePhoto(index)}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        ))}
        
        {/* Upload button */}
        {photos.length < maxPhotos && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="aspect-square h-32 border-2 border-dashed border-border hover:border-primary/50 rounded-lg flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            {uploading ? (
              <Upload className="w-6 h-6 animate-spin" />
            ) : (
              <Camera className="w-6 h-6" />
            )}
            <span className="text-xs">
              {uploading ? 'Uploading...' : 'Add Photo'}
            </span>
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <p className="text-xs text-muted-foreground">
        Upload up to {maxPhotos} photos. First photo will be your main profile picture.
      </p>
    </div>
  );
}
