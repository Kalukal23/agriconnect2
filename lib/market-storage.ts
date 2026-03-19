import { pool } from "@/lib/db-mock"

// Store market pricing information in the database.
// This will create commodities/markets as needed and insert a new price record.
export async function updateMarketPrice(
  crop: string,
  region: string,
  price: number,
  marketName: string,
) {
  const client = await pool.connect()
  try {
    await client.query("BEGIN")

    // Find or create commodity
    const commodityResult = await client.query(
      "SELECT id FROM commodities WHERE LOWER(name_en) = LOWER($1) LIMIT 1",
      [crop],
    )
    const commodityId =
      commodityResult.rows[0]?.id ||
      (
        await client.query(
          "INSERT INTO commodities (name_en, unit, created_at, updated_at) VALUES ($1, $2, NOW(), NOW()) RETURNING id",
          [crop, "quintal"],
        )
      ).rows[0].id

    // Find or create market
    const marketResult = await client.query(
      "SELECT id FROM markets WHERE LOWER(name) = LOWER($1) AND LOWER(region) = LOWER($2) LIMIT 1",
      [marketName, region],
    )
    const marketId =
      marketResult.rows[0]?.id ||
      (
        await client.query(
          "INSERT INTO markets (name, region, created_at, updated_at) VALUES ($1, $2, NOW(), NOW()) RETURNING id",
          [marketName, region],
        )
      ).rows[0].id

    // Insert price record
    const priceResult = await client.query(
      `INSERT INTO prices (commodity_id, market_id, price_value, currency, timestamp, source, created_at)
       VALUES ($1, $2, $3, 'ETB', NOW(), $4, NOW())
       RETURNING price_id, price_value, timestamp`,
      [commodityId, marketId, price, marketName],
    )

    await client.query("COMMIT")

    return {
      success: true,
      priceId: priceResult.rows[0].price_id,
      price: Number(priceResult.rows[0].price_value),
      timestamp: priceResult.rows[0].timestamp,
    }
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("[v0] updateMarketPrice error:", error)
    return null
  } finally {
    client.release()
  }
}
