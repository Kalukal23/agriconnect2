import { type NextRequest, NextResponse } from "next/server"
import Joi from "joi"
import { createUser, findUserByPhone } from "@/lib/db-mock"
import { createAccessToken, createRefreshToken, hashPassword, hashToken, setAuthCookies } from "@/lib/auth"
import { createRefreshToken as storeRefreshToken } from "@/lib/db-mock"

const registerSchema = Joi.object({
  // UI fields
  name: Joi.string().max(100).required(),
  confirmPassword: Joi.string().required(),
  region: Joi.string().optional(),
  farmSize: Joi.string().optional(),
  language: Joi.string().valid("english", "amharic", "oromiffa", "tigrinya", "en", "am").default("english"),

  // Legacy/optional fields
  username: Joi.string().max(100).optional(),
  email: Joi.string().email().optional(),

  phone: Joi.string().required(),
  password: Joi.string().min(8).max(128).required(),
  preferredLanguage: Joi.string().valid("en", "am").optional(),
  location: Joi.string().optional(),
  role: Joi.string().valid("Farmer", "ExtensionOfficer", "Admin").default("Farmer"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validation = registerSchema.validate(body, { abortEarly: false })

    if (validation.error) {
      return NextResponse.json({ error: validation.error.details.map((d) => d.message).join(", ") }, { status: 400 })
    }

    const { name, confirmPassword, region, language, username, email, phone, password, preferredLanguage, location, role } = validation.value

    // Confirm passwords match
    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 })
    }

    // Determine which language code to store (fallback to preferredLanguage if provided)
    const languageMap: Record<string, string> = {
      english: "en",
      amharic: "am",
      oromiffa: "om",
      tigrinya: "ti",
      en: "en",
      am: "am",
    }

    const storedLanguage = preferredLanguage || languageMap[language.toLowerCase()] || "en"

    // Determine location/region (stored as JSONB)
    let storedLocation: any = null
    if (region) {
      storedLocation = { region }
    } else if (location) {
      try {
        storedLocation = typeof location === "string" ? JSON.parse(location) : location
      } catch {
        storedLocation = { raw: location }
      }
    }

    // Determine display name / username for the user record
    const storedUsername = username || name || phone

    // Prevent duplicate registration
    const existingUser = await findUserByPhone(phone)
    if (existingUser) {
      return NextResponse.json({ error: "Phone number already registered" }, { status: 400 })
    }

    const hashedPassword = await hashPassword(password)

    const user = await createUser({
      username: storedUsername,
      email,
      phone,
      passwordHash: hashedPassword,
      preferredLanguage: storedLanguage,
      location: storedLocation,
      role,
    })

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

    // store refresh token hash for revocation
    const refreshHash = hashToken(refreshToken)
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    await storeRefreshToken(user.id, refreshHash, expiresAt)

    await setAuthCookies(accessToken, refreshToken)

    return NextResponse.json({ success: true, user: { id: user.id, username: user.username, phone: user.phone, email: user.email, role: user.role } }, { status: 201 })
  } catch (error: any) {
    console.error("[v0] Registration error FULL:", error)
    console.error("[v0] Registration error Message:", error?.message)

    if (error && (error.code === "ETIMEDOUT" || error.code === "ECONNREFUSED")) {
      return NextResponse.json({ error: "Database connection failed (timeout)" }, { status: 503 })
    }

    return NextResponse.json({ error: "Registration failed: " + (error?.message || "unknown") }, { status: 500 })
  }
}
