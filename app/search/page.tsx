import { Suspense } from "react"
import { SearchResults } from "./search-results"
import { ProductFilters } from "@/components/product-filters"
import { SearchBar } from "@/components/search-bar"

async function getFilterMetadata() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/products/filters`,
      {
        cache: "no-store",
      },
    )
    if (!response.ok) throw new Error("Failed to fetch")
    return await response.json()
  } catch (error) {
    console.error("Error fetching filter metadata:", error)
    return { categories: [], priceRange: { min: 0, max: 0 } }
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const filterMetadata = await getFilterMetadata()

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Pencarian Produk</h1>
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <SearchBar />
          {searchParams.q && (
            <p className="text-muted-foreground">
              Hasil pencarian untuk: <strong>"{searchParams.q}"</strong>
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <ProductFilters categories={filterMetadata.categories} priceRange={filterMetadata.priceRange} />
          </div>
        </div>

        {/* Search Results */}
        <div className="lg:col-span-3">
          <Suspense fallback={<SearchResultsSkeleton />}>
            <SearchResults searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

function SearchResultsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 bg-gray-200 rounded animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="aspect-square bg-gray-200 rounded animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
