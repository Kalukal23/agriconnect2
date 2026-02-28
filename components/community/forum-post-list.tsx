"use client"

import { useState, useEffect } from "react"
import { getForumPosts, type ForumPost } from "@/lib/knowledge-data"
import { Heart, MessageCircle, MapPin, Clock } from "lucide-react"
import Link from "next/link"

export function ForumPostList() {
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState<string>("all")

  const loadPosts = async () => {
    setLoading(true)
    try {
      const data = await getForumPosts(category)
      setPosts(data)
    } catch (error) {
      console.error("[v0] Failed to load forum posts:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPosts()

    // Listen for category changes
    const handleCategoryChange = (e: Event) => {
      const customEvent = e as CustomEvent
      setCategory(customEvent.detail)
    }

    window.addEventListener("forumCategoryChanged", handleCategoryChange)
    return () => window.removeEventListener("forumCategoryChanged", handleCategoryChange)
  }, [])

  useEffect(() => {
    loadPosts()
  }, [category])

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor(diff / (1000 * 60 * 60))

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    return "Just now"
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading posts...</p>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No posts found in this category.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/community/${post.id}`}
          className="block bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow hover:border-primary/50"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-semibold">{post.userName}</span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {post.userRegion}
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {formatTime(post.createdAt)}
                </span>
              </div>
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                {post.category}
              </span>
            </div>
          </div>

          <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
          <p className="text-muted-foreground mb-4 line-clamp-2">{post.content}</p>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              {post.likes} likes
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              {post.replies} replies
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
