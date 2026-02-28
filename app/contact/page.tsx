"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Mail, Phone, MessageCircle, MapPin, Send } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Contact form submitted:", formData)
    setSubmitted(true)
    setTimeout(() => {
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
      setSubmitted(false)
    }, 3000)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Header */}
      <div className="bg-primary text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Get in Touch</h1>
          <p className="text-lg opacity-90">We'd love to hear from you. Contact AgriConnect today.</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6 text-foreground">Contact Information</h2>
              <p className="text-muted-foreground mb-8">
                Have questions about AgriConnect? Reach out to our team. We're here to help farmers succeed.
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-6">
              {/* Phone */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Phone</h3>
                  <a href="tel:+251918461548" className="text-primary hover:underline">
                    +251 91 846 1548
                  </a>
                  <p className="text-sm text-muted-foreground">Available Monday - Friday, 9AM - 5PM EAT</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Email</h3>
                  <a href="mailto:kalkalkidan497@gmail.com" className="text-primary hover:underline">
                    kalkalkidan497@gmail.com
                  </a>
                  <p className="text-sm text-muted-foreground">We'll respond within 24 hours</p>
                </div>
              </div>

              {/* Telegram */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Telegram</h3>
                  <a
                    href="https://t.me/Kalu6064"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    @Kalu6064
                  </a>
                  <p className="text-sm text-muted-foreground">Quick messages and support</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Location</h3>
                  <p className="text-foreground">Ethiopia</p>
                  <p className="text-sm text-muted-foreground">Serving smallholder farmers nationwide</p>
                </div>
              </div>
            </div>

            {/* Contact Person */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
              <h3 className="font-semibold text-foreground mb-2">Primary Contact</h3>
              <p className="text-foreground font-medium">Kalkidan Tilahun</p>
              <p className="text-sm text-muted-foreground">AgriConnect Team Lead</p>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-foreground">Send us a Message</h2>

              {submitted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <div className="text-green-600 font-semibold mb-2">Message Sent Successfully!</div>
                  <p className="text-green-700 text-sm">
                    Thank you for contacting AgriConnect. We'll get back to you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                      placeholder="Your name"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                      placeholder="your@email.com"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                      placeholder="+251 91 234 5678"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                      placeholder="How can we help?"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background resize-none"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="h-5 w-5" />
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Back to Home */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/" className="text-primary hover:underline font-medium">
          ← Back to Home
        </Link>
      </div>
    </main>
  )
}
