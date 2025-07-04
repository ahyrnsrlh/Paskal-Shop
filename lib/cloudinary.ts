import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export { cloudinary }

// Helper function to upload file to Cloudinary
export async function uploadToCloudinary(
  file: File,
  folder: string
): Promise<string> {
  console.log('🚀 Upload to Cloudinary started')
  console.log('Environment check:', {
    NODE_ENV: process.env.NODE_ENV,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? 'SET' : 'MISSING',
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? 'SET' : 'MISSING',
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'MISSING',
  })

  // Check if Cloudinary is properly configured
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('❌ Cloudinary credentials missing')
    throw new Error('CLOUDINARY_NOT_CONFIGURED: Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in environment variables')
  }

  try {
    console.log('📤 Processing file:', {
      name: file.name,
      size: file.size,
      type: file.type,
      targetFolder: `paskal-shop/${folder}`
    })

    // Validate file
    if (!file || file.size === 0) {
      throw new Error('INVALID_FILE: File is empty or invalid')
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      throw new Error('FILE_TOO_LARGE: File size exceeds 10MB limit')
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`INVALID_FILE_TYPE: Only ${allowedTypes.join(', ')} are allowed`)
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    console.log('📊 Buffer created, size:', buffer.length)

    // Generate unique filename
    const timestamp = Date.now()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const publicId = `${timestamp}_${sanitizedName.split('.')[0]}`
    
    return new Promise((resolve, reject) => {
      console.log('☁️ Starting Cloudinary upload stream...')
      
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `paskal-shop/${folder}`,
          public_id: publicId,
          resource_type: 'image',
          use_filename: true,
          unique_filename: false,
          overwrite: true,
          timeout: 60000, // 60 seconds timeout
        },
        (error, result) => {
          if (error) {
            console.error('❌ Cloudinary upload error:', {
              message: error.message,
              http_code: error.http_code,
              name: error.name
            })
            reject(new Error(`CLOUDINARY_UPLOAD_FAILED: ${error.message}`))
          } else if (result && result.secure_url) {
            console.log('✅ Cloudinary upload successful:', {
              url: result.secure_url,
              public_id: result.public_id,
              bytes: result.bytes,
              format: result.format
            })
            resolve(result.secure_url)
          } else {
            console.error('❌ Cloudinary upload failed: No result returned')
            reject(new Error('CLOUDINARY_NO_RESULT: Upload completed but no URL returned'))
          }
        }
      )

      uploadStream.end(buffer)
    })
  } catch (error) {
    console.error('❌ Error in uploadToCloudinary:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error(`UPLOAD_ERROR: ${String(error)}`)
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
