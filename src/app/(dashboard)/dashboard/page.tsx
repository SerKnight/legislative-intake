import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { getActiveSession } from "@/lib/session-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }

  // Check for active session
  const activeSession = await getActiveSession(session.user.id)

  // If user has an active session, redirect to it
  if (activeSession) {
    redirect(`/sessions/${activeSession.id}`)
  }

  // Otherwise, show session selection/creation page
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome</h1>
        <p className="text-muted-foreground">
          Get started by creating or selecting a legislative session
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Create New Session</CardTitle>
            <CardDescription>
              Set up a new legislative session to organize and track bills
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/sessions/new">
              <Button className="w-full gap-2">
                <Plus className="h-4 w-4" />
                Create Session
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Select Existing Session</CardTitle>
            <CardDescription>
              Choose from your existing legislative sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Use the session selector in the sidebar to switch between sessions
            </p>
            <p className="text-xs text-muted-foreground">
              If you don't see any sessions, you may need to be added to one by an administrator.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

