import {
  createFileRoute,
  Outlet,
  redirect,
  Link,
  useMatchRoute,
} from '@tanstack/react-router'
import { useAuthStore } from '../store/auth'
import type { LucideIcon } from 'lucide-react'
import {
  Bug,
  LayoutDashboard,
  Settings,
  User,
  LogOut,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: () => {
    const { user, isLoading } = useAuthStore.getState()
    if (!isLoading && !user) {
      throw redirect({ to: '/' })
    }
  },
  component: AuthenticatedLayout,
})

type SidebarLink = {
  to: string
  label: string
  icon: LucideIcon
}

const sidebarLinks: SidebarLink[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/settings', label: 'Settings', icon: Settings },
  { to: '/profile', label: 'Profile', icon: User },
]

function AuthenticatedLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const matchRoute = useMatchRoute()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  // Determine current page for breadcrumbs
  const currentPage = sidebarLinks.find((link) =>
    matchRoute({ to: link.to } as any),
  )

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-6">
          <Bug className="h-5 w-5 text-slate-900" strokeWidth={2} />
          <span className="text-base font-semibold tracking-tight text-slate-900">
            Agent47
          </span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4">
          <ul className="m-0 list-none space-y-1 p-0">
            {sidebarLinks.map(({ to, label, icon: Icon }) => {
              const isActive = !!matchRoute({ to } as any)
              return (
                <li key={to}>
                  <Link
                    to={to as any}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium no-underline transition ${
                      isActive
                        ? 'bg-slate-100 text-slate-900'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                    }`}
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.8} />
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Bottom user section */}
        <div className="border-t border-slate-200 p-3">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user?.username ?? 'User'}
                className="h-8 w-8 rounded-full"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">
                {user?.username?.[0]?.toUpperCase() ?? 'U'}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="m-0 truncate text-sm font-medium text-slate-900">
                {user?.username ?? 'User'}
              </p>
              <p className="m-0 truncate text-xs text-slate-400">
                {user?.email ?? ''}
              </p>
            </div>
            <button
              onClick={() => logout()}
              className="cursor-pointer rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col">
        {/* Top Nav */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
          {/* Left: mobile menu + breadcrumbs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="cursor-pointer rounded-md p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>

            {/* Breadcrumbs */}
            <nav className="hidden items-center gap-1.5 text-sm sm:flex">
              <span className="text-slate-400">Agent47</span>
              {currentPage && (
                <>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
                  <span className="font-medium text-slate-900">
                    {currentPage.label}
                  </span>
                </>
              )}
            </nav>
          </div>

          {/* Right: user avatar */}
          <div className="flex items-center gap-3">
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user?.username ?? 'User'}
                className="h-8 w-8 rounded-full"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">
                {user?.username?.[0]?.toUpperCase() ?? 'U'}
              </div>
            )}
          </div>
        </header>

        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-30 lg:hidden">
            <div
              className="absolute inset-0 bg-black/20"
              onClick={() => setMobileMenuOpen(false)}
            />
            <aside className="relative z-40 flex h-full w-64 flex-col border-r border-slate-200 bg-white">
              <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-6">
                <Bug className="h-5 w-5 text-slate-900" strokeWidth={2} />
                <span className="text-base font-semibold tracking-tight text-slate-900">
                  Agent47
                </span>
              </div>
              <nav className="flex-1 px-3 py-4">
                <ul className="m-0 list-none space-y-1 p-0">
                  {sidebarLinks.map(({ to, label, icon: Icon }) => {
                    const isActive = !!matchRoute({ to } as any)
                    return (
                      <li key={to}>
                        <Link
                          to={to as any}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium no-underline transition ${
                            isActive
                              ? 'bg-slate-100 text-slate-900'
                              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                          }`}
                        >
                          <Icon className="h-4 w-4" strokeWidth={1.8} />
                          {label}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </nav>
            </aside>
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
