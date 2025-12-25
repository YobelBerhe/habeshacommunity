-- Create storage buckets for image uploads
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('profile-photos', 'profile-photos', true),
  ('match-photos', 'match-photos', true),
  ('marketplace-images', 'marketplace-images', true),
  ('event-images', 'event-images', true),
  ('group-images', 'group-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for public access (read)
CREATE POLICY "Public read access for profile-photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-photos');

CREATE POLICY "Public read access for match-photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'match-photos');

CREATE POLICY "Public read access for marketplace-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'marketplace-images');

CREATE POLICY "Public read access for event-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'event-images');

CREATE POLICY "Public read access for group-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'group-images');

-- Storage policies for authenticated uploads
CREATE POLICY "Authenticated users can upload to profile-photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'profile-photos'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can upload to match-photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'match-photos'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can upload to marketplace-images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'marketplace-images'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can upload to event-images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'event-images'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can upload to group-images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'group-images'
  AND auth.role() = 'authenticated'
);

-- Storage policies for users to update their own files
CREATE POLICY "Users can update own files"
ON storage.objects FOR UPDATE
USING (auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for users to delete their own files
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
USING (auth.uid()::text = (storage.foldername(name))[1]);