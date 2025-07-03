import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { verifySession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    // Verify admin session
    const session = await verifySession()
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")

    const skip = (page - 1) * limit

    const where: any = {}
    if (status && status !== "all") {
      where.paymentStatus = status
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ])

    return NextResponse.json({
      orders: orders.map((order: any) => ({
        ...order,
        totalAmount: Number(order.totalAmount),
        orderItems: order.orderItems.map((item: any) => ({
          ...item,
          price: Number(item.price),
          product: {
            ...item.product,
            price: Number(item.product.price),
          },
        })),
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Verify admin session
    const session = await verifySession()
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { orderId, paymentStatus, paymentNotes } = body

    if (!orderId || !paymentStatus) {
      return NextResponse.json(
        { message: "Order ID and payment status are required" },
        { status: 400 }
      )
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    })

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      )
    }

    const updateData: any = {
      paymentStatus,
      confirmedBy: session.username,
      updatedAt: new Date(),
    }

    if (paymentNotes) {
      updateData.paymentNotes = paymentNotes
    }

    if (paymentStatus === "PAYMENT_CONFIRMED") {
      updateData.paidAt = new Date()
      updateData.status = "PROCESSING"
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
    })

    return NextResponse.json({
      message: "Payment status updated successfully",
      order: {
        ...updatedOrder,
        totalAmount: Number(updatedOrder.totalAmount),
      },
    })
  } catch (error) {
    console.error("Error updating payment status:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
