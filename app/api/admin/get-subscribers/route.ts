import { getAllSMSSubscribers } from "@/lib/db-mock"

export async function GET() {
  try {
    const subscribers = await getAllSMSSubscribers()

    console.log(`[v0] Retrieved ${subscribers.length} SMS subscribers`)

    return Response.json({
      count: subscribers.length,
      subscribers,
    })
  } catch (error) {
    console.error("[v0] Get subscribers error:", error)
    return Response.json({ error: "Failed to get subscribers" }, { status: 500 })
  }
}
