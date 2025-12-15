import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { getSessionRole } from "@/lib/session-context"
import { z } from "zod"

const inviteMemberSchema = z.object({
  email: z.string().email(),
  role: z.enum(["VIEWER", "CONTRIBUTOR", "MANAGER", "ADMIN"]),
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

    const members = await prisma.userSession.findMany({
      where: { sessionId: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { joinedAt: "desc" },
    })

    return NextResponse.json({ members })
  } catch (error) {
    console.error("Error fetching members:", error)
    return NextResponse.json(
      { error: "Failed to fetch members" },
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
    if (role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can invite members" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const data = inviteMemberSchema.parse(body)

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found. They must sign up first." },
        { status: 404 }
      )
    }

    // Check if user is already a member
    const existing = await prisma.userSession.findUnique({
      where: {
        userId_sessionId: {
          userId: user.id,
          sessionId: params.id,
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: "User is already a member of this session" },
        { status: 400 }
      )
    }

    // Add user to session
    const userSession = await prisma.userSession.create({
      data: {
        userId: user.id,
        sessionId: params.id,
        role: data.role,
        isActive: false,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    })

    return NextResponse.json({ member: userSession }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error inviting member:", error)
    return NextResponse.json(
      { error: "Failed to invite member" },
      { status: 500 }
    )
  }
}

