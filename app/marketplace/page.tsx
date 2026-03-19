"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ShoppingCart, Search, ArrowLeft } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { getProducts, categories, type Product } from "@/lib/marketplace-data"
import { LanguageSelector } from "@/components/language-selector"

export default function MarketplacePage() {
  const { t } = useLanguage()
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [cart, setCart] = useState<{ [key: string]: number }>({})

  useEffect(() => {
    const load = async () => {
      const allProducts = await getProducts()
      setProducts(allProducts)
      filterProducts(allProducts, selectedCategory, searchTerm)
    }

    void load()
  }, [])

  const filterProducts = (allProducts: Product[], category: string, search: string) => {
    let filtered = allProducts

    if (category !== "All") {
      filtered = filtered.filter((p) => p.category === category)
    }

    if (search) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase()),
      )
    }

    setFilteredProducts(filtered)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    filterProducts(products, category, searchTerm)
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    filterProducts(products, selectedCategory, term)
  }

  const handleAddToCart = (productId: string) => {
    setCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }))
  }

  const cartCount = Object.values(cart).reduce((sum, count) => sum + count, 0)

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
              <h1 className="text-2xl font-bold">{t("marketplace.title")}</h1>
            </div>
            <div className="flex items-center gap-4">
              <LanguageSelector />
              <Link
                href="/marketplace/cart"
                className="relative bg-secondary text-secondary-foreground px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-destructive text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 flex-1">
        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder={t("marketplace.productName")}
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => handleCategoryChange("All")}
              className={`px-4 py-2 rounded-lg whitespace-nowrap font-semibold transition-colors ${
                selectedCategory === "All"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap font-semibold transition-colors ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                cartQuantity={cart[product.id] || 0}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">{t("marketplace.noProducts")}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function ProductCard({
  product,
  onAddToCart,
  cartQuantity,
}: {
  product: Product
  onAddToCart: (id: string) => void
  cartQuantity: number
}) {
  const { t } = useLanguage()

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>

        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-2xl font-bold text-primary">{product.price} ETB</p>
            <p className="text-sm text-muted-foreground">
              {t("marketplace.quantity")}: {product.quantity}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm">
            <span className="font-semibold">{t("marketplace.seller")}:</span> {product.seller.name}
          </p>
          <p className="text-sm text-muted-foreground">{product.seller.phone}</p>
        </div>

        <button
          onClick={() => onAddToCart(product.id)}
          className="w-full mt-4 bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          {t("marketplace.addToCart")} {cartQuantity > 0 && `(${cartQuantity})`}
        </button>
      </div>
    </div>
  )
}
