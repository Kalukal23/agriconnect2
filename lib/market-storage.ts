const marketPricesStore: Map<string, any> = new Map()

export function initializeMarketPrices() {
  const ETHIOPIAN_CROPS = [
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

  const ETHIOPIAN_REGIONS = ["Addis Ababa", "Oromia", "Amhara", "Tigray", "SNNPR"]

  const markets = ["Central Market", "Wholesale Market", "ECX", "Local Market"]

  ETHIOPIAN_CROPS.forEach((crop) => {
    ETHIOPIAN_REGIONS.forEach((region) => {
      const basePrice = Math.floor(Math.random() * 5000) + 2000
      const change = (Math.random() - 0.5) * 20
      const key = `${crop}-${region}`.toLowerCase().replace(/\s+/g, "-")

      marketPricesStore.set(key, {
        id: key,
        crop,
        region,
        market: markets[Math.floor(Math.random() * markets.length)],
        price: basePrice,
        unit: "quintal",
        change: Number.parseFloat(change.toFixed(2)),
        lastUpdated: new Date(),
        trend: change > 2 ? "up" : change < -2 ? "down" : "stable",
      })
    })
  })
}

export function getStoredPrices(filters?: {
  crop?: string
  region?: string
  search?: string
}) {
  if (marketPricesStore.size === 0) {
    initializeMarketPrices()
  }

  let prices = Array.from(marketPricesStore.values())

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

export function updateMarketPrice(crop: string, region: string, newPrice: number, market: string) {
  const key = `${crop}-${region}`.toLowerCase().replace(/\s+/g, "-")
  const existing = marketPricesStore.get(key)

  if (existing) {
    const oldPrice = existing.price
    const change = newPrice - oldPrice
    const changePercent = (change / oldPrice) * 100

    marketPricesStore.set(key, {
      ...existing,
      price: newPrice,
      market,
      change: Number.parseFloat(changePercent.toFixed(2)),
      lastUpdated: new Date(),
      trend: changePercent > 2 ? "up" : changePercent < -2 ? "down" : "stable",
    })

    return marketPricesStore.get(key)
  }

  return null
}

export function getAllPrices() {
  if (marketPricesStore.size === 0) {
    initializeMarketPrices()
  }
  return Array.from(marketPricesStore.values())
}
