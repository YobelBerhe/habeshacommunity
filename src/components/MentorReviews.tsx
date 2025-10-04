import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
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
      // Check if user has completed bookings with this mentor that haven't been reviewed
      const { data: bookings } = await supabase
        .from('mentor_bookings')
        .select('id')
        .eq('mentor_id', mentorId)
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .limit(1);

      if (bookings && bookings.length > 0) {
        // Check if user already reviewed this booking
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
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-muted-foreground'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
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
            {user && eligibleBooking && (
              <Button onClick={() => setShowReviewForm(true)} size="sm">
                Write a Review
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
        {user && !eligibleBooking && reviews.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            To review, you need to take a session first.
          </div>
        )}
        {user && !eligibleBooking && reviews.length > 0 && (
          <div className="text-sm text-muted-foreground mb-4 text-center">
            To leave a review, you need to take a session first.
          </div>
        )}
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading reviews...
          </div>
        ) : reviews.length === 0 && (!user || eligibleBooking) ? (
          <div className="text-center py-8 text-muted-foreground">
            No reviews yet. Be the first to review this mentor!
          </div>
        ) : reviews.length > 0 ? (
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
        ) : null}
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
