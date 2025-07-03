import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Creating order with data:", body); // Debug log

    const {
      customerName,
      customerEmail,
      customerPhone,
      address,
      city,
      postalCode,
      paymentMethod,
      totalAmount,
      items,
    } = body;

    // Calculate payment due date (24 hours from now for transfer/ewallet)
    let paymentDueDate = null;
    let bankName = null;
    let accountNumber = null;
    let accountName = null;
    let paymentInstructions = null;

    if (paymentMethod === "transfer") {
      paymentDueDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      bankName = "BCA";
      accountNumber = "1234567890";
      accountName = "Paskal Shop";
      paymentInstructions =
        "Transfer tepat sesuai nominal yang tertera dan upload bukti pembayaran.";
    } else if (paymentMethod === "ewallet") {
      paymentDueDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      paymentInstructions =
        "Transfer ke nomor 0812-3456-7890 (OVO/DANA/GoPay) atas nama Paskal Shop dan upload screenshot bukti pembayaran.";
    } else if (paymentMethod === "cod") {
      paymentInstructions =
        "Pembayaran dilakukan saat barang diterima. Siapkan uang pas sesuai total pembayaran.";
    }

    // Create order with order items
    const order = await prisma.order.create({
      data: {
        customerName,
        customerEmail,
        customerPhone: customerPhone || "",
        address,
        city,
        postalCode,
        paymentMethod,
        totalAmount,
        paymentStatus: "WAITING_PAYMENT",
        paymentDueDate,
        bankName,
        accountNumber,
        accountName,
        paymentInstructions,
        orderItems: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    // Update product stock
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    console.log("Order created successfully:", order.id); // Debug log
    return NextResponse.json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    const whereClause = email ? { customerEmail: email } : {};

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
