import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

function SuccessContent({ searchParams }: { searchParams: { orderId?: string } }) {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <Card>
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Pesanan Berhasil!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Terima kasih atas pesanan Anda. Kami akan segera memproses pesanan Anda.
            </p>
            {searchParams.orderId && (
              <p className="text-sm">
                <strong>ID Pesanan:</strong> {searchParams.orderId}
              </p>
            )}
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/">Kembali ke Home</Link>
              </Button>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/cart">Lihat Keranjang</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { orderId?: string }
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent searchParams={searchParams} />
    </Suspense>
  )
}
