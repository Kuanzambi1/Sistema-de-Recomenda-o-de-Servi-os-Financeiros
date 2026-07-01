"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface NavItem {
  label: string
  href: string
}

interface SidebarProps {
  brand?: string
  items: NavItem[]
  className?: string
}

export default function Sidebar({ brand = "SRF", items, className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full w-64 flex flex-col gap-8 bg-sidebar border-r border-sidebar-border p-6",
        className
      )}
    >
      <div className="flex items-center gap-3 px-4">
        <span className="font-heading text-2xl font-bold text-primary">{brand}</span>
        <span className="text-xs text-sidebar-active-border font-body">v1.0</span>
      </div>

      <nav className="flex flex-col gap-1">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
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
    </aside>
  )
}
