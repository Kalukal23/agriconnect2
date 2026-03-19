import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import { cookies } from "next/headers"

export interface UserPayload {
  id: number
  user_id: string
  username?: string
  email?: string
  phone: string
  role?: string
  preferred_language?: string
}

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || "agriconnect-secret-key-change-in-production"
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "agriconnect-refresh-secret-change-in-production"

const accessTokenExpiresIn = "24h"
const refreshTokenExpiresIn = "30d"

export function hashPassword(password: string) {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

export function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export function createAccessToken(payload: UserPayload) {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: accessTokenExpiresIn })
}

export function verifyAccessToken(token: string): UserPayload | null {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as UserPayload
  } catch (e) {
    return null
  }
}

export function createRefreshToken(payload: UserPayload) {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: refreshTokenExpiresIn })
}

export function verifyRefreshToken(token: string): UserPayload | null {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET) as UserPayload
  } catch (e) {
    return null
  }
}

export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex")
}

export async function setAuthCookies(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies()
  cookieStore.set("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 1 day
    path: "/",
  })
  cookieStore.set("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  })
}

export async function clearAuthCookies() {
  const cookieStore = await cookies()
  cookieStore.delete("access_token")
  cookieStore.delete("refresh_token")
}

export async function getAuthTokens(): Promise<{ accessToken: string | null; refreshToken: string | null }> {
  const cookieStore = await cookies()
  return {
    accessToken: cookieStore.get("access_token")?.value || null,
    refreshToken: cookieStore.get("refresh_token")?.value || null,
  }
}

export async function getCurrentUser(): Promise<UserPayload | null> {
  const { accessToken } = await getAuthTokens()
  if (!accessToken) return null
  return verifyAccessToken(accessToken)
}
