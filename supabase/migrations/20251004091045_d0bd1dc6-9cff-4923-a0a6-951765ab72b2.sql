-- Add default UUID generation for conversations table
ALTER TABLE public.conversations 
ALTER COLUMN id SET DEFAULT gen_random_uuid();