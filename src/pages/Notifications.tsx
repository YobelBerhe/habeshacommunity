import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import MentorHeader from '@/components/MentorHeader';

type NotificationRow = {
  id: string;
  title: string;
  body?: string | null;
  link?: string | null;
  read_at?: string | null;
  created_at: string;
  type: string;
};

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    setLoading(true);
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    setUser(currentUser);
    
    if (!currentUser) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', currentUser.id)
      .order('created_at', { ascending: false })
      .limit(200);
    
    setNotifications(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const markAllAsRead = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('mark-notifications', {
        body: { action: 'mark-all' }
      });

      if (error) throw error;

      setNotifications(prev => prev.map(n => ({
        ...n,
        read_at: n.read_at ?? new Date().toISOString()
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

      setNotifications(prev => prev.map(n => 
        n.id === id ? { ...n, read_at: new Date().toISOString() } : n
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  };

  const handleNotificationClick = (notification: NotificationRow) => {
    if (!notification.read_at) {
      markOneAsRead(notification.id);
    }
    
    if (notification.link) {
      navigate(notification.link);
    }
  };

  const unreadCount = notifications.filter(n => !n.read_at).length;

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              Please log in to view your notifications.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MentorHeader title="Notifications" backPath="/" />
      <div className="container mx-auto px-4 pt-4 pb-8">
        {unreadCount > 0 && (
          <div className="mb-4 flex justify-end">
            <Button onClick={markAllAsRead} variant="outline" size="sm">
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark all read
            </Button>
          </div>
        )}

        {loading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">Loading notifications...</div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <div>No notifications yet.</div>
                  <div className="text-sm mt-1">We'll notify you when there's something new!</div>
                </div>
              </CardContent>
            </Card>
          ) : (
            notifications.map(notification => (
              <Card 
                key={notification.id} 
                className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                  !notification.read_at ? 'border-l-4 border-l-blue-500 bg-accent/20' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{notification.title}</h3>
                        {!notification.read_at && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      
                      {notification.body && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.body}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {notification.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(notification.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
        )}
      </div>
    </div>
  );
}