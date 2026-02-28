"use client"

import { useLanguage } from "@/lib/language-context"
import { WeatherCurrent } from "./weather-current"
import { WeatherForecast } from "./weather-forecast"
import { WeatherAlerts } from "./weather-alerts"
import { WeatherChart } from "./weather-chart"
import { Cloud } from "lucide-react"

export function WeatherPageClient({ userRegion }: { userRegion: string }) {
  const { t } = useLanguage()

  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Cloud className="h-8 w-8 text-accent" />
          <h1 className="text-3xl md:text-4xl font-bold">{t("weather.title")}</h1>
        </div>
        <p className="text-muted-foreground">
          {t("weather.subtitle")} {userRegion}
        </p>
      </div>

      {/* Weather Alerts */}
      <WeatherAlerts region={userRegion} />

      {/* Current Weather */}
      <WeatherCurrent region={userRegion} />

      {/* 7-Day Forecast */}
      <WeatherForecast region={userRegion} />

      {/* Weather Chart */}
      <WeatherChart region={userRegion} />
    </main>
  )
}
