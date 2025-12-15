import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { getSessionRole } from "@/lib/session-context"
import { z } from "zod"

const updateMemberSchema = z.object({
  role: z.enum(["VIEWER", "CONTRIBUTOR", "MANAGER", "ADMIN"]).optional(),
  isActive: z.boolean().optional(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; memberId: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const role = await getSessionRole(session.user.id, params.id)
    if (role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can update member roles" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const data = updateMemberSchema.parse(body)

    const userSession = await prisma.userSession.update({
      where: { id: params.memberId },
      data: {
        role: data.role,
        isActive: data.isActive,
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

    return NextResponse.json({ member: userSession })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error updating member:", error)
    return NextResponse.json(
      { error: "Failed to update member" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; memberId: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const role = await getSessionRole(session.user.id, params.id)
    if (role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can remove members" },
        { status: 403 }
      )
    }

    // Don't allow removing yourself
    const member = await prisma.userSession.findUnique({
      where: { id: params.memberId },
    })

    if (member?.userId === session.user.id) {
      return NextResponse.json(
        { error: "You cannot remove yourself from the session" },
        { status: 400 }
      )
    }

    await prisma.userSession.delete({
      where: { id: params.memberId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing member:", error)
    return NextResponse.json(
      { error: "Failed to remove member" },
      { status: 500 }
    )
  }
}

