"use client"

import { useLanguage } from "@/lib/language-context"
import { Globe } from "lucide-react"

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-5 w-5" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as "en" | "am")}
        className="bg-transparent border border-current rounded px-2 py-1 text-sm cursor-pointer hover:bg-primary/10 transition-colors"
      >
        <option value="en">English</option>
        <option value="am">አማርኛ</option>
      </select>
    </div>
  )
}
