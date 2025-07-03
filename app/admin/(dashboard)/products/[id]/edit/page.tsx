"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Loader2, Upload, X, ImageIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  category: string
  image: string
}

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [loadingProduct, setLoadingProduct] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  })
  const [currentImage, setCurrentImage] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/admin/products/${params.id}`)
        if (response.ok) {
          const product: Product = await response.json()
          setFormData({
            name: product.name,
            description: product.description || "",
            price: product.price.toString(),
            stock: product.stock.toString(),
            category: product.category,
          })
          setCurrentImage(product.image || "")
        } else {
          toast({
            title: "Error",
            description: "Gagal mengambil data produk",
            variant: "destructive",
          })
          router.push("/admin/products")
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Terjadi kesalahan saat mengambil data produk",
          variant: "destructive",
        })
        router.push("/admin/products")
      } finally {
        setLoadingProduct(false)
      }
    }

    fetchProduct()
  }, [params.id, router, toast])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File terlalu besar",
          description: "Ukuran file maksimal 5MB",
          variant: "destructive",
        })
        return
      }

      // Check file type
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Format file tidak didukung",
          description: "Gunakan format JPG, PNG, GIF, atau WebP",
          variant: "destructive",
        })
        return
      }

      setImageFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeNewImage = () => {
    setImageFile(null)
    setImagePreview("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let imagePath = currentImage || "/placeholder.svg?height=400&width=400"
      
      // Upload new image if file is selected
      if (imageFile) {
        const imageFormData = new FormData()
        imageFormData.append("image", imageFile)
        
        const imageResponse = await fetch("/api/admin/products/upload-image", {
          method: "POST",
          body: imageFormData,
        })

        if (imageResponse.ok) {
          const imageData = await imageResponse.json()
          imagePath = imageData.imagePath
        } else {
          throw new Error("Gagal mengupload gambar")
        }
      }

      const response = await fetch(`/api/admin/products/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          category: formData.category,
          image: imagePath,
        }),
      })

      if (response.ok) {
        toast({
          title: "Produk berhasil diperbarui",
          description: "Data produk telah diperbarui",
        })
        router.push("/admin/products")
      } else {
        const error = await response.json()
        toast({
          title: "Gagal memperbarui produk",
          description: error.message || "Terjadi kesalahan",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Gagal memperbarui produk",
        description: error instanceof Error ? error.message : "Terjadi kesalahan koneksi",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loadingProduct) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/products">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit Produk</h1>
            <p className="text-muted-foreground">Memuat data produk...</p>
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
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Produk</h1>
          <p className="text-muted-foreground">Perbarui informasi produk</p>
        </div>
      </div>

      <Card className="bg-white border-0 shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="text-gray-900">Informasi Produk</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700">Nama Produk *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Masukkan nama produk"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                  className="border-gray-200 focus:border-green-500 focus:ring-green-500 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-gray-700">Kategori *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)} required>
                  <SelectTrigger className="border-gray-200 focus:border-green-500 focus:ring-green-500 rounded-lg">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Fashion">Fashion</SelectItem>
                    <SelectItem value="Home">Home</SelectItem>
                    <SelectItem value="Books">Books</SelectItem>
                    <SelectItem value="Sports">Sports</SelectItem>
                    <SelectItem value="Toys">Toys</SelectItem>
                    <SelectItem value="Beauty">Beauty</SelectItem>
                    <SelectItem value="Food">Food</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price" className="text-gray-700">Harga (IDR) *</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0"
                  min="0"
                  step="1000"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  required
                  className="border-gray-200 focus:border-green-500 focus:ring-green-500 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock" className="text-gray-700">Stok *</Label>
                <Input
                  id="stock"
                  type="number"
                  placeholder="0"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => handleInputChange("stock", e.target.value)}
                  required
                  className="border-gray-200 focus:border-green-500 focus:ring-green-500 rounded-lg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-700">Deskripsi</Label>
              <Textarea
                id="description"
                placeholder="Masukkan deskripsi produk"
                rows={4}
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="border-gray-200 focus:border-green-500 focus:ring-green-500 rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image" className="text-gray-700">Gambar Produk</Label>
              <div className="space-y-4">
                {/* Current Image */}
                {currentImage && !imagePreview && (
                  <div className="relative w-full max-w-md">
                    <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={currentImage}
                        alt="Current image"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">Gambar saat ini</p>
                    </div>
                  </div>
                )}

                {/* New Image Preview */}
                {imagePreview && (
                  <div className="relative w-full max-w-md">
                    <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={imagePreview}
                        alt="New image preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={removeNewImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <div className="mt-2">
                      <p className="text-sm text-green-600">Gambar baru (belum disimpan)</p>
                    </div>
                  </div>
                )}

                {/* Upload Area */}
                {!imagePreview && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <div className="space-y-2">
                      <Label htmlFor="image-upload" className="cursor-pointer">
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                          <Upload className="h-4 w-4" />
                          {currentImage ? "Ganti gambar" : "Upload gambar baru"}
                        </div>
                      </Label>
                      <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <p className="text-xs text-gray-500">
                        Format: JPG, PNG, GIF, WebP. Maksimal 5MB
                      </p>
                    </div>
                  </div>
                )}
                
                {!imagePreview && (
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('image-upload')?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {currentImage ? "Ganti Gambar" : "Pilih Gambar"}
                    </Button>
                    {!currentImage && (
                      <span className="text-sm text-gray-500">atau gunakan placeholder jika kosong</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 rounded-lg">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  "Perbarui Produk"
                )}
              </Button>
              <Button type="button" variant="outline" asChild className="border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg">
                <Link href="/admin/products">Batal</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
