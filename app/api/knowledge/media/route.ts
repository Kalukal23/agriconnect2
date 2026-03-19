import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { writeFile, mkdir } from "fs/promises"
import { join, extname } from "path"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const role = (user as any).role || "Farmer"
    if (role !== "ExtensionOfficer" && role !== "admin" && role !== "Admin") {
      return NextResponse.json({ error: "Only Extension Workers can upload media" }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const ext = extname(file.name).toLowerCase()
    const videoExts = [".mp4", ".mov", ".avi", ".webm", ".mkv"]
    const audioExts = [".mp3", ".wav", ".ogg", ".m4a", ".aac"]

    let mediaType: "video" | "audio" | "image" = "video"
    if (audioExts.includes(ext)) mediaType = "audio"

    // Save file to /public/uploads
    const uploadsDir = join(process.cwd(), "public", "uploads")
    await mkdir(uploadsDir, { recursive: true })

    const timestamp = Date.now()
    const safeName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`
    const filePath = join(uploadsDir, safeName)

    const bytes = await file.arrayBuffer()
    await writeFile(filePath, Buffer.from(bytes))

    const url = `/uploads/${safeName}`
    return NextResponse.json({ url, type: mediaType, name: file.name }, { status: 201 })
  } catch (error) {
    console.error("[v0] Media upload error:", error)
    return NextResponse.json({ error: "Failed to upload media" }, { status: 500 })
  }
}
