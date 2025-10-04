-- Create mentor_reviews table
CREATE TABLE public.mentor_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES public.mentors(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  booking_id UUID REFERENCES public.mentor_bookings(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add rating columns to mentors table
ALTER TABLE public.mentors 
ADD COLUMN rating_avg NUMERIC(3,2) DEFAULT 0,
ADD COLUMN rating_count INTEGER DEFAULT 0;

-- Enable RLS on mentor_reviews
ALTER TABLE public.mentor_reviews ENABLE ROW LEVEL SECURITY;

-- Reviews are viewable by everyone
CREATE POLICY "Reviews are viewable by everyone"
ON public.mentor_reviews FOR SELECT
USING (true);

-- Users can create reviews for their own bookings
CREATE POLICY "Users can create reviews for completed bookings"
ON public.mentor_reviews FOR INSERT
WITH CHECK (
  auth.uid() = user_id 
  AND EXISTS (
    SELECT 1 FROM public.mentor_bookings 
    WHERE id = booking_id 
    AND user_id = auth.uid() 
    AND status = 'completed'
  )
);

-- Users can update their own reviews
CREATE POLICY "Users can update their own reviews"
ON public.mentor_reviews FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own reviews
CREATE POLICY "Users can delete their own reviews"
ON public.mentor_reviews FOR DELETE
USING (auth.uid() = user_id);

-- Create function to update mentor rating stats
CREATE OR REPLACE FUNCTION public.update_mentor_rating_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.mentors
  SET 
    rating_avg = (
      SELECT ROUND(AVG(rating)::numeric, 2)
      FROM public.mentor_reviews
      WHERE mentor_id = COALESCE(NEW.mentor_id, OLD.mentor_id)
    ),
    rating_count = (
      SELECT COUNT(*)
      FROM public.mentor_reviews
      WHERE mentor_id = COALESCE(NEW.mentor_id, OLD.mentor_id)
    )
  WHERE id = COALESCE(NEW.mentor_id, OLD.mentor_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to auto-update mentor stats when reviews change
CREATE TRIGGER update_mentor_rating_on_review_change
AFTER INSERT OR UPDATE OR DELETE ON public.mentor_reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_mentor_rating_stats();