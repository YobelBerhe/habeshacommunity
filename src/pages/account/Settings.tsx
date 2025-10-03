import { useEffect, useState } from 'react';
import { Settings, User, Save } from 'lucide-react';
import { useAuth } from '@/store/auth';
import { supabase } from '@/integrations/supabase/client';
import MobileHeader from '@/components/layout/MobileHeader';
import { toast } from 'sonner';

export default function AccountSettings() {
  const [displayName, setDisplayName] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

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
      
      // Update presence with new city (commented out - RPC function not implemented)
      // if (city.trim()) {
      //   await supabase.rpc('touch_presence', { p_city: city.trim() });
      // }
      
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
        <MobileHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading your settings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MobileHeader />
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Account Settings</h1>
        </div>

        <div className="space-y-6">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Information
            </h2>
            
            <div className="space-y-4">
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
        </div>
      </div>
    </div>
  );
}