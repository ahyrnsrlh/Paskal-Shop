export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

export function getCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return []
  
  try {
    const cart = localStorage.getItem("cart")
    return cart ? JSON.parse(cart) : []
  } catch (error) {
    console.error('Error parsing cart from localStorage:', error)
    // Clear corrupted data
    localStorage.removeItem("cart")
    return []
  }
}

export function saveCartToStorage(cart: CartItem[]) {
  if (typeof window === "undefined") return
  localStorage.setItem("cart", JSON.stringify(cart))
}

export function addToCart(product: Omit<CartItem, "quantity">) {
  const cart = getCartFromStorage()
  const existingItem = cart.find((item) => item.id === product.id)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({ ...product, quantity: 1 })
  }

  saveCartToStorage(cart)
  return cart
}

export function removeFromCart(productId: string) {
  const cart = getCartFromStorage()
  const updatedCart = cart.filter((item) => item.id !== productId)
  saveCartToStorage(updatedCart)
  return updatedCart
}

export function updateCartQuantity(productId: string, quantity: number) {
  const cart = getCartFromStorage()
  const item = cart.find((item) => item.id === productId)

  if (item) {
    if (quantity <= 0) {
      return removeFromCart(productId)
    }
    item.quantity = quantity
    saveCartToStorage(cart)
  }

  return cart
}

export function clearCart() {
  if (typeof window === "undefined") return
  localStorage.removeItem("cart")
}

export function getCartTotal(cart: CartItem[]): number {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0)
}
