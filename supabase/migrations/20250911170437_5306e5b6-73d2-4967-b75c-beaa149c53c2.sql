-- Create match_likes table for user likes
CREATE TABLE IF NOT EXISTS public.match_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  target_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, target_id)
);

-- Create match_passes table for user passes
CREATE TABLE IF NOT EXISTS public.match_passes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  target_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, target_id)
);

-- Enable RLS on both tables
ALTER TABLE public.match_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_passes ENABLE ROW LEVEL SECURITY;

-- Create policies for match_likes
CREATE POLICY "Users can create their own likes"
  ON public.match_likes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own likes"
  ON public.match_likes
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes"
  ON public.match_likes
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for match_passes
CREATE POLICY "Users can create their own passes"
  ON public.match_passes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own passes"
  ON public.match_passes
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own passes"
  ON public.match_passes
  FOR DELETE
  USING (auth.uid() = user_id);