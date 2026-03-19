"use client"

import { useState, useEffect } from "react"
import { MessageSquare, Send, User, Clock, CheckCircle, Clock3, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"

interface FarmerAnswer {
  id: string
  officerName: string
  content: string
  createdAt: string
  mediaUrl?: string
  mediaType?: "video" | "audio"
}

interface FarmerQuestion {
  id: string
  farmerName: string
  farmerPhone: string
  title: string
  content: string
  createdAt: string
  answers: FarmerAnswer[]
  status: "pending" | "answered"
}

export function KnowledgeQA({ user }: { user: any }) {
  const role = (user?.role || "Farmer").toLowerCase()
  const isExtensionWorker = ["extensionofficer", "extension_officer", "extensionworker", "extension worker", "admin"].includes(role)

  const [questions, setQuestions] = useState<FarmerQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [newTitle, setNewTitle] = useState("")
  const [newContent, setNewContent] = useState("")
  const [showAskForm, setShowAskForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [answerText, setAnswerText] = useState<Record<string, string>>({})
  const [answeringId, setAnsweringId] = useState<string | null>(null)

  useEffect(() => {
    loadQuestions()
  }, [])

  const loadQuestions = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/knowledge/questions")
      const data = await res.json()
      setQuestions(data)
    } catch (err) {
      console.error("[v0] Failed to load questions:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle || !newContent) return
    setSubmitting(true)
    try {
      const res = await fetch("/api/knowledge/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, content: newContent }),
      })
      if (res.ok) {
        setNewTitle("")
        setNewContent("")
        setShowAskForm(false)
        await loadQuestions()
      }
    } catch (err) {
      console.error("[v0] Failed to post question:", err)
    } finally {
      setSubmitting(false)
    }
  }

  const [answerError, setAnswerError] = useState<Record<string, string>>({})

  const handleAnswer = async (questionId: string) => {
    const content = answerText[questionId]
    if (!content) return
    setAnsweringId(questionId)
    setAnswerError((prev) => ({ ...prev, [questionId]: "" }))
    try {
      const res = await fetch(`/api/knowledge/questions/${questionId}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })
      const data = await res.json()
      if (res.ok) {
        setAnswerText((prev) => ({ ...prev, [questionId]: "" }))
        await loadQuestions()
      } else {
        setAnswerError((prev) => ({ ...prev, [questionId]: data.error || "Failed to send answer" }))
      }
    } catch (err) {
      console.error("[v0] Failed to post answer:", err)
      setAnswerError((prev) => ({ ...prev, [questionId]: "Network error — could not send answer" }))
    } finally {
      setAnsweringId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            {isExtensionWorker ? "Farmer Questions" : "My Questions"}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {isExtensionWorker
              ? "Answer questions from farmers in your area"
              : "Ask a question and get expert advice from Extension Workers"}
          </p>
        </div>
        {!isExtensionWorker && (
          <Button onClick={() => setShowAskForm(!showAskForm)}>
            {showAskForm ? "Cancel" : "Ask a Question"}
          </Button>
        )}
      </div>

      {/* Ask Form (Farmers Only) */}
      {showAskForm && !isExtensionWorker && (
        <Card className="p-4 border-primary/20 bg-primary/5">
          <form onSubmit={handleAskQuestion} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Question Title</label>
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Briefly describe your question"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Details</label>
              <Textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Provide more details about your problem or question"
                rows={4}
                required
              />
            </div>
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "Posting..." : "Post Question"}
              <Send className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </Card>
      )}

      {/* Questions List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2" />
            <p className="text-muted-foreground">Loading questions...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-lg">
            <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">
              {isExtensionWorker ? "No questions from farmers yet." : "You haven't asked any questions yet."}
            </p>
            {!isExtensionWorker && (
              <Button variant="outline" size="sm" className="mt-3" onClick={() => setShowAskForm(true)}>
                Ask your first question
              </Button>
            )}
          </div>
        ) : (
          questions.map((q) => (
            <Card key={q.id} className="p-4 hover:border-primary/50 transition-colors">
              {/* Question Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span className="font-medium text-foreground">{q.farmerName}</span>
                  <span>•</span>
                  <Clock className="h-4 w-4" />
                  <span>{new Date(q.createdAt).toLocaleDateString()}</span>
                </div>
                <span
                  className={`flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full ${
                    q.status === "answered"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {q.status === "answered" ? (
                    <><CheckCircle className="h-3 w-3" /> Answered</>
                  ) : (
                    <><Clock3 className="h-3 w-3" /> Pending</>
                  )}
                </span>
              </div>

              <h3 className="text-lg font-bold mb-1">{q.title}</h3>
              <p className="text-muted-foreground mb-3 whitespace-pre-wrap">{q.content}</p>

              {/* Expand/Collapse Toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 px-0 text-primary"
                onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
              >
                {expandedId === q.id ? (
                  <><ChevronUp className="h-4 w-4" /> Hide</>
                ) : (
                  <><ChevronDown className="h-4 w-4" /> {q.answers.length} {q.answers.length === 1 ? "Answer" : "Answers"}</>
                )}
              </Button>

              {expandedId === q.id && (
                <div className="mt-3 space-y-3 border-t pt-3">
                  {/* Answers */}
                  {q.answers.map((a) => (
                    <div key={a.id} className="bg-secondary/10 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="font-semibold text-foreground">{a.officerName}</span>
                        <span>• Extension Worker</span>
                        <span>•</span>
                        <span>{new Date(a.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-foreground whitespace-pre-wrap">{a.content}</p>
                      {a.mediaUrl && (
                        <div className="mt-2">
                          {a.mediaType === "video" ? (
                            <video controls className="w-full rounded-md max-h-64" src={a.mediaUrl} />
                          ) : a.mediaType === "audio" ? (
                            <audio controls className="w-full" src={a.mediaUrl} />
                          ) : null}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Answer Form — Extension Workers Only */}
                  {isExtensionWorker && (
                    <div className="mt-2 space-y-2">
                      <Textarea
                        value={answerText[q.id] || ""}
                        onChange={(e) => setAnswerText((prev) => ({ ...prev, [q.id]: e.target.value }))}
                        placeholder="Write your answer to this farmer's question..."
                        rows={3}
                      />
                      <Button
                        size="sm"
                        onClick={() => handleAnswer(q.id)}
                        disabled={answeringId === q.id || !answerText[q.id]}
                        className="gap-1"
                      >
                        {answeringId === q.id ? "Sending..." : "Send Answer"}
                        <Send className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
