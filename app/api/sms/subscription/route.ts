import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { subscribeSMS, getSMSSubscription } from "@/lib/sms-service"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const subscription = await getSMSSubscription(user.phone)

    return NextResponse.json({ subscription })
  } catch (error) {
    console.error("[v0] Get SMS subscription error:", error)
    return NextResponse.json({ error: "Failed to get subscription" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const body = await request.json()
    const { alerts, priceUpdates, weatherAlerts } = body

    await subscribeSMS({
      phone: user.phone,
      userId: user.id,
      alerts: alerts || false,
      priceUpdates: priceUpdates || false,
      weatherAlerts: weatherAlerts || false,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Subscribe SMS error:", error)
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 })
  }
}
