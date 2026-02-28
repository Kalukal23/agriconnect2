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
  const baseTemp = 20 + Math.random() * 10
  return {
    temp: Number.parseFloat(baseTemp.toFixed(1)),
    feelsLike: Number.parseFloat((baseTemp + (Math.random() - 0.5) * 3).toFixed(1)),
    humidity: Math.floor(40 + Math.random() * 40),
    windSpeed: Number.parseFloat((Math.random() * 15).toFixed(1)),
    condition: ["sunny", "cloudy", "rainy"][Math.floor(Math.random() * 3)],
    description: "Partly cloudy with chance of rain",
    rainfall: Number.parseFloat((Math.random() * 10).toFixed(1)),
    pressure: Math.floor(1000 + Math.random() * 30),
  }
}

function generateMockForecast(days: number): WeatherForecast[] {
  const forecast: WeatherForecast[] = []
  const conditions: Array<"sunny" | "cloudy" | "rainy" | "stormy"> = ["sunny", "cloudy", "rainy", "stormy"]

  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() + i)

    const baseTemp = 20 + Math.random() * 10
    forecast.push({
      date: date.toISOString().split("T")[0],
      temp: Number.parseFloat(baseTemp.toFixed(1)),
      tempMin: Number.parseFloat((baseTemp - 5).toFixed(1)),
      tempMax: Number.parseFloat((baseTemp + 5).toFixed(1)),
      humidity: Math.floor(40 + Math.random() * 40),
      rainfall: Number.parseFloat((Math.random() * 20).toFixed(1)),
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      windSpeed: Number.parseFloat((Math.random() * 15).toFixed(1)),
    })
  }

  return forecast
}

function generateMockAlerts(region: string): WeatherAlert[] {
  const alerts: WeatherAlert[] = []

  if (Math.random() > 0.5) {
    alerts.push({
      id: "alert-1",
      type: "warning",
      title: "Heavy Rainfall Expected",
      description: "Expect heavy rainfall this weekend. Prepare your crops and ensure proper drainage.",
      region,
      validUntil: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    })
  }

  if (Math.random() > 0.7) {
    alerts.push({
      id: "alert-2",
      type: "danger",
      title: "Drought Warning",
      description: "Low rainfall expected for the next two weeks. Consider irrigation for sensitive crops.",
      region,
      validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    })
  }

  return alerts
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
