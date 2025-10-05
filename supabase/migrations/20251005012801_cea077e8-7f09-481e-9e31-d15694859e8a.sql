-- Add youtube_link column to mentors table
ALTER TABLE public.mentors
ADD COLUMN IF NOT EXISTS youtube_link TEXT;