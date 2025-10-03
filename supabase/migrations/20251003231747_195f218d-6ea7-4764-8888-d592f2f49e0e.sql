-- Create mentor-photos storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('mentor-photos', 'mentor-photos', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for mentor-photos bucket
CREATE POLICY "Anyone can view mentor photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'mentor-photos');

CREATE POLICY "Authenticated users can upload their own mentor photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'mentor-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own mentor photos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'mentor-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own mentor photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'mentor-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);