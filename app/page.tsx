import { prisma } from "@/lib/db"
import { ProductCard } from "@/components/product-card"
import { FeaturedProducts } from "@/components/featured-products"

interface Product {
  id: string
  name: string
  price: number
  image: string | null
  stock: number
  createdAt: Date
}

async function getProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  })

  return products.map((product: any) => ({
    ...product,
    price: Number(product.price),
  }))
}

export default async function HomePage() {
  const products = await getProducts()

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-6 text-gray-900">Selamat Datang di Paskal Shop</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Temukan produk terbaik dengan harga terjangkau dan kualitas terpercaya di Paskal Shop</p>
        </div>

        <div className="space-y-16">
          {/* All Products */}
          <div>
            <h2 className="text-3xl font-bold mb-8 text-gray-900">Semua Produk</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product: Product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image || undefined}
                  stock={product.stock}
                />
              ))}
            </div>
          </div>

          {/* Featured Categories */}
          <FeaturedProducts title="Produk Terbaru" category="Electronics" limit={4} sortBy="newest" />

          <FeaturedProducts title="Produk Terpopuler" category="Fashion" limit={4} sortBy="popular" />
        </div>
      </div>
    </div>
  )
}
