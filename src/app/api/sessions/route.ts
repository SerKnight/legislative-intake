import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { z } from "zod"

const createSessionSchema = z.object({
  name: z.string().min(1),
  identifier: z.string().min(1),
  jurisdictionId: z.string().min(1),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  description: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userSessions = await prisma.userSession.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        session: {
          include: {
            jurisdiction: true,
            _count: {
              select: {
                bills: true,
                hearings: true,
              },
            },
          },
        },
      },
      orderBy: {
        joinedAt: "desc",
      },
    })

    const sessions = userSessions.map((us) => ({
      ...us.session,
      role: us.role,
      isActive: us.isActive,
    }))

    return NextResponse.json({ sessions })
  } catch (error) {
    console.error("Error fetching sessions:", error)
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can create sessions" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const data = createSessionSchema.parse(body)

    // Verify jurisdiction exists
    const jurisdiction = await prisma.jurisdiction.findUnique({
      where: { id: data.jurisdictionId },
    })

    if (!jurisdiction) {
      return NextResponse.json(
        { error: "Invalid jurisdiction" },
        { status: 400 }
      )
    }

    // Check if identifier is unique
    const existing = await prisma.legislativeSession.findUnique({
      where: { identifier: data.identifier },
    })

    if (existing) {
      return NextResponse.json(
        { error: "Session identifier already exists" },
        { status: 400 }
      )
    }

    // Create session
    const legislativeSession = await prisma.legislativeSession.create({
      data: {
        name: data.name,
        identifier: data.identifier,
        jurisdictionId: data.jurisdictionId,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        description: data.description || null,
        status: "ACTIVE",
      },
      include: {
        jurisdiction: true,
      },
    })

    // Add creator as admin
    await prisma.userSession.create({
      data: {
        userId: session.user.id,
        sessionId: legislativeSession.id,
        role: "ADMIN",
        isActive: true,
      },
    })

    return NextResponse.json({ session: legislativeSession }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error creating session:", error)
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    )
  }
}

