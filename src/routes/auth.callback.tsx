import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { Bug, Loader2 } from 'lucide-react'

export const Route = createFileRoute('/auth/callback')({
  component: AuthCallback,
})

/**
 * This page exists as a fallback in case the user lands here directly.
 * The backend handles the entire OAuth callback flow and redirects to /dashboard.
 * If the user somehow reaches this page, we simply redirect them to /dashboard
 * where the AuthContext will validate their session.
 */
function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    // The backend handles the callback and sets the cookie.
    // Redirect to dashboard — the root session check will validate auth.
    navigate({ to: '/dashboard' } as any)
  }, [navigate])

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-100">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-inner">
          <img
            src="/agent47logo%20standalone.png"
            alt="Agent47 Logo"
            className="h-8 w-8 object-contain"
          />
        </div>
        <div className="mb-4 flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
          <span className="text-sm font-medium text-zinc-300">
            Completing sign-in...
          </span>
        </div>
        <p className="text-xs text-zinc-500">
          Redirecting to your dashboard
        </p>
      </div>
    </div>
  )
}
