"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search } from "lucide-react"
import { ETHIOPIAN_CROPS, ETHIOPIAN_REGIONS } from "@/lib/market-data"

interface MarketFiltersProps {
  userRegion?: string
}

export function MarketFilters({ userRegion }: MarketFiltersProps) {
  const [filters, setFilters] = useState({
    crop: "all",
    region: userRegion || "all",
    search: "",
  })

  // Store filters in URL params for sharing
  const updateFilters = (newFilters: Partial<typeof filters>) => {
    const updated = { ...filters, ...newFilters }
    setFilters(updated)

    // Update URL params
    const params = new URLSearchParams()
    if (updated.crop !== "all") params.set("crop", updated.crop)
    if (updated.region !== "all") params.set("region", updated.region)
    if (updated.search) params.set("search", updated.search)

    const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname
    window.history.replaceState({}, "", newUrl)

    // Trigger custom event for table to listen
    window.dispatchEvent(new CustomEvent("marketFiltersChanged", { detail: updated }))
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">Filter Prices</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {/* Crop Filter */}
        <div className="space-y-2">
          <Label htmlFor="crop">Crop Type</Label>
          <select
            id="crop"
            className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground"
            value={filters.crop}
            onChange={(e) => updateFilters({ crop: e.target.value })}
          >
            <option value="all">All Crops</option>
            {ETHIOPIAN_CROPS.map((crop) => (
              <option key={crop} value={crop}>
                {crop}
              </option>
            ))}
          </select>
        </div>

        {/* Region Filter */}
        <div className="space-y-2">
          <Label htmlFor="region">Region</Label>
          <select
            id="region"
            className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground"
            value={filters.region}
            onChange={(e) => updateFilters({ region: e.target.value })}
          >
            <option value="all">All Regions</option>
            {ETHIOPIAN_REGIONS.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              type="text"
              placeholder="Search crops or markets..."
              className="pl-10"
              value={filters.search}
              onChange={(e) => updateFilters({ search: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
