import { Pool } from "pg"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

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

    await client.query("INSERT INTO sms_subscribers (user_id, phone, name) VALUES ($1, $2, $3)", [
      user.id,
      user.phone,
      user.name,
    ])

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
  const result = await pool.query("SELECT * FROM users WHERE phone = $1", [phone])
  return result.rows[0] || null
}

export async function findUserById(id: string | number): Promise<any> {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id])
  return result.rows[0] || null
}

export async function getAllSMSSubscribers(): Promise<any[]> {
  const result = await pool.query("SELECT * FROM sms_subscribers WHERE subscribed = TRUE")
  return result.rows
}
