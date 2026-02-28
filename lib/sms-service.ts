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

// Mock SMS subscriptions
const subscriptions: SMSSubscription[] = []

export async function sendSMS(smsData: SMSMessage): Promise<boolean> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // In production, integrate with SMS gateway:
  // const response = await fetch('https://sms-api.ethiotelecom.et/send', {
  //   method: 'POST',
  //   headers: { 'Authorization': `Bearer ${process.env.SMS_API_KEY}` },
  //   body: JSON.stringify({
  //     to: smsData.to,
  //     message: smsData.message
  //   })
  // })

  console.log("[v0] SMS sent:", smsData)
  return true
}

export async function subscribeSMS(subscription: SMSSubscription): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  // Check if already subscribed
  const existing = subscriptions.findIndex((s) => s.phone === subscription.phone)
  if (existing >= 0) {
    subscriptions[existing] = subscription
  } else {
    subscriptions.push(subscription)
  }

  return true
}

export async function unsubscribeSMS(phone: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const index = subscriptions.findIndex((s) => s.phone === phone)
  if (index >= 0) {
    subscriptions.splice(index, 1)
  }

  return true
}

export async function getSMSSubscription(phone: string): Promise<SMSSubscription | null> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return subscriptions.find((s) => s.phone === phone) || null
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
