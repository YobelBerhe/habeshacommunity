import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { Loader2 } from 'lucide-react';

interface Match {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: Date;
  unread: boolean;
}

export default function MatchesList() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    // Mock data - later connect to real matches
    setMatches([
      {
        id: '1',
        name: 'Sarah',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
        lastMessage: 'Hi! Love your profile 😊',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        unread: true,
      },
      {
        id: '2',
        name: 'Meron',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
        lastMessage: 'Thanks for the like!',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        unread: false,
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
              Matches ({matches.length})
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto p-4">
        {matches.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-4xl mb-4">💕</p>
            <h2 className="text-xl font-bold mb-2">No matches yet</h2>
            <p className="text-muted-foreground mb-4">
              Keep swiping to find your perfect match!
            </p>
            <Button onClick={() => navigate('/match/discover')}>
              Start Discovering
            </Button>
          </Card>
        ) : (
          <div className="space-y-2">
            {matches.map((match) => (
              <Card
                key={match.id}
                className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => navigate(`/inbox`)}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={match.avatar} />
                      <AvatarFallback>{match.name[0]}</AvatarFallback>
                    </Avatar>
                    {match.unread && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-match rounded-full border-2 border-background" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{match.name}</h3>
                      {match.unread && (
                        <Badge className="bg-match text-white">New</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {match.lastMessage}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(match.timestamp, { addSuffix: true })}
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
