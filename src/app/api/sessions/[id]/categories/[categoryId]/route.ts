import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { getSessionRole } from "@/lib/session-context"
import { z } from "zod"

const updateCategorySchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  order: z.number().int().optional(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; categoryId: string } }
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
    const data = updateCategorySchema.parse(body)

    // Check if slug is unique within session (if changing)
    if (data.slug) {
      const existing = await prisma.sessionCategory.findFirst({
        where: {
          sessionId: params.id,
          slug: data.slug,
          id: { not: params.categoryId },
        },
      })

      if (existing) {
        return NextResponse.json(
          { error: "Category slug already exists in this session" },
          { status: 400 }
        )
      }
    }

    const category = await prisma.sessionCategory.update({
      where: { id: params.categoryId },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description !== undefined ? data.description : undefined,
        color: data.color !== undefined ? data.color : undefined,
        order: data.order,
      },
    })

    return NextResponse.json({ category })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error updating category:", error)
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; categoryId: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const role = await getSessionRole(session.user.id, params.id)
    if (!role || (role !== "ADMIN" && role !== "MANAGER")) {
      return NextResponse.json(
        { error: "Only managers and admins can delete categories" },
        { status: 403 }
      )
    }

    await prisma.sessionCategory.delete({
      where: { id: params.categoryId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    )
  }
}

