import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/store/auth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface LikedProfile {
  id: string;
  name: string;
  age: number;
  photo: string;
  likedAt: Date;
  isMutual: boolean;
}

export default function Liked() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [liked, setLiked] = useState<LikedProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchLiked();
    }
  }, [user]);

  const fetchLiked = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Get all profiles user has liked
      const { data: interactions, error } = await supabase
        .from('match_interactions')
        .select('target_user_id, created_at, is_mutual')
        .eq('user_id', user.id)
        .eq('action', 'like')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!interactions || interactions.length === 0) {
        setLiked([]);
        setLoading(false);
        return;
      }

      // Get profile details
      const userIds = interactions.map(i => i.target_user_id);
      
      const { data: profiles } = await supabase
        .from('match_profiles')
        .select('user_id, display_name, name, age, photos')
        .in('user_id', userIds);

      // Create profile map
      const profileMap = new Map();
      profiles?.forEach(p => {
        profileMap.set(p.user_id, p);
      });

      // Format data
      const formatted: LikedProfile[] = interactions
        .map(interaction => {
          const profile = profileMap.get(interaction.target_user_id);
          if (!profile) return null;

          return {
            id: interaction.target_user_id,
            name: profile.display_name || profile.name || 'Someone Special',
            age: profile.age || 25,
            photo: profile.photos?.[0] || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
            likedAt: new Date(interaction.created_at),
            isMutual: interaction.is_mutual || false
          };
        })
        .filter(Boolean) as LikedProfile[];

      setLiked(formatted);
    } catch (error) {
      console.error('Error fetching liked profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-match" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">
              People You Liked ({liked.length})
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto p-4">
        {liked.length === 0 ? (
          <Card className="p-8 text-center">
            <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-bold mb-2">No likes yet</h2>
            <p className="text-muted-foreground mb-4">
              Start liking profiles to see them here
            </p>
            <Button onClick={() => navigate('/match/discover')}>
              Start Browsing
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {liked.map((profile) => (
              <Card
                key={profile.id}
                className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow relative"
                onClick={() => navigate(`/match/profile/${profile.id}`)}
              >
                {profile.isMutual && (
                  <div className="absolute top-2 left-2 z-10">
                    <Badge className="bg-match text-white">
                      Match!
                    </Badge>
                  </div>
                )}
                <div className="aspect-[3/4] relative">
                  <img
                    src={profile.photo}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <p className="text-white font-semibold">
                      {profile.name}, {profile.age}
                    </p>
                    <p className="text-white/70 text-xs">
                      {formatDistanceToNow(profile.likedAt, { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
