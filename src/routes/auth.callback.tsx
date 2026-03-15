import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { useEffect } from 'react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/store/auth'
import { Bug, Loader2 } from 'lucide-react'

type CallbackSearch = {
  code: string
}

type CallbackResponse = {
  user_id: string
  username: string
  is_new_user: boolean
  token: string
}

export const Route = createFileRoute('/auth/callback')({
  validateSearch: (search: Record<string, unknown>): CallbackSearch => ({
    code: (search.code as string) ?? '',
  }),
  component: AuthCallback,
})

function AuthCallback() {
  const { code } = Route.useSearch()
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  const callbackMutation = useMutation({
    mutationFn: async (code: string) => {
      const { data } = await api.get<CallbackResponse>('/auth/callback', {
        params: { code },
      })
      return data
    },
    onSuccess: (data) => {
      setAuth(data.token, {
        id: data.user_id,
        username: data.username,
      })

      if (data.is_new_user) {
        navigate({ to: '/onboarding' } as any)
      } else {
        navigate({ to: '/dashboard' } as any)
      }
    },
    onError: () => {
      navigate({ to: '/' })
    },
  })

  useEffect(() => {
    if (code) {
      callbackMutation.mutate(code)
    } else {
      navigate({ to: '/' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code])

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
          <Bug className="h-6 w-6 text-slate-700" strokeWidth={1.8} />
        </div>
        <div className="mb-4 flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
          <span className="text-sm font-medium text-slate-600">
            Authenticating...
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Completing your GitHub sign-in
        </p>
        {callbackMutation.isError && (
          <p className="mt-4 text-sm text-red-500">
            Authentication failed. Redirecting...
          </p>
        )}
      </div>
    </div>
  )
}
