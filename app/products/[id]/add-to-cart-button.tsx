"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart-provider";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Plus, Minus } from "lucide-react";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    image?: string | null;
  };
  stock: number;
}

export function AddToCartButton({ product, stock }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart, cart } = useCart();
  const { toast } = useToast();

  const cartItem = cart.find((item) => item.id === product.id);
  const currentCartQuantity = cartItem?.quantity || 0;
  const maxQuantity = stock - currentCartQuantity;

  const handleAddToCart = () => {
    if (maxQuantity <= 0) {
      toast({
        title: "Stok tidak mencukupi",
        description:
          "Produk sudah habis atau sudah mencapai batas maksimal di keranjang",
        variant: "destructive",
      });
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image || undefined,
      });
    }

    toast({
      title: "Berhasil ditambahkan",
      description: `${quantity} ${product.name} ditambahkan ke keranjang`,
    });
  };

  const increaseQuantity = () => {
    if (quantity < maxQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (stock === 0) {
    return (
      <Button disabled className="w-full bg-gray-300 text-gray-500 rounded-lg">
        Stok Habis
      </Button>
    );
  }

  if (maxQuantity <= 0) {
    return (
      <Button disabled className="w-full bg-gray-300 text-gray-500 rounded-lg">
        Sudah di Keranjang (Stok Habis)
      </Button>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-700">Jumlah:</span>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={decreaseQuantity}
            disabled={quantity <= 1}
            className="border-gray-200 hover:bg-gray-50 rounded-lg"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-12 text-center font-medium text-gray-900">
            {quantity}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={increaseQuantity}
            disabled={quantity >= maxQuantity}
            className="border-gray-200 hover:bg-gray-50 rounded-lg"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <span className="text-sm text-gray-500">(Maksimal: {maxQuantity})</span>
      </div>

      <Button
        onClick={handleAddToCart}
        className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg"
        size="lg"
      >
        <ShoppingCart className="mr-2 h-5 w-5" />
        Tambah ke Keranjang
      </Button>
    </div>
  );
}
