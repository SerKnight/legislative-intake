"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Settings } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

interface SessionHeaderProps {
  session: {
    id: string
    name: string
    identifier: string
    status: string
    startDate: string
    endDate?: string | null
    description?: string | null
    jurisdiction: {
      name: string
      code: string
    }
    role?: string
  }
}

export function SessionHeader({ session }: SessionHeaderProps) {
  const isActive = session.status === "ACTIVE"
  const isManager = session.role === "MANAGER" || session.role === "ADMIN"

  return (
    <div className="border-b bg-background">
      <div className="container py-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{session.name}</h1>
              <Badge
                variant={
                  isActive
                    ? "default"
                    : session.status === "CLOSED"
                      ? "secondary"
                      : "outline"
                }
              >
                {session.status}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{session.jurisdiction.name}</span>
              <span>•</span>
              <span>
                {format(new Date(session.startDate), "MMM d, yyyy")}
                {session.endDate &&
                  ` - ${format(new Date(session.endDate), "MMM d, yyyy")}`}
              </span>
            </div>
            {session.description && (
              <p className="text-sm text-muted-foreground">
                {session.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/sessions/${session.id}/bills/upload`}>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Bill
              </Button>
            </Link>
            {isManager && (
              <Link href={`/sessions/${session.id}/settings`}>
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

