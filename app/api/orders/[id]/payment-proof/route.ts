import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log("=== Payment Proof Upload API Called ===");
  console.log("Order ID:", params.id);
  
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

    // Check if order exists
    console.log("🔍 Checking if order exists:", orderId);
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      console.log("❌ Order not found:", orderId);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    console.log("✅ Order found:", order.id);

    // Upload to Cloudinary
    console.log("📤 Starting upload to Cloudinary...");
    const cloudinaryUrl = await uploadToCloudinary(file, 'payment-proofs');
    console.log("✅ Cloudinary upload successful:", cloudinaryUrl);

    // Update order with payment proof
    console.log("💾 Updating order in database...");
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

    console.log("✅ Order updated successfully");
    return NextResponse.json({
      message: "Payment proof uploaded successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("❌ Error uploading payment proof:", error);
    
    // Better error response based on error type
    if (error instanceof Error) {
      if (error.message.includes('Cloudinary')) {
        return NextResponse.json(
          { error: "Failed to upload image. Please try again." },
          { status: 500 }
        );
      }
      if (error.message.includes('credentials')) {
        return NextResponse.json(
          { error: "Server configuration error. Please contact support." },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
