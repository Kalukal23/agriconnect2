import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { Navigation } from "@/components/navigation"
import { WeatherPageClient } from "@/components/weather/weather-page-client"

export default async function WeatherPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  const userRegion = user.region || "Addis Ababa"

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <WeatherPageClient userRegion={userRegion} />
    </div>
  )
}
