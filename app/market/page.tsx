import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { Navigation } from "@/components/navigation"
import { MarketPageClient } from "@/components/market/market-page-client"

export default async function MarketPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <MarketPageClient userRegion={user.region} />
    </div>
  )
}
