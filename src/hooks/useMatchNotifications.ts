import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/store/auth';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export function useMatchNotifications() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    // Subscribe to new matches
    const channel = supabase
      .channel('match-notifications')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'match_interactions',
          filter: `target_user_id=eq.${user.id}`,
        },
        (payload) => {
          // Check if it's a new mutual match
          if (payload.new.is_mutual && !payload.old?.is_mutual) {
            toast.success("You have a new match! 💕", {
              duration: 5000,
              action: {
                label: "View",
                onClick: () => navigate('/match/matches')
              }
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, navigate]);
}
