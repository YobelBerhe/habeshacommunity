import imageCompression from 'browser-image-compression';
import { supabase } from '@/integrations/supabase/client';

export async function uploadListingImages(files: File[], userId: string) {
  const urls: string[] = [];
  for (const file of files.slice(0, 6)) {
    const compressed = await imageCompression(file, { maxSizeMB: 0.2, maxWidthOrHeight: 1920, useWebWorker: true });
    const key = `u_${userId}/${Date.now()}_${Math.random().toString(36).slice(2)}.${compressed.type.split('/')[1] || 'jpg'}`;
    const { error } = await supabase.storage.from('listing-images').upload(key, compressed, { upsert: false, contentType: compressed.type });
    if (error) throw error;
    const { data } = supabase.storage.from('listing-images').getPublicUrl(key);
    urls.push(data.publicUrl);
  }
  return urls;
}