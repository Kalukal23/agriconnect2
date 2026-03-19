import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-middleware"
import { updateUserPreferences } from "@/lib/db-mock"

export async function PUT(request: Request) {
  const user = await requireAuth()
  if (user instanceof NextResponse) return user

  const body = await request.json()
  const updated = await updateUserPreferences(user.id, body)

  return NextResponse.json({ user: updated })
}
