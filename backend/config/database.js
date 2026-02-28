const { Pool } = require("pg")

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

pool.on("connect", () => {
  console.log("[v0] Connected to PostgreSQL database")
})

pool.on("error", (err) => {
  console.error("[v0] PostgreSQL connection error:", err)
  process.exit(-1)
})

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
}
