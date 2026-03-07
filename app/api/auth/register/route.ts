import { type NextRequest, NextResponse } from "next/server"
import { createUser, findUserByPhone } from "@/lib/db-mock"
import { createToken, setAuthCookie, hashPassword } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    // log DB envs for debugging network/connectivity issues
    console.log('[v0] ENV DATABASE_URL:', process.env.DATABASE_URL)
    console.log('[v0] ENV DB_HOST/DB_DATABASE:', process.env.DB_HOST, process.env.DB_DATABASE || process.env.DB_NAME)

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
  } catch (error: any) {
    // Enhanced logging for DB/network errors
    console.error('[v0] Registration error FULL:', error)
    console.error('[v0] Registration error Message:', error?.message)

    // If the error is a connectivity timeout, return 503 so clients know it's temporary
    if (error && (error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED')) {
      return NextResponse.json({ error: 'Database connection failed (timeout)' }, { status: 503 })
    }

    return NextResponse.json({ error: 'Registration failed: ' + error?.message }, { status: 500 })
  }
}
