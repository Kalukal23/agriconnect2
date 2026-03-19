"use client"

import { useState, useEffect } from "react"
import { Heart, MessageCircle, MapPin, Clock, Send, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface Reply {
  id: string
  userName: string
  content: string
  createdAt: string
}

interface Post {
  id: string
  userId: string
  userName: string
  userRegion: string
  title: string
  content: string
  category: string
  likes: number
  replies: number
  createdAt: string
  updatedAt: string
}

export function ForumPostList() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState<string>("all")
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())
  const [expandedPost, setExpandedPost] = useState<string | null>(null)
  const [replies, setReplies] = useState<Record<string, Reply[]>>({})
  const [replyText, setReplyText] = useState<Record<string, string>>({})
  const [submittingReply, setSubmittingReply] = useState<string | null>(null)

  const loadPosts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (category && category !== "all") params.append("category", category)
      const res = await fetch(`/api/community/posts?${params.toString()}`)
      const data = await res.json()
      setPosts(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("[v0] Failed to load forum posts:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPosts()
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

  const handleLike = async (e: React.MouseEvent, postId: string) => {
    e.preventDefault()
    e.stopPropagation()
    // Optimistic update
    const already = likedPosts.has(postId)
    setLikedPosts((prev) => {
      const next = new Set(prev)
      if (already) next.delete(postId)
      else next.add(postId)
      return next
    })
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, likes: already ? p.likes - 1 : p.likes + 1 } : p
      )
    )
    try {
      await fetch(`/api/community/posts/${postId}/like`, { method: "POST" })
    } catch (e) {
      // Revert on error
      setLikedPosts((prev) => {
        const next = new Set(prev)
        if (already) next.add(postId)
        else next.delete(postId)
        return next
      })
    }
  }

  const loadReplies = async (postId: string) => {
    try {
      const res = await fetch(`/api/community/posts/${postId}/replies`)
      const data = await res.json()
      setReplies((prev) => ({ ...prev, [postId]: Array.isArray(data) ? data : [] }))
    } catch (e) {
      console.error("[v0] Failed to load replies:", e)
    }
  }

  const toggleReplies = (e: React.MouseEvent, postId: string) => {
    e.preventDefault()
    e.stopPropagation()
    if (expandedPost === postId) {
      setExpandedPost(null)
    } else {
      setExpandedPost(postId)
      loadReplies(postId)
    }
  }

  const handleReply = async (e: React.MouseEvent, postId: string) => {
    e.preventDefault()
    e.stopPropagation()
    const content = replyText[postId]
    if (!content?.trim()) return
    setSubmittingReply(postId)
    try {
      const res = await fetch(`/api/community/posts/${postId}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })
      if (res.ok) {
        setReplyText((prev) => ({ ...prev, [postId]: "" }))
        await loadReplies(postId)
        setPosts((prev) =>
          prev.map((p) => (p.id === postId ? { ...p, replies: p.replies + 1 } : p))
        )
      }
    } catch (e) {
      console.error("[v0] Failed to post reply:", e)
    } finally {
      setSubmittingReply(null)
    }
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const mins = Math.floor(diff / (1000 * 60))
    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (mins > 0) return `${mins}m ago`
    return "Just now"
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2" />
        <p className="text-muted-foreground">Loading posts...</p>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/30 rounded-lg">
        <MessageCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">No posts found in this category.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow hover:border-primary/40"
        >
          {/* Post Header */}
          <div className="flex items-start justify-between mb-3">
            <Link href={`/community/${post.id}`} className="flex-1 min-w-0">
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
            </Link>
          </div>

          <Link href={`/community/${post.id}`} className="block">
            <h3 className="text-xl font-semibold mb-2 hover:text-primary transition-colors">{post.title}</h3>
            <p className="text-muted-foreground mb-4 line-clamp-2">{post.content}</p>
          </Link>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 text-sm">
            {/* Like Button */}
            <button
              onClick={(e) => handleLike(e, post.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all hover:scale-105 ${
                likedPosts.has(post.id)
                  ? "bg-red-100 text-red-600"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <Heart
                className={`h-4 w-4 ${likedPosts.has(post.id) ? "fill-red-500 text-red-500" : ""}`}
              />
              <span>{post.likes}</span>
            </button>

            {/* Reply Toggle */}
            <button
              onClick={(e) => toggleReplies(e, post.id)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-muted-foreground hover:bg-muted transition-all"
            >
              <MessageCircle className="h-4 w-4" />
              <span>{post.replies} {post.replies === 1 ? "Reply" : "Replies"}</span>
              {expandedPost === post.id ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </button>
          </div>

          {/* Reply Section */}
          {expandedPost === post.id && (
            <div className="mt-4 pt-4 border-t space-y-3" onClick={(e) => e.preventDefault()}>
              {/* Existing Replies */}
              {(replies[post.id] || []).map((r) => (
                <div key={r.id} className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold shrink-0">
                    {r.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-1">{r.userName}</p>
                    <p className="text-sm text-foreground">{r.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">{formatTime(r.createdAt)}</p>
                  </div>
                </div>
              ))}

              {(replies[post.id] || []).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-2">
                  No replies yet. Be the first!
                </p>
              )}

              {/* Reply Input */}
              <div className="flex gap-2">
                <Textarea
                  value={replyText[post.id] || ""}
                  onChange={(e) =>
                    setReplyText((prev) => ({ ...prev, [post.id]: e.target.value }))
                  }
                  placeholder="Write a reply..."
                  rows={2}
                  className="flex-1 text-sm"
                />
                <Button
                  size="sm"
                  onClick={(e) => handleReply(e, post.id)}
                  disabled={submittingReply === post.id || !replyText[post.id]?.trim()}
                  className="self-end"
                >
                  {submittingReply === post.id ? "..." : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
