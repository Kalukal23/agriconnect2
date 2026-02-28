"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sprout, TrendingUp, Cloud, BookOpen, Users, Menu, X, Settings, BarChart3 } from "lucide-react"
import { useState } from "react"

export function Navigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Sprout },
    { href: "/market", label: "Market Prices", icon: TrendingUp },
    { href: "/weather", label: "Weather", icon: Cloud },
    { href: "/knowledge", label: "Knowledge", icon: BookOpen },
    { href: "/community", label: "Community", icon: Users },
  ]

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      window.location.href = "/"
    } catch (error) {
      console.error("[v0] Logout failed:", error)
    }
  }

  return (
    <header className="bg-primary text-primary-foreground shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl">
            <Sprout className="h-8 w-8" />
            <span className="hidden sm:inline">AgriConnect</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive ? "bg-primary-foreground/20 font-semibold" : "hover:bg-primary-foreground/10"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/admin/market"
              className="px-4 py-2 rounded-lg hover:bg-primary-foreground/10 transition-colors flex items-center gap-2"
              title="Market Admin"
            >
              <BarChart3 className="h-5 w-5" />
              <span className="text-sm">Admin</span>
            </Link>
            <Link href="/settings" className="px-4 py-2 rounded-lg hover:bg-primary-foreground/10 transition-colors">
              <Settings className="h-5 w-5" />
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-primary-foreground/20">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive ? "bg-primary-foreground/20 font-semibold" : "hover:bg-primary-foreground/10"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
            <div className="mt-4 pt-4 border-t border-primary-foreground/20 space-y-2">
              <Link
                href="/admin/market"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-foreground/10 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <BarChart3 className="h-5 w-5" />
                <span>Market Admin</span>
              </Link>
              <Link
                href="/settings"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-foreground/10 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Logout
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
