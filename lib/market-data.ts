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
    return []
  }
}

export async function getPriceHistory(crop: string, region: string): Promise<{ date: string; price: number }[]> {
  try {
    const params = new URLSearchParams()
    params.append("crop", crop)
    params.append("region", region)

    const response = await fetch(`/api/market/prices/history?${params.toString()}`)
    if (!response.ok) throw new Error("Failed to fetch price history")
    return await response.json()
  } catch (error) {
    console.error("[v0] Price history fetch error:", error)
    return []
  }
}
