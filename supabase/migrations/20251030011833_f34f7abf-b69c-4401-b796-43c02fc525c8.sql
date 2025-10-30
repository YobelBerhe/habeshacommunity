-- Add missing columns to listings table
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS condition TEXT,
ADD COLUMN IF NOT EXISTS bedrooms TEXT,
ADD COLUMN IF NOT EXISTS bathrooms TEXT,
ADD COLUMN IF NOT EXISTS salary TEXT,
ADD COLUMN IF NOT EXISTS job_type TEXT,
ADD COLUMN IF NOT EXISTS experience TEXT,
ADD COLUMN IF NOT EXISTS video_url TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS favorite_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS message_count INTEGER DEFAULT 0;

-- Create storage bucket for marketplace images
INSERT INTO storage.buckets (id, name, public)
VALUES ('marketplace-images', 'marketplace-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage policies
CREATE POLICY "Authenticated users can upload marketplace images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'marketplace-images');

CREATE POLICY "Public can view marketplace images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'marketplace-images');

CREATE POLICY "Users can delete their own marketplace images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'marketplace-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create favorites table
CREATE TABLE IF NOT EXISTS listing_favorites (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, listing_id)
);

ALTER TABLE listing_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own favorites"
ON listing_favorites FOR ALL
USING (auth.uid() = user_id);