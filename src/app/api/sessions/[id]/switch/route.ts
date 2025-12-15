import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { switchActiveSession } from "@/lib/session-context"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const legislativeSession = await switchActiveSession(
      session.user.id,
      params.id
    )

    if (!legislativeSession) {
      return NextResponse.json(
        { error: "Session not found or access denied" },
        { status: 404 }
      )
    }

    return NextResponse.json({ session: legislativeSession })
  } catch (error) {
    console.error("Error switching session:", error)
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to switch session",
      },
      { status: 500 }
    )
  }
}

