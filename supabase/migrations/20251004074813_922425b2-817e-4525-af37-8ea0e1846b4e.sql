-- Create mentor_badges table
CREATE TABLE public.mentor_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES public.mentors(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL CHECK (badge_type IN ('Milestone', 'Quality', 'Engagement')),
  label TEXT NOT NULL,
  icon TEXT,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add badges_count to mentors table
ALTER TABLE public.mentors ADD COLUMN badges_count INT DEFAULT 0;

-- Enable RLS for mentor_badges
ALTER TABLE public.mentor_badges ENABLE ROW LEVEL SECURITY;

-- Policy: Badges are viewable by everyone
CREATE POLICY "Badges are viewable by everyone"
ON public.mentor_badges
FOR SELECT
USING (true);

-- Create award_badges function
CREATE OR REPLACE FUNCTION public.award_badges(mentor_id UUID) 
RETURNS void AS $$
DECLARE
  sessions_count INT;
  avg_rating NUMERIC;
  badge_total INT;
BEGIN
  -- Count confirmed sessions from mentor_bookings
  SELECT COUNT(*) INTO sessions_count 
  FROM public.mentor_bookings 
  WHERE mentor_bookings.mentor_id = award_badges.mentor_id 
    AND status = 'confirmed';

  -- Get average rating from mentor_reviews
  SELECT COALESCE(AVG(rating), 0) INTO avg_rating 
  FROM public.mentor_reviews 
  WHERE mentor_reviews.mentor_id = award_badges.mentor_id;

  -- Award Bronze (10 sessions)
  IF sessions_count >= 10 AND NOT EXISTS (
    SELECT 1 FROM public.mentor_badges 
    WHERE mentor_badges.mentor_id = award_badges.mentor_id 
      AND label = 'Bronze Mentor'
  ) THEN
    INSERT INTO public.mentor_badges (mentor_id, badge_type, label, icon) 
    VALUES (award_badges.mentor_id, 'Milestone', 'Bronze Mentor', '🥉');
  END IF;

  -- Award Silver (50 sessions)
  IF sessions_count >= 50 AND NOT EXISTS (
    SELECT 1 FROM public.mentor_badges 
    WHERE mentor_badges.mentor_id = award_badges.mentor_id 
      AND label = 'Silver Mentor'
  ) THEN
    INSERT INTO public.mentor_badges (mentor_id, badge_type, label, icon) 
    VALUES (award_badges.mentor_id, 'Milestone', 'Silver Mentor', '🥈');
  END IF;

  -- Award Gold (100 sessions)
  IF sessions_count >= 100 AND NOT EXISTS (
    SELECT 1 FROM public.mentor_badges 
    WHERE mentor_badges.mentor_id = award_badges.mentor_id 
      AND label = 'Gold Mentor'
  ) THEN
    INSERT INTO public.mentor_badges (mentor_id, badge_type, label, icon) 
    VALUES (award_badges.mentor_id, 'Milestone', 'Gold Mentor', '🥇');
  END IF;

  -- Award Top Rated (avg rating >= 4.8)
  IF avg_rating >= 4.8 AND NOT EXISTS (
    SELECT 1 FROM public.mentor_badges 
    WHERE mentor_badges.mentor_id = award_badges.mentor_id 
      AND label = 'Top Rated Mentor'
  ) THEN
    INSERT INTO public.mentor_badges (mentor_id, badge_type, label, icon) 
    VALUES (award_badges.mentor_id, 'Quality', 'Top Rated Mentor', '⭐');
  END IF;

  -- Update badges_count in mentors table
  SELECT COUNT(*) INTO badge_total 
  FROM public.mentor_badges 
  WHERE mentor_badges.mentor_id = award_badges.mentor_id;

  UPDATE public.mentors 
  SET badges_count = badge_total 
  WHERE id = award_badges.mentor_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;