import { queryWithRetry } from "@/lib/db-mock"

export interface ForumReply {
  id: string
  postId: string
  userId: string
  userName: string
  content: string
  createdAt: string
}

export interface CommunityPost {
  id: string
  userId: string
  userName: string
  userRegion: string
  title: string
  content: string
  category: string
  images?: string[]
  likes: number
  likedBy: string[]
  replies: number
  replyList: ForumReply[]
  createdAt: string
  updatedAt: string
}

export async function readPosts(): Promise<CommunityPost[]> {
  const sql = `
    SELECT p.post_id, p.title, p.content, p.category, p.vote_count, p.created_at, p.updated_at,
           u.id AS user_id, u.name AS user_name, u.location AS user_region
    FROM forum_posts p
    LEFT JOIN users u ON p.author_id = u.id
    WHERE p.is_question = FALSE
    ORDER BY p.created_at DESC
    LIMIT 50
  `
  const result = await queryWithRetry(sql)
  const posts: CommunityPost[] = []

  for (const row of result.rows) {
    // Get likedBy IDs
    const likesResult = await queryWithRetry(
      "SELECT user_id FROM forum_votes WHERE post_id = (SELECT id FROM forum_posts WHERE post_id = $1)",
      [row.post_id]
    )
    const likedBy = likesResult.rows.map((r: any) => String(r.user_id))

    // Get replies
    const repliesResult = await queryWithRetry(
      `SELECT r.reply_id, r.content, r.created_at, r.author_id, u.name AS user_name
       FROM forum_replies r
       LEFT JOIN users u ON r.author_id = u.id
       WHERE r.post_id = (SELECT id FROM forum_posts WHERE post_id = $1)
       ORDER BY r.created_at ASC`,
      [row.post_id]
    )

    const replyList: ForumReply[] = repliesResult.rows.map((r: any) => ({
      id: r.reply_id,
      postId: row.post_id,
      userId: String(r.author_id),
      userName: r.user_name || "User",
      content: r.content,
      createdAt: r.created_at.toISOString(),
    }))

    posts.push({
      id: row.post_id,
      userId: String(row.user_id),
      userName: row.user_name || "User",
      userRegion: row.user_region?.region || row.user_region || "Ethiopia",
      title: row.title,
      content: row.content,
      category: row.category || "General",
      likes: Number(row.vote_count || 0),
      likedBy,
      replies: replyList.length,
      replyList,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString(),
    })
  }

  return posts
}

export async function addPost(post: Omit<CommunityPost, "id" | "createdAt" | "updatedAt" | "likes" | "likedBy" | "replies" | "replyList">): Promise<void> {
  const sql = `
    INSERT INTO forum_posts (author_id, title, content, category, is_question, created_at, updated_at)
    VALUES ($1, $2, $3, $4, FALSE, NOW(), NOW())
  `
  await queryWithRetry(sql, [post.userId, post.title, post.content, post.category])
}

export async function findPost(id: string): Promise<CommunityPost | null> {
  const posts = await readPosts()
  return posts.find((p) => p.id === id) || null
}

export async function toggleLike(postId: string, userId: string): Promise<{ likes: number; liked: boolean } | null> {
  const findPostId = await queryWithRetry("SELECT id FROM forum_posts WHERE post_id = $1", [postId])
  if (findPostId.rows.length === 0) return null
  const internalPostId = findPostId.rows[0].id

  // Check if already liked
  const checkLike = await queryWithRetry(
    "SELECT id FROM forum_votes WHERE post_id = $1 AND user_id = $2",
    [internalPostId, userId]
  )

  if (checkLike.rows.length > 0) {
    // Unlike
    await queryWithRetry("DELETE FROM forum_votes WHERE id = $1", [checkLike.rows[0].id])
    await queryWithRetry("UPDATE forum_posts SET vote_count = vote_count - 1 WHERE id = $1", [internalPostId])
  } else {
    // Like
    await queryWithRetry(
      "INSERT INTO forum_votes (post_id, user_id, vote_type) VALUES ($1, $2, 'UP')",
      [internalPostId, userId]
    )
    await queryWithRetry("UPDATE forum_posts SET vote_count = vote_count + 1 WHERE id = $1", [internalPostId])
  }

  const updatedPost = await queryWithRetry("SELECT vote_count FROM forum_posts WHERE id = $1", [internalPostId])
  const likes = Number(updatedPost.rows[0].vote_count)

  const checkLiked = await queryWithRetry(
    "SELECT id FROM forum_votes WHERE post_id = $1 AND user_id = $2",
    [internalPostId, userId]
  )

  return { likes, liked: checkLiked.rows.length > 0 }
}

export async function addReply(postId: string, reply: Omit<ForumReply, "id" | "createdAt">): Promise<boolean> {
  const findPostId = await queryWithRetry("SELECT id FROM forum_posts WHERE post_id = $1", [postId])
  if (findPostId.rows.length === 0) return false
  const internalPostId = findPostId.rows[0].id

  const sql = `
    INSERT INTO forum_replies (post_id, author_id, content, created_at, updated_at)
    VALUES ($1, $2, $3, NOW(), NOW())
  `
  await queryWithRetry(sql, [internalPostId, reply.userId, reply.content])
  return true
}

export async function getReplies(postId: string): Promise<ForumReply[]> {
  const post = await findPost(postId)
  return post?.replyList || []
}
