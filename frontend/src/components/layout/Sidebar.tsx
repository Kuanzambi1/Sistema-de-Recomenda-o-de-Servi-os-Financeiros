"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

export interface NavItem {
  label: string
  href: string
}

interface SidebarProps {
  brand?: string
  items: NavItem[]
  className?: string
  variant?: "light" | "dark"
  mobileOpen?: boolean
  onMobileClose?: () => void
}

export default function Sidebar({ brand = "SRF", items, className, variant = "light", mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname()
  const isDark = variant === "dark"

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onMobileClose}
        />
      )}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full w-64 flex flex-col p-6 transition-all duration-300 z-50",
          "lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          isDark
            ? "bg-sidebar-dark text-white border-r border-sidebar-dark-border gap-8"
            : "bg-sidebar border-r border-sidebar-border gap-8",
          className
        )}
      >
        <div className="flex items-center justify-between">
          {isDark ? (
            <div className="flex items-center gap-4 px-4">
              <div className="w-10 h-10 rounded-lg bg-[#feae2c] flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-[#6b4500]" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 2L2 7v6l8 5 8-5V7l-8-5z" />
                </svg>
              </div>
              <div>
                <span className="font-heading text-2xl font-semibold text-white">{brand}</span>
                <p className="text-sm text-white/70 font-medium tracking-[0.28px]">Institutional Access</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 px-4">
              <span className="font-heading text-2xl font-bold text-primary">{brand}</span>
              <span className="text-xs text-sidebar-active-border font-body">v1.0</span>
            </div>
          )}
          <button
            type="button"
            onClick={onMobileClose}
            className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-[#44474f] hover:text-[#151c27] hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex flex-col gap-1 flex-1 overflow-y-auto">
          {items.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            if (isDark) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onMobileClose}
                  className={cn(
                    "flex items-center gap-4 px-4 py-4 rounded-lg text-sm transition-colors",
                    isActive
                      ? "bg-sidebar-dark-active-bg text-sidebar-dark-active-foreground font-bold"
                      : "text-sidebar-dark-foreground hover:text-white"
                  )}
                >
                  {item.label}
                </Link>
              )
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onMobileClose}
                className={cn(
                  "flex items-center gap-4 px-4 py-4 rounded-lg text-sm transition-colors",
                  isActive
                    ? "bg-sidebar-active-bg text-foreground font-medium border-r-4 border-sidebar-active-border"
                    : "text-sidebar-foreground hover:bg-muted"
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className={`flex flex-col gap-2 pt-4 border-t ${isDark ? "border-sidebar-dark-border" : "border-sidebar-border"}`}>
          {isDark && (
            <Link
              href="#"
              className="flex items-center gap-4 px-4 py-4 rounded-lg text-sm text-sidebar-dark-foreground hover:text-white transition-colors"
            >
              Help Center
            </Link>
          )}

          <Link
            href="/login"
            onClick={onMobileClose}
            className={`flex items-center gap-4 px-4 py-4 rounded-lg text-sm transition-colors ${
              isDark
                ? "text-sidebar-dark-foreground hover:text-white"
                : "text-sidebar-foreground hover:bg-muted"
            }`}
          >
            Logout
          </Link>
        </div>
      </aside>
    </>
  )
}
