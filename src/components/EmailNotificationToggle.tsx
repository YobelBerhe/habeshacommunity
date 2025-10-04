import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/store/auth';
import { toast } from 'sonner';
import { Mail } from 'lucide-react';

export function EmailNotificationToggle() {
  const { user } = useAuth();
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPreference();
  }, [user]);

  const loadPreference = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('email_notifications_enabled')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setEnabled(data?.email_notifications_enabled ?? true);
    } catch (error) {
      console.error('Error loading email preference:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (checked: boolean) => {
    if (!user) return;

    setEnabled(checked);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ email_notifications_enabled: checked })
        .eq('id', user.id);

      if (error) throw error;

      toast.success(
        checked 
          ? 'Email notifications enabled' 
          : 'Email notifications disabled'
      );
    } catch (error) {
      console.error('Error updating email preference:', error);
      toast.error('Failed to update preference');
      setEnabled(!checked); // Revert on error
    }
  };

  if (!user || loading) return null;

  return (
    <div className="flex items-center justify-between space-x-4 rounded-lg border border-border bg-card p-4">
      <div className="flex items-center space-x-3">
        <Mail className="h-5 w-5 text-muted-foreground" />
        <div className="space-y-0.5">
          <Label htmlFor="email-notifications" className="text-base cursor-pointer">
            Email Notifications
          </Label>
          <p className="text-sm text-muted-foreground">
            Receive emails when you get new messages (only when you're offline)
          </p>
        </div>
      </div>
      <Switch
        id="email-notifications"
        checked={enabled}
        onCheckedChange={handleToggle}
      />
    </div>
  );
}
