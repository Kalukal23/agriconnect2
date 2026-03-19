import { NextRequest, NextResponse } from "next/server"
import { queryWithRetry } from "@/lib/db-mock"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const result = await queryWithRetry(
      `SELECT p.product_id AS id, p.seller_id, p.name, p.description, p.price, p.category, p.quantity, p.image_url AS image, p.created_at,
              u.name AS seller_name, u.phone AS seller_phone
       FROM marketplace_products p
       LEFT JOIN users u ON p.seller_id = u.id
       WHERE p.product_id = $1
       LIMIT 1`,
      [id],
    )

    if (!result.rows.length) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("[v0] Marketplace product fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await queryWithRetry("DELETE FROM marketplace_products WHERE product_id = $1", [id])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Marketplace product delete error:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const fields: string[] = []
    const values: any[] = []
    let idx = 1

    for (const [key, value] of Object.entries(body)) {
      if (["name", "description", "price", "category", "quantity", "image"].includes(key)) {
        if (key === "image") {
          fields.push("image_url = $" + idx)
        } else {
          fields.push(`${key} = $${idx}`)
        }
        values.push(value)
        idx++
      }
    }

    if (fields.length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 })
    }

    values.push(id)
    const sql = `UPDATE marketplace_products SET ${fields.join(", ")}, updated_at = NOW() WHERE product_id = $${idx} RETURNING product_id AS id, seller_id, name, description, price, category, quantity, image_url AS image, created_at`

    const result = await queryWithRetry(sql, values)
    if (!result.rows.length) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("[v0] Marketplace product update error:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}
