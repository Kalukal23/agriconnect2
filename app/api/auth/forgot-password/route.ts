import { type NextRequest, NextResponse } from "next/server"
import Joi from "joi"
import { findUserByEmail, findUserByPhone, createPasswordResetToken } from "@/lib/db-mock"
import { hashToken } from "@/lib/auth"
import { sendSMS } from "@/lib/sms-service"

const forgotSchema = Joi.object({
  identifier: Joi.string().required(), // email or phone
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { error, value } = forgotSchema.validate(body, { abortEarly: false })
    if (error) {
      return NextResponse.json({ error: error.details.map((d) => d.message).join(", ") }, { status: 400 })
    }

    const { identifier } = value
    const user = identifier.includes("@") ? await findUserByEmail(identifier) : await findUserByPhone(identifier)

    if (!user) {
      // Do not reveal user existence
      return NextResponse.json({ success: true })
    }

    // Create password reset token (e.g. for email link)
    const token = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10)
    const tokenHash = hashToken(token)
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1h
    await createPasswordResetToken(user.id, tokenHash, expiresAt)

    // Send via SMS if phone, else log
    if (user.phone) {
      await sendSMS({ to: user.phone, message: `Your AgriConnect password reset code is: ${token}`, type: "general" })
    }

    // In a real system, send email to user.email with reset link containing token
    console.log("[v0] Password reset token (for debugging):", token)

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error("[v0] Forgot password error", err)
    return NextResponse.json({ error: "Unable to process request" }, { status: 500 })
  }
}
