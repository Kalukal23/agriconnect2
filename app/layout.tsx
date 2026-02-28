import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { LanguageProvider } from "@/lib/language-context"
import { CartProvider } from "@/lib/cart-context"

export const metadata: Metadata = {
  title: "AgriConnect - Ethiopian Farming Platform",
  description:
    "Empowering Ethiopian smallholder farmers with real-time market prices, accurate weather forecasts, and expert agricultural knowledge.",
  keywords: "agriculture, Ethiopia, farmer platform, market prices, weather alerts, crop knowledge",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  manifest: "/manifest.json",
}

export const viewport = {
  themeColor: "#1b5e20",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="antialiased">
      <body className="bg-background text-foreground">
        <LanguageProvider>
          <CartProvider>{children}</CartProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
