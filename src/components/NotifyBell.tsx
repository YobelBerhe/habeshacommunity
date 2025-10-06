import React, { useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Bell, MessageCircle, Calendar, Star, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

type Notification = {
  id: string;
  type: string;
  title: string;
  body?: string | null;
  link?: string | null;
  read_at?: string | null;
  created_at: string;
};

export default function NotifyBell() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);
  const unread = useMemo(() => items.filter(i => !i.read_at).length, [items]);
  const menuRef = useRef<HTMLDivElement>(null);

  const loadNotifications = async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    setUser(currentUser);
    if (!currentUser) return;

    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', currentUser.id)
      .is('read_at', null)
      .order('created_at', { ascending: false })
      .limit(50);
    
    setItems(data || []);
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  // Realtime subscription
  useEffect(() => {
    let channel: any;
    
    const setupRealtime = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) return;

      channel = supabase
        .channel(`notifications:${currentUser.id}`)
        .on('postgres_changes',
          { 
            event: '*', 
            schema: 'public', 
            table: 'notifications', 
            filter: `user_id=eq.${currentUser.id}` 
          },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              const newNotif = payload.new as Notification;
              // Only add if it's unread
              if (!newNotif.read_at) {
                setItems(prev => [newNotif, ...prev].slice(0, 50));
                toast.info('New notification received');
              }
            } else if (payload.eventType === 'UPDATE') {
              const updatedNotif = payload.new as Notification;
              // Remove from list if it was marked as read
              if (updatedNotif.read_at) {
                setItems(prev => prev.filter(i => i.id !== updatedNotif.id));
              }
            }
          }
        ).subscribe();
    };

    setupRealtime();
    
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!open) return;
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const markAllAsRead = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('mark-notifications', {
        body: { action: 'mark-all' }
      });

      if (error) throw error;

      // Clear all items since they're all now read
      setItems([]);
      
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('Failed to mark notifications as read');
    }
  };

  const markOneAsRead = async (id: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('mark-notifications', {
        body: { action: 'mark-one', notificationId: id }
      });

      if (error) throw error;

      // Remove the notification from the list since it's now read
      setItems(prev => prev.filter(i => i.id !== id));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageCircle className="h-4 w-4 text-blue-500" />;
      case 'booking':
        return <Calendar className="h-4 w-4 text-green-500" />;
      case 'review':
        return <Star className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read_at) {
      markOneAsRead(notification.id);
    }
    
    if (notification.link) {
      navigate(notification.link);
    }
    
    setOpen(false);
  };

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(o => !o)}
        className="relative p-2 rounded-full hover:bg-muted transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-4 min-w-[16px] px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] leading-[16px] text-center font-medium">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed left-1/2 -translate-x-1/2 top-14 w-[92vw] max-h-[70vh] overflow-auto rounded-lg border bg-popover shadow-lg z-[10000] sm:absolute sm:top-auto sm:right-0 sm:left-auto sm:translate-x-0 sm:mt-2 sm:w-96">

          <div className="px-4 py-3 flex items-center justify-between border-b bg-background sticky top-0">
            <div className="font-semibold text-sm">Notifications</div>
            {unread > 0 && (
              <button 
                onClick={markAllAsRead} 
                className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                Mark all read
              </button>
            )}
          </div>
          
          <div className="divide-y">
            {items.length === 0 && (
              <div className="p-8 text-sm text-muted-foreground text-center">
                <Bell className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No notifications yet</p>
                <p className="text-xs mt-1">We'll notify you when something happens</p>
              </div>
            )}
            
            {items.map(notification => (
              <div 
                key={notification.id} 
                className={`p-3 hover:bg-muted/50 cursor-pointer transition-colors relative ${
                  !notification.read_at ? 'bg-accent/20' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium line-clamp-1">{notification.title}</p>
                      {!notification.read_at && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                      )}
                    </div>
                    {notification.body && (
                      <p className="text-xs mt-0.5 text-muted-foreground line-clamp-2">
                        {notification.body}
                      </p>
                    )}
                    <p className="text-[11px] mt-1 text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="px-4 py-3 text-center border-t bg-background sticky bottom-0">
            <button 
              onClick={() => {
                navigate('/notifications');
                setOpen(false);
              }}
              className="text-xs text-primary hover:underline font-medium"
            >
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}