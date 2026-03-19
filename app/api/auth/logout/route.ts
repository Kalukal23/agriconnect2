import { type NextRequest, NextResponse } from "next/server"
import { getAuthTokens, clearAuthCookies, hashToken } from "@/lib/auth"
import { revokeRefreshToken } from "@/lib/db-mock"

export async function POST(_request: NextRequest) {
  try {
    const { refreshToken } = await getAuthTokens()
    if (refreshToken) {
      const tokenHash = hashToken(refreshToken)
      await revokeRefreshToken(tokenHash)
    }
    await clearAuthCookies()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Logout error:", error)
    return NextResponse.json({ error: "Logout failed" }, { status: 500 })
  }
}
