-- Add cover_image column to events table for event photos
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS cover_image TEXT;

-- Create RSVPs table for event attendance tracking
CREATE TABLE IF NOT EXISTS public.rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'going' CHECK (status IN ('going', 'maybe', 'not_going')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- Enable RLS
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

-- RLS Policies for RSVPs
CREATE POLICY "Anyone can view RSVPs"
  ON public.rsvps FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own RSVPs"
  ON public.rsvps FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own RSVPs"
  ON public.rsvps FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own RSVPs"
  ON public.rsvps FOR DELETE
  USING (auth.uid() = user_id);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_rsvps_event ON public.rsvps(event_id);
CREATE INDEX IF NOT EXISTS idx_rsvps_user ON public.rsvps(user_id);
CREATE INDEX IF NOT EXISTS idx_rsvps_status ON public.rsvps(status);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_rsvps_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_rsvps_updated_at
  BEFORE UPDATE ON public.rsvps
  FOR EACH ROW
  EXECUTE FUNCTION update_rsvps_updated_at();