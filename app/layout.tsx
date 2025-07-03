import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { NavbarWrapper } from "@/components/navbar-wrapper";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Paskal Shop",
  description:
    "Toko online terpercaya dengan produk berkualitas dan harga terjangkau",
  generator: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <CartProvider>
            <NavbarWrapper />
            <main className="min-h-screen bg-gray-50">{children}</main>
            <Toaster />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
