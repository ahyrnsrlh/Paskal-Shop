import { notFound } from "next/navigation"
import Image from "next/image"
import { prisma } from "@/lib/db"
import { AddToCartButton } from "./add-to-cart-button"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

async function getProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
  })

  if (!product) return null

  return {
    ...product,
    price: Number(product.price),
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const product = await getProduct(params.id)

  if (!product) {
    notFound()
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Button asChild variant="ghost" className="mb-6 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg">
          <Link href="/" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Home</span>
          </Link>
        </Button>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-square relative">
              <Image
                src={product.image || "/placeholder.svg?height=600&width=600"}
                alt={product.name}
                fill
                className="object-cover rounded-xl"
              />
            </div>

            <div className="space-y-8">
              <div>
                <h1 className="text-4xl font-bold mb-4 text-gray-900">{product.name}</h1>
                {product.category && (
                  <Badge variant="secondary" className="mb-6 bg-green-100 text-green-700 rounded-lg">
                    {product.category}
                  </Badge>
                )}
                <p className="text-4xl font-bold text-green-600 mb-6">{formatPrice(product.price)}</p>
                <p className="text-gray-600 mb-6">Stok tersedia: <span className="font-semibold text-green-600">{product.stock} unit</span></p>
              </div>

              {product.description && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4 text-gray-900">Deskripsi</h2>
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>
              )}

              <div className="space-y-4">
                <AddToCartButton
                  product={{
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                  }}
                  stock={product.stock}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
