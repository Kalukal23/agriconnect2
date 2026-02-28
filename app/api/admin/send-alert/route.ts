import { getAllSMSSubscribers } from "@/lib/db-mock"
import { sendSMS, formatGeneralAlert } from "@/lib/sms-service"

export async function POST(request: Request) {
  try {
    const { alertType, crop, price, region, condition, customMessage } = await request.json()

    console.log("[v0] Sending alert:", { alertType, crop, price, region, condition })

    // Get all SMS subscribers
    const subscribers = await getAllSMSSubscribers()

    if (subscribers.length === 0) {
      return Response.json({ error: "No subscribers found", sent: 0 }, { status: 400 })
    }

    let messagesSent = 0

    // Send SMS to each subscriber
    for (const subscriber of subscribers) {
      let message = ""

      if (alertType === "price_high") {
        message = `AgriConnect: ${crop} price is HIGH at ${price} ETB/quintal in ${region}. Good time to sell!`
      } else if (alertType === "price_low") {
        message = `AgriConnect: ${crop} price is LOW at ${price} ETB/quintal in ${region}. Wait for better prices.`
      } else if (alertType === "weather_bad") {
        message = `AgriConnect: ${condition} expected in ${region}. Prepare your crops now!`
      } else if (alertType === "custom") {
        message = formatGeneralAlert(customMessage)
      }

      // Truncate to 160 characters for SMS
      if (message.length > 160) {
        message = message.substring(0, 157) + "..."
      }

      const sent = await sendSMS({
        to: subscriber.phone,
        message,
        type: "alert",
      })

      if (sent) {
        messagesSent++
      }
    }

    console.log(`[v0] Alert sent to ${messagesSent} subscribers`)

    return Response.json({
      success: true,
      sent: messagesSent,
      total: subscribers.length,
    })
  } catch (error) {
    console.error("[v0] Alert error:", error)
    return Response.json({ error: "Failed to send alert" }, { status: 500 })
  }
}
