import { queryWithRetry } from "@/lib/db-mock"

// SMS service for feature phone integration
// In production, integrate with Ethio Telecom SMS API or Twilio

export interface SMSMessage {
  to: string
  message: string
  type: "alert" | "price" | "weather" | "general"
}

export interface SMSSubscription {
  phone: string
  userId: string
  alerts: boolean
  priceUpdates: boolean
  weatherAlerts: boolean
}

export async function sendSMS(smsData: SMSMessage): Promise<boolean> {
  const { to, message } = smsData

  // Store message record in database
  const insertSql = `
    INSERT INTO sms_messages (phone_number, direction, content, status, created_at)
    VALUES ($1, $2, $3, $4, NOW())
    RETURNING id
  `
  const insertResult = await queryWithRetry(insertSql, [to, "OUT", message, "PENDING"])
  const messageId = insertResult.rows[0]?.id

  // Try to deliver via Twilio if configured
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const fromNumber = process.env.TWILIO_FROM_NUMBER

  let status = "SENT"
  let errorCode: string | null = null

  if (accountSid && authToken && fromNumber) {
    try {
      const payload = new URLSearchParams()
      payload.append("To", to)
      payload.append("From", fromNumber)
      payload.append("Body", message)

      const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64")
      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: payload.toString(),
      })

      if (!response.ok) {
        const body = await response.text().catch(() => "")
        console.error("[v0] Twilio send error", response.status, body)
        status = "ERROR"
        errorCode = `HTTP_${response.status}`
      }
    } catch (err: any) {
      console.error("[v0] Twilio send exception", err)
      status = "ERROR"
      errorCode = err?.message || "unknown"
    }
  } else {
    // No SMS provider configured; treat as logged for now
    console.warn("[v0] No SMS provider configured (TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN / TWILIO_FROM_NUMBER)")
    status = "LOGGED"
  }

  await queryWithRetry(
    "UPDATE sms_messages SET status = $1, error_code = $2, sent_at = NOW() WHERE id = $3",
    [status, errorCode, messageId],
  )

  return status === "SENT" || status === "LOGGED"
}

export function generateOtp(length = 6): string {
  const digits = "0123456789"
  let otp = ""
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)]
  }
  return otp
}

export async function subscribeSMS(subscription: SMSSubscription): Promise<boolean> {
  const { phone, userId } = subscription

  const existing = await queryWithRetry("SELECT id FROM sms_subscribers WHERE phone = $1", [phone])
  if (existing.rows.length) {
    await queryWithRetry(
      "UPDATE sms_subscribers SET user_id = $1, subscribed = TRUE, created_at = NOW() WHERE phone = $2",
      [userId, phone],
    )
  } else {
    await queryWithRetry(
      "INSERT INTO sms_subscribers (user_id, phone, subscribed, created_at) VALUES ($1, $2, TRUE, NOW())",
      [userId, phone],
    )
  }

  return true
}

export async function unsubscribeSMS(phone: string): Promise<boolean> {
  await queryWithRetry("UPDATE sms_subscribers SET subscribed = FALSE WHERE phone = $1", [phone])
  return true
}

export async function getSMSSubscription(phone: string): Promise<SMSSubscription | null> {
  const result = await queryWithRetry("SELECT * FROM sms_subscribers WHERE phone = $1", [phone])
  const row = result.rows[0]
  if (!row) return null

  return {
    phone: row.phone,
    userId: String(row.user_id),
    alerts: true,
    priceUpdates: true,
    weatherAlerts: true,
  }
}

// Format messages for SMS (160 character limit)
export function formatPriceAlert(crop: string, price: number, change: number): string {
  const direction = change > 0 ? "up" : "down"
  return `AgriConnect: ${crop} price ${direction} ${Math.abs(change)}% to ${price} ETB/quintal. Check app for details.`
}

export function formatWeatherAlert(region: string, condition: string): string {
  return `AgriConnect: ${condition} expected in ${region}. Prepare your crops. Check app for forecast.`
}

export function formatGeneralAlert(message: string): string {
  // Truncate to 160 characters
  return message.length > 160 ? message.substring(0, 157) + "..." : message
}
