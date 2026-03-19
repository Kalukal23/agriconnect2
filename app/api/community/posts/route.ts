import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { readPosts, addPost, type CommunityPost } from "@/lib/community-store"

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get("category")
  let posts = readPosts()

  if (category && category !== "all") {
    posts = posts.filter((p) => p.category.toLowerCase() === category.toLowerCase())
  }

  // Sort newest first
  posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return NextResponse.json(posts)
}

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

    const now = new Date().toISOString()
    const post: CommunityPost = {
      id: `post_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      userId: String((user as any).id || (user as any).user_id || ""),
      userName: (user as any).username || (user as any).name || "Farmer",
      userRegion:
        typeof (user as any).location === "object"
          ? (user as any).location?.region || "Ethiopia"
          : (user as any).location || "Ethiopia",
      title,
      content,
      category,
      likes: 0,
      likedBy: [],
      replies: 0,
      replyList: [],
      createdAt: now,
      updatedAt: now,
    }

    addPost(post)
    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error("[v0] Create post error:", error)
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}
