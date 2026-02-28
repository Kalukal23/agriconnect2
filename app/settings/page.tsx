import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { Navigation } from "@/components/navigation"
import { SMSSettings } from "@/components/settings/sms-settings"
import { OfflineStatus } from "@/components/settings/offline-status"
import { Settings } from "lucide-react"

export default async function SettingsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold">Settings</h1>
          </div>
          <p className="text-muted-foreground">Manage your notifications and offline access</p>
        </div>

        <div className="max-w-3xl space-y-6">
          {/* Offline Status */}
          <OfflineStatus />

          {/* SMS Settings */}
          <SMSSettings user={user} />

          {/* Profile Info */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-muted-foreground">Name:</span>
                <p className="font-medium">{user.name}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Phone:</span>
                <p className="font-medium">{user.phone}</p>
              </div>
              {user.region && (
                <div>
                  <span className="text-sm text-muted-foreground">Region:</span>
                  <p className="font-medium">{user.region}</p>
                </div>
              )}
              {user.language && (
                <div>
                  <span className="text-sm text-muted-foreground">Language:</span>
                  <p className="font-medium capitalize">{user.language}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
