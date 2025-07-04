import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData();
    const file = formData.get("paymentProof") as File;
    const paymentNotes = formData.get("paymentNotes") as string;
    const orderId = params.id;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload JPG, PNG, or GIF" },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB" },
        { status: 400 }
      );
    }

    // Check if order exists
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Upload to Cloudinary
    const cloudinaryUrl = await uploadToCloudinary(file, 'payment-proofs');

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
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
