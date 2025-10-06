import imageCompression from 'browser-image-compression';

export async function compressImage(file: File): Promise<Blob> {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: 'image/jpeg',
  };

  try {
    return await imageCompression(file, options);
  } catch (error) {
    console.error('Image compression failed:', error);
    return file;
  }
}

export async function compressThumbnail(file: File): Promise<Blob> {
  const options = {
    maxSizeMB: 0.2,
    maxWidthOrHeight: 400,
    useWebWorker: true,
    fileType: 'image/jpeg',
  };

  try {
    return await imageCompression(file, options);
  } catch (error) {
    console.error('Thumbnail compression failed:', error);
    return file;
  }
}
