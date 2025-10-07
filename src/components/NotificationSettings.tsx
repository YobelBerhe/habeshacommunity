import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useDesktopNotifications } from '@/hooks/useDesktopNotifications';
import { Bell, BellOff, Volume2, VolumeX } from 'lucide-react';

export function NotificationSettings() {
  const [soundEnabled, setSoundEnabled] = useState(
    localStorage.getItem('notifications.sound') !== 'false'
  );
  const [toastEnabled, setToastEnabled] = useState(
    localStorage.getItem('notifications.toast') !== 'false'
  );

  const { permission, requestPermission, isSupported } = useDesktopNotifications();

  const handleSoundToggle = (enabled: boolean) => {
    setSoundEnabled(enabled);
    localStorage.setItem('notifications.sound', String(enabled));
  };

  const handleToastToggle = (enabled: boolean) => {
    setToastEnabled(enabled);
    localStorage.setItem('notifications.toast', String(enabled));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notification Preferences
        </h3>
      </div>

      {/* Desktop Notifications */}
      {isSupported && (
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-0.5">
            <Label className="text-base">Desktop Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Show notifications even when tab is not active
            </p>
          </div>
          
          {permission === 'granted' ? (
            <div className="flex items-center gap-2 text-green-600">
              <Bell className="w-4 h-4" />
              <span className="text-sm font-medium">Enabled</span>
            </div>
          ) : permission === 'denied' ? (
            <div className="flex items-center gap-2 text-red-600">
              <BellOff className="w-4 h-4" />
              <span className="text-sm font-medium">Blocked</span>
            </div>
          ) : (
            <Button
              size="sm"
              onClick={requestPermission}
            >
              Enable
            </Button>
          )}
        </div>
      )}

      {/* In-app Toast Notifications */}
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="space-y-0.5">
          <Label htmlFor="toast-notifications" className="text-base">
            In-app Notifications
          </Label>
          <p className="text-sm text-muted-foreground">
            Show toast notifications within the app
          </p>
        </div>
        <Switch
          id="toast-notifications"
          checked={toastEnabled}
          onCheckedChange={handleToastToggle}
        />
      </div>

      {/* Sound Notifications */}
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="space-y-0.5">
          <Label htmlFor="sound-notifications" className="text-base flex items-center gap-2">
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            Notification Sounds
          </Label>
          <p className="text-sm text-muted-foreground">
            Play sound when receiving notifications
          </p>
        </div>
        <Switch
          id="sound-notifications"
          checked={soundEnabled}
          onCheckedChange={handleSoundToggle}
        />
      </div>

      {/* Notification Types */}
      <div className="space-y-3">
        <Label className="text-base">Notify me about:</Label>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <Label htmlFor="messages" className="font-normal cursor-pointer">
              New messages
            </Label>
            <Switch id="messages" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <Label htmlFor="bookings" className="font-normal cursor-pointer">
              Booking updates
            </Label>
            <Switch id="bookings" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <Label htmlFor="listings" className="font-normal cursor-pointer">
              New listings in saved searches
            </Label>
            <Switch id="listings" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <Label htmlFor="marketing" className="font-normal cursor-pointer">
              Marketing updates
            </Label>
            <Switch id="marketing" />
          </div>
        </div>
      </div>
    </div>
  );
}
