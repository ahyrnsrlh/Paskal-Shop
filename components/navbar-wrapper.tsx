"use client";

import { useEffect, useState } from "react";
import { Navbar } from "./navbar";

export function NavbarWrapper() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a skeleton navbar during hydration
    return (
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-2 flex-shrink-0">
            <div className="h-6 w-6 bg-gray-200 rounded animate-pulse" />
            <span className="font-bold text-xl">Paskal Shop</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="h-9 w-16 bg-gray-200 rounded animate-pulse" />
            <div className="h-9 w-16 bg-gray-200 rounded animate-pulse" />
            <div className="h-9 w-16 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </nav>
    );
  }

  return <Navbar />;
}
