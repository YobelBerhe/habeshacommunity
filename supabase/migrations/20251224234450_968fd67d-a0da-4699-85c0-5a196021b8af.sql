-- Create match_interactions table for tracking likes/passes with mutual match detection
CREATE TABLE IF NOT EXISTS public.match_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('like', 'pass', 'super-like')),
  comment TEXT,
  is_mutual BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, target_user_id)
);

-- Enable RLS
ALTER TABLE public.match_interactions ENABLE ROW LEVEL SECURITY;

-- Users can see their own interactions
CREATE POLICY "Users can view own interactions"
  ON public.match_interactions FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = target_user_id);

-- Users can create interactions
CREATE POLICY "Users can create interactions"
  ON public.match_interactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own interactions
CREATE POLICY "Users can update own interactions"
  ON public.match_interactions FOR UPDATE
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_match_interactions_user ON public.match_interactions(user_id, action);
CREATE INDEX idx_match_interactions_target ON public.match_interactions(target_user_id, action);
CREATE INDEX idx_match_interactions_mutual ON public.match_interactions(is_mutual) WHERE is_mutual = true;

-- Create function to check and set mutual matches
CREATE OR REPLACE FUNCTION check_mutual_match()
RETURNS TRIGGER AS $$
BEGIN
  -- Only check for likes
  IF NEW.action = 'like' THEN
    -- Check if target user has already liked this user
    IF EXISTS (
      SELECT 1 FROM public.match_interactions
      WHERE user_id = NEW.target_user_id
      AND target_user_id = NEW.user_id
      AND action = 'like'
    ) THEN
      -- Set both as mutual
      NEW.is_mutual := true;
      
      -- Update the other interaction to be mutual too
      UPDATE public.match_interactions
      SET is_mutual = true
      WHERE user_id = NEW.target_user_id
      AND target_user_id = NEW.user_id
      AND action = 'like';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for mutual match detection
DROP TRIGGER IF EXISTS check_mutual_match_trigger ON public.match_interactions;
CREATE TRIGGER check_mutual_match_trigger
  BEFORE INSERT ON public.match_interactions
  FOR EACH ROW EXECUTE FUNCTION check_mutual_match();

-- Enable realtime for match interactions
ALTER PUBLICATION supabase_realtime ADD TABLE public.match_interactions;