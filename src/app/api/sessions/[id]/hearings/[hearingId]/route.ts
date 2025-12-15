import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { getSessionRole } from "@/lib/session-context"
import { z } from "zod"

const updateHearingSchema = z.object({
  title: z.string().min(1).optional(),
  date: z.string().datetime().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED", "POSTPONED"]).optional(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; hearingId: string } }
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
    const data = updateHearingSchema.parse(body)

    const updateData: any = {}
    if (data.title) updateData.title = data.title
    if (data.date) updateData.date = new Date(data.date)
    if (data.location !== undefined) updateData.location = data.location || null
    if (data.description !== undefined) updateData.description = data.description || null
    if (data.status) updateData.status = data.status

    const hearing = await prisma.hearing.update({
      where: { id: params.hearingId },
      data: updateData,
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
    })

    return NextResponse.json({ hearing })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error updating hearing:", error)
    return NextResponse.json(
      { error: "Failed to update hearing" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; hearingId: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const role = await getSessionRole(session.user.id, params.id)
    if (!role || (role !== "ADMIN" && role !== "MANAGER")) {
      return NextResponse.json(
        { error: "Only managers and admins can delete hearings" },
        { status: 403 }
      )
    }

    await prisma.hearing.delete({
      where: { id: params.hearingId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting hearing:", error)
    return NextResponse.json(
      { error: "Failed to delete hearing" },
      { status: 500 }
    )
  }
}

