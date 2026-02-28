import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { Navigation } from "@/components/navigation"
import { CommunityPageClient } from "@/components/community/community-page-client"

export default async function CommunityPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <CommunityPageClient />
    </div>
  )
}
