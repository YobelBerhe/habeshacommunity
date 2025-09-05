import React, { useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Bell } from 'lucide-react';
import { toast } from 'sonner';

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
              setItems(prev => [payload.new as Notification, ...prev].slice(0, 50));
              toast.info('New notification received');
            } else if (payload.eventType === 'UPDATE') {
              setItems(prev => prev.map(i => 
                i.id === (payload.new as any).id ? (payload.new as Notification) : i
              ));
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

      setItems(prev => prev.map(i => ({ 
        ...i, 
        read_at: i.read_at ?? new Date().toISOString() 
      })));
      
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

      setItems(prev => prev.map(i => 
        i.id === id ? { ...i, read_at: new Date().toISOString() } : i
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read_at) {
      markOneAsRead(notification.id);
    }
    
    if (notification.link) {
      window.location.href = notification.link;
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
        <div className="absolute right-0 mt-2 w-80 max-h-[70vh] overflow-auto rounded-lg border bg-popover shadow-lg z-50">
          <div className="px-3 py-2 flex items-center justify-between border-b">
            <div className="font-medium">Notifications</div>
            {unread > 0 && (
              <button 
                onClick={markAllAsRead} 
                className="text-xs text-muted-foreground hover:text-foreground underline"
              >
                Mark all read
              </button>
            )}
          </div>
          
          <div className="divide-y">
            {items.length === 0 && (
              <div className="p-4 text-sm text-muted-foreground text-center">
                No notifications yet.
              </div>
            )}
            
            {items.map(notification => (
              <div 
                key={notification.id} 
                className={`p-3 hover:bg-muted/50 cursor-pointer transition-colors ${
                  !notification.read_at ? 'bg-accent/30' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="text-sm font-medium">{notification.title}</div>
                {notification.body && (
                  <div className="text-xs mt-0.5 text-muted-foreground line-clamp-2">
                    {notification.body}
                  </div>
                )}
                <div className="text-[11px] mt-1 text-muted-foreground">
                  {new Date(notification.created_at).toLocaleString()}
                </div>
                {!notification.read_at && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </div>
            ))}
          </div>
          
          <div className="px-3 py-2 text-center border-t">
            <a 
              href="/notifications" 
              className="text-xs text-muted-foreground hover:text-foreground underline"
              onClick={() => setOpen(false)}
            >
              View all notifications
            </a>
          </div>
        </div>
      )}
    </div>
  );
}