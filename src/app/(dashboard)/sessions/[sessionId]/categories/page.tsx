import { notFound, redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { SessionHeader } from "@/components/sessions/SessionHeader"
import { CategoryGrid } from "@/components/categories/CategoryGrid"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus } from "lucide-react"
import { getSessionRole } from "@/lib/session-context"

export default async function SessionCategoriesPage({
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
      categories: {
        orderBy: { order: "asc" },
        include: {
          _count: {
            select: {
              bills: true,
            },
          },
        },
      },
    },
  })

  if (!legislativeSession) {
    notFound()
  }

  // Check if user can manage categories (CONTRIBUTOR, MANAGER, ADMIN)
  const canManage =
    userSession.role === "CONTRIBUTOR" ||
    userSession.role === "MANAGER" ||
    userSession.role === "ADMIN"

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
              <h2 className="text-2xl font-semibold">Session Categories</h2>
              <p className="text-sm text-muted-foreground">
                Organize bills by topic for easier navigation and tracking. Categories help staff
                quickly find related bills and understand the scope of legislation in this session.
              </p>
            </div>
          </div>
          {canManage && (
            <Link href={`/sessions/${params.sessionId}/categories/new`}>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Category
              </Button>
            </Link>
          )}
        </div>

        <CategoryGrid
          sessionId={params.sessionId}
          categories={legislativeSession.categories}
          canManage={canManage}
        />
      </div>
    </div>
  )
}

