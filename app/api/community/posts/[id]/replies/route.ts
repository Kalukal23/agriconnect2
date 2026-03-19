import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { addReply, getReplies, type ForumReply } from "@/lib/community-store"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const replyList = getReplies(id)
  return NextResponse.json(replyList)
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const body = await request.json()
    const { content } = body
    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    const reply: ForumReply = {
      id: `reply_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      postId: id,
      userId: String((user as any).id || (user as any).user_id || ""),
      userName: (user as any).username || (user as any).name || "User",
      content,
      createdAt: new Date().toISOString(),
    }

    const saved = addReply(id, reply)
    if (!saved) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json(saved, { status: 201 })
  } catch (error) {
    console.error("[v0] Reply post error:", error)
    return NextResponse.json({ error: "Failed to post reply" }, { status: 500 })
  }
}
