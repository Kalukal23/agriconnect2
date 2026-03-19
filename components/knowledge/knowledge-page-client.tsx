"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { KnowledgeSearch } from "./knowledge-search"
import { ArticleList } from "./article-list"
import { KnowledgeQA } from "./knowledge-qa"
import { WriteArticle } from "./write-article"
import { BookOpen, HelpCircle, PenLine } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function KnowledgePageClient({ user }: { user: any }) {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState("articles")

  const isExtensionWorker = user?.role === "ExtensionOfficer"

  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="h-8 w-8 text-secondary" />
          <h1 className="text-3xl md:text-4xl font-bold">{t("knowledge.title")}</h1>
        </div>
        <p className="text-muted-foreground">{t("knowledge.subtitle")}</p>
        {isExtensionWorker && (
          <p className="mt-2 text-sm text-primary font-medium">
            👩‍🌾 You are logged in as an Extension Worker — you can answer farmer questions and publish articles.
          </p>
        )}
      </div>

      <Tabs
        defaultValue="articles"
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className={`grid w-full max-w-lg ${isExtensionWorker ? "grid-cols-3" : "grid-cols-2"}`}>
          <TabsTrigger value="articles" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Articles
          </TabsTrigger>
          <TabsTrigger value="qa" className="gap-2">
            <HelpCircle className="h-4 w-4" />
            {isExtensionWorker ? "Farmer Q&A" : "My Questions"}
          </TabsTrigger>
          {isExtensionWorker && (
            <TabsTrigger value="write" className="gap-2">
              <PenLine className="h-4 w-4" />
              Write Article
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="articles" className="space-y-6">
          {/* Search */}
          <KnowledgeSearch />
          {/* Articles */}
          <ArticleList />
        </TabsContent>

        <TabsContent value="qa">
          <KnowledgeQA user={user} />
        </TabsContent>

        {isExtensionWorker && (
          <TabsContent value="write">
            <WriteArticle user={user} />
          </TabsContent>
        )}
      </Tabs>
    </main>
  )
}
