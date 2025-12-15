import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userSession = await prisma.userSession.findUnique({
      where: {
        userId_sessionId: {
          userId: session.user.id,
          sessionId: params.id,
        },
      },
    })

    if (!userSession) {
      return NextResponse.json(
        { error: "Session not found or access denied" },
        { status: 404 }
      )
    }

    // Get bill counts by status
    const billsByStatus = await prisma.bill.groupBy({
      by: ["status"],
      where: { sessionId: params.id },
      _count: true,
    })

    // Get bill counts by priority
    const billsByPriority = await prisma.bill.groupBy({
      by: ["priority"],
      where: { sessionId: params.id },
      _count: true,
    })

    // Get bill counts by category
    const billsByCategory = await prisma.billCategory.groupBy({
      by: ["categoryId"],
      where: {
        bill: {
          sessionId: params.id,
        },
      },
      _count: true,
    })

    // Get category details
    const categoryDetails = await prisma.sessionCategory.findMany({
      where: { sessionId: params.id },
      select: {
        id: true,
        name: true,
        slug: true,
        color: true,
      },
    })

    const categoryCounts = billsByCategory.map((bc: any) => {
      const category = categoryDetails.find((c: any) => c.id === bc.categoryId)
      return {
        categoryId: bc.categoryId,
        categoryName: category?.name || "Unknown",
        categorySlug: category?.slug || "",
        categoryColor: category?.color || null,
        count: bc._count,
      }
    })

    // Get total counts
    const totalBills = await prisma.bill.count({
      where: { sessionId: params.id },
    })

    const totalHearings = await prisma.hearing.count({
      where: { sessionId: params.id },
    })

    // Get upcoming hearings (next 30 days)
    const upcomingHearings = await prisma.hearing.count({
      where: {
        sessionId: params.id,
        date: {
          gte: new Date(),
          lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
        status: {
          in: ["SCHEDULED", "IN_PROGRESS"],
        },
      },
    })

    // Get recent activity (bills updated in last 7 days)
    const recentActivity = await prisma.bill.count({
      where: {
        sessionId: params.id,
        updatedAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    })

    // Get bills assigned to current user
    const myBills = await prisma.bill.count({
      where: {
        sessionId: params.id,
        assignedTo: session.user.id,
      },
    })

    // Get high priority bills
    const highPriorityBills = await prisma.bill.count({
      where: {
        sessionId: params.id,
        priority: {
          in: ["HIGH", "URGENT"],
        },
      },
    })

    return NextResponse.json({
      metrics: {
        totalBills,
        totalHearings,
        upcomingHearings,
        recentActivity,
        myBills,
        highPriorityBills,
        billsByStatus: billsByStatus.map((b: any) => ({
          status: b.status,
          count: b._count,
        })),
        billsByPriority: billsByPriority.map((b: any) => ({
          priority: b.priority,
          count: b._count,
        })),
        billsByCategory: categoryCounts,
      },
    })
  } catch (error) {
    console.error("Error fetching session metrics:", error)
    return NextResponse.json(
      { error: "Failed to fetch session metrics" },
      { status: 500 }
    )
  }
}

