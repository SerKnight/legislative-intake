import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { SessionSetupWizard } from "@/components/sessions/SessionSetupWizard"

export default async function NewSessionPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      defaultJurisdiction: true,
    },
  })

  const jurisdictions = await prisma.jurisdiction.findMany({
    orderBy: [
      { type: "asc" },
      { name: "asc" },
    ],
  })

  return (
    <SessionSetupWizard
      jurisdictions={jurisdictions}
      defaultJurisdictionId={user?.defaultJurisdictionId || undefined}
    />
  )
}

