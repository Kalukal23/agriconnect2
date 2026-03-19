import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { addAnswer, type FarmerAnswer } from "@/lib/qa-store"

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
    const canAnswer = ["extensionofficer", "extension_officer", "extensionworker", "extension worker", "admin"].includes(role)
    if (!canAnswer) {
      return NextResponse.json({ error: "Only Extension Workers can answer questions" }, { status: 403 })
    }

    const body = await request.json()
    const { content, mediaUrl, mediaType } = body

    if (!content) {
      return NextResponse.json({ error: "Answer content is required" }, { status: 400 })
    }

    const officerId = (user as any).id
    if (!officerId) {
      return NextResponse.json({ error: "Officer ID not found in session" }, { status: 400 })
    }

    const success = await addAnswer(questionId, {
      officerId,
      content,
    })

    if (!success) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error("[v0] POST /api/knowledge/questions/[id]/answer error:", error)
    return NextResponse.json({ error: "Failed to submit answer" }, { status: 500 })
  }
}
