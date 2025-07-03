"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  CreditCard, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Upload,
  Search
} from "lucide-react"
import Image from "next/image"

interface Order {
  id: string
  customerName: string
  customerEmail: string
  totalAmount: number
  paymentMethod: string
  paymentStatus: string
  paymentProof?: string
  paymentNotes?: string
  createdAt: string
  paidAt?: string
  confirmedBy?: string
  orderItems: Array<{
    id: string
    quantity: number
    price: number
    product: {
      id: string
      name: string
      image?: string
    }
  }>
}

export default function AdminPaymentsPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [paymentNotes, setPaymentNotes] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [updating, setUpdating] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchOrders()
  }, [statusFilter])

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/admin/payments?status=${statusFilter}`)
      if (response.ok) {
        const { orders } = await response.json()
        setOrders(orders)
      } else {
        toast({
          title: "Error",
          description: "Gagal mengambil data pembayaran",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat mengambil data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updatePaymentStatus = async (orderId: string, newStatus: string) => {
    setUpdating(true)
    try {
      const response = await fetch("/api/admin/payments", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          paymentStatus: newStatus,
          paymentNotes: paymentNotes || undefined,
        }),
      })

      if (response.ok) {
        toast({
          title: "Status pembayaran berhasil diupdate",
          description: `Pembayaran untuk pesanan #${orderId} telah ${newStatus === "PAYMENT_CONFIRMED" ? "dikonfirmasi" : "ditolak"}`,
        })
        fetchOrders()
        setSelectedOrder(null)
        setPaymentNotes("")
      } else {
        throw new Error("Failed to update payment status")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengupdate status pembayaran",
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "WAITING_PAYMENT":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200"><Clock className="w-3 h-3 mr-1" />Menunggu Pembayaran</Badge>
      case "PAYMENT_UPLOADED":
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200"><Upload className="w-3 h-3 mr-1" />Bukti Diupload</Badge>
      case "PAYMENT_CONFIRMED":
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Dikonfirmasi</Badge>
      case "PAYMENT_REJECTED":
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Ditolak</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Pembayaran</h1>
          <p className="text-gray-600">Kelola dan verifikasi pembayaran pelanggan</p>
        </div>
      </div>

      {/* Filter */}
      <Card className="bg-white shadow-lg border-0 rounded-xl">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="statusFilter" className="text-gray-700">Filter Status Pembayaran</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="mt-2 border-gray-200 focus:border-green-500 focus:ring-green-500 rounded-lg">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="WAITING_PAYMENT">Menunggu Pembayaran</SelectItem>
                  <SelectItem value="PAYMENT_UPLOADED">Bukti Diupload</SelectItem>
                  <SelectItem value="PAYMENT_CONFIRMED">Dikonfirmasi</SelectItem>
                  <SelectItem value="PAYMENT_REJECTED">Ditolak</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={fetchOrders} variant="outline" className="border-gray-200 hover:bg-gray-50 rounded-lg">
              <Search className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.length === 0 ? (
          <Card className="bg-white shadow-lg border-0 rounded-xl">
            <CardContent className="p-8 text-center">
              <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada pembayaran</h3>
              <p className="text-gray-500">Belum ada pembayaran yang perlu diverifikasi</p>
            </CardContent>
          </Card>
        ) : (
          orders.map((order) => (
            <Card key={order.id} className="bg-white shadow-lg border-0 rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">#{order.id}</h3>
                      {getPaymentStatusBadge(order.paymentStatus)}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Pelanggan:</span>
                        <p className="font-medium text-gray-900">{order.customerName}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Total:</span>
                        <p className="font-medium text-green-600">{formatPrice(order.totalAmount)}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Metode:</span>
                        <p className="font-medium">{order.paymentMethod === "transfer" ? "Transfer Bank" : order.paymentMethod}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Tanggal:</span>
                        <p className="font-medium">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                          className="border-gray-200 hover:bg-gray-50 rounded-lg"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Detail
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Detail Pembayaran #{selectedOrder?.id}</DialogTitle>
                          <DialogDescription>
                            Verifikasi bukti pembayaran dan update status
                          </DialogDescription>
                        </DialogHeader>
                        
                        {selectedOrder && (
                          <div className="space-y-6">
                            {/* Order Info */}
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500">Pelanggan:</span>
                                <p className="font-medium">{selectedOrder.customerName}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Email:</span>
                                <p className="font-medium">{selectedOrder.customerEmail}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Total:</span>
                                <p className="font-medium text-green-600">{formatPrice(selectedOrder.totalAmount)}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Status:</span>
                                {getPaymentStatusBadge(selectedOrder.paymentStatus)}
                              </div>
                            </div>

                            {/* Payment Proof */}
                            {selectedOrder.paymentProof && (
                              <div>
                                <Label className="text-gray-700 font-medium">Bukti Pembayaran</Label>
                                <div className="mt-2 border rounded-lg p-4 bg-gray-50">
                                  <Image
                                    src={selectedOrder.paymentProof}
                                    alt="Bukti Pembayaran"
                                    width={400}
                                    height={300}
                                    className="rounded-lg object-cover mx-auto"
                                  />
                                </div>
                              </div>
                            )}

                            {/* Order Items */}
                            <div>
                              <Label className="text-gray-700 font-medium">Item Pesanan</Label>
                              <div className="mt-2 space-y-2">
                                {selectedOrder.orderItems.map((item) => (
                                  <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                    <span>{item.product.name} x {item.quantity}</span>
                                    <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Admin Notes */}
                            {selectedOrder.paymentStatus === "PAYMENT_UPLOADED" && (
                              <div>
                                <Label htmlFor="paymentNotes" className="text-gray-700 font-medium">
                                  Catatan Admin (Opsional)
                                </Label>
                                <Textarea
                                  id="paymentNotes"
                                  value={paymentNotes}
                                  onChange={(e) => setPaymentNotes(e.target.value)}
                                  placeholder="Tambahkan catatan jika diperlukan..."
                                  className="mt-2 border-gray-200 focus:border-green-500 focus:ring-green-500 rounded-lg"
                                />
                              </div>
                            )}

                            {/* Existing Notes */}
                            {selectedOrder.paymentNotes && (
                              <div>
                                <Label className="text-gray-700 font-medium">Catatan Sebelumnya</Label>
                                <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm">
                                  {selectedOrder.paymentNotes}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        <DialogFooter>
                          {selectedOrder?.paymentStatus === "PAYMENT_UPLOADED" && (
                            <div className="flex gap-2 w-full">
                              <Button
                                variant="destructive"
                                onClick={() => updatePaymentStatus(selectedOrder.id, "PAYMENT_REJECTED")}
                                disabled={updating}
                                className="flex-1 rounded-lg"
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Tolak
                              </Button>
                              <Button
                                onClick={() => updatePaymentStatus(selectedOrder.id, "PAYMENT_CONFIRMED")}
                                disabled={updating}
                                className="flex-1 bg-green-600 hover:bg-green-700 rounded-lg"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Konfirmasi
                              </Button>
                            </div>
                          )}
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
