"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { CATEGORIES } from "@/lib/knowledge-data"

export function ForumFilters() {
  const [category, setCategory] = useState("all")

  const updateCategory = (newCategory: string) => {
    setCategory(newCategory)
    window.dispatchEvent(new CustomEvent("forumCategoryChanged", { detail: newCategory }))
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center gap-4">
        <Label htmlFor="category" className="font-semibold">
          Filter by Category:
        </Label>
        <select
          id="category"
          className="h-10 px-3 rounded-md border border-input bg-background text-foreground"
          value={category}
          onChange={(e) => updateCategory(e.target.value)}
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
  )
}
