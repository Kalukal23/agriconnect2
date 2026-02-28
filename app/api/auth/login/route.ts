import { type NextRequest, NextResponse } from "next/server"
import { findUserByPhone } from "@/lib/db-mock"
import { createToken, setAuthCookie, verifyPassword } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone, password } = body

    // Validate required fields
    if (!phone || !password) {
      return NextResponse.json({ error: "Missing phone or password" }, { status: 400 })
    }

    // Find user
    const user = await findUserByPhone(phone)
    if (!user) {
      return NextResponse.json({ error: "Invalid phone number or password" }, { status: 401 })
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid phone number or password" }, { status: 401 })
    }

    // Create JWT token
    const token = await createToken({
      id: user.id,
      phone: user.phone,
      name: user.name,
      region: user.region,
      language: user.language,
    })

    // Set auth cookie
    await setAuthCookie(token)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        region: user.region,
      },
    })
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
