const express = require("express")
const cors = require("cors")
const { Pool } = require("pg")
require("dotenv").config()

const app = express()
const port = process.env.PORT || 5000

console.log("[v0] DATABASE_URL=", process.env.DATABASE_URL)
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  // some deployments (Railway) use DB_DATABASE instead of DB_NAME
  database: process.env.DB_DATABASE || process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
})
// attempt a simple query to verify connection at startup
pool
  .query("SELECT NOW()")
  .then((res) => console.log("[v0] DB connected, time", res.rows[0].now))
  .catch((err) => console.error("[v0] DB connection error at startup", err))

app.use(cors())
app.use(express.json())

app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()")
    res.json({ status: "healthy", time: result.rows[0].now })
  } catch (err) {
    console.log("[v0] Database connection error:", err)
    console.log(err && err.stack)
    res.status(500).json({ status: "error", message: "Database unreachable", error: err && err.message })
  }
})

app.listen(port, () => {
  console.log(`[v0] Backend server running on port ${port}`)
})

module.exports = { pool }
