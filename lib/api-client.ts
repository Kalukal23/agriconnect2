/**
 * AgriConnect Centralized API Client
 * This client manages all external API communication for the frontend.
 * It uses the NEXT_PUBLIC_API_URL environment variable to point to the external backend.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

class ApiClient {
  private async fetcher(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`

    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    const response = await fetch(url, { ...options, headers })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "An unknown error occurred" }))
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  // Auth
  login(data: any) {
    return this.fetcher("/api/auth/login", { method: "POST", body: JSON.stringify(data) })
  }
  register(data: any) {
    return this.fetcher("/api/auth/register", { method: "POST", body: JSON.stringify(data) })
  }
  logout() {
    return this.fetcher("/api/auth/logout", { method: "POST" })
  }

  // Market
  getPrices(params?: string) {
    return this.fetcher(`/api/market/prices${params ? `?${params}` : ""}`)
  }
  updatePrice(data: any) {
    return this.fetcher("/api/market/update", { method: "POST", body: JSON.stringify(data) })
  }
  getSubscribers() {
    return this.fetcher("/api/admin/get-subscribers")
  }
  sendAlert(data: any) {
    return this.fetcher("/api/admin/send-alert", { method: "POST", body: JSON.stringify(data) })
  }

  // Weather
  getCurrentWeather(region: string) {
    return this.fetcher(`/api/weather/current?region=${encodeURIComponent(region)}`)
  }
  getForecast(region: string, days: number) {
    return this.fetcher(`/api/weather/forecast?region=${encodeURIComponent(region)}&days=${days}`)
  }
  getAlerts(region: string) {
    return this.fetcher(`/api/weather/alerts?region=${encodeURIComponent(region)}`)
  }

  // SMS
  getSmsSubscription() {
    return this.fetcher("/api/sms/subscription")
  }
  updateSmsSubscription(data: any) {
    return this.fetcher("/api/sms/subscription", { method: "POST", body: JSON.stringify(data) })
  }

  // Community
  createPost(data: any) {
    return this.fetcher("/api/community/posts", { method: "POST", body: JSON.stringify(data) })
  }
}

export const api = new ApiClient()
