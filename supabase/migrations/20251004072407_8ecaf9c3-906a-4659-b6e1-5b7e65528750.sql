-- Add discovery and filtering columns to mentors table
ALTER TABLE public.mentors
  ADD COLUMN IF NOT EXISTS skills TEXT[],
  ADD COLUMN IF NOT EXISTS industries TEXT[],
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_mentors_skills ON public.mentors USING GIN(skills);
CREATE INDEX IF NOT EXISTS idx_mentors_industries ON public.mentors USING GIN(industries);
CREATE INDEX IF NOT EXISTS idx_mentors_languages ON public.mentors USING GIN(languages);
CREATE INDEX IF NOT EXISTS idx_mentors_is_featured ON public.mentors(is_featured) WHERE is_featured = true;

-- Update any existing mentors to have empty arrays instead of null
UPDATE public.mentors 
SET 
  skills = COALESCE(skills, ARRAY[]::TEXT[]),
  industries = COALESCE(industries, ARRAY[]::TEXT[]),
  languages = COALESCE(languages, ARRAY[]::TEXT[])
WHERE 
  skills IS NULL 
  OR industries IS NULL 
  OR languages IS NULL;