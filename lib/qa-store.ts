import { queryWithRetry } from "@/lib/db-mock"

export interface FarmerAnswer {
  id: string
  officerId: string
  officerName: string
  content: string
  createdAt: string
  mediaUrl?: string
  mediaType?: "video" | "audio"
}

export interface FarmerQuestion {
  id: string
  farmerId: string
  farmerName: string
  farmerPhone: string
  title: string
  content: string
  createdAt: string
  answers: FarmerAnswer[]
  status: "pending" | "answered"
}

export async function readQAStore(): Promise<FarmerQuestion[]> {
  const sql = `
    SELECT p.post_id, p.title, p.content, p.created_at, p.is_answered,
           u.id AS farmer_id, u.name AS farmer_name, u.phone AS farmer_phone
    FROM forum_posts p
    LEFT JOIN users u ON p.author_id = u.id
    WHERE p.is_question = TRUE
    ORDER BY p.created_at DESC
  `
  const result = await queryWithRetry(sql)
  const questions: FarmerQuestion[] = []

  for (const row of result.rows) {
    // Get answers for each question
    const answersResult = await queryWithRetry(
      `SELECT r.reply_id, r.content, r.created_at, r.author_id, u.name AS officer_name
       FROM forum_replies r
       LEFT JOIN users u ON r.author_id = u.id
       WHERE r.post_id = (SELECT id FROM forum_posts WHERE post_id = $1)
       ORDER BY r.created_at ASC`,
      [row.post_id]
    )

    const answers: FarmerAnswer[] = answersResult.rows.map((r: any) => ({
      id: r.reply_id,
      officerId: String(r.author_id),
      officerName: r.officer_name || "Extension Worker",
      content: r.content,
      createdAt: r.created_at.toISOString(),
    }))

    questions.push({
      id: row.post_id,
      farmerId: String(row.farmer_id),
      farmerName: row.farmer_name || "Unknown Farmer",
      farmerPhone: row.farmer_phone || "",
      title: row.title,
      content: row.content,
      createdAt: row.created_at.toISOString(),
      answers,
      status: row.is_answered ? "answered" : "pending",
    })
  }

  return questions
}

export async function addQuestion(q: { authorId: number; title: string; content: string }): Promise<void> {
  const sql = `
    INSERT INTO forum_posts (author_id, title, content, is_question, status, created_at, updated_at)
    VALUES ($1, $2, $3, TRUE, 'pending', NOW(), NOW())
  `
  await queryWithRetry(sql, [q.authorId, q.title, q.content])
}

export async function addAnswer(questionId: string, answer: { officerId: number; content: string }): Promise<boolean> {
  const sql = `
    INSERT INTO forum_replies (post_id, author_id, content, created_at, updated_at)
    SELECT id, $1, $2, NOW(), NOW()
    FROM forum_posts WHERE post_id = $3
    RETURNING post_id
  `
  const result = await queryWithRetry(sql, [answer.officerId, answer.content, questionId])
  
  if (result.rows.length > 0) {
    // Update question status to answered
    await queryWithRetry("UPDATE forum_posts SET is_answered = TRUE WHERE post_id = $1", [questionId])
    return true
  }
  return false
}
