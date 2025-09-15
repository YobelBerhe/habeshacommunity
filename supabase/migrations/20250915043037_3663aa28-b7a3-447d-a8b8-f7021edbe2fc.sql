-- Add plan description to mentors for customizable plan text
ALTER TABLE public.mentors
ADD COLUMN IF NOT EXISTS plan_description text;

-- Create mentor_favorites table to favorite mentors independently of listings
CREATE TABLE IF NOT EXISTS public.mentor_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  mentor_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT mentor_favorites_user_mentor_unique UNIQUE (user_id, mentor_id)
);

-- Optional FK to mentors for referential integrity
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'mentor_favorites_mentor_id_fkey'
  ) THEN
    ALTER TABLE public.mentor_favorites
      ADD CONSTRAINT mentor_favorites_mentor_id_fkey
      FOREIGN KEY (mentor_id) REFERENCES public.mentors(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Enable RLS and add policies
ALTER TABLE public.mentor_favorites ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can create their own mentor favorites'
  ) THEN
    CREATE POLICY "Users can create their own mentor favorites"
    ON public.mentor_favorites
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete their own mentor favorites'
  ) THEN
    CREATE POLICY "Users can delete their own mentor favorites"
    ON public.mentor_favorites
    FOR DELETE
    USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own mentor favorites'
  ) THEN
    CREATE POLICY "Users can view their own mentor favorites"
    ON public.mentor_favorites
    FOR SELECT
    USING (auth.uid() = user_id);
  END IF;
END $$;