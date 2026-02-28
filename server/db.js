const { Pool } = require("pg")
require("dotenv").config()

const poolConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE || process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
}
console.log("[v0] pool config", poolConfig)
const pool = new Pool(poolConfig)

module.exports = {
  query: (text, params) => pool.query(text, params),
}
