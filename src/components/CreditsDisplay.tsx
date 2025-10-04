import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Ticket, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Credit {
  id: string;
  bundle_size: number;
  credits_left: number;
  mentor: {
    id: string;
    name: string;
    avatar_url: string | null;
  };
}

interface CreditsDisplayProps {
  userId: string;
  mentorId?: string; // If provided, only show credits for this mentor
  showActions?: boolean;
}

export function CreditsDisplay({ userId, mentorId, showActions = true }: CreditsDisplayProps) {
  const [credits, setCredits] = useState<Credit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCredits();
  }, [userId, mentorId]);

  const loadCredits = async () => {
    try {
      let query = supabase
        .from('mentor_credits')
        .select(`
          id,
          bundle_size,
          credits_left,
          mentor:mentor_id (
            id,
            name,
            avatar_url
          )
        `)
        .eq('user_id', userId)
        .gt('credits_left', 0);

      if (mentorId) {
        query = query.eq('mentor_id', mentorId);
      }

      const { data, error } = await query;

      if (error) throw error;

      setCredits(data as any);
    } catch (error) {
      console.error('Error loading credits:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-2/3"></div>
        </div>
      </Card>
    );
  }

  if (credits.length === 0) {
    return null;
  }

  const totalCredits = credits.reduce((sum, c) => sum + c.credits_left, 0);

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Your Credits</h3>
            <Badge variant="secondary">{totalCredits} Available</Badge>
          </div>
        </div>

        <div className="space-y-3">
          {credits.map((credit) => (
            <div
              key={credit.id}
              className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                {credit.mentor.avatar_url && (
                  <img
                    src={credit.mentor.avatar_url}
                    alt={credit.mentor.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="font-medium">{credit.mentor.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {credit.credits_left} of {credit.bundle_size} credits remaining
                  </p>
                </div>
              </div>

              {showActions && (
                <Link to={`/mentor/${credit.mentor.id}`}>
                  <Button variant="ghost" size="sm">
                    Book Session
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              )}
            </div>
          ))}
        </div>

        <p className="text-sm text-muted-foreground">
          💡 Credits never expire - use them anytime!
        </p>
      </div>
    </Card>
  );
}
