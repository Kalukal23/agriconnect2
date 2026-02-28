"use client"

import { useState, useEffect } from "react"
import { searchArticles, type Article } from "@/lib/knowledge-data"
import { Eye, Calendar, Tag } from "lucide-react"
import Link from "next/link"

export function ArticleList() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<{ query: string; category?: string }>({ query: "" })

  const loadArticles = async () => {
    setLoading(true)
    try {
      const data = await searchArticles(filters.query, filters.category)
      setArticles(data)
    } catch (error) {
      console.error("[v0] Failed to load articles:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadArticles()

    // Listen for filter changes
    const handleFilterChange = (e: Event) => {
      const customEvent = e as CustomEvent
      setFilters(customEvent.detail)
    }

    window.addEventListener("knowledgeFiltersChanged", handleFilterChange)
    return () => window.removeEventListener("knowledgeFiltersChanged", handleFilterChange)
  }, [])

  useEffect(() => {
    loadArticles()
  }, [filters])

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading articles...</p>
      </div>
    )
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No articles found. Try adjusting your search.</p>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {articles.map((article) => (
        <Link
          key={article.id}
          href={`/knowledge/${article.id}`}
          className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow hover:border-primary/50"
        >
          <div className="flex items-start justify-between mb-3">
            <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary text-sm font-medium rounded-full">
              {article.category}
            </span>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Eye className="h-4 w-4" />
              {article.views}
            </div>
          </div>

          <h3 className="text-xl font-semibold mb-2 text-balance">{article.title}</h3>
          <p className="text-muted-foreground mb-4 line-clamp-2">{article.excerpt}</p>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {article.publishedAt.toLocaleDateString("en-ET", { month: "short", day: "numeric", year: "numeric" })}
            </div>
            <div className="flex items-center gap-1">
              <Tag className="h-4 w-4" />
              {article.tags.slice(0, 2).join(", ")}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
