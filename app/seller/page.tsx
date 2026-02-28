"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Edit2, Trash2 } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { getProducts, addProduct, deleteProduct, categories, type Product } from "@/lib/marketplace-data"
import { LanguageSelector } from "@/components/language-selector"

export default function SellerDashboard() {
  const { t } = useLanguage()
  const [products, setProducts] = useState<Product[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Seeds",
    quantity: "",
    image: "",
  })
  const [sellerInfo, setSellerInfo] = useState({
    name: "Kalkidan Tilahun",
    phone: "0918461548",
  })

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = () => {
    const allProducts = getProducts()
    // Filter to show only this seller's products (in real app, would be based on auth)
    const sellerProducts = allProducts.filter((p) => p.seller.name === sellerInfo.name)
    setProducts(sellerProducts)
  }

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.price || !formData.quantity) {
      alert("Please fill in all required fields")
      return
    }

    const newProduct = addProduct({
      name: formData.name,
      description: formData.description,
      price: Number.parseFloat(formData.price),
      category: formData.category,
      quantity: Number.parseInt(formData.quantity),
      image: formData.image || "/placeholder.svg?key=default",
      seller: {
        id: "seller-current",
        name: sellerInfo.name,
        phone: sellerInfo.phone,
      },
    })

    setProducts([...products, newProduct])
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "Seeds",
      quantity: "",
      image: "",
    })
    setShowForm(false)
  }

  const handleDeleteProduct = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id)
      setProducts(products.filter((p) => p.id !== id))
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="hover:opacity-80 transition-opacity">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <h1 className="text-2xl font-bold">Seller Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <LanguageSelector />
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                {t("marketplace.addProduct")}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 flex-1">
        {/* Seller Info */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                value={sellerInfo.name}
                onChange={(e) => setSellerInfo({ ...sellerInfo, name: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input
                type="tel"
                value={sellerInfo.phone}
                onChange={(e) => setSellerInfo({ ...sellerInfo, phone: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Add Product Form */}
        {showForm && (
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">{t("marketplace.addProduct")}</h2>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t("marketplace.productName")} *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t("marketplace.category")}</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t("marketplace.description")}</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t("marketplace.price")} *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t("marketplace.quantity")} *</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t("marketplace.image")}</label>
                <input
                  type="text"
                  placeholder="Image URL (optional)"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  Add Product
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-muted text-foreground px-6 py-2 rounded-lg font-semibold hover:bg-muted/80 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products List */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Products ({products.length})</h2>
          {products.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-card border border-border rounded-lg overflow-hidden">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>

                    <div className="mb-4">
                      <p className="text-2xl font-bold text-primary">{product.price} ETB</p>
                      <p className="text-sm text-muted-foreground">Available: {product.quantity}</p>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                        <Edit2 className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="flex-1 bg-destructive text-destructive-foreground py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <p className="text-muted-foreground mb-4">You haven't added any products yet.</p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity inline-flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Add Your First Product
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
