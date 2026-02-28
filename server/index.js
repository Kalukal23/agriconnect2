const express = require("express")
const cors = require("cors")
const { Pool } = require("pg")
require("dotenv").config()

const app = express()
const port = process.env.PORT || 5000

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
})

app.use(cors())
app.use(express.json())

app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()")
    res.json({ status: "healthy", time: result.rows[0].now })
  } catch (err) {
    console.error("[v0] Database connection error:", err)
    res.status(500).json({ status: "error", message: "Database unreachable" })
  }
})

app.listen(port, () => {
  console.log(`[v0] Backend server running on port ${port}`)
})

module.exports = { pool }
