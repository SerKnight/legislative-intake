import { notFound, redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { SessionHeader } from "@/components/sessions/SessionHeader"
import { BillList } from "@/components/bills/BillList"
import { BillFilters } from "@/components/bills/BillFilters"
import { BillSearchSession } from "@/components/bills/BillSearchSession"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus } from "lucide-react"

export default async function SessionBillsPage({
  params,
  searchParams,
}: {
  params: { sessionId: string }
  searchParams: {
    search?: string
    category?: string
    status?: string
    priority?: string
    assignedTo?: string
    sortBy?: string
  }
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
      },
    },
  })

  if (!legislativeSession) {
    notFound()
  }

  // Build filter conditions
  const where: any = {
    sessionId: params.sessionId,
  }

  if (searchParams.search) {
    where.OR = [
      { title: { contains: searchParams.search, mode: "insensitive" } },
      { billNumber: { contains: searchParams.search, mode: "insensitive" } },
      { summary: { contains: searchParams.search, mode: "insensitive" } },
    ]
  }

  if (searchParams.status) {
    where.status = searchParams.status
  }

  if (searchParams.priority) {
    where.priority = searchParams.priority
  }

  if (searchParams.assignedTo) {
    if (searchParams.assignedTo === "unassigned") {
      where.assignedTo = null
    } else {
      where.assignedTo = searchParams.assignedTo
    }
  }

  if (searchParams.category) {
    where.categories = {
      some: {
        categoryId: searchParams.category,
      },
    }
  }

  // Determine sort order
  const orderBy: any = {}
  if (searchParams.sortBy === "priority") {
    orderBy.priority = "desc"
  } else if (searchParams.sortBy === "date") {
    orderBy.introducedDate = "desc"
  } else if (searchParams.sortBy === "number") {
    orderBy.billNumber = "asc"
  } else {
    orderBy.updatedAt = "desc"
  }

  // Get bills for this session
  const bills = await prisma.bill.findMany({
    where,
    include: {
      jurisdiction: true,
      categories: {
        include: {
          category: true,
        },
      },
      legislativeSession: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy,
    take: 100,
  })

  // Get all users for assignment filter
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
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/sessions/${params.sessionId}`}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h2 className="text-2xl font-semibold">Session Bills</h2>
              <p className="text-sm text-muted-foreground">
                Track and manage all bills in this legislative session
              </p>
            </div>
          </div>
          <Link href={`/sessions/${params.sessionId}/bills/upload`}>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Bill
            </Button>
          </Link>
        </div>

        <div className="mb-6 space-y-4">
          <BillSearchSession sessionId={params.sessionId} initialQuery={searchParams.search} />
          <BillFilters
            sessionId={params.sessionId}
            categories={legislativeSession.categories}
            users={users}
            currentFilters={searchParams}
          />
        </div>

        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {bills.length} bill{bills.length !== 1 ? "s" : ""} in this session
          </p>
        </div>

        <BillList bills={bills} showSession={false} />
      </div>
    </div>
  )
}

