"use client"

import { useState } from "react"
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

export default function NewProductPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")

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

  const removeImage = () => {
    setImageFile(null)
    setImagePreview("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let imagePath = "/placeholder.svg?height=400&width=400"
      
      // Upload image first if file is selected
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

      const response = await fetch("/api/admin/products", {
        method: "POST",
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
          title: "Produk berhasil ditambahkan",
          description: "Produk baru telah ditambahkan ke katalog",
        })
        router.push("/admin/products")
      } else {
        const error = await response.json()
        toast({
          title: "Gagal menambahkan produk",
          description: error.message || "Terjadi kesalahan",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Gagal menambahkan produk",
        description: error instanceof Error ? error.message : "Terjadi kesalahan koneksi",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/products">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tambah Produk Baru</h1>
            <p className="text-gray-600">Buat produk baru untuk ditambahkan ke katalog</p>
          </div>
        </div>
      </div>

      <Card className="bg-white shadow-sm border">
        <CardHeader>
          <CardTitle className="text-gray-900">Informasi Produk</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Produk *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Masukkan nama produk"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Kategori *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tapis">Tapis</SelectItem>
                    <SelectItem value="Miniatur">Miniatur</SelectItem>
                    <SelectItem value="Patung">Patung</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Harga (IDR) *</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0"
                  min="0"
                  step="1000"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Stok *</Label>
                <Input
                  id="stock"
                  type="number"
                  placeholder="0"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => handleInputChange("stock", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                placeholder="Masukkan deskripsi produk"
                rows={4}
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Gambar Produk</Label>
              <div className="space-y-4">
                {imagePreview ? (
                  <div className="relative w-full max-w-md">
                    <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <div className="space-y-2">
                      <Label htmlFor="image-upload" className="cursor-pointer">
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                          <Upload className="h-4 w-4" />
                          Klik untuk upload gambar
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
                      Pilih Gambar
                    </Button>
                    <span className="text-sm text-gray-500">atau gunakan placeholder jika kosong</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  "Simpan Produk"
                )}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/products">Batal</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
