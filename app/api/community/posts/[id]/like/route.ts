import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { toggleLike } from "@/lib/community-store"

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

    const userId = String((user as any).id || (user as any).user_id || "")
    const result = await toggleLike(id, userId)

    if (!result) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Like post error:", error)
    return NextResponse.json({ error: "Failed to like post" }, { status: 500 })
  }
}
