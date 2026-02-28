import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { findUserById } from "@/lib/db-mock"

export async function GET() {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Get full user details
    const user = await findUserById(currentUser.id)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        region: user.region,
        farmSize: user.farmSize,
        crops: user.crops,
        language: user.language,
      },
    })
  } catch (error) {
    console.error("[v0] Get user error:", error)
    return NextResponse.json({ error: "Failed to get user" }, { status: 500 })
  }
}
