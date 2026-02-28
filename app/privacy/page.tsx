"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity w-fit">
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </Link>
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
          <p className="text-sm opacity-90 mt-2">Last updated: October 2025</p>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-sm max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              AgriConnect ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your information when you visit our website and use
              our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">2. Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              We may collect information about you in a variety of ways. The information we may collect on the Site
              includes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>
                <strong>Personal Data:</strong> Name, email address, phone number, location, and farm information
              </li>
              <li>
                <strong>Device Information:</strong> Browser type, IP address, and operating system
              </li>
              <li>
                <strong>Usage Data:</strong> Pages visited, time spent on pages, and links clicked
              </li>
              <li>
                <strong>Location Data:</strong> Geographic location for weather and market price services
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">3. Use of Your Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Having accurate information about you permits us to provide you with a smooth, efficient, and customized
              experience. Specifically, we may use information collected about you via the Site to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Create and manage your account</li>
              <li>Provide market prices, weather forecasts, and agricultural advice</li>
              <li>Send SMS notifications and alerts</li>
              <li>Improve our services and user experience</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">4. Disclosure of Your Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may share your information with third-party service providers who assist us in operating our website
              and conducting our business, subject to those third parties agreeing to keep this information
              confidential. We will not sell, trade, or rent your personal information to others.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Security of Your Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use administrative, technical, and physical security measures to protect your personal information.
              However, no method of transmission over the Internet or method of electronic storage is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">6. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions or comments about this Privacy Policy, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-foreground">
                <strong>Email:</strong> kalkalkidan497@gmail.com
              </p>
              <p className="text-foreground">
                <strong>Phone:</strong> +251 91 846 1548
              </p>
              <p className="text-foreground">
                <strong>Telegram:</strong> @Kalu6064
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
