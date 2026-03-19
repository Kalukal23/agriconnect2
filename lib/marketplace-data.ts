// Marketplace data storage and types
export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  quantity: number
  image: string
  seller?: {
    id: string
    name: string
    phone: string
  }
  createdAt: string
}

export interface CartItem {
  productId: string
  quantity: number
  price: number
}

function normalizeProduct(raw: any): Product {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description,
    price: Number(raw.price) || 0,
    category: raw.category,
    quantity: Number(raw.quantity) || 0,
    image: raw.image || "/placeholder.svg",
    seller: raw.seller_id
      ? {
          id: String(raw.seller_id),
          name: raw.seller_name || "",
          phone: raw.seller_phone || "",
        }
      : undefined,
    createdAt: raw.created_at ? new Date(raw.created_at) : new Date(),
  }
}

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`/api/marketplace/products`)
  if (!response.ok) {
    console.error("[v0] Failed to fetch products")
    return []
  }
  const data = await response.json()
  return Array.isArray(data) ? data.map(normalizeProduct) : []
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const response = await fetch(`/api/marketplace/products/${encodeURIComponent(id)}`)
  if (!response.ok) return undefined
  const data = await response.json()
  return data ? normalizeProduct(data) : undefined
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const response = await fetch(`/api/marketplace/products?category=${encodeURIComponent(category)}`)
  if (!response.ok) {
    console.error("[v0] Failed to fetch products by category")
    return []
  }
  const data = await response.json()
  return Array.isArray(data) ? data.map(normalizeProduct) : []
}

export async function addProduct(product: Omit<Product, "id" | "createdAt">, sellerId?: string): Promise<Product | null> {
  const response = await fetch(`/api/marketplace/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...product, sellerId }),
  })

  if (!response.ok) {
    console.error("[v0] Failed to add product")
    return null
  }

  return await response.json()
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  const response = await fetch(`/api/marketplace/products/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  })

  if (!response.ok) {
    console.error("[v0] Failed to update product")
    return null
  }

  return await response.json()
}

export async function deleteProduct(id: string): Promise<boolean> {
  const response = await fetch(`/api/marketplace/products/${encodeURIComponent(id)}`, {
    method: "DELETE",
  })

  return response.ok
}

export const categories = ["Seeds", "Fertilizer", "Pesticide", "Tools", "Produce"]
