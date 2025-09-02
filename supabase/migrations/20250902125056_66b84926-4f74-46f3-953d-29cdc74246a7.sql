-- Create a separate protected table for contact information
CREATE TABLE public.listing_contacts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id uuid NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  contact_method text,
  contact_value text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(listing_id)
);

-- Enable RLS on the new table
ALTER TABLE public.listing_contacts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for contact information
-- Only authenticated users can view contact info
CREATE POLICY "Authenticated users can view contact info" 
ON public.listing_contacts 
FOR SELECT 
TO authenticated
USING (true);

-- Only listing owners can create contact info
CREATE POLICY "Listing owners can create contact info" 
ON public.listing_contacts 
FOR INSERT 
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.listings 
    WHERE id = listing_id 
    AND user_id = auth.uid()
  )
);

-- Only listing owners can update their contact info
CREATE POLICY "Listing owners can update contact info" 
ON public.listing_contacts 
FOR UPDATE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.listings 
    WHERE id = listing_id 
    AND user_id = auth.uid()
  )
);

-- Only listing owners can delete their contact info
CREATE POLICY "Listing owners can delete contact info" 
ON public.listing_contacts 
FOR DELETE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.listings 
    WHERE id = listing_id 
    AND user_id = auth.uid()
  )
);

-- Migrate existing contact data to the new protected table
INSERT INTO public.listing_contacts (listing_id, contact_method, contact_value)
SELECT id, contact_method, contact_value 
FROM public.listings 
WHERE contact_method IS NOT NULL AND contact_value IS NOT NULL;

-- Remove contact fields from the public listings table
ALTER TABLE public.listings DROP COLUMN contact_method;
ALTER TABLE public.listings DROP COLUMN contact_value;