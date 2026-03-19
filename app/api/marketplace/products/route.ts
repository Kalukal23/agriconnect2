import { NextRequest, NextResponse } from "next/server"
import { queryWithRetry } from "@/lib/db-mock"

export async function GET(request: NextRequest) {
  const url = request.nextUrl
  const category = url.searchParams.get("category")
  const search = url.searchParams.get("search")

  const whereClauses: string[] = []
  const params: any[] = []
  let idx = 1

  if (category) {
    whereClauses.push(`LOWER(category) = $${idx}`)
    params.push(category.toLowerCase())
    idx++
  }

  if (search) {
    whereClauses.push(`(LOWER(name) LIKE $${idx} OR LOWER(description) LIKE $${idx})`)
    params.push(`%${search.toLowerCase()}%`)
    idx++
  }

  const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : ""

  const sql = `
    SELECT
      p.product_id AS id,
      p.seller_id,
      p.name,
      p.description,
      p.price,
      p.category,
      p.quantity,
      p.image_url AS image,
      p.created_at,
      u.name AS seller_name,
      u.phone AS seller_phone
    FROM marketplace_products p
    LEFT JOIN users u ON p.seller_id = u.id
    ${whereSql}
    ORDER BY p.created_at DESC
    LIMIT 100
  `

  try {
    const result = await queryWithRetry(sql, params)
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("[v0] Marketplace products fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, price, category, quantity, image, sellerId } = body

    if (!name || !price || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const insertSql = `
      INSERT INTO marketplace_products (seller_id, name, description, price, category, quantity, image_url, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING product_id AS id, seller_id, name, description, price, category, quantity, image_url AS image, created_at
    `

    const result = await queryWithRetry(insertSql, [
      sellerId || null,
      name,
      description,
      price,
      category,
      quantity || 0,
      image || null,
    ])

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error("[v0] Marketplace product create error:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
