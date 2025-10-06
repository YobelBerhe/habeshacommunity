import { ListSkeleton } from '@/components/LoadingStates';
import { EmptyState } from '@/components/EmptyState';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import MentorHeader from '@/components/MentorHeader';
import { SwipeableCard } from '@/components/SwipeableCard';
import { PullToRefresh } from '@/components/PullToRefresh';
import { VirtualizedList } from '@/components/VirtualizedList';

type NotificationRow = {
  id: string;
  title: string;
  body?: string | null;
  link?: string | null;
  read_at?: string | null;
  created_at: string;
  type: string;
  sender_id?: string | null;
  conversation_id?: string | null;
  sender?: {
    display_name?: string;
    avatar_url?: string;
  } | null;
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
      .select(`
        *,
        sender:profiles!notifications_sender_id_fkey(display_name, avatar_url)
      `)
      .eq('user_id', currentUser.id)
      .order('created_at', { ascending: false })
      .limit(200);
    
    setNotifications((data || []) as any);
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

  const handleNotificationClick = async (notification: NotificationRow) => {
    if (!notification.read_at) {
      await markOneAsRead(notification.id);
    }
    
    if (notification.link) {
      navigate(notification.link);
    }
  };

  const handleThreadClick = async (thread: { notifications: NotificationRow[], isThread: boolean }) => {
    // Mark all unread notifications in this thread as read
    const unreadNotifs = thread.notifications.filter(n => !n.read_at);
    
    for (const notif of unreadNotifs) {
      await markOneAsRead(notif.id);
    }

    // Navigate to the link if available
    const firstNotif = thread.notifications[0];
    if (firstNotif.link) {
      navigate(firstNotif.link);
    }
  };

  const handleDeleteNotification = async (notificationIds: string[]) => {
    try {
      await supabase
        .from('notifications')
        .delete()
        .in('id', notificationIds);
      
      setNotifications(prev => prev.filter(n => !notificationIds.includes(n.id)));
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  // Separate message and non-message notifications
  const messageNotifications = notifications.filter(n => 
    n.type === 'message' && n.sender_id && n.sender_id.trim() !== ''
  );
  const otherNotifications = notifications.filter(n => 
    n.type !== 'message' || !n.sender_id || n.sender_id.trim() === ''
  );

  // Group message notifications by sender_id (ensure consistent grouping)
  const groupedMessages = messageNotifications.reduce((acc, notification) => {
    const senderId = notification.sender_id!.trim(); // Trim to handle any whitespace issues
    if (!acc[senderId]) {
      acc[senderId] = [];
    }
    acc[senderId].push(notification);
    return acc;
  }, {} as Record<string, NotificationRow[]>);

  // Create threads for message groups
  const messageThreads = Object.values(groupedMessages).map(thread => {
    const sorted = [...thread].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return {
      notifications: sorted,
      latestDate: new Date(sorted[0].created_at).getTime(),
      hasUnread: sorted.some(n => !n.read_at),
      isThread: true
    };
  });

  // Create individual items for non-message notifications
  const otherThreads = otherNotifications.map(notification => ({
    notifications: [notification],
    latestDate: new Date(notification.created_at).getTime(),
    hasUnread: !notification.read_at,
    isThread: false
  }));

  // Combine and sort all threads
  const notificationThreads = [...messageThreads, ...otherThreads]
    .sort((a, b) => b.latestDate - a.latestDate);

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
  <ListSkeleton count={5} />
) : (
        <PullToRefresh onRefresh={loadNotifications}>
          {notifications.length === 0 ? (
            <EmptyState
              icon={Bell}
              title="No notifications yet"
              description="We'll notify you when there's something new!"
              variant="minimal"
            />
          ) : (
            <VirtualizedList
              items={notificationThreads}
              estimateSize={120}
              className="h-[calc(100vh-200px)]"
              renderItem={(thread) => {
                const firstNotif = thread.notifications[0];
                const isMessageThread = thread.isThread && firstNotif.type === 'message';
                
                return (
                  <SwipeableCard
                    onSwipeLeft={() => handleDeleteNotification(thread.notifications.map(n => n.id))}
                    onSwipeRight={() => thread.isThread ? handleThreadClick(thread) : handleNotificationClick(firstNotif)}
                    leftAction="delete"
                    rightAction="favorite"
                  >
                    <Card 
                      className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                        thread.hasUnread ? 'border-l-4 border-l-primary bg-accent/20' : ''
                      }`}
                      onClick={() => thread.isThread ? handleThreadClick(thread) : handleNotificationClick(firstNotif)}
                    >
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium">
                                {isMessageThread 
                                  ? `${thread.notifications.length} messages from ${firstNotif.title.replace('New message from ', '')}` 
                                  : firstNotif.title}
                              </h3>
                              {thread.hasUnread && (
                                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                              )}
                            </div>
                            
                            {isMessageThread ? (
                              <div className="space-y-1.5 mt-2">
                                {thread.notifications.slice(0, 2).map(notif => (
                                  <div key={notif.id} className="text-sm text-muted-foreground pl-3 border-l-2 border-muted">
                                    {notif.body || 'Message'}
                                  </div>
                                ))}
                                {thread.notifications.length > 2 && (
                                  <div className="text-xs text-primary font-medium pl-3">
                                    +{thread.notifications.length - 2} more messages
                                  </div>
                                )}
                              </div>
                            ) : (
                              firstNotif.body && (
                                <p className="text-sm text-muted-foreground mb-2">
                                  {firstNotif.body}
                                </p>
                              )
                            )}
                            
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="secondary" className="text-xs">
                                {firstNotif.type}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(firstNotif.created_at).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </SwipeableCard>
                );
              }}
            />
          )}
        </PullToRefresh>
        )}
      </div>
    </div>
  );
}
