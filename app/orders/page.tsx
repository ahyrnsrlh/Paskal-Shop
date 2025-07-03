"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  Eye,
  Calendar,
  ShoppingBag,
  CheckCircle,
  Clock,
  AlertCircle,
  Upload,
  Package,
  Truck,
  XCircle,
  FileText,
} from "lucide-react";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    image: string | null;
  };
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  orderItems: OrderItem[];
}

export default function OrdersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState("");
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

  useEffect(() => {
    // In a real app, you'd get orders by user authentication
    // For now, we'll allow searching by email
  }, []);

  const handleSearch = async () => {
    if (!searchEmail.trim()) {
      toast({
        title: "Error",
        description: "Masukkan email untuk mencari pesanan",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/orders?email=${encodeURIComponent(searchEmail)}`
      );
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
        setFilteredOrders(data);
      } else {
        toast({
          title: "Error",
          description: "Tidak ada pesanan ditemukan dengan email tersebut",
          variant: "destructive",
        });
        setOrders([]);
        setFilteredOrders([]);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mencari pesanan",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "WAITING_PAYMENT":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            <Clock className="w-3 h-3 mr-1" />
            Menunggu Pembayaran
          </Badge>
        );
      case "PAYMENT_UPLOADED":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            <Upload className="w-3 h-3 mr-1" />
            Bukti Diupload
          </Badge>
        );
      case "PAYMENT_CONFIRMED":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Pembayaran Dikonfirmasi
          </Badge>
        );
      case "PAYMENT_REJECTED":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            <AlertCircle className="w-3 h-3 mr-1" />
            Pembayaran Ditolak
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge
            variant="outline"
            className="bg-gray-50 text-gray-700 border-gray-200"
          >
            <Package className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "PROCESSING":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            <Package className="w-3 h-3 mr-1" />
            Diproses
          </Badge>
        );
      case "SHIPPED":
        return (
          <Badge
            variant="outline"
            className="bg-purple-50 text-purple-700 border-purple-200"
          >
            <Truck className="w-3 h-3 mr-1" />
            Dikirim
          </Badge>
        );
      case "DELIVERED":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Selesai
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            <XCircle className="w-3 h-3 mr-1" />
            Dibatalkan
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Cek Status Pesanan</h1>
        <p className="text-gray-600">
          Masukkan email untuk melihat pesanan Anda
        </p>
      </div>

      {/* Search Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Cari Pesanan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="email">Email yang digunakan saat checkout</Label>
              <Input
                id="email"
                type="email"
                placeholder="Masukkan email Anda"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleSearch}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                Cari Pesanan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      {filteredOrders.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Pesanan Anda</h2>

          {filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      Order #{order.id.slice(-8)}
                    </CardTitle>
                    <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right space-y-2">
                    {getPaymentStatusBadge(order.paymentStatus)}
                    {getOrderStatusBadge(order.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Order Items */}
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4" />
                      Produk ({order.orderItems.length} item)
                    </h4>
                    <div className="space-y-2">
                      {order.orderItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded"
                        >
                          <span>
                            {item.product.name} x {item.quantity}
                          </span>
                          <span className="font-medium">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total and Actions */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="text-sm text-gray-600">Total Pembayaran</p>
                      <p className="text-xl font-bold text-green-600">
                        {formatPrice(order.totalAmount)}
                      </p>
                    </div>
                    <div className="space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => router.push(`/payment/${order.id}`)}
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        Lihat Detail
                      </Button>
                      {order.paymentStatus === "PAYMENT_CONFIRMED" && (
                        <Button
                          variant="outline"
                          onClick={() => router.push(`/invoice/${order.id}`)}
                          className="flex items-center gap-2"
                        >
                          <FileText className="h-4 w-4" />
                          Invoice
                        </Button>
                      )}
                      {(order.paymentStatus === "WAITING_PAYMENT" ||
                        order.paymentStatus === "PAYMENT_REJECTED") &&
                        (order.paymentMethod === "transfer" ||
                          order.paymentMethod === "ewallet") && (
                          <Button
                            onClick={() => router.push(`/payment/${order.id}`)}
                            className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                          >
                            <Upload className="h-4 w-4" />
                            Upload Bukti
                          </Button>
                        )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* No orders found */}
      {!loading && searchEmail && filteredOrders.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Tidak ada pesanan ditemukan
            </h3>
            <p className="text-gray-600 mb-6">
              Tidak ditemukan pesanan dengan email{" "}
              <strong>{searchEmail}</strong>
            </p>
            <Button
              onClick={() => router.push("/")}
              className="bg-green-600 hover:bg-green-700"
            >
              Mulai Belanja
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Initial state */}
      {!searchEmail && (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Cek Status Pesanan Anda
            </h3>
            <p className="text-gray-600 mb-6">
              Masukkan email yang digunakan saat checkout untuk melihat status
              pesanan Anda
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
