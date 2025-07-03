"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Upload, CreditCard, Clock, CheckCircle } from "lucide-react";
import Image from "next/image";

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  paymentProof?: string;
  createdAt: string;
  orderItems: Array<{
    id: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      name: string;
      image?: string;
    };
  }>;
}

export default function PaymentPage({
  params,
}: {
  params: { orderId: string };
}) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchOrder();
  }, [params.orderId]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/payment?orderId=${params.orderId}`);
      if (response.ok) {
        const { order } = await response.json();
        setOrder(order);
      } else {
        toast({
          title: "Error",
          description: "Pesanan tidak ditemukan",
          variant: "destructive",
        });
        router.push("/");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat mengambil data pesanan",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentProof(e.target.files[0]);
    }
  };

  const handleUploadProof = async () => {
    if (!paymentProof) {
      toast({
        title: "Error",
        description: "Silakan pilih file bukti pembayaran",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("paymentProof", paymentProof);
      formData.append("orderId", params.orderId);

      const response = await fetch("/api/payment", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast({
          title: "Bukti pembayaran berhasil diupload",
          description: "Pembayaran Anda sedang diverifikasi oleh admin",
        });
        fetchOrder(); // Refresh order data
        setPaymentProof(null);
      } else {
        throw new Error("Failed to upload payment proof");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengupload bukti pembayaran",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "WAITING_PAYMENT":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-600 border-yellow-200"
          >
            <Clock className="w-3 h-3 mr-1" />
            Menunggu Pembayaran
          </Badge>
        );
      case "PAYMENT_UPLOADED":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-600 border-blue-200"
          >
            <Upload className="w-3 h-3 mr-1" />
            Bukti Diupload
          </Badge>
        );
      case "PAYMENT_CONFIRMED":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-600 border-green-200"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Pembayaran Dikonfirmasi
          </Badge>
        );
      case "PAYMENT_REJECTED":
        return <Badge variant="destructive">Pembayaran Ditolak</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data pesanan...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Pesanan tidak ditemukan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Pembayaran
            </h1>
            <p className="text-gray-600">Pesanan #{order.id}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Payment Information */}
            <Card className="bg-white shadow-lg border-0 rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-green-600" />
                  Informasi Pembayaran
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status Pembayaran:</span>
                  {getPaymentStatusBadge(order.paymentStatus)}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Metode Pembayaran:</span>
                  <span className="font-medium">
                    {order.paymentMethod === "transfer"
                      ? "Transfer Bank"
                      : order.paymentMethod}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Pembayaran:</span>
                  <span className="text-2xl font-bold text-green-600">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>

                {order.paymentMethod === "transfer" && (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h3 className="font-semibold text-green-800 mb-3">
                      Informasi Transfer Bank
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-green-700">Bank:</span>
                        <span className="font-medium">BCA</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">No. Rekening:</span>
                        <span className="font-medium">1234567890</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Atas Nama:</span>
                        <span className="font-medium">Paskal Shop</span>
                      </div>
                    </div>
                  </div>
                )}

                {order.paymentStatus === "WAITING_PAYMENT" && (
                  <div className="space-y-4">
                    <div>
                      <Label
                        htmlFor="paymentProof"
                        className="text-gray-700 font-medium"
                      >
                        Upload Bukti Pembayaran
                      </Label>
                      <Input
                        id="paymentProof"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="mt-2 border-gray-200 focus:border-green-500 focus:ring-green-500 rounded-lg"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Format: JPG, PNG, GIF (Max 5MB)
                      </p>
                    </div>

                    <Button
                      onClick={handleUploadProof}
                      disabled={uploading || !paymentProof}
                      className="w-full bg-green-600 hover:bg-green-700 rounded-lg"
                    >
                      {uploading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Mengupload...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Bukti Pembayaran
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {order.paymentProof && (
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">
                      Bukti Pembayaran
                    </Label>
                    <div className="border rounded-lg p-2 bg-gray-50">
                      <Image
                        src={order.paymentProof}
                        alt="Bukti Pembayaran"
                        width={200}
                        height={200}
                        className="rounded-lg object-cover"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card className="bg-white shadow-lg border-0 rounded-xl">
              <CardHeader>
                <CardTitle>Ringkasan Pesanan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {order.orderItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        {item.product.image ? (
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            width={48}
                            height={48}
                            className="rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-300 rounded-lg"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {item.product.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {item.quantity} x {formatPrice(item.price)}
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

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">
                      Total:
                    </span>
                    <span className="text-2xl font-bold text-green-600">
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Informasi Pengiriman
                  </h4>
                  <p className="text-sm text-gray-600">{order.customerName}</p>
                  <p className="text-sm text-gray-600">{order.customerEmail}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
