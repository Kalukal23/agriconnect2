"use client"

import { useLanguage } from "@/lib/language-context"
import { ForumFilters } from "./forum-filters"
import { ForumPostList } from "./forum-post-list"
import { Users, Plus } from "lucide-react"
import Link from "next/link"

export function CommunityPageClient() {
  const { t } = useLanguage()

  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold">{t("community.title")}</h1>
          </div>
          <p className="text-muted-foreground">{t("community.subtitle")}</p>
        </div>
        <Link
          href="/community/new"
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          <span className="hidden sm:inline">{t("community.newPost")}</span>
        </Link>
      </div>

      {/* Filters */}
      <ForumFilters />

      {/* Posts */}
      <ForumPostList />
    </main>
  )
}
