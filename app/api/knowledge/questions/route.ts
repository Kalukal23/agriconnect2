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
    const allQuestions = readQAStore()

    let result: FarmerQuestion[]
    if (isWorkerOrAdmin) {
      // Extension workers see ALL questions
      result = allQuestions.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    } else {
      // Farmers see only their own questions
      const userId = String((user as any).id || (user as any).user_id || "")
      result = allQuestions
        .filter((q) => q.farmerId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
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
    if (role === "extensionofficer" || role === "extensionworker" || role === "extension worker") {
      return NextResponse.json({ error: "Extension workers cannot ask questions" }, { status: 403 })
    }

    const body = await request.json()
    const { title, content } = body
    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    const question: FarmerQuestion = {
      id: `q_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      farmerId: String((user as any).id || (user as any).user_id || ""),
      farmerName: (user as any).username || (user as any).name || "Farmer",
      farmerPhone: (user as any).phone || "",
      title,
      content,
      createdAt: new Date().toISOString(),
      answers: [],
      status: "pending",
    }

    addQuestion(question)
    return NextResponse.json(question, { status: 201 })
  } catch (error) {
    console.error("[v0] POST /api/knowledge/questions error:", error)
    return NextResponse.json({ error: "Failed to create question" }, { status: 500 })
  }
}
