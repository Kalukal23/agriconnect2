"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MessageSquare, Loader2, CheckCircle } from "lucide-react"
import type { UserPayload } from "@/lib/auth"

export function SMSSettings({ user }: { user: UserPayload }) {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [settings, setSettings] = useState({
    alerts: false,
    priceUpdates: false,
    weatherAlerts: false,
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/sms/subscription")
      if (response.ok) {
        const data = await response.json()
        if (data.subscription) {
          setSettings({
            alerts: data.subscription.alerts,
            priceUpdates: data.subscription.priceUpdates,
            weatherAlerts: data.subscription.weatherAlerts,
          })
        }
      }
    } catch (error) {
      console.error("[v0] Failed to load SMS settings:", error)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    setSaving(true)
    setSaved(false)

    try {
      const response = await fetch("/api/sms/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (error) {
      console.error("[v0] Failed to save SMS settings:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <MessageSquare className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold">SMS Notifications</h2>
      </div>

      <p className="text-sm text-muted-foreground mb-6">
        Receive important updates via SMS on your phone ({user.phone}). Works on any phone, including feature phones.
      </p>

      {loading ? (
        <div className="text-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Alert Toggles */}
          <ToggleOption
            label="General Alerts"
            description="Important announcements and system updates"
            checked={settings.alerts}
            onChange={() => handleToggle("alerts")}
          />

          <ToggleOption
            label="Price Updates"
            description="Get notified when crop prices change significantly"
            checked={settings.priceUpdates}
            onChange={() => handleToggle("priceUpdates")}
          />

          <ToggleOption
            label="Weather Alerts"
            description="Receive warnings about extreme weather conditions"
            checked={settings.weatherAlerts}
            onChange={() => handleToggle("weatherAlerts")}
          />

          {/* Save Button */}
          <Button onClick={saveSettings} disabled={saving} className="w-full mt-6">
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : saved ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Settings Saved
              </>
            ) : (
              "Save SMS Preferences"
            )}
          </Button>

          {/* Info */}
          <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4 mt-4">
            <p className="text-sm text-muted-foreground">
              <strong>SMS Format:</strong> Messages are limited to 160 characters and sent in your preferred language.
              Standard SMS rates may apply.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function ToggleOption({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <div className="flex items-start justify-between p-4 bg-muted/30 rounded-lg">
      <div className="flex-1">
        <p className="font-medium mb-1">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <button
        type="button"
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? "bg-primary" : "bg-muted"
        }`}
        aria-label={`Toggle ${label}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  )
}
