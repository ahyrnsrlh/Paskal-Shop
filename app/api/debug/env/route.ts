import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Only allow in development or with special header
    const isDev = process.env.NODE_ENV === 'development'
    const debugHeader = request.headers.get('x-debug-key')
    
    if (!isDev && debugHeader !== process.env.DEBUG_KEY) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const envCheck = {
      NODE_ENV: process.env.NODE_ENV,
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? 'SET' : 'MISSING',
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? 'SET' : 'MISSING', 
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'MISSING',
      DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'MISSING',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'MISSING',
      timestamp: new Date().toISOString()
    }

    console.log('🔍 Environment check requested:', envCheck)

    return NextResponse.json({
      status: 'ok',
      environment: envCheck,
      cloudinaryConfigured: !!(
        process.env.CLOUDINARY_CLOUD_NAME && 
        process.env.CLOUDINARY_API_KEY && 
        process.env.CLOUDINARY_API_SECRET
      )
    })
  } catch (error) {
    console.error('❌ Environment check error:', error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
