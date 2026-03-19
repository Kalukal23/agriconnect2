import { type NextRequest, NextResponse } from "next/server"
import Joi from "joi"
import { findUserByPhone, findUserByEmail, createRefreshToken as storeRefreshToken } from "@/lib/db-mock"
import { verifyPassword, createAccessToken, createRefreshToken, hashToken, setAuthCookies } from "@/lib/auth"

const loginSchema = Joi.object({
  identifier: Joi.string().optional(), // phone or email
  phone: Joi.string().optional(),
  password: Joi.string().required(),
}).or("identifier", "phone")

const loginAttempts: Record<string, { count: number; lastAttempt: number }> = {}
const MAX_ATTEMPTS = 5
const LOCK_WINDOW_MS = 15 * 60 * 1000

function recordLoginAttempt(key: string) {
  const now = Date.now()
  const entry = loginAttempts[key] || { count: 0, lastAttempt: now }
  if (now - entry.lastAttempt > LOCK_WINDOW_MS) {
    entry.count = 1
  } else {
    entry.count += 1
  }
  entry.lastAttempt = now
  loginAttempts[key] = entry
  return entry.count
}

function isLocked(key: string) {
  const entry = loginAttempts[key]
  if (!entry) return false
  if (entry.count >= MAX_ATTEMPTS && Date.now() - entry.lastAttempt < LOCK_WINDOW_MS) {
    return true
  }
  return false
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { error, value } = loginSchema.validate(body, { abortEarly: false })
    if (error) {
      return NextResponse.json({ error: error.details.map((d) => d.message).join(", ") }, { status: 400 })
    }

    const identifier = (value.identifier || value.phone || "").toString()
    const password = value.password

    if (!identifier) {
      return NextResponse.json({ error: "Identifier or phone is required" }, { status: 400 })
    }

    if (isLocked(identifier)) {
      return NextResponse.json({ error: "Too many login attempts. Please try again later." }, { status: 429 })
    }

    const user = identifier.includes("@") ? await findUserByEmail(identifier) : await findUserByPhone(identifier)
    if (!user) {
      recordLoginAttempt(identifier)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const isValidPassword = await verifyPassword(password, user.password_hash)
    if (!isValidPassword) {
      recordLoginAttempt(identifier)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Reset login counters on successful login
    loginAttempts[identifier] = { count: 0, lastAttempt: Date.now() }

    const payload = {
      id: user.id,
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      preferred_language: user.preferred_language,
    }

    const accessToken = createAccessToken(payload)
    const refreshToken = createRefreshToken(payload)

    const refreshHash = hashToken(refreshToken)
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    await storeRefreshToken(user.id, refreshHash, expiresAt)

    await setAuthCookies(accessToken, refreshToken)

    return NextResponse.json({ success: true, user: { id: user.id, username: user.username, email: user.email, phone: user.phone, role: user.role } })
  } catch (err: any) {
    console.error("[v0] Login error", err)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
