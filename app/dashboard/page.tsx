import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { Navigation } from "@/components/navigation"
import { DashboardPageClient } from "@/components/dashboard/dashboard-page-client"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <DashboardPageClient user={user} />
    </div>
  )
}
