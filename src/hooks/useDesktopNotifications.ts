import { useEffect, useState } from 'react';

export function useDesktopNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      console.warn('Browser does not support notifications');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return false;
    }
  };

  const showNotification = (title: string, options?: NotificationOptions) => {
    if (permission !== 'granted') {
      console.warn('Notification permission not granted');
      return;
    }

    try {
      const notification = new Notification(title, {
        icon: '/lovable-uploads/d2261896-ec85-45d6-8ecf-9928fb132004.png',
        badge: '/lovable-uploads/d2261896-ec85-45d6-8ecf-9928fb132004.png',
        ...options,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      return notification;
    } catch (error) {
      console.error('Failed to show notification:', error);
    }
  };

  return {
    permission,
    isSupported: 'Notification' in window,
    requestPermission,
    showNotification,
  };
}
