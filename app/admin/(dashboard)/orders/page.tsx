import { prisma } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

async function getOrders() {
  const orders = await prisma.order.findMany({
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return orders.map((order) => ({
    ...order,
    totalAmount: Number(order.totalAmount),
  }))
}

export default async function AdminOrdersPage() {
  const orders = await getOrders()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price)
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      PENDING: "default",
      PROCESSING: "secondary",
      SHIPPED: "outline",
      DELIVERED: "default",
      CANCELLED: "destructive",
    } as const

    return <Badge variant={variants[status as keyof typeof variants] || "default"}>{status}</Badge>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Manajemen Pesanan</h1>
        <p className="text-muted-foreground">Kelola pesanan dari pelanggan</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pesanan</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Pesanan</TableHead>
                <TableHead>Pelanggan</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Items</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-sm">{order.id.slice(-8)}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-bold">{formatPrice(order.totalAmount)}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString("id-ID")}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {order.orderItems.map((item) => (
                        <div key={item.id} className="text-sm">
                          {item.product.name} x {item.quantity}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
