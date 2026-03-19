import type { WeatherForecast, WeatherAlert, CurrentWeather } from "./types"

const REGION_COORDS: Record<string, { lat: number; lon: number }> = {
  "Addis Ababa": { lat: 9.03, lon: 38.74 },
  Oromia: { lat: 8.54, lon: 39.27 },
  Amhara: { lat: 11.6, lon: 37.39 },
  Tigray: { lat: 14.0, lon: 38.0 },
  SNNPR: { lat: 6.5, lon: 37.0 },
  Somali: { lat: 8.0, lon: 44.0 },
  Afar: { lat: 11.75, lon: 40.5 },
  "Benishangul-Gumuz": { lat: 10.78, lon: 35.57 },
  Gambela: { lat: 8.25, lon: 34.58 },
  Harari: { lat: 9.31, lon: 42.13 },
  "Dire Dawa": { lat: 9.6, lon: 41.85 },
}

function generateMockCurrentWeather(region: string): CurrentWeather {
  // Deterministic fallback if API is not configured
  return {
    temp: 22,
    feelsLike: 21,
    humidity: 65,
    windSpeed: 5.2,
    condition: "cloudy",
    description: "Partly cloudy",
    rainfall: 0,
    pressure: 1013,
  }
}

function generateMockForecast(days: number): WeatherForecast[] {
  const forecast: WeatherForecast[] = []
  const start = new Date()

  for (let i = 0; i < days; i++) {
    const date = new Date(start)
    date.setDate(start.getDate() + i)
    forecast.push({
      date: date.toISOString().split("T")[0],
      temp: 22,
      tempMin: 18,
      tempMax: 26,
      humidity: 65,
      rainfall: 0,
      condition: "cloudy",
      windSpeed: 5,
    })
  }

  return forecast
}

function generateMockAlerts(region: string): WeatherAlert[] {
  return [
    {
      id: "alert-1",
      type: "warning",
      title: "Check local weather forecasts",
      description: "Weather data not configured; please set OPENWEATHER_API_KEY to fetch live data.",
      region,
      validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  ]
}

export async function getCurrentWeather(region: string): Promise<CurrentWeather> {
  try {
    const response = await fetch(`/api/weather/current?region=${encodeURIComponent(region)}`)
    if (!response.ok) throw new Error("Failed to fetch weather")
    return await response.json()
  } catch (error) {
    console.error("[v0] Weather fetch error:", error)
    await new Promise((resolve) => setTimeout(resolve, 300))
    return generateMockCurrentWeather(region)
  }
}

export async function getWeatherForecast(region: string, days = 7): Promise<WeatherForecast[]> {
  try {
    const response = await fetch(`/api/weather/forecast?region=${encodeURIComponent(region)}&days=${days}`)
    if (!response.ok) throw new Error("Failed to fetch forecast")
    return await response.json()
  } catch (error) {
    console.error("[v0] Forecast fetch error:", error)
    await new Promise((resolve) => setTimeout(resolve, 300))
    return generateMockForecast(days)
  }
}

export async function getWeatherAlerts(region: string): Promise<WeatherAlert[]> {
  try {
    const response = await fetch(`/api/weather/alerts?region=${encodeURIComponent(region)}`)
    if (!response.ok) throw new Error("Failed to fetch alerts")
    return await response.json()
  } catch (error) {
    console.error("[v0] Alerts fetch error:", error)
    await new Promise((resolve) => setTimeout(resolve, 200))
    return generateMockAlerts(region)
  }
}

export function getWeatherIcon(condition: string): string {
  const icons: Record<string, string> = {
    sunny: "☀️",
    cloudy: "☁️",
    rainy: "🌧️",
    stormy: "⛈️",
  }
  return icons[condition] || "🌤️"
}

export { REGION_COORDS }
