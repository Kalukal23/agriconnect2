import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { sendSMS, formatGeneralAlert } from "@/lib/sms-service"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const body = await request.json()
    const { message, type } = body

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const formattedMessage = formatGeneralAlert(message)

    const success = await sendSMS({
      to: user.phone,
      message: formattedMessage,
      type: type || "general",
    })

    if (!success) {
      throw new Error("Failed to send SMS")
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Send SMS error:", error)
    return NextResponse.json({ error: "Failed to send SMS" }, { status: 500 })
  }
}
