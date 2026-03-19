import { type NextRequest, NextResponse } from "next/server"
import { getAuthTokens, createAccessToken, verifyRefreshToken, hashToken, setAuthCookies } from "@/lib/auth"
import { findRefreshToken, revokeRefreshToken, createRefreshToken as storeRefreshToken } from "@/lib/db-mock"

export async function POST(request: NextRequest) {
  try {
    const { refreshToken } = await getAuthTokens()
    if (!refreshToken) {
      return NextResponse.json({ error: "Missing refresh token" }, { status: 401 })
    }

    const payload = verifyRefreshToken(refreshToken)
    if (!payload) {
      return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 })
    }

    const tokenHash = hashToken(refreshToken)
    const stored = await findRefreshToken(tokenHash)
    if (!stored) {
      return NextResponse.json({ error: "Refresh token not found" }, { status: 401 })
    }

    const expiresAt = new Date(stored.expires_at).getTime()
    if (expiresAt < Date.now()) {
      await revokeRefreshToken(tokenHash)
      return NextResponse.json({ error: "Refresh token expired" }, { status: 401 })
    }

    // Issue new tokens
    const accessToken = createAccessToken(payload)
    const newRefreshToken = createRefreshToken(payload)

    // Rotate refresh tokens
    await revokeRefreshToken(tokenHash)

    const newHash = hashToken(newRefreshToken)
    const newExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    await storeRefreshToken(stored.user_id, newHash, newExpiresAt)

    await setAuthCookies(accessToken, newRefreshToken)

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error("[v0] Refresh token error", err)
    return NextResponse.json({ error: "Could not refresh token" }, { status: 500 })
  }
}
