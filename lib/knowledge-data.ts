export interface Article {
  id: string
  title: string
  content: string
  excerpt: string
  category: string
  tags: string[]
  author: string
  publishedAt: Date
  views: number
  language: string
}

export interface ForumPost {
  id: string
  userId: string
  userName: string
  userRegion: string
  title: string
  content: string
  category: string
  images?: string[]
  likes: number
  replies: number
  createdAt: Date
  updatedAt: Date
}

export interface ForumReply {
  id: string
  postId: string
  userId: string
  userName: string
  content: string
  createdAt: string
}

export const CATEGORIES = [
  "Crop Management",
  "Pest Control",
  "Soil Health",
  "Irrigation",
  "Harvesting",
  "Marketing",
]

function parseArticle(raw: any): Article {
  return {
    ...raw,
    publishedAt: raw.publishedAt ? new Date(raw.publishedAt) : new Date(),
  }
}

function parseForumPost(raw: any): ForumPost {
  return {
    ...raw,
    createdAt: raw.createdAt ? new Date(raw.createdAt) : new Date(),
    updatedAt: raw.updatedAt ? new Date(raw.updatedAt) : new Date(),
  }
}

export async function searchArticles(query: string, category?: string): Promise<Article[]> {
  const params = new URLSearchParams()
  if (query) params.append("q", query)
  if (category) params.append("category", category)

  const response = await fetch(`/api/knowledge/articles?${params.toString()}`)
  if (!response.ok) {
    console.error("[v0] Failed to search articles")
    return []
  }
  const data = await response.json()
  return Array.isArray(data) ? data.map(parseArticle) : []
}

export async function getArticleById(id: string): Promise<Article | null> {
  const response = await fetch(`/api/knowledge/articles/${encodeURIComponent(id)}`)
  if (!response.ok) return null
  const data = await response.json()
  return data ? parseArticle(data) : null
}

export async function getForumPosts(category?: string): Promise<ForumPost[]> {
  const params = new URLSearchParams()
  if (category) params.append("category", category)

  const response = await fetch(`/api/community/posts?${params.toString()}`)
  if (!response.ok) {
    console.error("[v0] Failed to fetch forum posts")
    return []
  }
  const data = await response.json()
  return Array.isArray(data) ? data.map(parseForumPost) : []
}

export async function getForumPostById(id: string): Promise<ForumPost | null> {
  const response = await fetch(`/api/community/posts/${encodeURIComponent(id)}`)
  if (!response.ok) return null
  const data = await response.json()
  return data ? parseForumPost(data) : null
}

export async function createForumPost(
  post: Omit<ForumPost, "id" | "createdAt" | "updatedAt">,
): Promise<ForumPost | null> {
  const response = await fetch(`/api/community/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  })
  if (!response.ok) {
    console.error("[v0] Failed to create forum post")
    return null
  }
  const data = await response.json()
  return data ? parseForumPost(data) : null
}
