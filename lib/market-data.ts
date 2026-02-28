// Mock market data for Ethiopian crops
// In production, this would fetch from ECX API or scrape their website

import type { MarketPrice } from "./types"

export const ETHIOPIAN_CROPS = [
  "Teff",
  "Wheat",
  "Barley",
  "Maize",
  "Sorghum",
  "Coffee",
  "Sesame",
  "Haricot Bean",
  "Chickpea",
  "Lentil",
]

export const ETHIOPIAN_REGIONS = [
  "Addis Ababa",
  "Oromia",
  "Amhara",
  "Tigray",
  "SNNPR",
  "Somali",
  "Afar",
  "Benishangul-Gumuz",
  "Gambela",
  "Harari",
  "Dire Dawa",
]

function generateMockPrices(): MarketPrice[] {
  const prices: MarketPrice[] = []
  const markets = ["Central Market", "Wholesale Market", "ECX", "Local Market"]

  ETHIOPIAN_CROPS.forEach((crop) => {
    ETHIOPIAN_REGIONS.slice(0, 5).forEach((region) => {
      const basePrice = Math.floor(Math.random() * 5000) + 2000
      const change = (Math.random() - 0.5) * 20
      prices.push({
        id: `${crop}-${region}`.toLowerCase().replace(/\s+/g, "-"),
        crop,
        region,
        market: markets[Math.floor(Math.random() * markets.length)],
        price: basePrice,
        unit: "quintal",
        change: Number.parseFloat(change.toFixed(2)),
        lastUpdated: new Date(Date.now() - Math.random() * 3600000),
        trend: change > 2 ? "up" : change < -2 ? "down" : "stable",
      })
    })
  })

  return prices
}

let cachedPrices: MarketPrice[] | null = null

export async function getMarketPrices(filters?: {
  crop?: string
  region?: string
  search?: string
}): Promise<MarketPrice[]> {
  try {
    const params = new URLSearchParams()
    if (filters?.crop) params.append("crop", filters.crop)
    if (filters?.region) params.append("region", filters.region)
    if (filters?.search) params.append("search", filters.search)

    const response = await fetch(`/api/market/prices?${params.toString()}`)
    if (!response.ok) throw new Error("Failed to fetch prices")
    return await response.json()
  } catch (error) {
    console.error("[v0] Market prices fetch error:", error)
    await new Promise((resolve) => setTimeout(resolve, 300))

    if (!cachedPrices) {
      cachedPrices = generateMockPrices()
    }

    let prices = [...cachedPrices]

    if (filters?.crop && filters.crop !== "all") {
      prices = prices.filter((p) => p.crop === filters.crop)
    }
    if (filters?.region && filters.region !== "all") {
      prices = prices.filter((p) => p.region === filters.region)
    }
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase()
      prices = prices.filter(
        (p) =>
          p.crop.toLowerCase().includes(searchLower) ||
          p.region.toLowerCase().includes(searchLower) ||
          p.market.toLowerCase().includes(searchLower),
      )
    }

    return prices
  }
}

export async function getPriceHistory(crop: string, region: string): Promise<{ date: string; price: number }[]> {
  const history = []
  const basePrice = Math.floor(Math.random() * 5000) + 2000

  for (let i = 30; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const variation = (Math.random() - 0.5) * 500
    history.push({
      date: date.toISOString().split("T")[0],
      price: Math.floor(basePrice + variation),
    })
  }

  return history
}
