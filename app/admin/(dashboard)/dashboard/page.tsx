import { prisma } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, Users, TrendingUp } from "lucide-react"

async function getDashboardStats() {
  const [productCount, orderCount, totalRevenue, recentOrders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: {
        totalAmount: true,
      },
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    }),
  ])

  return {
    productCount,
    orderCount,
    totalRevenue: Number(totalRevenue._sum.totalAmount || 0),
    recentOrders: recentOrders.map((order: any) => ({
      ...order,
      totalAmount: Number(order.totalAmount),
    })),
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Admin</h1>
        <p className="text-muted-foreground">Selamat datang di panel admin paskal shop</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Produk</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.productCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pesanan</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.orderCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rata-rata per Pesanan</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.orderCount > 0 ? formatPrice(stats.totalRevenue / stats.orderCount) : formatPrice(0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pesanan Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentOrders.map((order: any) => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{order.customerName}</p>
                  <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                  <p className="text-sm text-muted-foreground">{order.orderItems.length} item(s)</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{formatPrice(order.totalAmount)}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("id-ID")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
