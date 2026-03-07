const { Pool } = require("pg")
require("dotenv").config()

// prefer using full connection string when available
let poolConfig
if (process.env.DATABASE_URL) {
  poolConfig = {
    connectionString: process.env.DATABASE_URL,
    // Railway/Postgres needs TLS; disable cert check for convenience
    ssl: { rejectUnauthorized: false },
    max: 1,
    // fail faster on bad connections
    connectionTimeoutMillis: 5000,
  }
  console.log("[v0] using DATABASE_URL for pool")
} else {
  // fall back to individual env vars if provided
  poolConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE || process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: { rejectUnauthorized: false },
    max: 1,
    connectionTimeoutMillis: 5000,
  }
  console.log("[v0] pool config from individual env vars", poolConfig)
}

const pool = new Pool(poolConfig)

// TCP probe to help distinguish network/firewall issues from DB auth errors
const net = require('net')
function probeTcp(host, port, timeout = 3000) {
  return new Promise((resolve) => {
    const sock = new net.Socket()
    let done = false
    const onResult = (ok, reason) => {
      if (done) return
      done = true
      try {
        sock.destroy()
      } catch (e) {}
      resolve({ ok, reason })
    }

    sock.setTimeout(timeout, () => onResult(false, 'timeout'))
    sock.on('error', (err) => onResult(false, err && err.message))
    sock.connect(port, host, () => onResult(true))
  })
}

// derive host/port for probe
let probeHost, probePort
try {
  if (process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL)
    probeHost = url.hostname
    probePort = Number(url.port) || 5432
  } else {
    probeHost = process.env.DB_HOST
    probePort = Number(process.env.DB_PORT) || 5432
  }
} catch (e) {
  console.error('[v0] error parsing DATABASE_URL for probe', e)
}

if (probeHost) {
  probeTcp(probeHost, probePort, 4000).then(async (res) => {
    if (res.ok) {
      console.log('[v0] TCP probe OK to', probeHost + ':' + probePort)
    } else {
      console.error('[v0] TCP probe FAILED to', probeHost + ':' + probePort, 'reason:', res.reason)
    }

    // attempt SELECT 1 with retries to handle transient network blips
    const trySelect = async (attempts = 3) => {
      for (let i = 1; i <= attempts; i++) {
        try {
          await pool.query('SELECT 1')
          console.log('[v0] initial DB connection successful (attempt', i + ')')
          return
        } catch (err) {
          console.error('[v0] initial DB connection failed (attempt', i + ')', err && err.message)
          if (i < attempts) await new Promise((r) => setTimeout(r, 1000 * i))
        }
      }
    }

    await trySelect(3)
  })
} else {
  // fallback: just try the DB query
  ;(async () => {
    try {
      await pool.query('SELECT 1')
      console.log('[v0] initial DB connection successful')
    } catch (err) {
      console.error('[v0] initial DB connection failed', err)
    }
  })()
}

module.exports = {
  query: (text, params) => pool.query(text, params),
}
