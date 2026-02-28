import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { createForumPost } from "@/lib/knowledge-data"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const body = await request.json()
    const { title, content, category } = body

    if (!title || !content || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const post = await createForumPost({
      userId: user.id,
      userName: user.name,
      userRegion: user.region || "Unknown",
      title,
      content,
      category,
      likes: 0,
      replies: 0,
    })

    return NextResponse.json({ success: true, post }, { status: 201 })
  } catch (error) {
    console.error("[v0] Create post error:", error)
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}
