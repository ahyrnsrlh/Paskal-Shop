"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Loader2 } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Product {
  id: string
  name: string
  price: number
  stock: number
  category: string
  image: string | null
  createdAt: Date
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/admin/products")
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products)
      } else {
        toast({
          title: "Error",
          description: "Gagal mengambil data produk",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat mengambil data produk",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleDeleteProduct = async (productId: string, productName: string) => {
    setDeletingId(productId)
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Produk berhasil dihapus",
          description: `${productName} telah dihapus dari katalog`,
        })
        // Refresh the products list
        fetchProducts()
      } else {
        const error = await response.json()
        toast({
          title: "Gagal menghapus produk",
          description: error.message || "Terjadi kesalahan",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Gagal menghapus produk",
        description: "Terjadi kesalahan koneksi",
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manajemen Produk</h1>
            <p className="text-gray-600">Kelola produk di toko Anda</p>
          </div>
          <Button asChild className="bg-green-600 hover:bg-green-700 rounded-lg">
            <Link href="/admin/products/new">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Produk
            </Link>
          </Button>
        </div>
        </div>
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manajemen Produk</h1>
            <p className="text-gray-600">Kelola produk di toko Anda</p>
          </div>
          <Button asChild className="bg-green-600 hover:bg-green-700 rounded-lg">
            <Link href="/admin/products/new">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Produk
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="bg-white border-0 shadow-lg rounded-xl overflow-hidden">
            <div className="aspect-square relative">
              <Image
                src={product.image || "/placeholder.svg?height=300&width=300"}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle className="line-clamp-2 text-gray-900">{product.name}</CardTitle>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-green-600">{formatPrice(product.price)}</span>
                <Badge variant={product.stock > 0 ? "default" : "destructive"} className="rounded-lg">
                  Stok: {product.stock}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm" className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg">
                  <Link href={`/admin/products/${product.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" disabled={deletingId === product.id} className="rounded-lg">
                      {deletingId === product.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Hapus Produk</AlertDialogTitle>
                      <AlertDialogDescription>
                        Apakah Anda yakin ingin menghapus produk "{product.name}"? Tindakan ini tidak dapat dibatalkan.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="rounded-lg">Batal</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteProduct(product.id, product.name)}
                        className="bg-red-600 hover:bg-red-700 rounded-lg"
                      >
                        Hapus
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Belum ada produk yang ditambahkan</p>
          <Button asChild className="bg-green-600 hover:bg-green-700 rounded-lg">
            <Link href="/admin/products/new">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Produk Pertama
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
