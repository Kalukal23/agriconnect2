import { type NextRequest, NextResponse } from "next/server"
import { REGION_COORDS } from "@/lib/weather-data"

export async function GET(request: NextRequest) {
  const region = request.nextUrl.searchParams.get("region") || "Addis Ababa"
  const days = Number.parseInt(request.nextUrl.searchParams.get("days") || "7")
  const coords = (REGION_COORDS as Record<string, { lat: number; lon: number }>)[region] || { lat: 9.03, lon: 38.74 }

  const apiKey = process.env.OPENWEATHER_API_KEY

  if (!apiKey) {
    console.warn("[v0] OpenWeatherMap API key not configured")
    const forecast = []
    for (let i = 0; i < days; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
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
    return NextResponse.json(forecast)
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${apiKey}`,
    )

    if (!response.ok) {
      throw new Error(`Forecast API returned ${response.status}`)
    }

    const data = await response.json()
    const forecast = []
    const dailyData: Record<string, any> = {}

    data.list.forEach((item: any) => {
      const date = item.dt_txt.split(" ")[0]
      if (!dailyData[date]) {
        dailyData[date] = []
      }
      dailyData[date].push(item)
    })

    Object.entries(dailyData)
      .slice(0, days)
      .forEach(([date, items]: [string, any[]]) => {
        const avgTemp = (items as any[]).reduce((sum, item) => sum + item.main.temp, 0) / (items as any[]).length
        const maxTemp = Math.max(...(items as any[]).map((item) => item.main.temp))
        const minTemp = Math.min(...(items as any[]).map((item) => item.main.temp))
        const avgHumidity =
          (items as any[]).reduce((sum, item) => sum + item.main.humidity, 0) / (items as any[]).length
        const totalRain = (items as any[]).reduce((sum, item) => sum + (item.rain?.["3h"] || 0), 0)

        forecast.push({
          date,
          temp: Math.round(avgTemp * 10) / 10,
          tempMin: Math.round(minTemp * 10) / 10,
          tempMax: Math.round(maxTemp * 10) / 10,
          humidity: Math.round(avgHumidity),
          rainfall: Math.round(totalRain * 10) / 10,
          condition: (items as any[])[0].weather[0].main.toLowerCase(),
          windSpeed: Math.round((items as any[])[0].wind.speed * 10) / 10,
        })
      })

    return NextResponse.json(forecast)
  } catch (error) {
    console.error("[v0] Forecast API error:", error)
    return NextResponse.json({ error: "Failed to fetch forecast data" }, { status: 500 })
  }
}
