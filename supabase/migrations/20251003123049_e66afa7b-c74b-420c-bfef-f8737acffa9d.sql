-- Add missing columns to listings table
ALTER TABLE public.listings 
ADD COLUMN IF NOT EXISTS views integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;

-- Add missing columns to mentors table
ALTER TABLE public.mentors
ADD COLUMN IF NOT EXISTS display_name text,
ADD COLUMN IF NOT EXISTS price_cents integer,
ADD COLUMN IF NOT EXISTS photos text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS website_url text,
ADD COLUMN IF NOT EXISTS topics text[] DEFAULT '{}';

-- Add missing columns to match_profiles table
ALTER TABLE public.match_profiles
ADD COLUMN IF NOT EXISTS display_name text,
ADD COLUMN IF NOT EXISTS seeking text;

-- Create reports table
CREATE TABLE IF NOT EXISTS public.reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL,
  reporter_id uuid,
  reason text NOT NULL,
  details text,
  status text DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on reports
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Create policies for reports
CREATE POLICY "Authenticated users can create reports"
  ON public.reports
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view their own reports"
  ON public.reports
  FOR SELECT
  TO authenticated
  USING (auth.uid() = reporter_id);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  user_id uuid NOT NULL,
  city text NOT NULL,
  board text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on chat_messages
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for chat_messages
CREATE POLICY "Chat messages are viewable by everyone"
  ON public.chat_messages
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create chat messages"
  ON public.chat_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create function to increment listing views
CREATE OR REPLACE FUNCTION public.increment_views(listing_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.listings
  SET views = COALESCE(views, 0) + 1
  WHERE id = listing_id;
END;
$$;

-- Create function to get listing counts
CREATE OR REPLACE FUNCTION public.get_listing_counts()
RETURNS TABLE (
  category text,
  count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    listings.category::text,
    COUNT(*)::bigint
  FROM public.listings
  WHERE status = 'active'
  GROUP BY listings.category;
END;
$$;