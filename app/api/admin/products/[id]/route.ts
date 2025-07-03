import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { verifySession } from "@/lib/auth"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin session
    const session = await verifySession()
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const product = await prisma.product.findUnique({
      where: { id: params.id },
    })

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      ...product,
      price: Number(product.price),
    })
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const { name, description, price, stock, category, image } = body

    // Validate required fields
    if (!name || !price || stock === undefined || !category) {
      return NextResponse.json(
        { message: "Name, price, stock, and category are required" },
        { status: 400 }
      )
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: params.id },
    })

    if (!existingProduct) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      )
    }

    // Update the product
    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name,
        description: description || "",
        price: parseFloat(price),
        stock: parseInt(stock),
        category,
        image: image || "/placeholder.svg?height=400&width=400",
      },
    })

    return NextResponse.json({
      message: "Product updated successfully",
      product: {
        ...product,
        price: Number(product.price),
      },
    })
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin session
    const session = await verifySession()
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: params.id },
    })

    if (!existingProduct) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      )
    }

    // Delete the product
    await prisma.product.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      message: "Product deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
