import { NextRequest, NextResponse } from "next/server"
import { queryWithRetry } from "@/lib/db-mock"

export async function GET(request: NextRequest) {
  const url = request.nextUrl
  const crop = url.searchParams.get("crop")
  const region = url.searchParams.get("region")

  if (!crop || !region) {
    return NextResponse.json({ error: "Missing required query parameters: crop and region" }, { status: 400 })
  }

  try {
    const sql = `
      SELECT p.timestamp AS date, p.price_value AS price
      FROM prices p
      JOIN commodities c ON p.commodity_id = c.id
      JOIN markets m ON p.market_id = m.id
      WHERE LOWER(c.name_en) = $1 AND LOWER(m.region) = $2
      ORDER BY p.timestamp ASC
      LIMIT 100
    `
    const result = await queryWithRetry(sql, [crop.toLowerCase(), region.toLowerCase()])

    const history = result.rows.map((row: any) => ({
      date: row.date ? new Date(row.date).toISOString().split("T")[0] : "",
      price: Number(row.price),
    }))

    return NextResponse.json(history)
  } catch (error) {
    console.error("[v0] Price history query error:", error)
    return NextResponse.json({ error: "Failed to fetch price history" }, { status: 500 })
  }
}
