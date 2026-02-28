import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { Navigation } from "@/components/navigation"
import { NewPostForm } from "@/components/community/new-post-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function NewPostPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 container mx-auto px-4 py-8">
        <Link
          href="/community"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Community
        </Link>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Create New Post</h1>
          <p className="text-muted-foreground mb-8">Share your question or knowledge with the community</p>

          <NewPostForm user={user} />
        </div>
      </main>
    </div>
  )
}
