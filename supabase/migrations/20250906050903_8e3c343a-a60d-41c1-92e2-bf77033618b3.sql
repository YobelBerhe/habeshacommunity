-- Add photos and website_url columns to mentors table
ALTER TABLE mentors ADD COLUMN photos text[] DEFAULT '{}';
ALTER TABLE mentors ADD COLUMN website_url text;
ALTER TABLE mentors ADD COLUMN social_links jsonb DEFAULT '{}';

-- Create storage bucket for mentor photos
INSERT INTO storage.buckets (id, name, public) VALUES ('mentor-photos', 'mentor-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for mentor photos
CREATE POLICY "Mentor photos are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'mentor-photos');

CREATE POLICY "Users can upload their own mentor photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'mentor-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own mentor photos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'mentor-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own mentor photos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'mentor-photos' AND auth.uid()::text = (storage.foldername(name))[1]);