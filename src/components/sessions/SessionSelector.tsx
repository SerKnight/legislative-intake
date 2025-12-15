"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

interface Session {
  id: string
  name: string
  identifier: string
  status: string
  jurisdiction: {
    name: string
    code: string
  }
  role: string
  isActive: boolean
  _count?: {
    bills: number
  }
}

export function SessionSelector() {
  const router = useRouter()
  const [sessions, setSessions] = useState<Session[]>([])
  const [activeSession, setActiveSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      const response = await fetch("/api/sessions")
      if (response.ok) {
        const data = await response.json()
        setSessions(data.sessions || [])
        const active = data.sessions?.find((s: Session) => s.isActive)
        setActiveSession(active || data.sessions?.[0] || null)
      }
    } catch (error) {
      console.error("Error fetching sessions:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSessionChange = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/sessions/${sessionId}/switch`, {
        method: "POST",
      })

      if (response.ok) {
        const data = await response.json()
        setActiveSession(data.session)
        router.refresh()
        // Redirect to session dashboard
        router.push(`/sessions/${sessionId}`)
      }
    } catch (error) {
      console.error("Error switching session:", error)
    }
  }

  if (loading) {
    return (
      <Select disabled>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Loading..." />
        </SelectTrigger>
      </Select>
    )
  }

  if (sessions.length === 0) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">No sessions</span>
        <Link href="/sessions/new">
          <Button size="sm" variant="outline" className="gap-1">
            <Plus className="h-3 w-3" />
            Create
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Select
        value={activeSession?.id || ""}
        onValueChange={handleSessionChange}
      >
        <SelectTrigger className="w-[250px]">
          <SelectValue>
            {activeSession ? (
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {activeSession.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {activeSession.jurisdiction.name}
                </span>
              </div>
            ) : (
              "Select session"
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {sessions.map((session) => (
            <SelectItem key={session.id} value={session.id}>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{session.name}</span>
                <span className="text-xs text-muted-foreground">
                  {session.jurisdiction.name} • {session._count?.bills || 0}{" "}
                  bills
                </span>
              </div>
            </SelectItem>
          ))}
          <div className="border-t p-1">
            <Link href="/sessions/new">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2"
              >
                <Plus className="h-4 w-4" />
                Create New Session
              </Button>
            </Link>
          </div>
        </SelectContent>
      </Select>
    </div>
  )
}

