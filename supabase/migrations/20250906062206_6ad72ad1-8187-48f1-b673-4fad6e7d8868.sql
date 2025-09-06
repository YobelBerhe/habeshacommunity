-- Fix the RLS policy for mentor photos upload
-- The folder structure is u_${userId}/filename, so we need to extract the userId part

-- Drop the existing incorrect policy
DROP POLICY IF EXISTS "Users can upload their own mentor photos" ON storage.objects;

-- Create the correct policy that extracts the user ID from the folder name
CREATE POLICY "Users can upload their own mentor photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'mentor-photos' 
  AND auth.uid()::text = SUBSTRING((storage.foldername(name))[1] FROM 3)
);

-- Also update the update and delete policies to match
DROP POLICY IF EXISTS "Users can update their own mentor photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own mentor photos" ON storage.objects;

CREATE POLICY "Users can update their own mentor photos" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'mentor-photos' 
  AND auth.uid()::text = SUBSTRING((storage.foldername(name))[1] FROM 3)
);

CREATE POLICY "Users can delete their own mentor photos" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'mentor-photos' 
  AND auth.uid()::text = SUBSTRING((storage.foldername(name))[1] FROM 3)
);