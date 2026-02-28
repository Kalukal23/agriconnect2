"use client"

import { useLanguage } from "@/lib/language-context"
import { KnowledgeSearch } from "./knowledge-search"
import { ArticleList } from "./article-list"
import { BookOpen } from "lucide-react"

export function KnowledgePageClient() {
  const { t } = useLanguage()

  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="h-8 w-8 text-secondary" />
          <h1 className="text-3xl md:text-4xl font-bold">{t("knowledge.title")}</h1>
        </div>
        <p className="text-muted-foreground">{t("knowledge.subtitle")}</p>
      </div>

      {/* Search */}
      <KnowledgeSearch />

      {/* Articles */}
      <ArticleList />
    </main>
  )
}
