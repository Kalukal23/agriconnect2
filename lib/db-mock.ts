import { Pool } from "pg"

// configure pool using DATABASE_URL and enable TLS when required
const poolOptions: any = {}
if (process.env.DATABASE_URL) {
  poolOptions.connectionString = process.env.DATABASE_URL
  // Only use SSL if it's not a localhost connection
  if (!process.env.DATABASE_URL.includes("localhost")) {
    poolOptions.ssl = { rejectUnauthorized: false }
  }
} else {
  // allow overriding individual vars for local development
  poolOptions.host = process.env.DB_HOST
  poolOptions.port = process.env.DB_PORT
  poolOptions.database = process.env.DB_DATABASE || process.env.DB_NAME
  poolOptions.user = process.env.DB_USER
  poolOptions.password = process.env.DB_PASSWORD
  if (process.env.DB_HOST && !process.env.DB_HOST.includes("localhost")) {
    poolOptions.ssl = { rejectUnauthorized: false }
  }
}

// sensible defaults to fail fast on bad network
poolOptions.max = 1
poolOptions.connectionTimeoutMillis = 5000

console.log('[v0] db-mock pool options', poolOptions)
const pool = new Pool(poolOptions)

// helper to retry queries a small number of times for transient network blips
async function queryWithRetry(text: string, params?: any[], attempts = 3) {
  let lastErr: any
  for (let i = 1; i <= attempts; i++) {
    try {
      return await pool.query(text, params)
    } catch (err) {
      lastErr = err
      console.error(`[v0] query failed (attempt ${i}):`, err && err.message)
      if (i < attempts) await new Promise((r) => setTimeout(r, 500 * i))
    }
  }
  throw lastErr
}

export interface User {
  id: string
  name: string
  phone: string
  password: string
  region?: string
  farm_size?: string
  language?: string
  created_at: Date
}

export async function createUser(userData: any): Promise<any> {
  const { name, phone, password, region, farmSize, language } = userData

  // Start a transaction to ensure both user and subscriber are created
  const client = await pool.connect()
  try {
    await client.query("BEGIN")
    const userResult = await client.query(
      "INSERT INTO users (name, phone, password, region, farm_size, language) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [name, phone, password, region, farmSize, language],
    )
    const user = userResult.rows[0]

    await client.query("INSERT INTO sms_subscribers (user_id, phone, name) VALUES ($1, $2, $3)", [user.id, user.phone, user.name])

    await client.query("COMMIT")
    return user
  } catch (e) {
    await client.query("ROLLBACK")
    throw e
  } finally {
    client.release()
  }
}

export async function findUserByPhone(phone: string): Promise<any> {
  const result = await queryWithRetry("SELECT * FROM users WHERE phone = $1", [phone])
  return result.rows[0] || null
}

export async function findUserById(id: string | number): Promise<any> {
  const result = await queryWithRetry("SELECT * FROM users WHERE id = $1", [id])
  return result.rows[0] || null
}

export async function getAllSMSSubscribers(): Promise<any[]> {
  const result = await queryWithRetry("SELECT * FROM sms_subscribers WHERE subscribed = TRUE")
  return result.rows
}
