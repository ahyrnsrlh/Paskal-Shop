"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ShoppingCart, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "./cart-provider"
import { SearchBar } from "./search-bar"
import { useRouter } from "next/navigation"

export function Navbar() {
  const { cartCount } = useCart()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <nav className="border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
          <Store className="h-6 w-6 text-green-600" />
          <span className="font-bold text-xl text-gray-900">Paskal Shop</span>
        </Link>

        {/* Search Bar - Hidden on mobile, shown on desktop */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className="flex items-center space-x-4">
          <Button asChild variant="ghost" className="text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg">
            <Link href="/">Home</Link>
          </Button>

          <Button asChild variant="ghost" className="text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg">
            <Link href="/search">Cari</Link>
          </Button>

          <Button asChild variant="ghost" className="text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg">
            <Link href="/orders">Pesanan</Link>
          </Button>

          <Button asChild variant="ghost" className="relative text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg">
            <Link href="/cart" className="flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden sm:inline">Cart</span>
              {mounted && cartCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 hover:bg-red-600 rounded-full"
                >
                  {cartCount}
                </Badge>
              )}
            </Link>
          </Button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-3 bg-white border-t border-gray-100">
        <SearchBar onSearch={handleSearch} />
      </div>
    </nav>
  )
}
