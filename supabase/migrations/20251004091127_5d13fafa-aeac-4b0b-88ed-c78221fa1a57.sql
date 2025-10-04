-- Create mentor_favorites table for saving favorite mentors
CREATE TABLE IF NOT EXISTS public.mentor_favorites (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mentor_id uuid NOT NULL REFERENCES public.mentors(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, mentor_id)
);

-- Enable RLS
ALTER TABLE public.mentor_favorites ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own mentor favorites"
ON public.mentor_favorites FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own mentor favorites"
ON public.mentor_favorites FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own mentor favorites"
ON public.mentor_favorites FOR DELETE
USING (auth.uid() = user_id);