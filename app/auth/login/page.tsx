import { LoginForm } from "@/components/auth/login-form"
import Link from "next/link"
import { Sprout } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-primary/5 to-background p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <Sprout className="h-10 w-10 text-primary" />
          <span className="text-2xl font-bold">AgriConnect</span>
        </Link>

        {/* Login Card */}
        <div className="bg-card border border-border rounded-lg shadow-lg p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-2">Welcome Back</h1>
          <p className="text-muted-foreground text-center mb-6">Sign in to access your AgriConnect account</p>

          <LoginForm />

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link href="/auth/register" className="text-primary font-semibold hover:underline">
              Sign up
            </Link>
          </div>
        </div>

        {/* SMS Access Notice */}
        <div className="mt-4 text-center text-sm text-muted-foreground">
          <p>SMS access available for feature phones</p>
        </div>
      </div>
    </div>
  )
}
