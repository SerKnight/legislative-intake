import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { UserSettingsForm } from "@/components/settings/UserSettingsForm"

export default async function SettingsPage() {
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

  if (!user) {
    redirect("/login")
  }

  const jurisdictions = await prisma.jurisdiction.findMany({
    orderBy: [
      { type: "asc" },
      { name: "asc" },
    ],
  })

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your profile information, role, and default preferences
        </p>
      </div>

      <UserSettingsForm user={user} jurisdictions={jurisdictions} />
    </div>
  )
}

