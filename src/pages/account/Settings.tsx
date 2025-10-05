import { useEffect, useState, useRef } from 'react';
import { User, Save, Camera, X } from 'lucide-react';
import { useAuth } from '@/store/auth';
import { supabase } from '@/integrations/supabase/client';
import MentorHeader from '@/components/MentorHeader';
import { toast } from 'sonner';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import imageCompression from 'browser-image-compression';
import { ImageCropper } from '@/components/ImageCropper';
import { EmailNotificationToggle } from '@/components/EmailNotificationToggle';

export default function AccountSettings() {
  const [displayName, setDisplayName] = useState('');
  const [city, setCity] = useState('');
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
          <div className="text-center">Loading your settings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MentorHeader title="Account Settings" backPath="/" />
      
      <div className="container mx-auto px-4 py-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-primary rounded-2xl p-8 text-white mb-6 shadow-elegant">
          <h2 className="text-3xl font-bold mb-2">Account Settings</h2>
          <p className="text-white/80">Manage your profile and preferences</p>
        </div>

        <div className="space-y-6">
          {/* Profile Photo Section */}
          <div className="bg-card rounded-xl shadow-md border border-border p-6">
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <Camera className="w-6 h-6" />
              Profile Photo
            </h3>
            
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-background shadow-lg">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback className="bg-gradient-match text-white text-4xl">
                    {user?.email?.charAt(0).toUpperCase() || 'A'}
                  </AvatarFallback>
                </Avatar>
                {avatarUrl && (
                  <button
                    onClick={handleRemovePhoto}
                    disabled={saving}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-destructive rounded-full flex items-center justify-center shadow-lg hover:bg-destructive/90 transition-colors"
                  >
                    <X className="w-4 h-4 text-destructive-foreground" />
                  </button>
                )}
              </div>
              
              <div className="flex flex-col gap-3">
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
                  className="px-6 py-3 bg-gradient-primary text-white rounded-xl font-semibold hover:shadow-elegant transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  <Camera className="w-5 h-5" />
                  {uploading ? 'Uploading...' : 'Upload New Photo'}
                </button>
                <p className="text-sm text-muted-foreground">
                  JPG, PNG or GIF. Max size 5MB.
                </p>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="bg-card rounded-xl shadow-md border border-border p-6">
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <User className="w-6 h-6" />
              Profile Information
            </h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={user?.email || ''} 
                  disabled 
                  className="w-full px-4 py-3 bg-muted border-2 border-border rounded-xl text-muted-foreground"
                />
                <p className="text-xs text-muted-foreground mt-2">Your email cannot be changed</p>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Display Name</label>
                <input 
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your display name"
                  className="w-full px-4 py-3 border-2 border-border rounded-xl focus:border-primary focus:outline-none transition-colors bg-background text-foreground"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  This is how your name will appear to others
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  City Location
                </label>
                <input 
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g., Asmara, Oakland, Frankfurt"
                  className="w-full px-4 py-3 border-2 border-border rounded-xl focus:border-primary focus:outline-none transition-colors bg-background text-foreground"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Your city will be shown on the live activity map
                </p>
              </div>
            </div>
            
            <button 
              onClick={handleSave}
              disabled={saving}
              className="mt-6 w-full px-6 py-3 bg-gradient-primary text-white rounded-xl font-bold hover:shadow-elegant transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>

          {/* Notifications */}
          <div className="bg-card rounded-xl shadow-md border border-border p-6">
            <EmailNotificationToggle />
          </div>

          {/* Security Notice */}
          <div className="bg-gradient-subtle rounded-xl p-6 border border-border">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-foreground mb-1">Your Data is Secure</h4>
                <p className="text-sm text-muted-foreground">
                  We take your privacy seriously. Your information is encrypted and never shared with third parties.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}