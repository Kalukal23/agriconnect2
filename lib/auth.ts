import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "agriconnect-secret-key-change-in-production")

export interface UserPayload {
  id: string
  phone: string
  name: string
  region?: string
  language?: string
}

export async function createToken(payload: UserPayload): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret)
}

export async function verifyToken(token: string): Promise<UserPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as UserPayload
  } catch (error) {
    return null
  }
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })
}

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")
  return token?.value || null
}

export async function getCurrentUser(): Promise<UserPayload | null> {
  const token = await getAuthToken()
  if (!token) return null
  return await verifyToken(token)
}

export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete("auth-token")
}

// Password hashing utilities (simplified for demo - use bcrypt in production)
export async function hashPassword(password: string): Promise<string> {
  // In production, use bcrypt or similar
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hash = await crypto.subtle.digest("SHA-256", data)
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password)
  return passwordHash === hash
}
