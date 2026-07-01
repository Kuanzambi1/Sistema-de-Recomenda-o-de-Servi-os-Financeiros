"use client"

import Sidebar from "./Sidebar"
import { cn } from "@/lib/utils"

interface NavItem {
  label: string
  href: string
}

interface AppShellProps {
  children: React.ReactNode
  navItems: NavItem[]
  title?: string
  subtitle?: string
  className?: string
}

export default function AppShell({ children, navItems, title, subtitle, className }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar items={navItems} />
      <div className="flex flex-col flex-1 ml-64">
        <header className="flex items-center justify-between h-16 px-8 bg-sidebar/90 backdrop-blur-md border-b border-border">
          <div>
            {title && (
              <h1 className="font-heading text-lg font-semibold text-foreground">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </header>
        <main className={cn("flex-1 p-8 bg-secondary", className)}>
          {children}
        </main>
      </div>
    </div>
  )
}
