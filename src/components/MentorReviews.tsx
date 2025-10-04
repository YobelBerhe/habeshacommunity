import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Review {
  id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
  profiles: {
    display_name: string | null;
  } | null;
}

interface MentorReviewsProps {
  mentorId: string;
  ratingAvg?: number;
  ratingCount?: number;
}

export default function MentorReviews({
  mentorId,
  ratingAvg = 0,
  ratingCount = 0,
}: MentorReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [mentorId]);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('mentor_reviews')
        .select('id, rating, review_text, created_at, user_id')
        .eq('mentor_id', mentorId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch profiles separately
      if (data && data.length > 0) {
        const userIds = [...new Set(data.map(r => r.user_id))];
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, display_name')
          .in('id', userIds);

        const profilesMap = new Map(
          profilesData?.map(p => [p.id, p]) || []
        );

        const reviewsWithProfiles = data.map(review => ({
          ...review,
          profiles: profilesMap.get(review.user_id) || null,
        }));

        setReviews(reviewsWithProfiles as Review[]);
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-muted-foreground'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Reviews</span>
          {ratingCount > 0 && (
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="text-xl font-bold">{ratingAvg.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">
                ({ratingCount} {ratingCount === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading reviews...
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No reviews yet. Be the first to review this mentor!
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="border-b border-border last:border-0 pb-4 last:pb-0"
              >
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback>
                      {(review.profiles?.display_name?.[0] || 'U').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium">
                        {review.profiles?.display_name || 'Anonymous'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(review.created_at), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                    <div className="mb-2">{renderStars(review.rating)}</div>
                    {review.review_text && (
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {review.review_text}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
