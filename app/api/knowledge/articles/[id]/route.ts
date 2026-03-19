import { NextRequest, NextResponse } from "next/server"
import { getArticleById } from "@/lib/knowledge-db"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const article = await getArticleById(id)
    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }
    return NextResponse.json(article)
  } catch (error) {
    console.error("[v0] Fetch article error:", error)
    return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 })
  }
}
