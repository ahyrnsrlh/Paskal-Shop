"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  CreditCard,
  Upload,
  CheckCircle,
  Clock,
  AlertCircle,
  Copy,
  Download,
  FileText,
  Calendar,
} from "lucide-react";
import Image from "next/image";

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
  paymentProof: string | null;
  bankName: string | null;
  accountNumber: string | null;
  accountName: string | null;
  paymentInstructions: string | null;
  paymentDueDate: string | null;
  paidAt: string | null;
  paymentNotes: string | null;
  createdAt: string;
  orderItems: OrderItem[];
}

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [paymentNotes, setPaymentNotes] = useState("");

  const orderId = params.id as string;

  useEffect(() => {
    console.log("Payment page loaded with params:", params); // Debug log
    console.log("Order ID:", orderId); // Debug log
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      console.log("Fetching order:", orderId); // Debug log
      const response = await fetch(`/api/orders/${orderId}`);
      console.log("API response status:", response.status); // Debug log

      if (response.ok) {
        const orderData = await response.json();
        console.log("Order data received:", orderData); // Debug log
        setOrder(orderData);
      } else {
        console.error("Failed to fetch order:", response.status); // Debug log
        const errorText = await response.text();
        console.error("Error details:", errorText);
        toast({
          title: "Error",
          description: "Pesanan tidak ditemukan",
          variant: "destructive",
        });
        router.push("/");
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      toast({
        title: "Error",
        description: "Gagal memuat data pesanan",
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Berhasil disalin",
      description: "Teks telah disalin ke clipboard",
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File terlalu besar",
          description: "Ukuran file maksimal 5MB",
          variant: "destructive",
        });
        return;
      }

      // Check file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Format file tidak didukung",
          description: "Gunakan format JPG, PNG, atau GIF",
          variant: "destructive",
        });
        return;
      }

      setPaymentProof(file);
    }
  };

  const handleUploadPaymentProof = async () => {
    if (!paymentProof) {
      toast({
        title: "Error",
        description: "Pilih file bukti pembayaran terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      console.log("Starting upload...", { orderId, fileSize: paymentProof.size, fileType: paymentProof.type });
      
      const formData = new FormData();
      formData.append("paymentProof", paymentProof);
      formData.append("paymentNotes", paymentNotes);

      console.log("Making request to:", `/api/orders/${orderId}/payment-proof`);
      
      const response = await fetch(`/api/orders/${orderId}/payment-proof`, {
        method: "POST",
        body: formData,
      });

      console.log("Response status:", response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log("Upload successful:", result);
        toast({
          title: "Berhasil!",
          description:
            "Bukti pembayaran berhasil diupload. Pesanan akan diverifikasi dalam 1x24 jam.",
        });
        fetchOrder(); // Refresh order data
        setPaymentProof(null);
        setPaymentNotes("");
      } else {
        const errorText = await response.text();
        console.error("Upload failed:", response.status, errorText);
        toast({
          title: "Error",
          description: `Gagal mengupload: ${response.status} - ${errorText}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Error",
        description: "Gagal mengupload bukti pembayaran",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
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
            Pending
          </Badge>
        );
      case "PROCESSING":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            Diproses
          </Badge>
        );
      case "SHIPPED":
        return (
          <Badge
            variant="outline"
            className="bg-purple-50 text-purple-700 border-purple-200"
          >
            Dikirim
          </Badge>
        );
      case "DELIVERED":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Selesai
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            Dibatalkan
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data pembayaran...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Pesanan Tidak Ditemukan</h1>
          <p className="text-gray-600 mb-6">
            Pesanan dengan ID tersebut tidak ditemukan
          </p>
          <Button
            onClick={() => router.push("/")}
            className="bg-green-600 hover:bg-green-700"
          >
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Pembayaran Pesanan</h1>
        <p className="text-gray-600">ID Pesanan: {order.id}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Instructions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Payment Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Status Pembayaran
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Status Pembayaran:</span>
                {getPaymentStatusBadge(order.paymentStatus)}
              </div>
              <div className="flex items-center justify-between">
                <span>Status Pesanan:</span>
                {getOrderStatusBadge(order.status)}
              </div>
              {order.paymentDueDate && (
                <div className="flex items-center justify-between">
                  <span>Batas Waktu Pembayaran:</span>
                  <div className="flex items-center gap-2 text-red-600">
                    <Calendar className="h-4 w-4" />
                    {formatDate(order.paymentDueDate)}
                  </div>
                </div>
              )}
              {order.paidAt && (
                <div className="flex items-center justify-between">
                  <span>Dikonfirmasi pada:</span>
                  <span>{formatDate(order.paidAt)}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Instructions based on method */}
          {order.paymentMethod === "transfer" && (
            <Card>
              <CardHeader>
                <CardTitle>Instruksi Pembayaran - Transfer Bank</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">
                    Transfer ke Rekening Berikut:
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Bank:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono">BCA</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard("BCA")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>No. Rekening:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono">1234567890</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard("1234567890")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Atas Nama:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono">Paskal Shop</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard("Paskal Shop")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Jumlah:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-lg">
                          {formatPrice(order.totalAmount)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(order.totalAmount.toString())
                          }
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>• Transfer tepat sesuai nominal yang tertera</p>
                  <p>• Simpan bukti transfer untuk diupload</p>
                  <p>• Pembayaran akan diverifikasi dalam 1x24 jam</p>
                </div>
              </CardContent>
            </Card>
          )}

          {order.paymentMethod === "ewallet" && (
            <Card>
              <CardHeader>
                <CardTitle>Instruksi Pembayaran - E-Wallet</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">
                    Transfer ke E-Wallet Berikut:
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Platform:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono">OVO / DANA / GoPay</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard("OVO / DANA / GoPay")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>No. HP:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono">0812-3456-7890</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard("081234567890")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Atas Nama:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono">Paskal Shop</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard("Paskal Shop")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Jumlah:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-lg">
                          {formatPrice(order.totalAmount)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(order.totalAmount.toString())
                          }
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>• Transfer tepat sesuai nominal yang tertera</p>
                  <p>• Screenshot bukti transfer untuk diupload</p>
                  <p>• Pembayaran akan diverifikasi dalam 1x24 jam</p>
                </div>
              </CardContent>
            </Card>
          )}

          {order.paymentMethod === "cod" && (
            <Card>
              <CardHeader>
                <CardTitle>
                  Instruksi Pembayaran - Bayar di Tempat (COD)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">
                    Pembayaran Cash on Delivery
                  </h4>
                  <div className="space-y-2">
                    <p>Pembayaran akan dilakukan saat barang diterima.</p>
                    <p className="font-semibold">
                      Total yang harus dibayar: {formatPrice(order.totalAmount)}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>• Siapkan uang pas sesuai total pembayaran</p>
                  <p>• Periksa barang sebelum melakukan pembayaran</p>
                  <p>• Pembayaran dilakukan langsung ke kurir</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upload Payment Proof */}
          {(order.paymentMethod === "transfer" ||
            order.paymentMethod === "ewallet") &&
            order.paymentStatus !== "PAYMENT_CONFIRMED" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Upload Bukti Pembayaran
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {order.paymentProof ? (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="font-semibold text-green-800">
                          Bukti pembayaran sudah diupload
                        </span>
                      </div>
                      <p className="text-sm text-green-700">
                        Bukti pembayaran sedang dalam proses verifikasi oleh
                        admin.
                      </p>
                      {order.paymentNotes && (
                        <div className="mt-2">
                          <p className="text-sm font-medium">
                            Catatan dari admin:
                          </p>
                          <p className="text-sm text-gray-600">
                            {order.paymentNotes}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="payment-proof">
                          Pilih File Bukti Pembayaran
                        </Label>
                        <Input
                          id="payment-proof"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="mt-1"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          Format: JPG, PNG, GIF. Maksimal 5MB
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="payment-notes">
                          Catatan (Opsional)
                        </Label>
                        <Textarea
                          id="payment-notes"
                          placeholder="Tambahkan catatan untuk admin..."
                          value={paymentNotes}
                          onChange={(e) => setPaymentNotes(e.target.value)}
                          className="mt-1"
                        />
                      </div>

                      <Button
                        onClick={handleUploadPaymentProof}
                        disabled={!paymentProof || uploading}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        {uploading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Mengupload...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Bukti Pembayaran
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

          {/* Invoice Link for Confirmed Payments */}
          {order.paymentStatus === "PAYMENT_CONFIRMED" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Invoice
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-800">
                      Pembayaran Dikonfirmasi
                    </span>
                  </div>
                  <p className="text-sm text-green-700 mb-4">
                    Pembayaran Anda telah dikonfirmasi. Anda dapat mengunduh
                    invoice sebagai bukti pembayaran.
                  </p>
                  <Button
                    onClick={() => router.push(`/invoice/${order.id}`)}
                    className="bg-green-600 hover:bg-green-700 w-full"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Lihat Invoice
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ringkasan Pesanan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 relative bg-gray-100 rounded-md overflow-hidden">
                      <Image
                        src={item.product.image || "/placeholder.svg"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">
                        {item.product.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-sm font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informasi Pengiriman</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="font-medium">{order.customerName}</p>
                <p className="text-sm text-gray-600">{order.customerEmail}</p>
                {order.customerPhone && (
                  <p className="text-sm text-gray-600">{order.customerPhone}</p>
                )}
              </div>
              <Separator />
              <div>
                <p className="text-sm">{order.address}</p>
                <p className="text-sm">
                  {order.city}, {order.postalCode}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
