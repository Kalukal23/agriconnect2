import { type NextRequest, NextResponse } from "next/server"
import Joi from "joi"
import { findUserByPhone, findPhoneVerification, markPhoneVerified } from "@/lib/db-mock"

const verifySchema = Joi.object({
  phone: Joi.string().required(),
  code: Joi.string().required(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { error, value } = verifySchema.validate(body, { abortEarly: false })
    if (error) {
      return NextResponse.json({ error: error.details.map((d) => d.message).join(", ") }, { status: 400 })
    }

    const { phone, code } = value
    const user = await findUserByPhone(phone)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const record = await findPhoneVerification(user.id, code)
    if (!record) {
      return NextResponse.json({ error: "Invalid code" }, { status: 400 })
    }

    if (new Date(record.expires_at).getTime() < Date.now()) {
      return NextResponse.json({ error: "Code expired" }, { status: 400 })
    }

    await markPhoneVerified(record.id)
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error("[v0] Verify phone error", err)
    return NextResponse.json({ error: "Unable to verify phone" }, { status: 500 })
  }
}
