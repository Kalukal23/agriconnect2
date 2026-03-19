"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

const ETHIOPIAN_CROPS = [
  "Teff",
  "Wheat",
  "Barley",
  "Maize",
  "Sorghum",
  "Coffee",
  "Sesame",
  "Haricot Bean",
  "Chickpea",
  "Lentil",
]

const ETHIOPIAN_REGIONS = ["Addis Ababa", "Oromia", "Amhara", "Tigray", "SNNPR"]

export default function MarketAdminPage() {
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  const [prices, setPrices] = useState<any[]>([])
  const [selectedCrop, setSelectedCrop] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("")
  const [newPrice, setNewPrice] = useState("")
  const [market, setMarket] = useState("Central Market")
  const [updateLoading, setUpdateLoading] = useState(false)
  const [message, setMessage] = useState("")

  const [alertType, setAlertType] = useState("price_high")
  const [alertCrop, setAlertCrop] = useState("")
  const [alertPrice, setAlertPrice] = useState("")
  const [alertRegion, setAlertRegion] = useState("")
  const [alertCondition, setAlertCondition] = useState("")
  const [customMessage, setCustomMessage] = useState("")
  const [subscriberCount, setSubscriberCount] = useState(0)
  const [sendingAlert, setSendingAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")

  useEffect(() => {
    async function checkAccess() {
      try {
        const response = await fetch("/api/auth/me")
        if (response.ok) {
          const data = await response.json()
          if (data.user?.role === "admin" || data.user?.role === "Admin") {
            setIsAdmin(true)
            fetchPrices()
            fetchSubscriberCount()
          } else {
            // Not an admin
            window.location.href = "/auth/login?error=unauthorized"
          }
        } else {
          // Not logged in
          window.location.href = "/auth/login"
        }
      } catch (error) {
        console.error("[v0] Auth check failed:", error)
        window.location.href = "/auth/login"
      } finally {
        setLoading(false)
      }
    }
    checkAccess()
  }, [])

  async function fetchPrices() {
    try {
      const response = await fetch("/api/market/prices")
      const data = await response.json()
      setPrices(data)
    } catch (error) {
      console.error("[v0] Failed to fetch prices:", error)
    }
  }

  async function fetchSubscriberCount() {
    try {
      const response = await fetch("/api/admin/get-subscribers")
      const data = await response.json()
      setSubscriberCount(data.count)
    } catch (error) {
      console.error("[v0] Failed to fetch subscribers:", error)
    }
  }

  async function handleUpdatePrice() {
    if (!selectedCrop || !selectedRegion || !newPrice) {
      setMessage("Please fill all fields")
      return
    }

    setUpdateLoading(true)
    try {
      const response = await fetch("/api/market/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crop: selectedCrop,
          region: selectedRegion,
          price: Number.parseFloat(newPrice),
          market,
        }),
      })

      if (response.ok) {
        setMessage("✓ Price updated successfully!")
        setNewPrice("")
        setSelectedCrop("")
        setSelectedRegion("")
        await fetchPrices()
        setTimeout(() => setMessage(""), 3000)
      } else {
        const error = await response.json()
        setMessage(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error("[v0] Update error:", error)
      setMessage("Failed to update price")
    } finally {
      setUpdateLoading(false)
    }
  }

  async function handleSendAlert() {
    if (alertType === "custom" && !customMessage) {
      setAlertMessage("Please enter a custom message")
      return
    }

    if (alertType === "price_high" || alertType === "price_low") {
      if (!alertCrop || !alertPrice || !alertRegion) {
        setAlertMessage("Please fill all price alert fields")
        return
      }
    }

    if (alertType === "weather_bad") {
      if (!alertCondition || !alertRegion) {
        setAlertMessage("Please fill all weather alert fields")
        return
      }
    }

    setSendingAlert(true)
    try {
      const response = await fetch("/api/admin/send-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alertType,
          crop: alertCrop,
          price: alertPrice,
          region: alertRegion,
          condition: alertCondition,
          customMessage,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setAlertMessage(`✓ Alert sent to ${data.sent} users!`)
        setAlertCrop("")
        setAlertPrice("")
        setAlertRegion("")
        setAlertCondition("")
        setCustomMessage("")
        setTimeout(() => setAlertMessage(""), 3000)
      } else {
        const error = await response.json()
        setAlertMessage(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error("[v0] Alert error:", error)
      setAlertMessage("Failed to send alert")
    } finally {
      setSendingAlert(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      sessionStorage.removeItem("adminAuthenticated")
      window.location.href = "/"
    } catch (error) {
      console.error("[v0] Logout failed:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAdmin) return null // Should be redirected by useEffect

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Market Price Admin</h1>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                window.history.back()
              }}
              variant="outline"
              className="border-border text-foreground hover:bg-muted"
              title="Go back"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-border text-foreground hover:bg-muted"
            >
              Logout
            </Button>
          </div>
        </div>

        <Card className="p-6 mb-8 bg-card border-border">
          <h2 className="text-xl font-semibold text-foreground mb-4">Send SMS Alert to All Users</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Subscribers: <span className="font-semibold text-foreground">{subscriberCount} users</span>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Alert Type</label>
              <select
                value={alertType}
                onChange={(e) => setAlertType(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="price_high">High Price Alert</option>
                <option value="price_low">Low Price Alert</option>
                <option value="weather_bad">Bad Weather Alert</option>
                <option value="custom">Custom Message</option>
              </select>
            </div>

            {(alertType === "price_high" || alertType === "price_low") && (
              <>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Crop</label>
                  <select
                    value={alertCrop}
                    onChange={(e) => setAlertCrop(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  >
                    <option value="">Select a crop</option>
                    {ETHIOPIAN_CROPS.map((crop) => (
                      <option key={crop} value={crop}>
                        {crop}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Price (ETB)</label>
                  <Input
                    type="number"
                    value={alertPrice}
                    onChange={(e) => setAlertPrice(e.target.value)}
                    placeholder="Enter price"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Region</label>
                  <select
                    value={alertRegion}
                    onChange={(e) => setAlertRegion(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  >
                    <option value="">Select a region</option>
                    {ETHIOPIAN_REGIONS.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {alertType === "weather_bad" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Weather Condition</label>
                  <select
                    value={alertCondition}
                    onChange={(e) => setAlertCondition(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  >
                    <option value="">Select condition</option>
                    <option value="Heavy rainfall">Heavy rainfall</option>
                    <option value="Drought">Drought</option>
                    <option value="Strong winds">Strong winds</option>
                    <option value="Frost">Frost</option>
                    <option value="Hailstorm">Hailstorm</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Region</label>
                  <select
                    value={alertRegion}
                    onChange={(e) => setAlertRegion(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  >
                    <option value="">Select a region</option>
                    {ETHIOPIAN_REGIONS.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {alertType === "custom" && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">Custom Message (max 160 chars)</label>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value.substring(0, 160))}
                  placeholder="Enter your message"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground mt-1">{customMessage.length}/160 characters</p>
              </div>
            )}
          </div>

          <Button
            onClick={handleSendAlert}
            disabled={sendingAlert}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {sendingAlert ? "Sending..." : `Send Alert to ${subscriberCount} Users`}
          </Button>

          {alertMessage && (
            <p className={`mt-4 text-sm ${alertMessage.includes("✓") ? "text-green-600" : "text-red-600"}`}>
              {alertMessage}
            </p>
          )}
        </Card>

        {/* Update Form */}
        <Card className="p-6 mb-8 bg-card border-border">
          <h2 className="text-xl font-semibold text-foreground mb-4">Update Market Price</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Crop</label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="">Select a crop</option>
                {ETHIOPIAN_CROPS.map((crop) => (
                  <option key={crop} value={crop}>
                    {crop}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Region</label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="">Select a region</option>
                {ETHIOPIAN_REGIONS.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Price (ETB per quintal)</label>
              <Input
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                placeholder="Enter price"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Market</label>
              <select
                value={market}
                onChange={(e) => setMarket(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option>Central Market</option>
                <option>Wholesale Market</option>
                <option>ECX</option>
                <option>Local Market</option>
              </select>
            </div>
          </div>

          <Button
            onClick={handleUpdatePrice}
            disabled={updateLoading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {updateLoading ? "Updating..." : "Update Price"}
          </Button>

          {message && (
            <p className={`mt-4 text-sm ${message.includes("✓") ? "text-green-600" : "text-red-600"}`}>{message}</p>
          )}
        </Card>

        {/* Current Prices Table */}
        <Card className="p-6 bg-card border-border">
          <h2 className="text-xl font-semibold text-foreground mb-4">Current Market Prices</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-4 font-semibold text-foreground">Crop</th>
                  <th className="text-left py-2 px-4 font-semibold text-foreground">Region</th>
                  <th className="text-left py-2 px-4 font-semibold text-foreground">Market</th>
                  <th className="text-right py-2 px-4 font-semibold text-foreground">Price (ETB)</th>
                  <th className="text-center py-2 px-4 font-semibold text-foreground">Change</th>
                  <th className="text-left py-2 px-4 font-semibold text-foreground">Updated</th>
                </tr>
              </thead>
              <tbody>
                {prices.map((price) => (
                  <tr key={price.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-2 px-4 text-foreground">{price.crop}</td>
                    <td className="py-2 px-4 text-foreground">{price.region}</td>
                    <td className="py-2 px-4 text-foreground">{price.market}</td>
                    <td className="py-2 px-4 text-right font-semibold text-foreground">
                      {price.price.toLocaleString()}
                    </td>
                    <td className="py-2 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          price.trend === "up"
                            ? "bg-red-100 text-red-700"
                            : price.trend === "down"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {price.trend === "up" ? "↑" : price.trend === "down" ? "↓" : "→"} {price.change.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-2 px-4 text-sm text-muted-foreground">
                      {new Date(price.lastUpdated).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
