import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Star, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/store/auth';
import MentorReviewForm from '@/components/MentorReviewForm';

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
  mentorName?: string;
}

export default function MentorReviews({
  mentorId,
  ratingAvg = 0,
  ratingCount = 0,
  mentorName = 'this mentor',
}: MentorReviewsProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [eligibleBooking, setEligibleBooking] = useState<{ id: string } | null>(null);

  useEffect(() => {
    fetchReviews();
    if (user) {
      checkEligibility();
    }
  }, [mentorId, user]);

  const checkEligibility = async () => {
    if (!user) return;

    try {
      const { data: bookings } = await supabase
        .from('mentor_bookings')
        .select('id')
        .eq('mentor_id', mentorId)
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .limit(1);

      if (bookings && bookings.length > 0) {
        const { data: existingReview } = await supabase
          .from('mentor_reviews')
          .select('id')
          .eq('booking_id', bookings[0].id)
          .limit(1);

        if (!existingReview || existingReview.length === 0) {
          setEligibleBooking(bookings[0]);
        }
      }
    } catch (error) {
      console.error('Error checking review eligibility:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('mentor_reviews')
        .select('id, rating, review_text, created_at, user_id')
        .eq('mentor_id', mentorId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        const userIds = [...new Set(data.map(r => r.user_id))];
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, display_name')
          .in('id', userIds);

        const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);
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

  const handleReviewSubmitted = () => {
    setShowReviewForm(false);
    setEligibleBooking(null);
    fetchReviews();
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'fill-amber-400 text-amber-400'
                : 'text-muted-foreground/30'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <Card>
        <CardHeader className="border-b bg-muted/30">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="flex items-center gap-3">
              <span>Reviews & Ratings</span>
              {ratingCount > 0 && (
                <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950 px-3 py-1.5 rounded-full">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span className="text-xl font-bold">{ratingAvg.toFixed(1)}</span>
                  <span className="text-sm text-muted-foreground">
                    ({ratingCount})
                  </span>
                </div>
              )}
            </CardTitle>
            {user && eligibleBooking && (
              <Button onClick={() => setShowReviewForm(true)} size="sm" className="gap-2">
                <Star className="w-4 h-4" />
                Write Review
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {loading ? (
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-10 h-10 bg-muted rounded-full animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                    <div className="h-3 w-full bg-muted rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-primary/50" />
              </div>
              <h4 className="font-semibold mb-2">No reviews yet</h4>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                {user && eligibleBooking
                  ? "Be the first to share your experience!"
                  : "This mentor hasn't received any reviews yet. Book a session to be the first!"}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="pb-6 border-b border-border last:border-0 last:pb-0"
                >
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12 border-2">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {(review.profiles?.display_name?.[0] || 'U').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <p className="font-semibold">
                            {review.profiles?.display_name || 'Anonymous User'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(review.created_at), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                        {renderStars(review.rating)}
                      </div>
                      {review.review_text && (
                        <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
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

      {eligibleBooking && (
        <MentorReviewForm
          isOpen={showReviewForm}
          onClose={() => setShowReviewForm(false)}
          mentorId={mentorId}
          mentorName={mentorName}
          bookingId={eligibleBooking.id}
          onReviewSubmitted={handleReviewSubmitted}
        />
      )}
    </>
  );
}
