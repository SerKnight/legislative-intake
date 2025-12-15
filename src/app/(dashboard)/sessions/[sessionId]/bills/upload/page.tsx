import { notFound, redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { BillUploadWizard } from "@/components/bills/BillUploadWizard"
import { SessionHeader } from "@/components/sessions/SessionHeader"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default async function SessionBillUploadPage({
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

  const jurisdictions = await prisma.jurisdiction.findMany({
    orderBy: [
      { type: "asc" },
      { name: "asc" },
    ],
  })

  // Get user with default jurisdiction
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      defaultJurisdiction: true,
    },
  })

  // Get categories for the session
  const categories = await prisma.sessionCategory.findMany({
    where: { sessionId: params.sessionId },
    orderBy: { order: "asc" },
  })

  // Get users for assignment
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
    orderBy: { name: "asc" },
  })

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

        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Add Bill to Session</h2>
          <p className="text-muted-foreground">
            Upload a new bill to track in this legislative session. Bills can be organized by category,
            assigned to staff members, and linked to hearings for better workflow management.
          </p>
        </div>

        <BillUploadWizard
          jurisdictions={jurisdictions}
          session={legislativeSession}
          categories={categories}
          users={users}
          defaultJurisdictionId={user?.defaultJurisdictionId || undefined}
        />
      </div>
    </div>
  )
}

