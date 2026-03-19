import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-middleware"
import { findUserById, updateUserProfile } from "@/lib/db-mock"

export async function GET() {
  const user = await requireAuth()
  if (user instanceof NextResponse) return user

  const dbUser = await findUserById(user.id)
  if (!dbUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  return NextResponse.json({ user: dbUser })
}

export async function PUT(request: Request) {
  const user = await requireAuth()
  if (user instanceof NextResponse) return user

  const body = await request.json()
  const updated = await updateUserProfile(user.id, body)

  return NextResponse.json({ user: updated })
}
