-- Add views and featured columns to listings table
ALTER TABLE public.listings 
ADD COLUMN IF NOT EXISTS views bigint DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS listings_category_idx ON public.listings(category);
CREATE INDEX IF NOT EXISTS listings_city_idx ON public.listings(city);
CREATE INDEX IF NOT EXISTS listings_views_idx ON public.listings(views DESC);
CREATE INDEX IF NOT EXISTS listings_featured_idx ON public.listings(is_featured) WHERE is_featured = true;

-- Create function to safely increment listing views
CREATE OR REPLACE FUNCTION public.increment_views(listing_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  UPDATE public.listings
  SET views = COALESCE(views, 0) + 1
  WHERE id = listing_id AND status = 'active';
END;
$$;