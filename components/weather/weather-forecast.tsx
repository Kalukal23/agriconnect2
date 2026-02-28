import { getWeatherForecast } from "@/lib/weather-data"
import { Calendar } from "lucide-react"

export async function WeatherForecast({ region }: { region: string }) {
  const forecast = await getWeatherForecast(region, 7)

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">7-Day Forecast</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {forecast.map((day, index) => {
          const date = new Date(day.date)
          const dayName = index === 0 ? "Today" : date.toLocaleDateString("en-US", { weekday: "short" })

          return (
            <div key={day.date} className="bg-muted/30 rounded-lg p-4 text-center hover:bg-muted/50 transition-colors">
              <div className="font-semibold mb-2">{dayName}</div>
              <div className="text-3xl mb-2">
                {day.condition === "sunny"
                  ? "☀️"
                  : day.condition === "rainy"
                    ? "🌧️"
                    : day.condition === "stormy"
                      ? "⛈️"
                      : "☁️"}
              </div>
              <div className="text-lg font-semibold mb-1">{day.temp}°C</div>
              <div className="text-xs text-muted-foreground mb-2">
                {day.tempMin}° / {day.tempMax}°
              </div>
              <div className="text-xs text-accent font-medium">{day.rainfall}mm rain</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
