"use client"

import { useEffect, useState } from "react"
import { getWeatherForecast, type WeatherForecast } from "@/lib/weather-data"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { TrendingUp } from "lucide-react"

export function WeatherChart({ region }: { region: string }) {
  const [forecast, setForecast] = useState<WeatherForecast[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadForecast = async () => {
      try {
        const data = await getWeatherForecast(region, 7)
        setForecast(data)
      } catch (error) {
        console.error("[v0] Failed to load weather forecast:", error)
      } finally {
        setLoading(false)
      }
    }

    loadForecast()
  }, [region])

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <p className="text-center text-muted-foreground">Loading chart...</p>
      </div>
    )
  }

  const chartData = forecast.map((day) => ({
    date: new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    temperature: day.temp,
    rainfall: day.rainfall,
  }))

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Temperature & Rainfall Trends</h2>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="temperature"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            name="Temperature (°C)"
            dot={{ fill: "hsl(var(--primary))" }}
          />
          <Line
            type="monotone"
            dataKey="rainfall"
            stroke="hsl(var(--accent))"
            strokeWidth={2}
            name="Rainfall (mm)"
            dot={{ fill: "hsl(var(--accent))" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
