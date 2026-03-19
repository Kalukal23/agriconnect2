import { type NextRequest, NextResponse } from "next/server"
import Joi from "joi"
import { findPasswordResetToken, markPasswordResetUsed, updateUserPassword } from "@/lib/db-mock"
import { hashPassword, hashToken } from "@/lib/auth"

const resetSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(8).required(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { error, value } = resetSchema.validate(body, { abortEarly: false })
    if (error) {
      return NextResponse.json({ error: error.details.map((d) => d.message).join(", ") }, { status: 400 })
    }

    const { token, password } = value
    const tokenHash = hashToken(token)
    const record = await findPasswordResetToken(tokenHash)

    if (!record || record.used) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 })
    }

    if (new Date(record.expires_at).getTime() < Date.now()) {
      return NextResponse.json({ error: "Token expired" }, { status: 400 })
    }

    const passwordHash = await hashPassword(password)
    await updateUserPassword(record.user_id, passwordHash)
    await markPasswordResetUsed(record.id)

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error("[v0] Reset password error", err)
    return NextResponse.json({ error: "Unable to reset password" }, { status: 500 })
  }
}
