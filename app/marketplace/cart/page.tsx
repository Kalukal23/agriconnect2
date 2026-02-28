"use client"

import type React from "react"

import Link from "next/link"
import { ArrowLeft, Trash2, Plus, Minus } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { useCart } from "@/lib/cart-context"
import { getProductById } from "@/lib/marketplace-data"
import { LanguageSelector } from "@/components/language-selector"
import { useState } from "react"

export default function CartPage() {
  const { t } = useLanguage()
  const { cart, removeFromCart, updateQuantity, clearCart, getTotal } = useCart()
  const [showCheckout, setShowCheckout] = useState(false)
  const [buyerInfo, setBuyerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  })

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault()
    if (!buyerInfo.name || !buyerInfo.phone) {
      alert("Please fill in your name and phone number")
      return
    }

    // Group items by seller
    const ordersBySeller: { [key: string]: any[] } = {}
    cart.forEach((item) => {
      const product = getProductById(item.productId)
      if (product) {
        const sellerId = product.seller.id
        if (!ordersBySeller[sellerId]) {
          ordersBySeller[sellerId] = []
        }
        ordersBySeller[sellerId].push({
          product,
          quantity: item.quantity,
          total: product.price * item.quantity,
        })
      }
    })

    // Create order summary
    const orderSummary = Object.entries(ordersBySeller).map(([sellerId, items]) => ({
      sellerId,
      seller: items[0].product.seller,
      items,
      total: items.reduce((sum, item) => sum + item.total, 0),
    }))

    // Show order confirmation
    const message = `Order Confirmation:\n\n${orderSummary
      .map(
        (order) =>
          `Seller: ${order.seller.name}\nPhone: ${order.seller.phone}\n\nItems:\n${order.items
            .map((item) => `- ${item.product.name} x${item.quantity} = ${item.total} ETB`)
            .join("\n")}\n\nTotal: ${order.total} ETB`,
      )
      .join("\n\n---\n\n")}\n\nBuyer: ${buyerInfo.name}\nPhone: ${buyerInfo.phone}\nAddress: ${buyerInfo.address}`

    alert(message + "\n\nPlease contact the sellers to complete the transaction.")
    clearCart()
    setShowCheckout(false)
    setBuyerInfo({ name: "", phone: "", email: "", address: "" })
  }

  const cartItems = cart.map((item) => ({
    ...item,
    product: getProductById(item.productId),
  }))

  const total = getTotal()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/marketplace" className="hover:opacity-80 transition-opacity">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <h1 className="text-2xl font-bold">Shopping Cart</h1>
            </div>
            <LanguageSelector />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 flex-1">
        {cartItems.length > 0 ? (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {cartItems.map((item) =>
                  item.product ? (
                    <div key={item.productId} className="bg-card border border-border rounded-lg p-4 flex gap-4">
                      <img
                        src={item.product.image || "/placeholder.svg"}
                        alt={item.product.name}
                        className="w-24 h-24 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{item.product.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{item.product.seller.name}</p>
                        <p className="text-lg font-bold text-primary">{item.product.price} ETB</p>

                        <div className="flex items-center gap-2 mt-3">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="p-1 hover:bg-muted rounded"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-3 py-1 bg-muted rounded">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="p-1 hover:bg-muted rounded"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                          <span className="ml-auto font-semibold">{item.product.price * item.quantity} ETB</span>
                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="p-1 hover:bg-destructive/10 rounded text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : null,
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                <div className="space-y-2 mb-6 pb-6 border-b border-border">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{total} ETB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery:</span>
                    <span>TBD</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-primary">{total} ETB</span>
                  </div>
                </div>

                {!showCheckout ? (
                  <button
                    onClick={() => setShowCheckout(true)}
                    className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                  >
                    Proceed to Checkout
                  </button>
                ) : (
                  <form onSubmit={handleCheckout} className="space-y-3">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={buyerInfo.name}
                      onChange={(e) => setBuyerInfo({ ...buyerInfo, name: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Your Phone"
                      value={buyerInfo.phone}
                      onChange={(e) => setBuyerInfo({ ...buyerInfo, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email (optional)"
                      value={buyerInfo.email}
                      onChange={(e) => setBuyerInfo({ ...buyerInfo, email: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <textarea
                      placeholder="Delivery Address"
                      value={buyerInfo.address}
                      onChange={(e) => setBuyerInfo({ ...buyerInfo, address: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      type="submit"
                      className="w-full bg-success text-white py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                    >
                      Place Order
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCheckout(false)}
                      className="w-full bg-muted text-foreground py-2 rounded-lg font-semibold hover:bg-muted/80 transition-colors"
                    >
                      Cancel
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <p className="text-muted-foreground text-lg mb-6">Your cart is empty</p>
              <Link
                href="/marketplace"
                className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
