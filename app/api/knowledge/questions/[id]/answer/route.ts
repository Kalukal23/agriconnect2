import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { addAnswer, readQAStore, type FarmerAnswer } from "@/lib/qa-store"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: questionId } = await params
    console.log("[v0] ANSWER ROUTE HIT - question id:", questionId)

    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const role = ((user as any).role || "Farmer").toLowerCase()
    console.log("[v0] ANSWER - user role:", (user as any).role, "-> lowercase:", role)

    const canAnswer = ["extensionofficer", "extension_officer", "extensionworker", "extension worker", "admin"].includes(role)
    if (!canAnswer) {
      return NextResponse.json({ error: "Only Extension Workers can answer questions" }, { status: 403 })
    }

    const body = await request.json()
    const { content, mediaUrl, mediaType } = body

    if (!content) {
      return NextResponse.json({ error: "Answer content is required" }, { status: 400 })
    }

    const answer: FarmerAnswer = {
      id: `a_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      officerId: String((user as any).id || (user as any).user_id),
      officerName: (user as any).username || (user as any).name || "Extension Worker",
      content,
      createdAt: new Date().toISOString(),
      ...(mediaUrl && { mediaUrl, mediaType }),
    }

    const updated = addAnswer(questionId, answer)
    console.log("[v0] ANSWER - addAnswer result:", updated ? "SUCCESS" : "QUESTION NOT FOUND")

    if (!updated) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 })
    }

    return NextResponse.json(answer, { status: 201 })
  } catch (error) {
    console.error("[v0] POST /api/knowledge/questions/[id]/answer error:", error)
    return NextResponse.json({ error: "Failed to submit answer" }, { status: 500 })
  }
}
