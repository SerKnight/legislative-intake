import { notFound, redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { SessionHeader } from "@/components/sessions/SessionHeader"
import { SessionSettingsForm } from "@/components/sessions/SessionSettingsForm"
import { SessionMembersList } from "@/components/sessions/SessionMembersList"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { getSessionRole } from "@/lib/session-context"

export default async function SessionSettingsPage({
  params,
}: {
  params: { sessionId: string }
}) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }

  // Check user has access to this session
  const userSession = await prisma.userSession.findUnique({
    where: {
      userId_sessionId: {
        userId: session.user.id,
        sessionId: params.sessionId,
      },
    },
  })

  if (!userSession) {
    notFound()
  }

  // Check if user is MANAGER or ADMIN
  const role = await getSessionRole(session.user.id, params.sessionId)
  if (!role || (role !== "MANAGER" && role !== "ADMIN")) {
    redirect(`/sessions/${params.sessionId}`)
  }

  // Get session details
  const legislativeSession = await prisma.legislativeSession.findUnique({
    where: { id: params.sessionId },
    include: {
      jurisdiction: true,
      userSessions: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
        orderBy: { joinedAt: "desc" },
      },
    },
  })

  if (!legislativeSession) {
    notFound()
  }

  const sessionWithRole = {
    ...legislativeSession,
    role: userSession.role,
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SessionHeader session={sessionWithRole} />
      <div className="container py-8">
        <div className="mb-6">
          <Link href={`/sessions/${params.sessionId}`}>
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Session Dashboard
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Session Settings</h2>
          <p className="text-muted-foreground">
            Manage session configuration, dates, status, and member access. Changes here affect how
            the session appears and who can access it.
          </p>
        </div>

        <div className="space-y-8">
          <SessionSettingsForm session={legislativeSession} />

          <SessionMembersList
            sessionId={params.sessionId}
            members={legislativeSession.userSessions}
            currentUserId={session.user.id}
            isAdmin={role === "ADMIN"}
          />
        </div>
      </div>
    </div>
  )
}

