import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

interface PresenceState {
  user_id: string;
  online_at: string;
  status?: 'online' | 'away' | 'busy';
}

export function usePresence(roomId: string, userId: string) {
  const [presences, setPresences] = useState<Record<string, PresenceState[]>>({});
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!userId) return;

    const presenceChannel = supabase.channel(`presence:${roomId}`, {
      config: {
        presence: {
          key: userId,
        },
      },
    });

    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState() as any;
        setPresences(state);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track({
            user_id: userId,
            online_at: new Date().toISOString(),
            status: 'online',
          });
        }
      });

    setChannel(presenceChannel);

    return () => {
      presenceChannel.unsubscribe();
    };
  }, [roomId, userId]);

  const updateStatus = async (status: 'online' | 'away' | 'busy') => {
    if (!channel) return;
    
    await channel.track({
      user_id: userId,
      online_at: new Date().toISOString(),
      status,
    });
  };

  const getOnlineUsers = () => {
    return Object.values(presences).flat();
  };

  const isUserOnline = (targetUserId: string) => {
    return getOnlineUsers().some(p => p.user_id === targetUserId);
  };

  return {
    presences,
    onlineUsers: getOnlineUsers(),
    updateStatus,
    isUserOnline,
    onlineCount: getOnlineUsers().length,
  };
}
