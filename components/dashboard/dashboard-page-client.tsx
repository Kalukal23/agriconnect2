"use client"

import type React from "react"
import { useLanguage } from "@/lib/language-context"
import { TrendingUp, Cloud, Users, BookOpen } from "lucide-react"
import Link from "next/link"
import type { User } from "@/lib/auth"

export function DashboardPageClient({ user }: { user: User }) {
  const { t } = useLanguage()

  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          {t("dashboard.welcome")}, {user.name}!
        </h1>
        <p className="text-muted-foreground">
          {user.region && `${user.region} ${t("dashboard.region")}`} • {t("dashboard.accessTools")}
        </p>
      </div>

      {/* Quick Access Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <QuickAccessCard
          href="/market"
          icon={<TrendingUp className="h-8 w-8 text-primary" />}
          title={t("dashboard.marketPrices")}
          description={t("dashboard.viewPrices")}
        />
        <QuickAccessCard
          href="/weather"
          icon={<Cloud className="h-8 w-8 text-accent" />}
          title={t("dashboard.weather")}
          description={t("dashboard.checkForecasts")}
        />
        <QuickAccessCard
          href="/knowledge"
          icon={<BookOpen className="h-8 w-8 text-secondary" />}
          title={t("dashboard.knowledgeBase")}
          description={t("dashboard.learnTechniques")}
        />
        <QuickAccessCard
          href="/community"
          icon={<Users className="h-8 w-8 text-primary" />}
          title={t("dashboard.community")}
          description={t("dashboard.connectFarmers")}
        />
      </div>

      {/* Recent Updates */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">{t("dashboard.recentUpdates")}</h2>
        <div className="space-y-4">
          <UpdateItem
            title={t("dashboard.teffPriceIncrease")}
            description={t("dashboard.teffPrice")}
            time={`2 ${t("dashboard.hoursAgo")}`}
          />
          <UpdateItem
            title={t("dashboard.heavyRain")}
            description={t("dashboard.rainDescription")}
            time={`5 ${t("dashboard.hoursAgo")}`}
          />
          <UpdateItem
            title={t("dashboard.pestControl")}
            description={t("dashboard.pestDescription")}
            time={`1 ${t("dashboard.daysAgo")}`}
          />
        </div>
      </div>
    </main>
  )
}

function QuickAccessCard({
  href,
  icon,
  title,
  description,
}: {
  href: string
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <Link
      href={href}
      className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow hover:border-primary/50"
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </Link>
  )
}

function UpdateItem({ title, description, time }: { title: string; description: string; time: string }) {
  return (
    <div className="border-l-4 border-primary pl-4">
      <h4 className="font-semibold mb-1">{title}</h4>
      <p className="text-sm text-muted-foreground mb-1">{description}</p>
      <p className="text-xs text-muted-foreground">{time}</p>
    </div>
  )
}
