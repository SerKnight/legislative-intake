"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { SessionSelector } from "@/components/sessions/SessionSelector"

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/bills", label: "Bills" },
  { href: "/bills/upload", label: "Upload Bill" },
  { href: "/settings", label: "Settings" },
]

export function DashboardNav({ user }: { user: any }) {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r bg-muted/50 flex flex-col">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/dashboard" className="text-xl font-bold">
          Legislative Intake
        </Link>
      </div>
      <div className="p-4 border-b">
        <SessionSelector />
      </div>
      <nav className="p-4 flex-1">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="border-t p-4">
        <div className="mb-2 text-sm">
          <div className="font-medium">{user?.name || user?.email}</div>
          <div className="text-xs text-muted-foreground">{user?.email}</div>
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          Sign Out
        </Button>
      </div>
    </aside>
  )
}

