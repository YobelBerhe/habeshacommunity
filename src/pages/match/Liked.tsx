import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Loader2 } from 'lucide-react';

interface LikedProfile {
  id: string;
  name: string;
  age: number;
  photo: string;
  likedAt: Date;
}

export default function Liked() {
  const navigate = useNavigate();
  const [liked, setLiked] = useState<LikedProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLiked();
  }, []);

  const fetchLiked = async () => {
    // Mock data
    setLiked([
      {
        id: '1',
        name: 'Sarah',
        age: 28,
        photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
        likedAt: new Date(),
      },
      {
        id: '2',
        name: 'Meron',
        age: 26,
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
        likedAt: new Date(),
      },
    ]);
    setLoading(false);
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
                className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/match/profile/${profile.id}`)}
              >
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
