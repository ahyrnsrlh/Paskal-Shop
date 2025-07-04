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
    console.error("❌ Error uploading image:", error);
    
    // Better error response
    if (error instanceof Error && error.message.includes('Cloudinary')) {
      return NextResponse.json(
        { error: "Failed to upload image. Please try again." },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
