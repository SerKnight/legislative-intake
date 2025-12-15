import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { getSessionRole } from "@/lib/session-context"
import { z } from "zod"

const createHearingSchema = z.object({
  title: z.string().min(1),
  date: z.string().datetime(),
  location: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED", "POSTPONED"]),
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

    const hearings = await prisma.hearing.findMany({
      where: { sessionId: params.id },
      include: {
        bills: {
          include: {
            bill: {
              select: {
                id: true,
                billNumber: true,
                title: true,
              },
            },
          },
        },
      },
      orderBy: { date: "asc" },
    })

    return NextResponse.json({ hearings })
  } catch (error) {
    console.error("Error fetching hearings:", error)
    return NextResponse.json(
      { error: "Failed to fetch hearings" },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const role = await getSessionRole(session.user.id, params.id)
    if (!role || (role !== "ADMIN" && role !== "MANAGER" && role !== "CONTRIBUTOR")) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const data = createHearingSchema.parse(body)

    const hearing = await prisma.hearing.create({
      data: {
        sessionId: params.id,
        title: data.title,
        date: new Date(data.date),
        location: data.location || null,
        description: data.description || null,
        status: data.status,
      },
      include: {
        bills: true,
      },
    })

    return NextResponse.json({ hearing }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error creating hearing:", error)
    return NextResponse.json(
      { error: "Failed to create hearing" },
      { status: 500 }
    )
  }
}

