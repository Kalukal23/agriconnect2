import { type NextRequest, NextResponse } from "next/server"
import { createUser, findUserByPhone } from "@/lib/db-mock"
import { createToken, setAuthCookie, hashPassword } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone, password, region, farmSize, language } = body

    // Validate required fields
    if (!name || !phone || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await findUserByPhone(phone)
    if (existingUser) {
      return NextResponse.json({ error: "Phone number already registered" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await createUser({
      name,
      phone,
      password: hashedPassword,
      region,
      farmSize,
      language,
    })

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

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          phone: user.phone,
          region: user.region,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Registration error:", error)
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
