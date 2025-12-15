import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
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
    const jurisdictionCode = formData.get("jurisdictionCode") as string
    const year = formData.get("year") as string
    const billNumber = formData.get("billNumber") as string
    const type = (formData.get("type") as "original" | "version" | "amendment") || "original"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
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

    // Read file buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Generate storage key
    const key = generateBillDocumentKey(
      jurisdictionCode || "unknown",
      year || new Date().getFullYear().toString(),
      billNumber || "unknown",
      type,
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

    return NextResponse.json({
      success: true,
      documentUrl,
      documentKey: key,
      extractedText,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    )
  }
}

