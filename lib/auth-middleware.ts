import { NextResponse } from "next/server"
import { getAuthTokens, verifyAccessToken } from "@/lib/auth"

export async function getCurrentUserFromRequest() {
  const { accessToken } = await getAuthTokens()
  if (!accessToken) return null
  return verifyAccessToken(accessToken)
}

export async function requireAuth() {
  const user = await getCurrentUserFromRequest()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  return user
}

export async function requireRole(requiredRole: string) {
  const user = await requireAuth()
  if (!user || (user as any).role !== requiredRole) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  return user
}
