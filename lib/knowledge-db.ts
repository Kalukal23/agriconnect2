import { queryWithRetry } from "@/lib/db-mock"

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
  createdAt: Date
}

export const CATEGORIES = [
  "Crop Management",
  "Pest Control",
  "Soil Health",
  "Irrigation",
  "Harvesting",
  "Marketing",
]

function mapArticleRow(row: any): Article {
  return {
    id: row.content_id,
    title: row.title_en || row.title_am || "",
    content: row.description || "",
    excerpt: (row.description || "").slice(0, 280),
    category: row.category || "",
    tags: Array.isArray(row.tags) ? row.tags : [],
    author: row.author || "",
    publishedAt: row.publish_date ? new Date(row.publish_date) : new Date(),
    views: Number(row.view_count || 0),
    language: row.language || "en",
  }
}

export async function searchArticles(query: string, category?: string): Promise<Article[]> {
  const whereClauses: string[] = ["content_type = 'ARTICLE'"]
  const params: any[] = []
  let idx = 1

  if (category && category !== "all") {
    whereClauses.push(`category = $${idx}`)
    params.push(category)
    idx++
  }

  if (query) {
    whereClauses.push(
      `(title_en ILIKE $${idx} OR description ILIKE $${idx} OR tags::text ILIKE $${idx})`,
    )
    params.push(`%${query}%`)
    idx++
  }

  const sql = `
    SELECT ec.content_id, ec.title_en, ec.title_am, ec.description, ec.category, ec.tags,
           ec.language, ec.view_count, ec.publish_date, u.name AS author
    FROM extension_content ec
    LEFT JOIN users u ON ec.author_id = u.id
    WHERE ${whereClauses.join(" AND ")}
    ORDER BY ec.publish_date DESC NULLS LAST
    LIMIT 50
  `

  const result = await queryWithRetry(sql, params)
  return result.rows.map(mapArticleRow)
}

export async function getArticleById(id: string): Promise<Article | null> {
  const sql = `
    SELECT ec.content_id, ec.title_en, ec.title_am, ec.description, ec.category, ec.tags,
           ec.language, ec.view_count, ec.publish_date, u.name AS author
    FROM extension_content ec
    LEFT JOIN users u ON ec.author_id = u.id
    WHERE ec.content_id = $1 AND ec.content_type = 'ARTICLE'
    LIMIT 1
  `
  const result = await queryWithRetry(sql, [id])
  if (!result.rows.length) return null
  return mapArticleRow(result.rows[0])
}

function mapForumPostRow(row: any): ForumPost {
  return {
    id: row.post_id,
    userId: String(row.author_id || ""),
    userName: row.user_name || "",
    userRegion: typeof row.user_region === "object" ? row.user_region?.region : row.user_region || "",
    title: row.title || "",
    content: row.content || "",
    category: row.category || "",
    likes: Number(row.vote_count || 0),
    replies: Number(row.reply_count || 0),
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  }
}

export async function getForumPosts(category?: string): Promise<ForumPost[]> {
  const whereClauses: string[] = []
  const params: any[] = []
  let idx = 1

  if (category && category !== "all") {
    whereClauses.push(`p.category = $${idx}`)
    params.push(category)
    idx++
  }

  const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : ""

  const sql = `
    SELECT p.post_id, p.title, p.content, p.category, p.tags, p.vote_count,
           p.created_at, p.updated_at, p.author_id,
           u.name AS user_name, u.location AS user_region,
           (SELECT COUNT(*) FROM forum_replies r WHERE r.post_id = p.id) AS reply_count
    FROM forum_posts p
    LEFT JOIN users u ON p.author_id = u.id
    ${whereSql}
    ORDER BY p.created_at DESC
    LIMIT 50
  `

  const result = await queryWithRetry(sql, params)
  return result.rows.map(mapForumPostRow)
}

export async function getForumPostById(id: string): Promise<ForumPost | null> {
  const sql = `
    SELECT p.post_id, p.title, p.content, p.category, p.tags, p.vote_count,
           p.created_at, p.updated_at, p.author_id,
           u.name AS user_name, u.location AS user_region,
           (SELECT COUNT(*) FROM forum_replies r WHERE r.post_id = p.id) AS reply_count
    FROM forum_posts p
    LEFT JOIN users u ON p.author_id = u.id
    WHERE p.post_id = $1
    LIMIT 1
  `
  const result = await queryWithRetry(sql, [id])
  if (!result.rows.length) return null
  return mapForumPostRow(result.rows[0])
}

export async function createForumPost(
  post: Omit<ForumPost, "id" | "createdAt" | "updatedAt">,
): Promise<ForumPost> {
  const sql = `
    INSERT INTO forum_posts (author_id, title, content, category, tags, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
    RETURNING post_id, author_id, title, content, category, tags, vote_count, created_at, updated_at
  `
  const tags: any[] = []
  const result = await queryWithRetry(sql, [
    post.userId,
    post.title,
    post.content,
    post.category,
    tags,
  ])
  const row = result.rows[0]
  return {
    id: row.post_id,
    userId: String(row.author_id || ""),
    userName: post.userName,
    userRegion: typeof post.userRegion === "object" ? (post.userRegion as any)?.region : post.userRegion || "Ethiopia",
    title: row.title || "",
    content: row.content || "",
    category: row.category || "",
    likes: Number(row.vote_count || 0),
    replies: 0,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  }
}
