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
export const pool = new Pool(poolOptions)

// helper to retry queries a small number of times for transient network blips
export async function queryWithRetry(text: string, params?: any[], attempts = 3) {
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
  id: number
  user_id: string
  username?: string
  email?: string
  phone: string
  password_hash: string
  location?: string
  preferred_language?: string
  account_status?: string
  role?: string
  registration_date?: Date
  last_login?: Date
  created_at: Date
  updated_at: Date
}

export async function createUser(userData: any): Promise<any> {
  const {
    username,
    email,
    phone,
    passwordHash,
    location,
    preferredLanguage,
    role = "Farmer",
    accountStatus = "ACTIVE",
  } = userData

  // Start a transaction to ensure user and related data are created atomically
  const client = await pool.connect()
  try {
    await client.query("BEGIN")
    const userResult = await client.query(
      `INSERT INTO users
        (name, username, email, phone, password, password_hash, location, preferred_language, account_status, role)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        username || email || phone,
        username,
        email,
        phone,
        passwordHash,
        passwordHash,
        location,
        preferredLanguage,
        accountStatus,
        role,
      ],
    )

    const user = userResult.rows[0]

    // Subscribe new user to SMS updates by default
    await client.query(
      "INSERT INTO sms_subscribers (user_id, phone, name) VALUES ($1, $2, $3)",
      [user.id, user.phone, user.username || user.email || null],
    )

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
  const result = await queryWithRetry(
    "SELECT * FROM users WHERE phone = $1 AND account_status != 'SUSPENDED'",
    [phone],
  )
  return result.rows[0] || null
}

export async function findUserByEmail(email: string): Promise<any> {
  const result = await queryWithRetry(
    "SELECT * FROM users WHERE email = $1 AND account_status != 'SUSPENDED'",
    [email],
  )
  return result.rows[0] || null
}

export async function findUserById(id: string | number): Promise<any> {
  const result = await queryWithRetry("SELECT * FROM users WHERE id = $1", [id])
  return result.rows[0] || null
}

export async function updateLastLogin(userId: number): Promise<void> {
  await queryWithRetry("UPDATE users SET last_login = NOW() WHERE id = $1", [userId])
}

export async function createRefreshToken(userId: number, tokenHash: string, expiresAt: string) {
  await queryWithRetry(
    "INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)",
    [userId, tokenHash, expiresAt],
  )
}

export async function findRefreshToken(tokenHash: string): Promise<any> {
  const result = await queryWithRetry("SELECT * FROM refresh_tokens WHERE token_hash = $1", [tokenHash])
  return result.rows[0] || null
}

export async function revokeRefreshToken(tokenHash: string): Promise<void> {
  await queryWithRetry("DELETE FROM refresh_tokens WHERE token_hash = $1", [tokenHash])
}

export async function revokeUserRefreshTokens(userId: number): Promise<void> {
  await queryWithRetry("DELETE FROM refresh_tokens WHERE user_id = $1", [userId])
}

export async function updateUserPassword(userId: number, passwordHash: string): Promise<void> {
  await queryWithRetry("UPDATE users SET password_hash = $1 WHERE id = $2", [passwordHash, userId])
}

export async function updateUserProfile(userId: number, data: any): Promise<any> {
  const fields: string[] = []
  const values: any[] = []
  let idx = 1

  for (const [key, value] of Object.entries(data)) {
    if (['username','email','location','preferred_language','account_status','role'].includes(key)) {
      fields.push(`${key} = $${idx}`)
      values.push(value)
      idx++
    }
  }

  if (fields.length === 0) return null

  const query = `UPDATE users SET ${fields.join(", ")}, updated_at = NOW() WHERE id = $${idx} RETURNING *`
  values.push(userId)

  const result = await queryWithRetry(query, values)
  return result.rows[0]
}

export async function updateUserPreferences(userId: number, preferences: any): Promise<any> {
  const fields: string[] = []
  const values: any[] = []
  let idx = 1

  for (const [key, value] of Object.entries(preferences)) {
    if (['preferred_language', 'account_status'].includes(key)) {
      fields.push(`${key} = $${idx}`)
      values.push(value)
      idx++
    }
  }

  if (fields.length === 0) return null

  const query = `UPDATE users SET ${fields.join(", ")}, updated_at = NOW() WHERE id = $${idx} RETURNING *`
  values.push(userId)

  const result = await queryWithRetry(query, values)
  return result.rows[0]
}

export async function createPasswordResetToken(userId: number, tokenHash: string, expiresAt: string): Promise<void> {
  await queryWithRetry(
    "INSERT INTO password_resets (user_id, token_hash, expires_at) VALUES ($1, $2, $3)",
    [userId, tokenHash, expiresAt],
  )
}

export async function findPasswordResetToken(tokenHash: string): Promise<any> {
  const result = await queryWithRetry("SELECT * FROM password_resets WHERE token_hash = $1", [tokenHash])
  return result.rows[0] || null
}

export async function markPasswordResetUsed(id: number): Promise<void> {
  await queryWithRetry("UPDATE password_resets SET used = TRUE WHERE id = $1", [id])
}

export async function createPhoneVerificationCode(userId: number, code: string, expiresAt: string): Promise<void> {
  await queryWithRetry(
    "INSERT INTO phone_verifications (user_id, code, expires_at) VALUES ($1, $2, $3)",
    [userId, code, expiresAt],
  )
}

export async function findPhoneVerification(userId: number, code: string): Promise<any> {
  const result = await queryWithRetry(
    "SELECT * FROM phone_verifications WHERE user_id = $1 AND code = $2 AND verified = FALSE",
    [userId, code],
  )
  return result.rows[0] || null
}

export async function markPhoneVerified(id: number): Promise<void> {
  await queryWithRetry("UPDATE phone_verifications SET verified = TRUE WHERE id = $1", [id])
}

export async function getAllSMSSubscribers(): Promise<any[]> {
  const result = await queryWithRetry("SELECT * FROM sms_subscribers WHERE subscribed = TRUE")
  return result.rows
}
