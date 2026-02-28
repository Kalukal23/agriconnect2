import { getWeatherAlerts } from "@/lib/weather-data"
import { AlertTriangle, Info, AlertCircle } from "lucide-react"

export async function WeatherAlerts({ region }: { region: string }) {
  const alerts = await getWeatherAlerts(region)

  if (alerts.length === 0) {
    return null
  }

  return (
    <div className="space-y-4 mb-6">
      {alerts.map((alert) => {
        const Icon = alert.type === "danger" ? AlertTriangle : alert.type === "warning" ? AlertCircle : Info

        const bgColor =
          alert.type === "danger"
            ? "bg-destructive/10 border-destructive/20"
            : alert.type === "warning"
              ? "bg-warning/10 border-warning/20"
              : "bg-accent/10 border-accent/20"

        const textColor =
          alert.type === "danger" ? "text-destructive" : alert.type === "warning" ? "text-warning" : "text-accent"

        return (
          <div key={alert.id} className={`border rounded-lg p-4 flex items-start gap-3 ${bgColor}`}>
            <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${textColor}`} />
            <div className="flex-1">
              <h3 className={`font-semibold mb-1 ${textColor}`}>{alert.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
              <p className="text-xs text-muted-foreground">
                Valid until {alert.validUntil.toLocaleDateString("en-ET", { month: "short", day: "numeric" })}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
