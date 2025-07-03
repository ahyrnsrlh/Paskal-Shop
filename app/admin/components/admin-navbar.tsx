"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Shield, User, LogOut } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AdminNavbarProps {
  admin: {
    id: string
    username: string
    name: string
  }
}

export function AdminNavbar({ admin }: AdminNavbarProps) {
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" })
      toast({
        title: "Logout berhasil",
        description: "Anda telah keluar dari panel admin",
      })
      router.push("/admin/login")
    } catch (error) {
      toast({
        title: "Terjadi kesalahan",
        description: "Gagal logout",
        variant: "destructive",
      })
    }
  }

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link href="/admin" className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-green-600" />
            <span className="font-bold text-xl text-gray-900">Admin Panel</span>
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            <Button asChild variant="ghost" className="text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg">
              <Link href="/admin">Dashboard</Link>
            </Button>
            <Button asChild variant="ghost" className="text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg">
              <Link href="/admin/products">Produk</Link>
            </Button>
            <Button asChild variant="ghost" className="text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg">
              <Link href="/admin/orders">Pesanan</Link>
            </Button>
            <Button asChild variant="ghost" className="text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg">
              <Link href="/admin/payments">Pembayaran</Link>
            </Button>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>{admin.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}
