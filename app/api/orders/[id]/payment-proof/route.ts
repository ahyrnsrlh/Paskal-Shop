import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log("=== Payment Proof Upload API Called ===");
  console.log("Order ID:", params.id);
  console.log("Environment check:", {
    hasCloudinaryName: !!process.env.CLOUDINARY_CLOUD_NAME,
    hasCloudinaryKey: !!process.env.CLOUDINARY_API_KEY,
    hasCloudinarySecret: !!process.env.CLOUDINARY_API_SECRET,
  });
  
  try {
    const formData = await request.formData();
    const file = formData.get("paymentProof") as File;
    const paymentNotes = formData.get("paymentNotes") as string;
    const orderId = params.id;

    console.log("Form data:", { 
      hasFile: !!file, 
      fileSize: file?.size, 
      fileType: file?.type,
      paymentNotes 
    });

    if (!file) {
      console.log("No file uploaded");
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      console.log("Invalid file type:", file.type);
      return NextResponse.json(
        { error: "Invalid file type. Please upload JPG, PNG, or GIF" },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.log("File too large:", file.size);
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB" },
        { status: 400 }
      );
    }

    // Check if order exists
    console.log("Checking order existence...");
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      console.log("Order not found:", orderId);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    console.log("Order found:", order.id);

    // Check Cloudinary configuration
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error("Cloudinary not configured");
      return NextResponse.json(
        { error: "Upload service not configured" },
        { status: 500 }
      );
    }

    // Upload to Cloudinary
    console.log("Uploading to Cloudinary...");
    const cloudinaryUrl = await uploadToCloudinary(file, 'payment-proofs');
    console.log("Cloudinary URL:", cloudinaryUrl);

    // Update order with payment proof
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentProof: cloudinaryUrl,
        paymentStatus: "PAYMENT_UPLOADED",
        paymentNotes: paymentNotes || null,
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Payment proof uploaded successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error uploading payment proof:", error);
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
