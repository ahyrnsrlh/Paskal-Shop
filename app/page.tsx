import { prisma } from "@/lib/db";
import { ProductCard } from "@/components/product-card";
import { FeaturedProducts } from "@/components/featured-products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingBag,
  Shield,
  Truck,
  Star,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Heart,
} from "lucide-react";
import Link from "next/link";

// Force revalidate every 60 seconds to ensure fresh data
export const revalidate = 60;

interface Product {
  id: string;
  name: string;
  price: number;
  image: string | null;
  stock: number;
  createdAt: Date;
}

async function getProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return products.map((product: any) => ({
    ...product,
    price: Number(product.price),
  }));
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        {/* Background Decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-75"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-150"></div>
        </div>

        <div className="relative container mx-auto px-4 py-20 lg:py-28">
          <div className="text-center max-w-6xl mx-auto">
            {/* Badge */}
            <Badge className="mb-6 bg-emerald-100 text-emerald-800 border-emerald-200 px-4 py-2 text-sm font-medium inline-flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Terpercaya sejak 2024
            </Badge>

            {/* Main Heading */}
            <h1 className="text-5xl lg:text-7xl font-bold mb-8 text-gray-900 leading-tight">
              Selamat Datang di{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Paskal Shop
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
              Temukan produk terbaik dengan{" "}
              <span className="font-semibold text-emerald-600">
                harga terjangkau
              </span>{" "}
              dan{" "}
              <span className="font-semibold text-emerald-600">
                kualitas terpercaya
              </span>{" "}
              di Paskal Shop
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                asChild
              >
                <Link
                  href="#products"
                  className="inline-flex items-center gap-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Mulai Berbelanja
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300"
                asChild
              >
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2"
                >
                  <Heart className="w-5 h-5" />
                  Lihat Koleksi
                </Link>
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-emerald-100 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Shield className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Kualitas Terjamin
                </h3>
                <p className="text-gray-600 text-sm">
                  Produk berkualitas tinggi dengan garansi resmi
                </p>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-emerald-100 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Truck className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Pengiriman Cepat
                </h3>
                <p className="text-gray-600 text-sm">
                  Pengiriman ke seluruh Indonesia dengan cepat dan aman
                </p>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-emerald-100 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Star className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Pelayanan Terbaik
                </h3>
                <p className="text-gray-600 text-sm">
                  Customer service 24/7 siap membantu Anda
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">
                  10K+
                </div>
                <div className="text-gray-600 text-sm">Pelanggan Puas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">
                  500+
                </div>
                <div className="text-gray-600 text-sm">Produk Tersedia</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">
                  50+
                </div>
                <div className="text-gray-600 text-sm">Kota Terjangkau</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">
                  24/7
                </div>
                <div className="text-gray-600 text-sm">Customer Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="container mx-auto px-4 py-16">
        <div className="space-y-16">
          {/* All Products */}
          <div>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-900">
                Produk Pilihan Kami
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Koleksi lengkap produk berkualitas dengan harga terbaik
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product: Product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image || undefined}
                  stock={product.stock}
                />
              ))}
            </div>
          </div>

          {/* Featured Sections */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl p-8 lg:p-12">
            <FeaturedProducts
              title="Produk Terbaru"
              limit={4}
              sortBy="newest"
            />
          </div>

          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-3xl p-8 lg:p-12">
            <FeaturedProducts
              title="Produk Terpopuler"
              limit={4}
              sortBy="popular"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
