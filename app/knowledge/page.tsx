import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { Navigation } from "@/components/navigation"
import { KnowledgePageClient } from "@/components/knowledge/knowledge-page-client"

export default async function KnowledgePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <KnowledgePageClient user={user} />
    </div>
  )
}
