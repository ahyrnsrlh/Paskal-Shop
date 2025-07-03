import Link from "next/link"
import { prisma } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, ShoppingCart, Users, TrendingUp, CreditCard, Clock } from "lucide-react"

async function getDashboardStats() {
  const [productCount, orderCount, pendingPayments, confirmedPayments] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.count({
      where: {
        paymentStatus: "PAYMENT_UPLOADED"
      }
    }),
    prisma.order.count({
      where: {
        paymentStatus: "PAYMENT_CONFIRMED"
      }
    }),
  ])

  return {
    productCount,
    orderCount,
    pendingPayments,
    confirmedPayments,
  }
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats()

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
        <p className="text-gray-600">Selamat datang di panel admin Paskal Shop</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Produk</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.productCount}</div>
            <p className="text-xs text-muted-foreground">
              Produk dalam katalog
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pesanan</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.orderCount}</div>
            <p className="text-xs text-muted-foreground">
              Pesanan yang diterima
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pembayaran Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingPayments}</div>
            <p className="text-xs text-muted-foreground">
              Menunggu verifikasi
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pembayaran Terkonfirmasi</CardTitle>
            <CreditCard className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.confirmedPayments}</div>
            <p className="text-xs text-muted-foreground">
              Sudah terkonfirmasi
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full bg-green-600 hover:bg-green-700">
              <Link href="/admin/products/new">
                <Package className="mr-2 h-4 w-4" />
                Tambah Produk Baru
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/products">
                <Package className="mr-2 h-4 w-4" />
                Kelola Produk
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/orders">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Lihat Pesanan
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/payments">
                <CreditCard className="mr-2 h-4 w-4" />
                Kelola Pembayaran
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Fitur aktivitas akan segera hadir...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
