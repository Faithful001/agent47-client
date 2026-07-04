import { createFileRoute, Outlet, redirect, Link, useMatchRoute } from "@tanstack/react-router";
import { useAuthStore } from "../store/auth";
import type { LucideIcon } from "lucide-react";
import { Bug, LayoutDashboard, Settings, User, LogOut, ChevronRight, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async () => {
    const state = useAuthStore.getState();
    if (state.isLoading) {
      await state.checkSession();
    }
    if (!useAuthStore.getState().user) {
      throw redirect({ to: "/" });
    }
  },
  component: AuthenticatedLayout,
});

type SidebarLink = {
  to: string;
  label: string;
  icon: LucideIcon;
};

const sidebarLinks: SidebarLink[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
  { to: "/dashboard/profile", label: "Profile", icon: User },
];

function AuthenticatedLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const matchRoute = useMatchRoute();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClose = () => setDropdownOpen(false);
    document.addEventListener("click", handleClose);
    return () => document.removeEventListener("click", handleClose);
  }, [dropdownOpen]);

  const currentPage = sidebarLinks.find((link) => matchRoute({ to: link.to } as any));

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
      {/* Desktop Sidebar */}
      <aside className="fixed h-screen hidden w-64 flex-shrink-0 border-r border-zinc-800 bg-zinc-950 lg:flex lg:flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-zinc-800 px-6">
          <Bug className="h-5 w-5 text-white" strokeWidth={2} />
          <span className="text-base font-semibold tracking-tight text-zinc-100 font-sans">
            Agent47
          </span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4">
          <ul className="m-0 list-none space-y-1 p-0">
            {sidebarLinks.map(({ to, label, icon: Icon }) => {
              const isActive = !!matchRoute({ to } as any);
              return (
                <li key={to}>
                  <Link
                    to={to as any}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium no-underline transition ${
                      isActive
                        ? "bg-zinc-800 text-white"
                        : "text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200"
                    }`}
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.8} />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom user section */}
        <div className="border-t border-zinc-800 p-3">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user?.username ?? "User"}
                className="h-8 w-8 rounded-full border border-zinc-700"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-xs font-semibold text-zinc-300">
                {user?.username?.[0]?.toUpperCase() ?? "U"}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="m-0 truncate text-sm font-medium text-zinc-200">
                {user?.username ?? "User"}
              </p>
              <p className="m-0 truncate text-xs text-zinc-500">{user?.email ?? ""}</p>
            </div>
            <button
              onClick={() => logout()}
              className="cursor-pointer rounded-md p-1.5 text-zinc-500 transition hover:bg-zinc-850 hover:text-zinc-300"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Top Nav */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-950/80 backdrop-blur px-6">
          {/* Left: mobile menu + breadcrumbs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="cursor-pointer rounded-md p-1.5 text-zinc-400 hover:bg-zinc-800 lg:hidden"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Breadcrumbs */}
            <nav className="hidden items-center gap-1.5 text-sm sm:flex">
              <span className="text-zinc-500 font-mono">Agent47</span>
              {currentPage && (
                <>
                  <ChevronRight className="h-3.5 w-3.5 text-zinc-650" />
                  <span className="font-semibold text-zinc-100 font-mono">{currentPage.label}</span>
                </>
              )}
            </nav>
          </div>

          {/* Right: user avatar with dropdown */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownOpen(!dropdownOpen);
                }}
                className="flex items-center gap-2 focus:outline-none cursor-pointer rounded-full"
              >
                {user?.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user?.username ?? "User"}
                    className="h-8 w-8 rounded-full border border-zinc-700 hover:border-zinc-500 transition-colors"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-xs font-semibold text-zinc-300 hover:bg-zinc-700 transition-colors">
                    {user?.username?.[0]?.toUpperCase() ?? "U"}
                  </div>
                )}
              </button>
              <div
                className={`absolute right-0 mt-2.5 w-52 origin-top-right rounded-xl border border-zinc-800 bg-zinc-950 p-1.5 shadow-2xl shadow-black/60 focus:outline-none z-50 transition-all duration-200 transform ${
                  dropdownOpen
                    ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                    : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-3.5 py-2.5 border-b border-zinc-850">
                  <p className="truncate text-xs font-semibold text-zinc-200 m-0 font-sans">
                    {user?.username ?? "User"}
                  </p>
                  <p className="truncate text-[10px] text-zinc-500 m-0 mt-0.5 font-sans">
                    {user?.email ?? ""}
                  </p>
                </div>
                <div className="py-1 space-y-0.5">
                  <Link
                    to="/dashboard/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-semibold text-zinc-300 hover:bg-zinc-850 hover:text-zinc-100 no-underline transition group animate-none"
                  >
                    <User className="h-3.5 w-3.5 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                    Profile
                  </Link>
                  <Link
                    to="/dashboard/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-semibold text-zinc-300 hover:bg-zinc-850 hover:text-zinc-100 no-underline transition group animate-none"
                  >
                    <Settings className="h-3.5 w-3.5 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                    Settings
                  </Link>
                  <div className="my-1 border-t border-zinc-850" />
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-semibold text-red-400 hover:bg-red-950/20 hover:text-red-300 cursor-pointer transition group"
                  >
                    <LogOut className="h-3.5 w-3.5 text-red-400/80 group-hover:text-red-300 transition-colors" />
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile menu overlay */}
        <div
          className={`fixed inset-0 z-30 lg:hidden transition-all duration-300 ${mobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        >
          <div
            className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${mobileMenuOpen ? "opacity-100" : "opacity-0"}`}
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside
            className={`relative z-45 flex h-full w-64 flex-col border-r border-zinc-800 bg-zinc-950 transition-transform duration-300 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
          >
            <div className="flex h-16 items-center gap-2 border-b border-zinc-800 px-6">
              <Bug className="h-5 w-5 text-white" strokeWidth={2} />
              <span className="text-base font-semibold tracking-tight text-zinc-100 font-sans">
                Agent47
              </span>
            </div>
            <nav className="flex-1 px-3 py-4">
              <ul className="m-0 list-none space-y-1 p-0">
                {sidebarLinks.map(({ to, label, icon: Icon }) => {
                  const isActive = !!matchRoute({ to } as any);
                  return (
                    <li key={to}>
                      <Link
                        to={to as any}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium no-underline transition ${
                          isActive
                            ? "bg-zinc-800 text-white"
                            : "text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200"
                        }`}
                      >
                        <Icon className="h-4 w-4" strokeWidth={1.8} />
                        {label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Bottom user section for mobile */}
            <div className="border-t border-zinc-800 p-3 bg-zinc-950">
              <div className="flex items-center gap-3 rounded-lg px-3 py-2">
                {user?.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user?.username ?? "User"}
                    className="h-8 w-8 rounded-full border border-zinc-700"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-xs font-semibold text-zinc-300">
                    {user?.username?.[0]?.toUpperCase() ?? "U"}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="m-0 truncate text-sm font-medium text-zinc-200">
                    {user?.username ?? "User"}
                  </p>
                  <p className="m-0 truncate text-xs text-zinc-500">{user?.email ?? ""}</p>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="cursor-pointer rounded-md p-1.5 text-zinc-500 transition hover:bg-zinc-850 hover:text-zinc-300"
                  title="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </aside>
        </div>

        {/* Page content */}
        <main className="flex-1 p-6 bg-zinc-950 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
