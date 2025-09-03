-- Add contact_hidden field to listings table
ALTER TABLE public.listings 
ADD COLUMN IF NOT EXISTS contact_hidden boolean DEFAULT false;

-- Update the listing_contacts RLS policy to respect the contact_hidden setting
DROP POLICY IF EXISTS "Secure contact info access" ON public.listing_contacts;

CREATE POLICY "Secure contact info access" 
ON public.listing_contacts 
FOR SELECT 
USING (
  -- Allow listing owners to see their own contact info
  EXISTS (
    SELECT 1 FROM public.listings 
    WHERE listings.id = listing_contacts.listing_id 
    AND listings.user_id = auth.uid()
  )
  OR
  -- Allow authenticated users to see contact info only if not hidden and they've viewed the listing
  (auth.uid() IS NOT NULL 
   AND EXISTS (
     SELECT 1 FROM public.listings 
     WHERE listings.id = listing_contacts.listing_id 
     AND (listings.contact_hidden = false OR listings.contact_hidden IS NULL)
   )
   AND EXISTS (
     SELECT 1 FROM public.listing_views 
     WHERE listing_views.listing_id = listing_contacts.listing_id 
     AND listing_views.user_id = auth.uid()
   ))
);