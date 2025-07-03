import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const query = searchParams.get("q") || ""
    const categories = searchParams.get("categories")?.split(",").filter(Boolean) || []
    const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined
    const stock = searchParams.get("stock") || ""
    const sort = searchParams.get("sort") || ""
    const page = Number(searchParams.get("page")) || 1
    const limit = Number(searchParams.get("limit")) || 12

    // Build where clause
    const where: any = {}

    // Text search
    if (query) {
      where.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ]
    }

    // Category filter
    if (categories.length > 0) {
      where.category = { in: categories }
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {}
      if (minPrice !== undefined) where.price.gte = minPrice
      if (maxPrice !== undefined) where.price.lte = maxPrice
    }

    // Stock filter
    if (stock === "in_stock") {
      where.stock = { gt: 0 }
    } else if (stock === "out_of_stock") {
      where.stock = { lte: 0 }
    }

    // Build orderBy clause
    let orderBy: any = { createdAt: "desc" } // default

    switch (sort) {
      case "name_asc":
        orderBy = { name: "asc" }
        break
      case "name_desc":
        orderBy = { name: "desc" }
        break
      case "price_asc":
        orderBy = { price: "asc" }
        break
      case "price_desc":
        orderBy = { price: "desc" }
        break
      case "newest":
        orderBy = { createdAt: "desc" }
        break
      case "oldest":
        orderBy = { createdAt: "asc" }
        break
    }

    // Get products with pagination
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ])

    // Convert Decimal to number
    const formattedProducts = products.map((product) => ({
      ...product,
      price: Number(product.price),
    }))

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      products: formattedProducts,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ error: "Failed to search products" }, { status: 500 })
  }
}
