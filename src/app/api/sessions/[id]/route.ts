import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { getSessionRole } from "@/lib/session-context"
import { z } from "zod"

const updateSessionSchema = z.object({
  name: z.string().min(1).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional().nullable(),
  status: z.enum(["DRAFT", "ACTIVE", "CLOSED", "ARCHIVED"]).optional(),
  description: z.string().optional(),
})

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

    const legislativeSession = await prisma.legislativeSession.findUnique({
      where: { id: params.id },
      include: {
        jurisdiction: true,
        categories: {
          orderBy: { order: "asc" },
        },
        _count: {
          select: {
            bills: true,
            hearings: true,
            userSessions: true,
          },
        },
      },
    })

    if (!legislativeSession) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      session: {
        ...legislativeSession,
        role: userSession.role,
        isActive: userSession.isActive,
      },
    })
  } catch (error) {
    console.error("Error fetching session:", error)
    return NextResponse.json(
      { error: "Failed to fetch session" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const role = await getSessionRole(session.user.id, params.id)
    if (!role || (role !== "ADMIN" && role !== "MANAGER")) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const data = updateSessionSchema.parse(body)

    const updateData: any = {}
    if (data.name) updateData.name = data.name
    if (data.startDate) updateData.startDate = new Date(data.startDate)
    if (data.endDate !== undefined)
      updateData.endDate = data.endDate ? new Date(data.endDate) : null
    if (data.status) updateData.status = data.status
    if (data.description !== undefined) updateData.description = data.description

    const legislativeSession = await prisma.legislativeSession.update({
      where: { id: params.id },
      data: updateData,
      include: {
        jurisdiction: true,
      },
    })

    return NextResponse.json({ session: legislativeSession })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error updating session:", error)
    return NextResponse.json(
      { error: "Failed to update session" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const role = await getSessionRole(session.user.id, params.id)
    if (role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can archive sessions" },
        { status: 403 }
      )
    }

    // Archive instead of delete
    await prisma.legislativeSession.update({
      where: { id: params.id },
      data: { status: "ARCHIVED" },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error archiving session:", error)
    return NextResponse.json(
      { error: "Failed to archive session" },
      { status: 500 }
    )
  }
}

