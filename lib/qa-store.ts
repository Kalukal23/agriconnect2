// File-based persistent store for farmer Q&A
// Uses a JSON file so data survives Next.js hot-reloads and restarts

import fs from "fs"
import path from "path"

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

const DATA_DIR = path.join(process.cwd(), "data")
const QA_FILE = path.join(DATA_DIR, "qa-store.json")

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

export function readQAStore(): FarmerQuestion[] {
  ensureDataDir()
  if (!fs.existsSync(QA_FILE)) return []
  try {
    const raw = fs.readFileSync(QA_FILE, "utf-8")
    return JSON.parse(raw) as FarmerQuestion[]
  } catch {
    return []
  }
}

export function writeQAStore(data: FarmerQuestion[]): void {
  ensureDataDir()
  fs.writeFileSync(QA_FILE, JSON.stringify(data, null, 2), "utf-8")
}

export function addQuestion(q: FarmerQuestion): void {
  const store = readQAStore()
  store.unshift(q)
  writeQAStore(store)
}

export function addAnswer(questionId: string, answer: FarmerAnswer): FarmerQuestion | null {
  const store = readQAStore()
  const question = store.find((q) => q.id === questionId)
  if (!question) return null
  question.answers.push(answer)
  question.status = "answered"
  writeQAStore(store)
  return question
}
