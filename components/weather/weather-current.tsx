import type React from "react"
import { getCurrentWeather } from "@/lib/weather-data"
import { Droplets, Wind, Gauge, CloudRain } from "lucide-react"

export async function WeatherCurrent({ region }: { region: string }) {
  const weather = await getCurrentWeather(region)

  return (
    <div className="bg-gradient-to-br from-accent/20 to-accent/5 border border-border rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Current Weather</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Main Weather Info */}
        <div>
          <div className="flex items-center gap-4 mb-4">
            <div className="text-6xl">
              {weather.condition === "sunny" ? "☀️" : weather.condition === "rainy" ? "🌧️" : "☁️"}
            </div>
            <div>
              <div className="text-5xl font-bold">{weather.temp}°C</div>
              <p className="text-muted-foreground">Feels like {weather.feelsLike}°C</p>
            </div>
          </div>
          <p className="text-lg capitalize">{weather.description}</p>
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-2 gap-4">
          <WeatherStat
            icon={<Droplets className="h-5 w-5 text-accent" />}
            label="Humidity"
            value={`${weather.humidity}%`}
          />
          <WeatherStat
            icon={<Wind className="h-5 w-5 text-accent" />}
            label="Wind Speed"
            value={`${weather.windSpeed} km/h`}
          />
          <WeatherStat
            icon={<CloudRain className="h-5 w-5 text-accent" />}
            label="Rainfall"
            value={`${weather.rainfall} mm`}
          />
          <WeatherStat
            icon={<Gauge className="h-5 w-5 text-accent" />}
            label="Pressure"
            value={`${weather.pressure} hPa`}
          />
        </div>
      </div>
    </div>
  )
}

function WeatherStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-card border border-border rounded-lg p-3">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  )
}
