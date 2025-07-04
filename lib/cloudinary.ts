import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary with fallback handling
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'your-cloud-name',
  api_key: process.env.CLOUDINARY_API_KEY || 'your-api-key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'your-api-secret',
})

export { cloudinary }

// Helper function to upload file to Cloudinary
export async function uploadToCloudinary(
  file: File,
  folder: string
): Promise<string> {
  // Check if Cloudinary is properly configured
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('Cloudinary credentials not configured');
    console.error('Available env vars:', {
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? 'SET' : 'NOT SET',
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET',
    });
    throw new Error('Cloudinary credentials not configured. Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your environment variables.');
  }

  try {
    console.log('Starting Cloudinary upload for folder:', folder);
    console.log('File details:', {
      name: file.name,
      size: file.size,
      type: file.type
    });
    
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: `paskal-shop/${folder}`,
          resource_type: 'image',
          format: 'auto',
          quality: 'auto',
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(new Error(`Cloudinary upload failed: ${error.message}`));
          } else {
            console.log('Cloudinary upload successful:', result?.secure_url);
            resolve(result?.secure_url || '');
          }
        }
      ).end(buffer);
    });
  } catch (error) {
    console.error('Error in uploadToCloudinary:', error);
    throw new Error(`Failed to upload image to Cloudinary: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Helper function to delete file from Cloudinary
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    console.error('Failed to delete image from Cloudinary:', error)
  }
}

// Helper function to extract public ID from Cloudinary URL
export function getPublicIdFromUrl(url: string): string {
  const parts = url.split('/')
  const filename = parts[parts.length - 1]
  return filename.split('.')[0]
}
