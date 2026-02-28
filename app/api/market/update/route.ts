import { type NextRequest, NextResponse } from "next/server"
import { updateMarketPrice } from "@/lib/market-storage"

export async function POST(request: NextRequest) {
  try {
    const { crop, region, price, market } = await request.json()

    if (!crop || !region || price === undefined) {
      return NextResponse.json({ error: "Missing required fields: crop, region, price" }, { status: 400 })
    }

    const updated = updateMarketPrice(crop, region, price, market || "Manual Update")

    if (!updated) {
      return NextResponse.json({ error: "Price not found for this crop and region" }, { status: 404 })
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error("[v0] Market update error:", error)
    return NextResponse.json({ error: "Failed to update market price" }, { status: 500 })
  }
}
