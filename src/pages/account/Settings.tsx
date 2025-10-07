import { useEffect, useState, useRef } from 'react';
import { User, Save, Camera, X } from 'lucide-react';
import { useAuth } from '@/store/auth';
import { supabase } from '@/integrations/supabase/client';
import MentorHeader from '@/components/MentorHeader';
import { toast } from 'sonner';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ImageCropper } from '@/components/ImageCropper';
import { EmailNotificationToggle } from '@/components/EmailNotificationToggle';
import { OptimizedImage } from '@/components/OptimizedImage';
import { StorageInfo } from '@/components/StorageInfo';

export default function AccountSettings() {
  const [displayName, setDisplayName] = useState('');
  const [city, setCity] = useState('');
  const [gender, setGender] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [cropperImage, setCropperImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    
    const loadProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data) {
          setDisplayName(data.display_name || '');
          setCity(data.city || '');
          setGender(data.gender || '');
          setAvatarUrl(data.avatar_url || '');
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setCropperImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    if (!user) return;

    try {
      setUploading(true);
      setCropperImage(null);

      const filePath = `${user.id}/avatar.jpg`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, croppedBlob, { 
          upsert: true,
          contentType: 'image/jpeg'
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          avatar_url: data.publicUrl,
          updated_at: new Date().toISOString()
        });

      if (updateError) throw updateError;

      setAvatarUrl(data.publicUrl);
      toast.success('Profile photo updated');
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Failed to upload photo');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCropCancel = () => {
    setCropperImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          avatar_url: null,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      setAvatarUrl('');
      toast.success('Profile photo removed');
    } catch (error) {
      console.error('Error removing photo:', error);
      toast.error('Failed to remove photo');
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          display_name: displayName.trim(),
          city: city.trim(),
          gender: gender || null,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
  return (
    <div className="min-h-screen bg-background">
      <MentorHeader title="Account Settings" backPath="/" />
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-card rounded-xl border p-6">
              <div className="h-6 w-48 bg-muted rounded animate-pulse mb-4" />
              <div className="space-y-3">
                <div className="h-12 bg-muted rounded animate-pulse" />
                <div className="h-12 bg-muted rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
  return (
    <div className="min-h-screen bg-background">
      <MentorHeader title="Account Settings" backPath="/" />
      
      <div className="container mx-auto px-4 py-6">

        <div className="space-y-6">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Profile Photo</label>
                <div className="flex items-center gap-4">
                  {avatarUrl ? (
                    <OptimizedImage
                      src={avatarUrl}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover border-4 border-background shadow-lg"
                      aspectRatio="1/1"
                    />
                  ) : (
                    <Avatar className="w-20 h-20">
                      <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                        {user?.email?.charAt(0).toUpperCase() || 'A'}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className="flex flex-col gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    {cropperImage && (
                      <ImageCropper
                        imageUrl={cropperImage}
                        onCropComplete={handleCropComplete}
                        onCancel={handleCropCancel}
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="btn-secondary flex items-center gap-2"
                    >
                      <Camera className="w-4 h-4" />
                      {uploading ? 'Uploading...' : 'Upload Photo'}
                    </button>
                    {avatarUrl && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        disabled={saving}
                        className="btn-secondary flex items-center gap-2 text-destructive hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                        Remove Photo
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input 
                  type="email" 
                  value={user?.email || ''} 
                  disabled 
                  className="field w-full bg-muted"
                />
                <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Display Name</label>
                <input 
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your display name"
                  className="field w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  City <span className="text-xs text-muted-foreground">(for live map)</span>
                </label>
                <input 
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g., Asmara, Oakland, Frankfurt"
                  className="field w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Your city will appear on the live activity map
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Gender <span className="text-xs text-muted-foreground">(for chat display)</span>
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="field w-full"
                >
                  <option value="">Prefer not to say</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                <p className="text-xs text-muted-foreground mt-1">
                  Your gender determines your username color in chat
                </p>
              </div>
            </div>
            
            <button 
              onClick={handleSave}
              disabled={saving}
              className="btn-primary mt-6 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          <EmailNotificationToggle />

          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4">App Storage</h2>
            <StorageInfo />
          </div>
        </div>
      </div>
    </div>
  );
}
