import { type NextRequest, NextResponse } from "next/server"
import { getStoredPrices } from "@/lib/market-storage"

export async function GET(request: NextRequest) {
  const crop = request.nextUrl.searchParams.get("crop")
  const region = request.nextUrl.searchParams.get("region")
  const search = request.nextUrl.searchParams.get("search")

  const prices = getStoredPrices({
    crop: crop || undefined,
    region: region || undefined,
    search: search || undefined,
  })

  return NextResponse.json(prices)
}
