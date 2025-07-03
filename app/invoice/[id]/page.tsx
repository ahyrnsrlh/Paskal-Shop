"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Download,
  Printer,
  ArrowLeft,
  CheckCircle,
  Store,
  MapPin,
  Phone,
  Mail,
  Calendar,
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
  customerPhone: string | null;
  address: string;
  city: string;
  postalCode: string;
  paymentMethod: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  paidAt: string | null;
  orderItems: OrderItem[];
}

export default function InvoicePage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const orderId = params.id as string;

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (response.ok) {
        const orderData = await response.json();
        setOrder(orderData);
      } else {
        router.push("/orders");
      }
    } catch (error) {
      router.push("/orders");
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

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real app, you'd generate and download a PDF
    window.print();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat invoice...</p>
        </div>
      </div>
    );
  }

  if (!order || order.paymentStatus !== "PAYMENT_CONFIRMED") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Invoice Tidak Tersedia</h1>
          <p className="text-gray-600 mb-6">
            Invoice hanya tersedia untuk pesanan yang sudah dikonfirmasi
            pembayarannya
          </p>
          <Button
            onClick={() => router.push("/orders")}
            className="bg-green-600 hover:bg-green-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Pesanan
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Print Header (hidden on screen, visible when printed) */}
      <div className="print:block hidden mb-8">
        <div className="text-center border-b pb-4">
          <h1 className="text-2xl font-bold text-green-600">Paskal Shop</h1>
          <p className="text-sm text-gray-600">Toko Online Terpercaya</p>
        </div>
      </div>

      {/* Screen Header (visible on screen, hidden when printed) */}
      <div className="print:hidden mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Invoice</h1>
          <p className="text-gray-600">Detail pembayaran pesanan Anda</p>
        </div>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => router.push("/orders")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button
            onClick={handleDownload}
            className="bg-green-600 hover:bg-green-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      <Card className="print:shadow-none print:border-none">
        <CardHeader className="print:pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <Store className="h-6 w-6" />
                Paskal Shop
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Toko Online Terpercaya
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <Badge className="bg-green-600 hover:bg-green-700">LUNAS</Badge>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Invoice #{order.id.slice(-8)}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Informasi Pengiriman
              </h3>
              <div className="space-y-1 text-sm">
                <p className="font-medium">{order.customerName}</p>
                <p className="text-gray-600">{order.address}</p>
                <p className="text-gray-600">
                  {order.city}, {order.postalCode}
                </p>
                {order.customerPhone && (
                  <p className="text-gray-600 flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {order.customerPhone}
                  </p>
                )}
                <p className="text-gray-600 flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {order.customerEmail}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Informasi Pesanan
              </h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Tanggal Pesanan:</span>
                  <span>{formatDate(order.createdAt)}</span>
                </div>
                {order.paidAt && (
                  <div className="flex justify-between">
                    <span>Tanggal Pembayaran:</span>
                    <span>{formatDate(order.paidAt)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Metode Pembayaran:</span>
                  <span className="capitalize">
                    {order.paymentMethod === "transfer" && "Transfer Bank"}
                    {order.paymentMethod === "ewallet" && "E-Wallet"}
                    {order.paymentMethod === "cod" && "Bayar di Tempat"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200"
                  >
                    {order.status === "DELIVERED" && "Selesai"}
                    {order.status === "SHIPPED" && "Dikirim"}
                    {order.status === "PROCESSING" && "Diproses"}
                    {order.status === "PENDING" && "Pending"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Order Items */}
          <div>
            <h3 className="font-semibold mb-4">Detail Pesanan</h3>
            <div className="space-y-3">
              {order.orderItems.map((item, index) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center py-2 border-b last:border-b-0"
                >
                  <div className="flex-1">
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-gray-600">
                      {formatPrice(item.price)} × {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Total */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-lg">
              <span className="font-semibold">Subtotal:</span>
              <span>{formatPrice(order.totalAmount)}</span>
            </div>
            <div className="flex justify-between items-center text-lg">
              <span className="font-semibold">Ongkos Kirim:</span>
              <span>Gratis</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center text-xl font-bold text-green-600">
              <span>Total Pembayaran:</span>
              <span>{formatPrice(order.totalAmount)}</span>
            </div>
          </div>

          <Separator />

          {/* Footer */}
          <div className="text-center text-sm text-gray-600 space-y-2">
            <p>Terima kasih telah berbelanja di Paskal Shop!</p>
            <p>
              Untuk pertanyaan lebih lanjut, hubungi customer service kami di
              support@paskalshop.com
            </p>
            <div className="print:block hidden mt-6 pt-4 border-t">
              <p className="text-xs">
                Dokumen ini dicetak secara otomatis dan sah tanpa tanda tangan
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
