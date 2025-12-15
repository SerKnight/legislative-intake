import { notFound, redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { SessionHeader } from "@/components/sessions/SessionHeader"
import { BillList } from "@/components/bills/BillList"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default async function CategoryDetailPage({
  params,
}: {
  params: { sessionId: string; categoryId: string }
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

  // Get category
  const category = await prisma.sessionCategory.findUnique({
    where: { id: params.categoryId },
    include: {
      session: {
        include: {
          jurisdiction: true,
        },
      },
    },
  })

  if (!category || category.sessionId !== params.sessionId) {
    notFound()
  }

  // Get bills in this category
  const bills = await prisma.bill.findMany({
    where: {
      sessionId: params.sessionId,
      categories: {
        some: {
          categoryId: params.categoryId,
        },
      },
    },
    include: {
      jurisdiction: true,
      categories: {
        include: {
          category: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  })

  const sessionWithRole = {
    ...category.session,
    role: userSession.role,
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SessionHeader session={sessionWithRole} />
      <div className="container py-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/sessions/${params.sessionId}/categories`}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-semibold">{category.name}</h2>
                {category.color && (
                  <div
                    className="h-4 w-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                )}
              </div>
              {category.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {category.description}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            {bills.length} bill{bills.length !== 1 ? "s" : ""} in this category
          </p>
        </div>

        <BillList bills={bills} showSession={false} />
      </div>
    </div>
  )
}

