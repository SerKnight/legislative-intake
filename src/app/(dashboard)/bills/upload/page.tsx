import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { getActiveSession } from "@/lib/session-context"
import { BillUploadWizard } from "@/components/bills/BillUploadWizard"

export default async function UploadBillPage({
  searchParams,
}: {
  searchParams: { sessionId?: string }
}) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
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

  // Get active session or use provided sessionId
  const activeSession = searchParams.sessionId
    ? await prisma.legislativeSession.findUnique({
        where: { id: searchParams.sessionId },
      })
    : await getActiveSession(session.user.id)

  if (!activeSession) {
    redirect("/dashboard")
  }

  // Get categories for the session
  const categories = await prisma.sessionCategory.findMany({
    where: { sessionId: activeSession.id },
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

  return (
    <BillUploadWizard
      jurisdictions={jurisdictions}
      session={activeSession}
      categories={categories}
      users={users}
      defaultJurisdictionId={user?.defaultJurisdictionId || undefined}
    />
  )
}

