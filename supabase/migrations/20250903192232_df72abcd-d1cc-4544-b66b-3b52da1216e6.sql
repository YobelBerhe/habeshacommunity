-- Add street_address column to listings table
ALTER TABLE public.listings 
ADD COLUMN street_address TEXT;