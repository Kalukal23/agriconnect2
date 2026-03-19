import { NextRequest, NextResponse } from "next/server"
import { queryWithRetry } from "@/lib/db-mock"

export async function GET(request: NextRequest) {
  const url = request.nextUrl
  const crop = url.searchParams.get("crop")
  const region = url.searchParams.get("region")
  const search = url.searchParams.get("search")

  const whereClauses: string[] = []
  const params: any[] = []
  let idx = 1

  if (crop) {
    whereClauses.push(`LOWER(c.name_en) LIKE $${idx}`)
    params.push(`%${crop.toLowerCase()}%`)
    idx++
  }

  if (region) {
    whereClauses.push(`LOWER(m.region) = $${idx}`)
    params.push(region.toLowerCase())
    idx++
  }

  if (search) {
    whereClauses.push(
      `(LOWER(c.name_en) LIKE $${idx} OR LOWER(m.name) LIKE $${idx} OR LOWER(m.region) LIKE $${idx})`,
    )
    params.push(`%${search.toLowerCase()}%`)
    idx++
  }

  const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : ""

  const sql = `
    SELECT
      p.price_id AS id,
      c.name_en AS crop,
      m.region AS region,
      m.name AS market,
      p.price_value AS price,
      COALESCE(c.unit, 'quintal') AS unit,
      p.timestamp AS last_updated
    FROM prices p
    JOIN commodities c ON p.commodity_id = c.id
    JOIN markets m ON p.market_id = m.id
    ${whereSql}
    ORDER BY p.timestamp DESC
    LIMIT 100
  `

  try {
    const result = await queryWithRetry(sql, params)
    const prices = result.rows.map((row: any) => ({
      id: row.id,
      crop: row.crop,
      region: row.region,
      market: row.market,
      price: Number(row.price),
      unit: row.unit,
      change: 0,
      lastUpdated: row.last_updated ? new Date(row.last_updated) : new Date(),
      trend: "stable",
    }))

    return NextResponse.json(prices)
  } catch (error) {
    console.error("[v0] Market prices query error:", error)
    return NextResponse.json({ error: "Failed to fetch market prices" }, { status: 500 })
  }
}
