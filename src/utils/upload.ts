import imageCompression from 'browser-image-compression';
import { supabase } from '@/integrations/supabase/client';

export async function uploadListingImages(files: File[], userId: string, bucketName: string = 'marketplace-images') {
  console.log('📤 Upload function called with:', { filesCount: files.length, userId, bucketName });
  const urls: string[] = [];
  
  for (const file of files.slice(0, 6)) {
    console.log('🗜️ Compressing file:', file.name);
    const compressed = await imageCompression(file, { maxSizeMB: 0.5, maxWidthOrHeight: 1920, useWebWorker: true });
    console.log('✅ File compressed:', { original: file.size, compressed: compressed.size });
    
    const fileExt = compressed.type.split('/')[1] || 'jpg';
    const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;
    console.log('🔑 Upload path:', filePath);
    
    const { error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, compressed, { 
        upsert: false, 
        contentType: compressed.type 
      });
      
    if (error) {
      console.error('❌ Storage upload error:', error);
      throw error;
    }
    
    const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
    console.log('🔗 Public URL generated:', data.publicUrl);
    urls.push(data.publicUrl);
  }
  
  console.log('✅ All uploads complete:', urls);
  return urls;
}