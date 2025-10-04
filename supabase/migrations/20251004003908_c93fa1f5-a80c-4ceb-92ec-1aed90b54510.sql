-- Create mentor_skills table for normalized skill storage
CREATE TABLE IF NOT EXISTS public.mentor_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id uuid NOT NULL REFERENCES public.mentors(id) ON DELETE CASCADE,
  skill text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(mentor_id, skill)
);

-- Enable RLS
ALTER TABLE public.mentor_skills ENABLE ROW LEVEL SECURITY;

-- Allow mentors to view their own skills
CREATE POLICY "Mentors can view their own skills"
ON public.mentor_skills
FOR SELECT
USING (
  mentor_id IN (
    SELECT id FROM public.mentors WHERE user_id = auth.uid()
  )
);

-- Allow mentors to insert their own skills
CREATE POLICY "Mentors can insert their own skills"
ON public.mentor_skills
FOR INSERT
WITH CHECK (
  mentor_id IN (
    SELECT id FROM public.mentors WHERE user_id = auth.uid()
  )
);

-- Allow mentors to delete their own skills
CREATE POLICY "Mentors can delete their own skills"
ON public.mentor_skills
FOR DELETE
USING (
  mentor_id IN (
    SELECT id FROM public.mentors WHERE user_id = auth.uid()
  )
);

-- Everyone can view skills (for directory search)
CREATE POLICY "Skills are viewable by everyone"
ON public.mentor_skills
FOR SELECT
USING (true);

-- Create index for faster searches
CREATE INDEX idx_mentor_skills_mentor_id ON public.mentor_skills(mentor_id);
CREATE INDEX idx_mentor_skills_skill ON public.mentor_skills(skill);