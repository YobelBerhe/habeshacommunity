-- Add website_url column to listings table
ALTER TABLE public.listings 
ADD COLUMN website_url text;

-- Make city NOT NULL with a default value for existing records
UPDATE public.listings SET city = 'Unknown' WHERE city IS NULL;
ALTER TABLE public.listings ALTER COLUMN city SET NOT NULL;