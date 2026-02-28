"use client"

import { useState, useEffect } from "react"
import { getMarketPrices, type MarketPrice } from "@/lib/market-data"
import { TrendingUp, TrendingDown, Minus, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MarketPriceTable() {
  const [prices, setPrices] = useState<MarketPrice[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<{ crop?: string; region?: string; search?: string }>({})

  const loadPrices = async () => {
    setLoading(true)
    try {
      const data = await getMarketPrices(filters)
      setPrices(data)
    } catch (error) {
      console.error("[v0] Failed to load market prices:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPrices()

    // Listen for filter changes
    const handleFilterChange = (e: Event) => {
      const customEvent = e as CustomEvent
      setFilters(customEvent.detail)
    }

    window.addEventListener("marketFiltersChanged", handleFilterChange)
    return () => window.removeEventListener("marketFiltersChanged", handleFilterChange)
  }, [])

  useEffect(() => {
    loadPrices()
  }, [filters])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-ET", {
      style: "currency",
      currency: "ETB",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatTime = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date
    const now = new Date()
    const diff = now.getTime() - dateObj.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)

    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return "Just now"
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Table Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold">Current Prices</h3>
        <Button variant="outline" size="sm" onClick={loadPrices} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-semibold">Crop</th>
              <th className="text-left p-4 font-semibold">Region</th>
              <th className="text-left p-4 font-semibold">Market</th>
              <th className="text-right p-4 font-semibold">Price (ETB)</th>
              <th className="text-right p-4 font-semibold">Change</th>
              <th className="text-right p-4 font-semibold">Updated</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center p-8 text-muted-foreground">
                  Loading prices...
                </td>
              </tr>
            ) : prices.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-8 text-muted-foreground">
                  No prices found. Try adjusting your filters.
                </td>
              </tr>
            ) : (
              prices.map((price) => (
                <tr key={price.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-medium">{price.crop}</td>
                  <td className="p-4 text-muted-foreground">{price.region}</td>
                  <td className="p-4 text-muted-foreground text-sm">{price.market}</td>
                  <td className="p-4 text-right font-semibold">
                    {formatPrice(price.price)}
                    <span className="text-xs text-muted-foreground ml-1">/{price.unit}</span>
                  </td>
                  <td className="p-4 text-right">
                    <div
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${
                        price.trend === "up"
                          ? "bg-success/10 text-success"
                          : price.trend === "down"
                            ? "bg-destructive/10 text-destructive"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {price.trend === "up" ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : price.trend === "down" ? (
                        <TrendingDown className="h-3 w-3" />
                      ) : (
                        <Minus className="h-3 w-3" />
                      )}
                      {Math.abs(price.change)}%
                    </div>
                  </td>
                  <td className="p-4 text-right text-sm text-muted-foreground">{formatTime(price.lastUpdated)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {!loading && prices.length > 0 && (
        <div className="p-4 border-t border-border text-sm text-muted-foreground">
          Showing {prices.length} price{prices.length !== 1 ? "s" : ""} • Data from Ethiopian Commodity Exchange (ECX)
          and local markets
        </div>
      )}
    </div>
  )
}
