import { prisma } from "@/lib/db";
import { ProductCard } from "./product-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FeaturedProductsProps {
  title: string;
  category?: string;
  limit?: number;
  sortBy?: "newest" | "popular" | "price_low" | "price_high";
}

async function getFeaturedProducts({
  category,
  limit = 8,
  sortBy = "newest",
}: Omit<FeaturedProductsProps, "title">) {
  const where: any = {};

  if (category) {
    where.category = category;
  }

  let orderBy: any = { createdAt: "desc" };

  switch (sortBy) {
    case "price_low":
      orderBy = { price: "asc" };
      break;
    case "price_high":
      orderBy = { price: "desc" };
      break;
    case "popular":
      // For now, we'll use newest as popular
      orderBy = { createdAt: "desc" };
      break;
  }

  const products = await prisma.product.findMany({
    where,
    orderBy,
    take: limit,
  });

  return products.map((product: any) => ({
    ...product,
    price: Number(product.price),
  }));
}

export async function FeaturedProducts({
  title,
  category,
  limit,
  sortBy,
}: FeaturedProductsProps) {
  const products = await getFeaturedProducts({ category, limit, sortBy });

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border-0 p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          {category && (
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-700 rounded-lg"
            >
              {category}
            </Badge>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product: any) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            image={product.image}
            stock={product.stock}
          />
        ))}
      </div>
    </div>
  );
}
