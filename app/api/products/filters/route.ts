import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    // Get unique categories
    const categories = await prisma.product.findMany({
      select: { category: true },
      where: { category: { not: null } },
      distinct: ["category"],
    })

    // Get price range
    const priceRange = await prisma.product.aggregate({
      _min: { price: true },
      _max: { price: true },
    })

    return NextResponse.json({
      categories: categories.map((c) => c.category).filter(Boolean),
      priceRange: {
        min: Number(priceRange._min.price) || 0,
        max: Number(priceRange._max.price) || 0,
      },
    })
  } catch (error) {
    console.error("Filter metadata error:", error)
    return NextResponse.json({ error: "Failed to get filter metadata" }, { status: 500 })
  }
}
