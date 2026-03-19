import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { readQAStore, addQuestion, type FarmerQuestion } from "@/lib/qa-store"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const role = ((user as any).role || "Farmer").toLowerCase()
    const isWorkerOrAdmin = ["extensionofficer", "extension_officer", "extensionworker", "extension worker", "admin"].includes(role)
    const allQuestions = await readQAStore()

    let result: FarmerQuestion[]
    if (isWorkerOrAdmin) {
      // Extension workers see ALL questions
      result = allQuestions
    } else {
      // Farmers see only their own questions
      const userId = String((user as any).id || (user as any).user_id || "")
      result = allQuestions.filter((q) => q.farmerId === userId)
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] GET /api/knowledge/questions error:", error)
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const role = ((user as any).role || "Farmer").toLowerCase()
    if (["extensionofficer", "extensionworker", "extension worker"].includes(role)) {
      return NextResponse.json({ error: "Extension workers cannot ask questions" }, { status: 403 })
    }

    const body = await request.json()
    console.log("[v0] CREATE QUESTION - body:", body)
    const { title, content } = body
    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    const authorId = (user as any).id
    console.log("[v0] CREATE QUESTION - user id:", authorId, "role:", (user as any).role)
    
    if (!authorId) {
       return NextResponse.json({ error: "User ID not found in session" }, { status: 400 })
    }

    try {
      await addQuestion({
        authorId,
        title,
        content,
      })
      console.log("[v0] CREATE QUESTION - SUCCESS")
    } catch (dbErr: any) {
      console.error("[v0] CREATE QUESTION - DATABASE ERROR:", dbErr)
      throw dbErr
    }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error("[v0] POST /api/knowledge/questions error:", error)
    return NextResponse.json({ error: "Failed to create question" }, { status: 500 })
  }
}
