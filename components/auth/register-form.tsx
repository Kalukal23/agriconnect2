"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

export function RegisterForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
    region: "",
    farmSize: "",
    language: "english",
    role: "Farmer",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    if (!formData.phone.match(/^(\+251|0)?[79]\d{8}$/)) {
      setError("Please enter a valid Ethiopian phone number")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Registration failed")
      }

      // Redirect to dashboard on success
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-lg p-3 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+251 or 09xxxxxxxx"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
          disabled={loading}
        />
        <p className="text-xs text-muted-foreground">Ethiopian phone number (e.g., +251912345678)</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="region">Region</Label>
        <select
          id="region"
          className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground"
          value={formData.region}
          onChange={(e) => setFormData({ ...formData, region: e.target.value })}
          required
          disabled={loading}
        >
          <option value="">Select your region</option>
          <option value="addis-ababa">Addis Ababa</option>
          <option value="oromia">Oromia</option>
          <option value="amhara">Amhara</option>
          <option value="tigray">Tigray</option>
          <option value="somali">Somali</option>
          <option value="afar">Afar</option>
          <option value="snnpr">SNNPR</option>
          <option value="benishangul">Benishangul-Gumuz</option>
          <option value="gambela">Gambela</option>
          <option value="harari">Harari</option>
          <option value="dire-dawa">Dire Dawa</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">I am a...</Label>
        <select
          id="role"
          className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          required
          disabled={loading}
        >
          <option value="Farmer">Farmer (ገበሬ)</option>
          <option value="ExtensionOfficer">Extension Worker (ኤክስቴንሽን ወርከር)</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="farmSize">Farm Size (optional)</Label>
        <Input
          id="farmSize"
          type="text"
          placeholder="e.g., 2 hectares"
          value={formData.farmSize}
          onChange={(e) => setFormData({ ...formData, farmSize: e.target.value })}
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="language">Preferred Language</Label>
        <select
          id="language"
          className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground"
          value={formData.language}
          onChange={(e) => setFormData({ ...formData, language: e.target.value })}
          disabled={loading}
        >
          <option value="english">English</option>
          <option value="amharic">Amharic (አማርኛ)</option>
          <option value="oromiffa">Oromiffa (Afaan Oromoo)</option>
          <option value="tigrinya">Tigrinya (ትግርኛ)</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="At least 6 characters"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
          disabled={loading}
          minLength={6}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Re-enter your password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          required
          disabled={loading}
          minLength={6}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Account...
          </>
        ) : (
          "Create Account"
        )}
      </Button>
    </form>
  )
}
