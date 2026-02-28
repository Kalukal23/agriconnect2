"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { getProductById, type Product } from "./marketplace-data"

export interface CartItem {
  productId: string
  quantity: number
  product?: Product
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (productId: string, quantity: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("cart")
    if (saved) {
      setCart(JSON.parse(saved))
    }
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("cart", JSON.stringify(cart))
    }
  }, [cart, mounted])

  const addToCart = (productId: string, quantity: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId)
      if (existing) {
        return prev.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item,
        )
      }
      return [...prev, { productId, quantity }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      setCart((prev) => prev.map((item) => (item.productId === productId ? { ...item, quantity } : item)))
    }
  }

  const clearCart = () => {
    setCart([])
  }

  const getTotal = () => {
    return cart.reduce((total, item) => {
      const product = getProductById(item.productId)
      return total + (product?.price || 0) * item.quantity
    }, 0)
  }

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, getTotal }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within CartProvider")
  }
  return context
}
