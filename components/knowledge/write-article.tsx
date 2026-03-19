"use client"

import { useState } from "react"
import { BookOpen, Send, Upload, X, Film, Music } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"

const CATEGORIES = [
  "Crop Management",
  "Pest & Disease Control",
  "Soil Health",
  "Irrigation",
  "Market & Prices",
  "Climate & Weather",
  "Livestock",
  "General",
]

interface MediaFile {
  name: string
  url: string
  type: "video" | "audio" | "image"
}

export function WriteArticle({ user }: { user: any }) {
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState(CATEGORIES[0])
  const [content, setContent] = useState("")
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append("file", file)

        const res = await fetch("/api/knowledge/media", {
          method: "POST",
          body: formData,
        })

        if (res.ok) {
          const data = await res.json()
          setMediaFiles((prev) => [...prev, { name: file.name, url: data.url, type: data.type }])
        }
      }
    } catch (err) {
      console.error("[v0] Upload error:", err)
      setError("Failed to upload media file")
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  const removeMedia = (url: string) => {
    setMediaFiles((prev) => prev.filter((f) => f.url !== url))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!title || !content) {
      setError("Title and content are required")
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/knowledge/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          content,
          mediaFiles,
          authorName: user?.username || user?.name || "Extension Worker",
        }),
      })

      if (res.ok) {
        setTitle("")
        setCategory(CATEGORIES[0])
        setContent("")
        setMediaFiles([])
        setSuccess("✓ Article published to Knowledge Base!")
        setTimeout(() => setSuccess(""), 4000)
      } else {
        const data = await res.json()
        setError(data.error || "Failed to publish article")
      }
    } catch (err) {
      console.error("[v0] Failed to publish article:", err)
      setError("Failed to publish article")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          Write an Article
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Share your agricultural knowledge with farmers. You can include text, videos, and audio.
        </p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-lg p-3 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 text-green-700 border border-green-200 rounded-lg p-3 text-sm font-medium">
              {success}
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium">Article Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. How to prevent wheat rust disease"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Content</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write detailed agricultural advice, step-by-step instructions, or helpful information for farmers..."
              rows={8}
              required
            />
          </div>

          {/* Media Upload */}
          <div className="space-y-3">
            <label className="block text-sm font-medium">Attach Media (Video / Audio)</label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-4 py-2 border border-dashed border-border rounded-md cursor-pointer hover:bg-muted/50 transition-colors text-sm">
                <Upload className="h-4 w-4 text-muted-foreground" />
                {uploading ? "Uploading..." : "Choose Video or Audio"}
                <input
                  type="file"
                  accept="video/*,audio/*"
                  className="hidden"
                  multiple
                  onChange={handleMediaUpload}
                  disabled={uploading}
                />
              </label>
              <p className="text-xs text-muted-foreground">MP4, MOV, MP3, WAV supported</p>
            </div>

            {/* Media Previews */}
            {mediaFiles.length > 0 && (
              <div className="space-y-2">
                {mediaFiles.map((f) => (
                  <div key={f.url} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    {f.type === "video" ? (
                      <Film className="h-5 w-5 text-blue-500 shrink-0" />
                    ) : (
                      <Music className="h-5 w-5 text-purple-500 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{f.name}</p>
                      {f.type === "video" ? (
                        <video controls className="mt-2 w-full rounded-md max-h-40" src={f.url} />
                      ) : (
                        <audio controls className="mt-2 w-full" src={f.url} />
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="shrink-0"
                      onClick={() => removeMedia(f.url)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Publishing..." : "Publish Article"}
            <Send className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </Card>
    </div>
  )
}
