-- Ensure gen_random_uuid() is available
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Temporarily drop the policy that depends on listings.id
DROP POLICY IF EXISTS "Listing contacts viewable by everyone" ON public.listing_contacts;

-- Set default UUID generation for listings.id
ALTER TABLE public.listings
  ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Recreate the policy
CREATE POLICY "Listing contacts viewable by everyone"
  ON public.listing_contacts
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.listings
      WHERE listings.id = listing_contacts.listing_id
      AND listings.status = 'active'
    )
  );

-- Verify helpful indexes (no-ops if they exist)
CREATE INDEX IF NOT EXISTS idx_listings_user ON public.listings(user_id);
CREATE INDEX IF NOT EXISTS idx_listings_category ON public.listings(category);
CREATE INDEX IF NOT EXISTS idx_listings_status ON public.listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_created ON public.listings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_listings_city ON public.listings(city);
