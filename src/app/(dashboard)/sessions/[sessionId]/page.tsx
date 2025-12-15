import { notFound, redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { SessionHeader } from "@/components/sessions/SessionHeader"
import { SessionMetrics } from "@/components/sessions/SessionMetrics"
import { RecentActivity } from "@/components/sessions/RecentActivity"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertCircle, FileText } from "lucide-react"

export default async function SessionDashboardPage({
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

  // Fetch metrics
  const metricsResponse = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/sessions/${params.sessionId}/metrics`,
    { cache: "no-store" }
  )
  const metricsData = metricsResponse.ok
    ? await metricsResponse.json()
    : { metrics: null }

  // Get recent bills
  const recentBills = await prisma.bill.findMany({
    where: { sessionId: params.sessionId },
    orderBy: { updatedAt: "desc" },
    take: 5,
    include: {
      jurisdiction: true,
    },
  })

  // Get upcoming hearings
  const upcomingHearings = await prisma.hearing.findMany({
    where: {
      sessionId: params.sessionId,
      date: {
        gte: new Date(),
      },
      status: {
        in: ["SCHEDULED", "IN_PROGRESS"],
      },
    },
    orderBy: { date: "asc" },
    take: 5,
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
  })

  // Get high priority bills assigned to user
  const myHighPriorityBills = await prisma.bill.findMany({
    where: {
      sessionId: params.sessionId,
      assignedTo: session.user.id,
      priority: {
        in: ["HIGH", "URGENT"],
      },
    },
    orderBy: { updatedAt: "desc" },
    take: 5,
    include: {
      jurisdiction: true,
    },
  })

  // Build activity feed (simplified - in production, you'd have a proper activity log)
  const activities = [
    ...recentBills.map((bill: any) => ({
      id: `bill-${bill.id}`,
      type: "bill_update" as const,
      title: `${bill.billNumber} updated`,
      description: bill.title,
      date: bill.updatedAt.toISOString(),
      link: `/bills/${bill.id}`,
    })),
    ...upcomingHearings.map((hearing: any) => ({
      id: `hearing-${hearing.id}`,
      type: "hearing" as const,
      title: hearing.title,
      description: `${hearing.bills.length} bill(s) on agenda`,
      date: hearing.date.toISOString(),
      link: `/sessions/${params.sessionId}/hearings/${hearing.id}`,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10)

  const sessionWithRole = {
    ...legislativeSession,
    role: userSession.role,
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SessionHeader session={sessionWithRole} />
      <div className="container py-8 space-y-8">
        {metricsData.metrics && (
          <SessionMetrics metrics={metricsData.metrics} />
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Activity */}
          <RecentActivity activities={activities} />

          {/* Upcoming Hearings */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Hearings</CardTitle>
              <CardDescription>Next scheduled hearings</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingHearings.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No upcoming hearings
                </p>
              ) : (
                <div className="space-y-4">
                  {upcomingHearings.map((hearing: any) => (
                    <div
                      key={hearing.id}
                      className="flex items-start justify-between rounded-md border p-3"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{hearing.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(hearing.date).toLocaleDateString()} at{" "}
                          {hearing.location || "TBD"}
                        </p>
                        {hearing.bills.length > 0 && (
                          <p className="text-xs text-muted-foreground">
                            {hearing.bills.length} bill(s) on agenda
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* High Priority Bills */}
        {myHighPriorityBills.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                Bills Requiring Attention
              </CardTitle>
              <CardDescription>
                High priority bills assigned to you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {myHighPriorityBills.map((bill: any) => (
                  <Link
                    key={bill.id}
                    href={`/bills/${bill.id}`}
                    className="flex items-center justify-between rounded-md border p-3 hover:bg-accent transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {bill.billNumber}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {bill.priority}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {bill.title}
                      </p>
                    </div>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Link href={`/sessions/${params.sessionId}/bills/upload`}>
                <Button variant="outline">Add New Bill</Button>
              </Link>
              <Link href={`/sessions/${params.sessionId}/bills`}>
                <Button variant="outline">View All Bills</Button>
              </Link>
              <Link href={`/sessions/${params.sessionId}/categories`}>
                <Button variant="outline">Manage Categories</Button>
              </Link>
              <Link href={`/sessions/${params.sessionId}/hearings`}>
                <Button variant="outline">View Hearings</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

