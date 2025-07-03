import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""

    if (query.length < 2) {
      return NextResponse.json({ suggestions: [] })
    }

    const suggestions = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { category: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        name: true,
        price: true,
        image: true,
        category: true,
      },
      take: 5,
      orderBy: { name: "asc" },
    })

    const formattedSuggestions = suggestions.map((suggestion) => ({
      ...suggestion,
      price: Number(suggestion.price),
    }))

    return NextResponse.json({ suggestions: formattedSuggestions })
  } catch (error) {
    console.error("Suggestions error:", error)
    return NextResponse.json({ error: "Failed to get suggestions" }, { status: 500 })
  }
}
