-- Add default UUID generator to mentors table id column
ALTER TABLE public.mentors 
ALTER COLUMN id SET DEFAULT gen_random_uuid();