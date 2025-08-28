-- Create storage bucket for listing images
INSERT INTO storage.buckets (id, name, public) VALUES ('listing-images', 'listing-images', true);

-- Storage policies for listing images
CREATE POLICY "Public read images" ON storage.objects
FOR SELECT USING (bucket_id = 'listing-images');

CREATE POLICY "Users can upload listing images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'listing-images' AND auth.role() = 'authenticated');

-- Update listings table to match the new schema
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS price_cents INTEGER,
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD',
ADD COLUMN IF NOT EXISTS contact_method TEXT CHECK (contact_method IN ('phone', 'whatsapp', 'telegram', 'email')),
ADD COLUMN IF NOT EXISTS contact_value TEXT,
ADD COLUMN IF NOT EXISTS location_lat DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS location_lng DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'flagged', 'archived'));

-- Rename existing columns to match new schema
ALTER TABLE listings RENAME COLUMN lat TO lat_old;
ALTER TABLE listings RENAME COLUMN lng TO lng_old;
ALTER TABLE listings RENAME COLUMN contact TO contact_old;
ALTER TABLE listings RENAME COLUMN price TO price_old;

-- Copy data from old columns to new ones
UPDATE listings SET 
  location_lat = lat_old,
  location_lng = lng_old,
  contact_value = contact_old,
  price_cents = CASE WHEN price_old IS NOT NULL THEN (price_old * 100)::INTEGER ELSE NULL END
WHERE lat_old IS NOT NULL OR lng_old IS NOT NULL OR contact_old IS NOT NULL OR price_old IS NOT NULL;

-- Drop old columns
ALTER TABLE listings DROP COLUMN IF EXISTS lat_old;
ALTER TABLE listings DROP COLUMN IF EXISTS lng_old;
ALTER TABLE listings DROP COLUMN IF EXISTS contact_old;
ALTER TABLE listings DROP COLUMN IF EXISTS price_old;

-- Enable RLS on all tables
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for listings
CREATE POLICY "Anyone can view active listings" ON listings
FOR SELECT USING (status = 'active');

CREATE POLICY "Users can create their own listings" ON listings
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own listings" ON listings
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own listings" ON listings
FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for favorites
CREATE POLICY "Users can view their own favorites" ON favorites
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own favorites" ON favorites
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" ON favorites
FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for saved searches
CREATE POLICY "Users can view their own saved searches" ON saved_searches
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own saved searches" ON saved_searches
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved searches" ON saved_searches
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved searches" ON saved_searches
FOR DELETE USING (auth.uid() = user_id);