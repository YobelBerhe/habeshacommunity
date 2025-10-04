-- Ensure messages table has proper id generation
ALTER TABLE public.messages 
ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Make sure id column exists and is primary key
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'messages' 
    AND column_name = 'id'
  ) THEN
    ALTER TABLE public.messages ADD COLUMN id uuid PRIMARY KEY DEFAULT gen_random_uuid();
  END IF;
END $$;