import { notFound, redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { SessionHeader } from "@/components/sessions/SessionHeader"
import { HearingList } from "@/components/hearings/HearingList"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus } from "lucide-react"
import { getSessionRole } from "@/lib/session-context"

export default async function SessionHearingsPage({
  params,
  searchParams,
}: {
  params: { sessionId: string }
  searchParams: { status?: string; dateFrom?: string; dateTo?: string }
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

  // Get session details
  const legislativeSession = await prisma.legislativeSession.findUnique({
    where: { id: params.sessionId },
    include: {
      jurisdiction: true,
    },
  })

  if (!legislativeSession) {
    notFound()
  }

  // Check if user can manage hearings
  const role = await getSessionRole(session.user.id, params.sessionId)
  const canManage =
    role === "CONTRIBUTOR" || role === "MANAGER" || role === "ADMIN"

  // Build filter conditions
  const where: any = {
    sessionId: params.sessionId,
  }

  if (searchParams.status) {
    where.status = searchParams.status
  }

  if (searchParams.dateFrom || searchParams.dateTo) {
    where.date = {}
    if (searchParams.dateFrom) {
      where.date.gte = new Date(searchParams.dateFrom)
    }
    if (searchParams.dateTo) {
      where.date.lte = new Date(searchParams.dateTo)
    }
  }

  // Get hearings
  const hearings = await prisma.hearing.findMany({
    where,
    include: {
      bills: {
        include: {
          bill: {
            select: {
              id: true,
              billNumber: true,
              title: true,
            },
          },
        },
      },
    },
    orderBy: { date: "asc" },
  })

  const sessionWithRole = {
    ...legislativeSession,
    role: userSession.role,
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SessionHeader session={sessionWithRole} />
      <div className="container py-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/sessions/${params.sessionId}`}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h2 className="text-2xl font-semibold">Hearings</h2>
              <p className="text-sm text-muted-foreground">
                Schedule and track legislative hearings. Link bills to hearings to manage agendas
                and coordinate committee work throughout the session.
              </p>
            </div>
          </div>
          {canManage && (
            <Link href={`/sessions/${params.sessionId}/hearings/new`}>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Schedule Hearing
              </Button>
            </Link>
          )}
        </div>

        <HearingList
          sessionId={params.sessionId}
          hearings={hearings}
          canManage={canManage}
          currentFilters={searchParams}
        />
      </div>
    </div>
  )
}

