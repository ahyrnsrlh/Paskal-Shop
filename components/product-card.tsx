import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image?: string;
  stock: number;
}

export function ProductCard({
  id,
  name,
  price,
  image,
  stock,
}: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  return (
    <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white rounded-xl">
      <div className="aspect-square relative">
        <Image
          src={image || "/placeholder.svg?height=300&width=300"}
          alt={name}
          fill
          className="object-cover"
        />
      </div>
      <CardContent className="p-6">
        <h3 className="font-semibold text-lg mb-3 line-clamp-2 text-gray-900">
          {name}
        </h3>
        <p className="text-2xl font-bold text-green-600 mb-2">
          {formatPrice(price)}
        </p>
        <p className="text-sm text-gray-500">Stok: {stock}</p>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex gap-3">
        <Button
          asChild
          variant="outline"
          className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg"
        >
          <Link href={`/products/${id}`}>Detail</Link>
        </Button>
        <Button
          asChild
          className="flex-1 bg-green-600 hover:bg-green-700 rounded-lg"
        >
          <Link href={`/products/${id}`}>Beli</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
