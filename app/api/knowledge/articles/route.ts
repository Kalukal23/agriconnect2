import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"

// In-memory articles store (extension worker published articles)
export interface KBArticle {
  id: string
  title: string
  category: string
  content: string
  authorId: string
  authorName: string
  mediaFiles: Array<{ name: string; url: string; type: "video" | "audio" | "image" }>
  createdAt: string
  views: number
}

declare global {
  var _kbArticles: KBArticle[]
}

if (!global._kbArticles) {
  global._kbArticles = []
}

export const articlesStore: KBArticle[] = global._kbArticles

export async function GET(request: NextRequest) {
  // All authenticated users can read articles
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const sorted = [...articlesStore].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
  return NextResponse.json(sorted)
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const role = (user as any).role || "Farmer"
    if (role !== "ExtensionOfficer" && role !== "admin" && role !== "Admin") {
      return NextResponse.json({ error: "Only Extension Workers can publish articles" }, { status: 403 })
    }

    const body = await request.json()
    const { title, category, content, mediaFiles, authorName } = body

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    const article: KBArticle = {
      id: `art_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      title,
      category: category || "General",
      content,
      authorId: String((user as any).id || (user as any).user_id),
      authorName: authorName || (user as any).username || "Extension Worker",
      mediaFiles: mediaFiles || [],
      createdAt: new Date().toISOString(),
      views: 0,
    }

    articlesStore.push(article)
    return NextResponse.json(article, { status: 201 })
  } catch (error) {
    console.error("[v0] POST /api/knowledge/articles error:", error)
    return NextResponse.json({ error: "Failed to publish article" }, { status: 500 })
  }
}
