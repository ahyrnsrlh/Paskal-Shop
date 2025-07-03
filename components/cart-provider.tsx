"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { type CartItem, getCartFromStorage, saveCartToStorage } from "@/lib/cart"

interface CartContextType {
  cart: CartItem[]
  addToCart: (product: Omit<CartItem, "quantity">) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  cartTotal: number
  cartCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    try {
      setCart(getCartFromStorage())
    } catch (error) {
      console.error('Error loading cart from storage:', error)
      setCart([])
    }
    setMounted(true)
  }, [])

  const addToCart = (product: Omit<CartItem, "quantity">) => {
    const existingItem = cart.find((item) => item.id === product.id)
    let newCart: CartItem[]

    if (existingItem) {
      newCart = cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
    } else {
      newCart = [...cart, { ...product, quantity: 1 }]
    }

    setCart(newCart)
    saveCartToStorage(newCart)
  }

  const removeFromCart = (productId: string) => {
    const newCart = cart.filter((item) => item.id !== productId)
    setCart(newCart)
    saveCartToStorage(newCart)
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    const newCart = cart.map((item) => (item.id === productId ? { ...item, quantity } : item))
    setCart(newCart)
    saveCartToStorage(newCart)
  }

  const clearCart = () => {
    setCart([])
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart")
    }
  }

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0)

  // Always provide context, even when not mounted
  return (
    <CartContext.Provider
      value={{
        cart: mounted ? cart : [],
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal: mounted ? cartTotal : 0,
        cartCount: mounted ? cartCount : 0,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
