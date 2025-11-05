-- Create calendars table
CREATE TABLE IF NOT EXISTS public.calendars (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  avatar_url TEXT,
  location TEXT,
  is_public BOOLEAN DEFAULT true,
  subscribers_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create calendar subscriptions table
CREATE TABLE IF NOT EXISTS public.calendar_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  calendar_id UUID NOT NULL REFERENCES public.calendars(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, calendar_id)
);

-- Enable RLS
ALTER TABLE public.calendars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_subscriptions ENABLE ROW LEVEL SECURITY;

-- Calendars policies
CREATE POLICY "Calendars are viewable by everyone" 
  ON public.calendars FOR SELECT USING (true);

CREATE POLICY "Users can create their own calendars" 
  ON public.calendars FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own calendars" 
  ON public.calendars FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own calendars" 
  ON public.calendars FOR DELETE 
  USING (auth.uid() = user_id);

-- Subscriptions policies
CREATE POLICY "Users can view their own subscriptions" 
  ON public.calendar_subscriptions FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own subscriptions" 
  ON public.calendar_subscriptions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own subscriptions" 
  ON public.calendar_subscriptions FOR DELETE 
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_calendars_user ON public.calendars(user_id);
CREATE INDEX idx_calendar_subscriptions_user ON public.calendar_subscriptions(user_id);
CREATE INDEX idx_calendar_subscriptions_calendar ON public.calendar_subscriptions(calendar_id);

-- Trigger for updated_at
CREATE TRIGGER update_calendars_updated_at
  BEFORE UPDATE ON public.calendars
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();