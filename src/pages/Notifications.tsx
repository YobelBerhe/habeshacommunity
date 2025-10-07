import { ListSkeleton } from '@/components/LoadingStates';
import { EmptyState } from '@/components/EmptyState';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCheck, Settings, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MentorHeader from '@/components/MentorHeader';
import { SwipeableCard } from '@/components/SwipeableCard';
import { PullToRefresh } from '@/components/PullToRefresh';
import { VirtualizedList } from '@/components/VirtualizedList';
import { showUndoToast } from '@/components/UndoToast';
import { useLiveNotifications } from '@/hooks/useLiveNotifications';
import { NotificationSettings } from '@/components/NotificationSettings';
import { useAuth } from '@/store/auth';
import { supabase } from '@/integrations/supabase/client';

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
  const { user } = useAuth();
  const [showSettings, setShowSettings] = useState(false);
  
  const {
    notifications: notificationData,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAll,
  } = useLiveNotifications(user?.id || '');

  // Convert to the format expected by the rest of the component
  const notifications: NotificationRow[] = notificationData as any;
  const loading = false;

  const loadNotifications = async () => {
    // Handled by useLiveNotifications hook
  };

  const handleNotificationClick = async (notification: NotificationRow) => {
    if (!notification.read_at) {
      await markAsRead(notification.id);
    }
    
    if (notification.link) {
      navigate(notification.link);
    }
  };

  const handleThreadClick = async (thread: { notifications: NotificationRow[], isThread: boolean }) => {
    // Mark all unread notifications in this thread as read
    const unreadNotifs = thread.notifications.filter(n => !n.read_at);
    
    for (const notif of unreadNotifs) {
      await markAsRead(notif.id);
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
      
      showUndoToast({
        message: notificationIds.length > 1 ? 'Notifications dismissed' : 'Notification dismissed',
        onUndo: () => {
          // Notifications will be reloaded by the real-time subscription
        },
      });
    } catch (error) {
      console.error('Failed to delete notification:', error);
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
      
      <main role="main" aria-label="Notifications">
        <div className="container mx-auto px-4 pt-4 pb-8">
          {/* Header Actions */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                >
                  <CheckCheck className="w-4 h-4 mr-2" />
                  Mark all read
                </Button>
              )}
              
              {notifications.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAll}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear all
                </Button>
              )}
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="mb-6 p-6 border rounded-lg bg-card">
              <NotificationSettings />
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
      </main>
    </div>
  );
}
