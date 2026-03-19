import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { searchArticles, createArticle } from "@/lib/knowledge-db"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = request.nextUrl
    const query = url.searchParams.get("q") || ""
    const category = url.searchParams.get("category") || "all"

    const articles = await searchArticles(query, category)
    return NextResponse.json(articles)
  } catch (error) {
    console.error("[v0] GET /api/knowledge/articles error:", error)
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const role = ((user as any).role || "Farmer").toLowerCase()
    if (role !== "extensionofficer" && role !== "admin") {
      return NextResponse.json({ error: "Only Extension Workers can publish articles" }, { status: 403 })
    }

    const body = await request.json()
    const { title, category, content, mediaFiles, authorName, language } = body

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    const authorId = String((user as any).id || (user as any).user_id)
    const authorDisplayName = authorName || (user as any).username || (user as any).name || "Extension Worker"

    const article = await createArticle({
      title,
      category: category || "General",
      content,
      excerpt: content.slice(0, 280),
      tags: [],
      language: language || "en",
      mediaFiles: mediaFiles || [],
      authorId,
      authorName: authorDisplayName,
    })

    return NextResponse.json(article, { status: 201 })
  } catch (error) {
    console.error("[v0] POST /api/knowledge/articles error:", error)
    return NextResponse.json({ error: "Failed to publish article" }, { status: 500 })
  }
}
