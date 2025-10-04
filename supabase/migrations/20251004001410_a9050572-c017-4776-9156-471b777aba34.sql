-- Add verification_celebrated column to track if mentor has seen the celebration
ALTER TABLE public.mentors 
ADD COLUMN verification_celebrated boolean DEFAULT false;