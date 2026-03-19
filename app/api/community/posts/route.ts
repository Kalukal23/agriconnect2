import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { readPosts, addPost } from "@/lib/community-store"

export async function GET(request: NextRequest) {
  try {
    const posts = await readPosts()
    return NextResponse.json(posts)
  } catch (error) {
    console.error("[v0] GET /api/community/posts error:", error)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, content, category } = body

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    const userId = String((user as any).id || (user as any).user_id || "")

    await addPost({
      userId,
      userName: (user as any).username || (user as any).name || "User",
      userRegion: (user as any).location?.region || (user as any).location || "Ethiopia",
      title,
      content,
      category: category || "General",
    })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error("[v0] POST /api/community/posts error:", error)
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}
