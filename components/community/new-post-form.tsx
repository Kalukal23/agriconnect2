"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CATEGORIES } from "@/lib/knowledge-data"
import { Loader2 } from "lucide-react"
import type { UserPayload } from "@/lib/auth"

export function NewPostForm({ user }: { user: UserPayload }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: CATEGORIES[0],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.title.trim() || !formData.content.trim()) {
      setError("Please fill in all fields")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create post")
      }

      // Redirect to community page
      router.push("/community")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create post")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 space-y-6">
      {error && (
        <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-lg p-3 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Post Title</Label>
        <Input
          id="title"
          type="text"
          placeholder="What's your question or topic?"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <select
          id="category"
          className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          disabled={loading}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <textarea
          id="content"
          className="w-full min-h-[200px] px-3 py-2 rounded-md border border-input bg-background text-foreground resize-y"
          placeholder="Describe your question or share your knowledge in detail..."
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          required
          disabled={loading}
        />
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Post...
            </>
          ) : (
            "Create Post"
          )}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
