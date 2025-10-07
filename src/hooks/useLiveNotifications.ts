import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useRealtimeSubscription } from './useRealtimeSubscription';

interface Notification {
  id: string;
  title: string;
  message?: string;
  type: 'message' | 'booking' | 'listing' | 'system' | 'favorite' | 'mention' | 'reply';
  link?: string;
  read_at?: string;
  created_at: string;
}

export function useLiveNotifications(userId: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isEnabled, setIsEnabled] = useState(
    localStorage.getItem('notifications.toast') !== 'false'
  );

  // Load initial notifications
  useEffect(() => {
    if (!userId) return;

    const loadNotifications = async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Failed to load notifications:', error);
        return;
      }

      setNotifications(data || []);
      setUnreadCount(data?.filter(n => !n.read_at).length || 0);
    };

    loadNotifications();
  }, [userId]);

  // Subscribe to new notifications
  useRealtimeSubscription({
    table: 'notifications',
    filter: `user_id=eq.${userId}`,
    event: 'INSERT',
    onInsert: (payload) => {
      const newNotification = payload.new as Notification;
      
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);

      // Show toast if enabled
      if (isEnabled) {
        showNotificationToast(newNotification);
      }

      // Play sound
      playNotificationSound();
    },
  });

  // Subscribe to notification updates (mark as read)
  useRealtimeSubscription({
    table: 'notifications',
    filter: `user_id=eq.${userId}`,
    event: 'UPDATE',
    onUpdate: (payload) => {
      const updated = payload.new as Notification;
      
      setNotifications(prev =>
        prev.map(n => n.id === updated.id ? updated : n)
      );

      if (updated.read_at) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    },
  });

  const markAsRead = useCallback(async (notificationId: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('id', notificationId);

    if (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    const { error } = await supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('user_id', userId)
      .is('read_at', null);

    if (error) {
      console.error('Failed to mark all as read:', error);
    } else {
      setUnreadCount(0);
    }
  }, [userId]);

  const clearAll = useCallback(async () => {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error('Failed to clear notifications:', error);
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [userId]);

  return {
    notifications,
    unreadCount,
    isEnabled,
    setIsEnabled,
    markAsRead,
    markAllAsRead,
    clearAll,
  };
}

function showNotificationToast(notification: Notification) {
  const icons = {
    message: '💬',
    booking: '📅',
    listing: '🏠',
    system: '🔔',
    favorite: '❤️',
    mention: '👤',
    reply: '↩️',
  };

  toast(notification.title, {
    description: notification.message,
    icon: icons[notification.type],
    action: notification.link ? {
      label: 'View',
      onClick: () => {
        window.location.href = notification.link!;
      },
    } : undefined,
    duration: 5000,
  });
}

function playNotificationSound() {
  const soundEnabled = localStorage.getItem('notifications.sound') !== 'false';
  
  if (!soundEnabled) return;
  
  try {
    const audio = new Audio('/notification.mp3');
    audio.volume = 0.5;
    audio.play().catch(err => console.warn('Failed to play sound:', err));
  } catch (error) {
    console.warn('Notification sound not available');
  }
}
