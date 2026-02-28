"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search } from "lucide-react"
import { CATEGORIES } from "@/lib/knowledge-data"

export function KnowledgeSearch() {
  const [filters, setFilters] = useState({
    query: "",
    category: "all",
  })

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    const updated = { ...filters, ...newFilters }
    setFilters(updated)

    // Trigger custom event for article list to listen
    window.dispatchEvent(new CustomEvent("knowledgeFiltersChanged", { detail: updated }))
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">Search Articles</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {/* Search Input */}
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              type="text"
              placeholder="Search articles, topics, or keywords..."
              className="pl-10"
              value={filters.query}
              onChange={(e) => updateFilters({ query: e.target.value })}
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground"
            value={filters.category}
            onChange={(e) => updateFilters({ category: e.target.value })}
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
