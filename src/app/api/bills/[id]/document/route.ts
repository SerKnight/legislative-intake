import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { getFileUrl } from "@/lib/storage"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const bill = await prisma.bill.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        documentKey: true,
        documentUrl: true,
      },
    })

    if (!bill) {
      return NextResponse.json({ error: "Bill not found" }, { status: 404 })
    }

    if (!bill.documentKey) {
      return NextResponse.json(
        { error: "No document available for this bill" },
        { status: 404 }
      )
    }

    // Generate a signed URL that expires in 1 hour
    const signedUrl = await getFileUrl(bill.documentKey, 3600)

    return NextResponse.json({ url: signedUrl })
  } catch (error) {
    console.error("Error generating signed URL:", error)
    return NextResponse.json(
      { error: "Failed to generate document URL" },
      { status: 500 }
    )
  }
}

