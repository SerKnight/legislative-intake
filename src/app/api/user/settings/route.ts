import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { z } from "zod"

const userSettingsSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  role: z.enum([
    "USER",
    "ADMIN",
    "LEGISLATOR",
    "STAFF_DIRECTOR",
    "POLICY_ANALYST",
    "LEGISLATIVE_AIDE",
    "COMMITTEE_STAFF",
    "BUDGET_ANALYST",
    "CONSTITUENT_SERVICES",
    "RESEARCHER",
  ]),
  defaultJurisdictionId: z.string().optional().nullable(),
  title: z.string().optional(),
  office: z.string().optional(),
  bio: z.string().optional(),
})

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const data = userSettingsSchema.parse(body)

    // Verify jurisdiction exists if provided
    if (data.defaultJurisdictionId) {
      const jurisdiction = await prisma.jurisdiction.findUnique({
        where: { id: data.defaultJurisdictionId },
      })

      if (!jurisdiction) {
        return NextResponse.json(
          { error: "Invalid jurisdiction" },
          { status: 400 }
        )
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: data.name || null,
        phone: data.phone || null,
        role: data.role as any,
        defaultJurisdictionId: data.defaultJurisdictionId || null,
        title: data.title || null,
        office: data.office || null,
        bio: data.bio || null,
      },
      include: {
        defaultJurisdiction: true,
      },
    })

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Error updating user settings:", error)
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        defaultJurisdiction: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Error fetching user settings:", error)
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    )
  }
}

