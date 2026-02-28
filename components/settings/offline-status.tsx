"use client"

import { useState, useEffect } from "react"
import { Wifi, WifiOff, Download, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function OfflineStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [cacheStatus, setCacheStatus] = useState<"idle" | "caching" | "cached">("idle")

  useEffect(() => {
    // Monitor online/offline status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    setIsOnline(navigator.onLine)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const cacheData = async () => {
    setCacheStatus("caching")

    try {
      // Cache key pages and data
      const urlsToCache = ["/dashboard", "/market", "/weather", "/knowledge", "/community"]

      for (const url of urlsToCache) {
        await fetch(url)
      }

      setCacheStatus("cached")
      setTimeout(() => setCacheStatus("idle"), 3000)
    } catch (error) {
      console.error("[v0] Failed to cache data:", error)
      setCacheStatus("idle")
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Offline Access</h2>

      <div className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-3">
            {isOnline ? (
              <>
                <Wifi className="h-5 w-5 text-success" />
                <div>
                  <p className="font-medium">Connected</p>
                  <p className="text-sm text-muted-foreground">You are online</p>
                </div>
              </>
            ) : (
              <>
                <WifiOff className="h-5 w-5 text-warning" />
                <div>
                  <p className="font-medium">Offline</p>
                  <p className="text-sm text-muted-foreground">Using cached data</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Cache Control */}
        <div>
          <p className="text-sm text-muted-foreground mb-3">
            Download data for offline access. This allows you to view market prices, weather forecasts, and articles
            without internet connection.
          </p>
          <Button
            onClick={cacheData}
            disabled={cacheStatus === "caching"}
            variant="outline"
            className="w-full bg-transparent"
          >
            {cacheStatus === "caching" ? (
              <>
                <Download className="mr-2 h-4 w-4 animate-pulse" />
                Downloading Data...
              </>
            ) : cacheStatus === "cached" ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Data Cached Successfully
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download for Offline Use
              </>
            )}
          </Button>
        </div>

        {/* Info */}
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> Offline mode allows you to access previously loaded data. For the latest updates,
            connect to the internet.
          </p>
        </div>
      </div>
    </div>
  )
}
