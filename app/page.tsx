"use client"

import type React from "react"
import Link from "next/link"
import { Sprout, TrendingUp, Cloud, BookOpen, Users, MessageSquare } from "lucide-react"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/lib/language-context"

export default function HomePage() {
  return <HomePageClient />
}

function HomePageClient() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sprout className="h-8 w-8" />
              <h1 className="text-2xl font-bold">AgriConnect</h1>
            </div>
            <nav className="hidden md:flex gap-6">
              <Link href="#features" className="hover:text-secondary transition-colors">
                {t("nav.features")}
              </Link>
              <Link href="#about" className="hover:text-secondary transition-colors">
                {t("nav.about")}
              </Link>
              <Link href="/auth/login" className="hover:text-secondary transition-colors">
                {t("nav.login")}
              </Link>
            </nav>
            <div className="flex items-center gap-4">
              <LanguageSelector />
              <Link
                href="/auth/register"
                className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                {t("nav.getStarted")}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-balance mb-6">{t("hero.title")}</h2>
            <p className="text-xl text-muted-foreground text-pretty mb-8">{t("hero.subtitle")}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/register"
                className="bg-primary text-primary-foreground px-8 py-4 rounded-lg text-lg font-semibold hover:opacity-90 transition-opacity"
              >
                {t("hero.joinButton")}
              </Link>
              <Link
                href="#features"
                className="bg-muted text-foreground px-8 py-4 rounded-lg text-lg font-semibold hover:bg-muted/80 transition-colors"
              >
                {t("hero.learnMore")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-12">{t("features.title")}</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<TrendingUp className="h-12 w-12 text-primary" />}
              title={t("features.marketPrices.title")}
              description={t("features.marketPrices.description")}
            />
            <FeatureCard
              icon={<Cloud className="h-12 w-12 text-accent" />}
              title={t("features.weather.title")}
              description={t("features.weather.description")}
            />
            <FeatureCard
              icon={<BookOpen className="h-12 w-12 text-secondary" />}
              title={t("features.knowledge.title")}
              description={t("features.knowledge.description")}
            />
            <FeatureCard
              icon={<MessageSquare className="h-12 w-12 text-primary" />}
              title={t("features.chatbot.title")}
              description={t("features.chatbot.description")}
            />
            <FeatureCard
              icon={<Users className="h-12 w-12 text-accent" />}
              title={t("features.community.title")}
              description={t("features.community.description")}
            />
            <FeatureCard
              icon={<Sprout className="h-12 w-12 text-success" />}
              title={t("features.sms.title")}
              description={t("features.sms.description")}
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">12M+</div>
              <div className="text-lg opacity-90">{t("stats.farmers")}</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">15-20%</div>
              <div className="text-lg opacity-90">{t("stats.income")}</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">24/7</div>
              <div className="text-lg opacity-90">{t("stats.access")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold text-center mb-8">{t("about.title")}</h3>
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">{t("about.description1")}</p>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">{t("about.description2")}</p>
              <p className="text-muted-foreground text-lg leading-relaxed">{t("about.description3")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-secondary/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-6">{t("cta.title")}</h3>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">{t("cta.subtitle")}</p>
          <Link
            href="/auth/register"
            className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded-lg text-lg font-semibold hover:opacity-90 transition-opacity"
          >
            {t("cta.button")}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Sprout className="h-6 w-6 text-primary" />
              <span className="font-semibold">AgriConnect</span>
            </div>
            <div className="text-sm text-muted-foreground">{t("footer.tagline")}</div>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="hover:text-primary transition-colors">
                {t("footer.privacy")}
              </Link>
              <Link href="/terms" className="hover:text-primary transition-colors">
                {t("footer.terms")}
              </Link>
              <Link href="/contact" className="hover:text-primary transition-colors">
                {t("footer.contact")}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="mb-4">{icon}</div>
      <h4 className="text-xl font-semibold mb-3">{title}</h4>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}
