import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const orderId = formData.get("orderId") as string;
    const paymentNotes = (formData.get("paymentNotes") as string) || "";

    if (!file || !orderId) {
      return NextResponse.json(
        { error: "File dan order ID diperlukan" },
        { status: 400 }
      );
    }

    // Validasi tipe file
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipe file tidak didukung. Gunakan JPG, PNG, atau WebP" },
        { status: 400 }
      );
    }

    // Validasi ukuran file (maksimal 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Ukuran file terlalu besar. Maksimal 5MB" },
        { status: 400 }
      );
    }

    // Buat nama file unik
    const timestamp = new Date().getTime();
    const fileExtension = file.name.split(".").pop();
    const fileName = `payment_${orderId}_${timestamp}.${fileExtension}`;

    // Simpan file ke direktori uploads
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadsDir = join(process.cwd(), "public", "uploads");
    const filePath = join(uploadsDir, fileName);

    await writeFile(filePath, buffer);

    // Update order dengan bukti pembayaran
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: "PAYMENT_UPLOADED",
        paymentProof: `/uploads/${fileName}`,
        paymentNotes: paymentNotes,
        paidAt: new Date(),
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
      message: "Bukti pembayaran berhasil diupload",
      order: updatedOrder,
      fileName: fileName,
    });
  } catch (error) {
    console.error("Error uploading payment proof:", error);
    return NextResponse.json(
      { error: "Gagal mengupload bukti pembayaran" },
      { status: 500 }
    );
  }
}
