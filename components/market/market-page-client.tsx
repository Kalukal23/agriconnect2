"use client"

import { useLanguage } from "@/lib/language-context"
import { MarketPriceTable } from "./market-price-table"
import { MarketFilters } from "./market-filters"
import { TrendingUp, AlertCircle } from "lucide-react"

export function MarketPageClient({ userRegion }: { userRegion?: string }) {
  const { t } = useLanguage()

  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="h-8 w-8 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold">{t("market.title")}</h1>
        </div>
        <p className="text-muted-foreground">{t("market.subtitle")}</p>
      </div>

      {/* Alert Banner */}
      <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4 mb-6 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-secondary mb-1">{t("market.priceAlert")}</h3>
          <p className="text-sm text-muted-foreground">{t("market.teffAlert")}</p>
        </div>
      </div>

      {/* Filters */}
      <MarketFilters userRegion={userRegion} />

      {/* Price Table */}
      <MarketPriceTable />
    </main>
  )
}
