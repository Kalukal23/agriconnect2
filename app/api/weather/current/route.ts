import { type NextRequest, NextResponse } from "next/server"
import { REGION_COORDS } from "@/lib/weather-data"

export async function GET(request: NextRequest) {
  const region = request.nextUrl.searchParams.get("region") || "Addis Ababa"
  const coords = (REGION_COORDS as Record<string, { lat: number; lon: number }>)[region] || { lat: 9.03, lon: 38.74 }

  const apiKey = process.env.OPENWEATHER_API_KEY

  if (!apiKey) {
    console.warn("[v0] OpenWeatherMap API key not configured")
    return NextResponse.json(
      {
        temp: 22,
        feelsLike: 21,
        humidity: 65,
        windSpeed: 5.2,
        condition: "cloudy",
        description: "Partly cloudy",
        rainfall: 0,
        pressure: 1013,
      },
      { status: 200 },
    )
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${apiKey}`,
    )

    if (!response.ok) {
      throw new Error(`Weather API returned ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json({
      temp: Math.round(data.main.temp * 10) / 10,
      feelsLike: Math.round(data.main.feels_like * 10) / 10,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 10) / 10,
      condition: data.weather[0].main.toLowerCase(),
      description: data.weather[0].description,
      rainfall: data.rain?.["1h"] || 0,
      pressure: data.main.pressure,
    })
  } catch (error) {
    console.error("[v0] Weather API error:", error)
    return NextResponse.json({ error: "Failed to fetch weather data" }, { status: 500 })
  }
}
