import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  console.log("=== Product Image Upload API Called ===");
  
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;

    console.log("File details:", {
      hasFile: !!file,
      fileSize: file?.size,
      fileType: file?.type
    });

    if (!file) {
      console.log("❌ No file uploaded");
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      console.log("❌ Invalid file type:", file.type);
      return NextResponse.json(
        { error: "Invalid file type. Please upload JPG, PNG, or GIF" },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.log("❌ File too large:", file.size);
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB" },
        { status: 400 }
      );
    }

    // Upload to Cloudinary
    console.log("📤 Starting upload to Cloudinary...");
    const cloudinaryUrl = await uploadToCloudinary(file, 'products');
    console.log("✅ Cloudinary upload successful:", cloudinaryUrl);

    return NextResponse.json({
      message: "Image uploaded successfully",
      imagePath: cloudinaryUrl,
    });
  } catch (error) {
    console.error("❌ PRODUCT IMAGE UPLOAD ERROR:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
    
    // Better error response based on error type
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase()
      
      if (errorMessage.includes('cloudinary_not_configured')) {
        return NextResponse.json(
          { error: "Upload service not configured. Please contact administrator." },
          { status: 503 }
        );
      }
      
      if (errorMessage.includes('invalid_file') || errorMessage.includes('file_too_large')) {
        return NextResponse.json(
          { error: error.message.split(':')[1]?.trim() || "Invalid file" },
          { status: 400 }
        );
      }
      
      if (errorMessage.includes('cloudinary') || errorMessage.includes('upload')) {
        return NextResponse.json(
          { error: "Failed to upload image. Please check your internet connection and try again." },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json(
      { 
        error: "Internal server error. Please try again later.",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
