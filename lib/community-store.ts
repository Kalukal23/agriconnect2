// File-based persistent store for community forum posts and replies
// Uses a JSON file so data survives Next.js hot-reloads and restarts

import fs from "fs"
import path from "path"

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

const DATA_DIR = path.join(process.cwd(), "data")
const POSTS_FILE = path.join(DATA_DIR, "community-posts.json")

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

export function readPosts(): CommunityPost[] {
  ensureDataDir()
  if (!fs.existsSync(POSTS_FILE)) return []
  try {
    const raw = fs.readFileSync(POSTS_FILE, "utf-8")
    return JSON.parse(raw) as CommunityPost[]
  } catch {
    return []
  }
}

export function writePosts(data: CommunityPost[]): void {
  ensureDataDir()
  fs.writeFileSync(POSTS_FILE, JSON.stringify(data, null, 2), "utf-8")
}

export function addPost(post: CommunityPost): void {
  const store = readPosts()
  store.unshift(post)
  writePosts(store)
}

export function findPost(id: string): CommunityPost | null {
  const store = readPosts()
  return store.find((p) => p.id === id) || null
}

export function toggleLike(postId: string, userId: string): { likes: number; liked: boolean } | null {
  const store = readPosts()
  const post = store.find((p) => p.id === postId)
  if (!post) return null

  if (post.likedBy.includes(userId)) {
    post.likedBy = post.likedBy.filter((id) => id !== userId)
    post.likes = Math.max(0, post.likes - 1)
  } else {
    post.likedBy.push(userId)
    post.likes += 1
  }
  post.updatedAt = new Date().toISOString()
  writePosts(store)
  return { likes: post.likes, liked: post.likedBy.includes(userId) }
}

export function addReply(postId: string, reply: ForumReply): ForumReply | null {
  const store = readPosts()
  const post = store.find((p) => p.id === postId)
  if (!post) return null

  post.replyList.push(reply)
  post.replies = post.replyList.length
  post.updatedAt = new Date().toISOString()
  writePosts(store)
  return reply
}

export function getReplies(postId: string): ForumReply[] {
  const store = readPosts()
  const post = store.find((p) => p.id === postId)
  return post?.replyList || []
}
