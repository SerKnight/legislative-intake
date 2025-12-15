import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { uploadFile, generateBillDocumentKey } from "@/lib/storage"
import { extractTextFromDocument } from "@/lib/document-processing"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const sessionId = formData.get("sessionId") as string
    const jurisdictionId = formData.get("jurisdictionId") as string
    const billNumber = formData.get("billNumber") as string
    const title = formData.get("title") as string
    const introducedDate = formData.get("introducedDate") as string
    const summary = formData.get("summary") as string
    const primarySponsor = formData.get("primarySponsor") as string
    const sponsors = formData.get("sponsors") as string
    const committees = formData.get("committees") as string
    const topics = formData.get("topics") as string
    const status = formData.get("status") as string
    const priority = formData.get("priority") as string
    const assignedTo = formData.get("assignedTo") as string
    const categoryIdsJson = formData.get("categoryIds") as string
    const relatedBillIdsJson = formData.get("relatedBillIds") as string

    // Validate required fields
    if (!file || !sessionId || !jurisdictionId || !billNumber || !title) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Verify session exists and user has access
    const userSession = await prisma.userSession.findUnique({
      where: {
        userId_sessionId: {
          userId: session.user.id,
          sessionId: sessionId,
        },
      },
    })

    if (!userSession) {
      return NextResponse.json(
        { error: "Session not found or access denied" },
        { status: 403 }
      )
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only PDF and DOCX are allowed." },
        { status: 400 }
      )
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit" },
        { status: 400 }
      )
    }

    // Verify jurisdiction exists
    const jurisdiction = await prisma.jurisdiction.findUnique({
      where: { id: jurisdictionId },
    })

    if (!jurisdiction) {
      return NextResponse.json(
        { error: "Invalid jurisdiction" },
        { status: 400 }
      )
    }

    // Read file buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Parse and validate introducedDate
    let parsedIntroducedDate: Date | null = null
    if (introducedDate && introducedDate.trim() !== "") {
      const date = new Date(introducedDate)
      // Check if date is valid
      if (!isNaN(date.getTime())) {
        parsedIntroducedDate = date
      }
    }

    // Generate storage key
    const year = parsedIntroducedDate
      ? parsedIntroducedDate.getFullYear().toString()
      : new Date().getFullYear().toString()

    const key = generateBillDocumentKey(
      jurisdiction.code,
      year,
      billNumber,
      "original",
      file.name
    )

    // Upload to R2
    const documentUrl = await uploadFile(key, buffer, file.type)

    // Extract text from document
    let extractedText: string | undefined
    try {
      extractedText = await extractTextFromDocument(buffer, file.type)
    } catch (error) {
      console.error("Failed to extract text:", error)
      // Continue even if text extraction fails
    }

    // Parse arrays from comma-separated strings
    const sponsorsArray = sponsors
      ? sponsors.split(",").map((s) => s.trim()).filter(Boolean)
      : []
    const committeesArray = committees
      ? committees.split(",").map((c) => c.trim()).filter(Boolean)
      : []
    const topicsArray = topics
      ? topics.split(",").map((t) => t.trim()).filter(Boolean)
      : []

    // Parse category IDs and related bill IDs
    let categoryIds: string[] = []
    if (categoryIdsJson) {
      try {
        categoryIds = JSON.parse(categoryIdsJson)
      } catch (e) {
        console.error("Failed to parse categoryIds:", e)
      }
    }

    let relatedBillIds: string[] = []
    if (relatedBillIdsJson) {
      try {
        relatedBillIds = JSON.parse(relatedBillIdsJson)
      } catch (e) {
        console.error("Failed to parse relatedBillIds:", e)
      }
    }

    // Create bill in database
    const bill = await prisma.bill.create({
      data: {
        billNumber,
        title,
        summary: summary || null,
        fullText: extractedText || null,
        status: (status as any) || "INTRODUCED",
        priority: (priority as any) || "NORMAL",
        jurisdictionId,
        sessionId,
        assignedTo: assignedTo || null,
        introducedDate: parsedIntroducedDate,
        documentUrl,
        documentKey: key,
        primarySponsor: primarySponsor || null,
        sponsors: sponsorsArray,
        committees: committeesArray,
        topics: topicsArray,
        categories: categoryIds.length > 0
          ? {
              create: categoryIds.map((categoryId) => ({
                categoryId,
              })),
            }
          : undefined,
      },
      include: {
        jurisdiction: true,
        legislativeSession: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
    })

    // Create bill relationships if any
    if (relatedBillIds.length > 0) {
      await prisma.billRelation.createMany({
        data: relatedBillIds.map((relatedBillId) => ({
          billId: bill.id,
          relatedBillId,
          relationType: "RELATED",
        })),
        skipDuplicates: true,
      })
    }

    return NextResponse.json({
      success: true,
      bill,
      documentUrl,
      documentKey: key,
    })
  } catch (error) {
    console.error("Bill creation error:", error)
    return NextResponse.json(
      { error: "Failed to create bill" },
      { status: 500 }
    )
  }
}

