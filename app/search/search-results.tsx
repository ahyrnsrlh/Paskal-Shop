import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Package } from "lucide-react"

interface SearchResultsProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

async function searchProducts(params: URLSearchParams) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/products/search?${params.toString()}`,
      { cache: "no-store" },
    )
    if (!response.ok) throw new Error("Failed to fetch")
    return await response.json()
  } catch (error) {
    console.error("Error searching products:", error)
    return { products: [], pagination: { page: 1, totalCount: 0, totalPages: 0, hasNext: false, hasPrev: false } }
  }
}

export async function SearchResults({ searchParams }: SearchResultsProps) {
  const params = new URLSearchParams()

  // Add all search params to the API call
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value) {
      params.set(key, Array.isArray(value) ? value.join(",") : value)
    }
  })

  const { products, pagination } = await searchProducts(params)

  const buildPageUrl = (page: number) => {
    const newParams = new URLSearchParams(params)
    newParams.set("page", page.toString())
    return `/search?${newParams.toString()}`
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <Package className="mx-auto h-24 w-24 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Tidak ada produk ditemukan</h2>
        <p className="text-muted-foreground mb-6">Coba ubah kata kunci pencarian atau filter yang digunakan</p>
        <Button asChild>
          <Link href="/">Kembali ke Home</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-lg font-semibold">{pagination.totalCount} produk ditemukan</p>
          <p className="text-sm text-muted-foreground">
            Halaman {pagination.page} dari {pagination.totalPages}
          </p>
        </div>

        {/* Results per page info */}
        <Badge variant="outline">
          Menampilkan {(pagination.page - 1) * 12 + 1}-{Math.min(pagination.page * 12, pagination.totalCount)} dari{" "}
          {pagination.totalCount}
        </Badge>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product: any) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            image={product.image}
            stock={product.stock}
          />
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-center items-center space-x-2">
              {pagination.hasPrev && (
                <Button asChild variant="outline" size="sm" className="bg-transparent">
                  <Link href={buildPageUrl(pagination.page - 1)}>
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Sebelumnya
                  </Link>
                </Button>
              )}

              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1
                  } else if (pagination.page >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i
                  } else {
                    pageNum = pagination.page - 2 + i
                  }

                  return (
                    <Button
                      key={pageNum}
                      asChild
                      variant={pageNum === pagination.page ? "default" : "outline"}
                      size="sm"
                      className={pageNum !== pagination.page ? "bg-transparent" : ""}
                    >
                      <Link href={buildPageUrl(pageNum)}>{pageNum}</Link>
                    </Button>
                  )
                })}
              </div>

              {pagination.hasNext && (
                <Button asChild variant="outline" size="sm" className="bg-transparent">
                  <Link href={buildPageUrl(pagination.page + 1)}>
                    Selanjutnya
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
