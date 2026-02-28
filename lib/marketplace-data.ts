// Marketplace data storage and types
export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  quantity: number
  image: string
  seller: {
    id: string
    name: string
    phone: string
  }
  createdAt: Date
}

export interface CartItem {
  productId: string
  quantity: number
  price: number
}

// Mock products database
const products: Product[] = [
  {
    id: "1",
    name: "Teff Seeds - Premium Quality",
    description: "High-quality teff seeds for planting. Yields excellent results in Ethiopian highlands.",
    price: 450,
    category: "Seeds",
    quantity: 100,
    image: "/teff-seeds.jpg",
    seller: {
      id: "seller1",
      name: "Abebe Kebede",
      phone: "+251912345678",
    },
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Organic Fertilizer - 50kg Bag",
    description: "Organic fertilizer made from composted agricultural waste. Perfect for sustainable farming.",
    price: 800,
    category: "Fertilizer",
    quantity: 50,
    image: "/organic-fertilizer-mix.png",
    seller: {
      id: "seller2",
      name: "Almaz Tekle",
      phone: "+251987654321",
    },
    createdAt: new Date("2024-01-10"),
  },
  {
    id: "3",
    name: "Maize Seeds - Hybrid Variety",
    description: "High-yielding hybrid maize seeds suitable for various soil types.",
    price: 350,
    category: "Seeds",
    quantity: 75,
    image: "/maize-seeds.jpg",
    seller: {
      id: "seller1",
      name: "Abebe Kebede",
      phone: "+251912345678",
    },
    createdAt: new Date("2024-01-12"),
  },
  {
    id: "4",
    name: "Pesticide - Natural Formula",
    description: "Eco-friendly pesticide for controlling common crop pests without harmful chemicals.",
    price: 250,
    category: "Pesticide",
    quantity: 30,
    image: "/natural-pesticide.jpg",
    seller: {
      id: "seller3",
      name: "Girma Assefa",
      phone: "+251911223344",
    },
    createdAt: new Date("2024-01-08"),
  },
  {
    id: "5",
    name: "Wheat Seeds - Winter Variety",
    description: "Winter wheat seeds with excellent cold tolerance and high protein content.",
    price: 400,
    category: "Seeds",
    quantity: 60,
    image: "/wheat-seeds.png",
    seller: {
      id: "seller2",
      name: "Almaz Tekle",
      phone: "+251987654321",
    },
    createdAt: new Date("2024-01-14"),
  },
]

export function getProducts(): Product[] {
  return products
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category)
}

export function addProduct(product: Omit<Product, "id" | "createdAt">): Product {
  const newProduct: Product = {
    ...product,
    id: Date.now().toString(),
    createdAt: new Date(),
  }
  products.push(newProduct)
  return newProduct
}

export function updateProduct(id: string, updates: Partial<Product>): Product | undefined {
  const index = products.findIndex((p) => p.id === id)
  if (index === -1) return undefined

  products[index] = { ...products[index], ...updates }
  return products[index]
}

export function deleteProduct(id: string): boolean {
  const index = products.findIndex((p) => p.id === id)
  if (index === -1) return false

  products.splice(index, 1)
  return true
}

export const categories = ["Seeds", "Fertilizer", "Pesticide", "Tools", "Produce"]
