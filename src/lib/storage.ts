import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

// Support both direct endpoint URL or account ID
const getEndpoint = () => {
  if (process.env.R2_ENDPOINT) {
    return process.env.R2_ENDPOINT
  }
  if (process.env.R2_ACCOUNT_ID) {
    return `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
  }
  throw new Error("Either R2_ENDPOINT or R2_ACCOUNT_ID must be set")
}

// Validate R2 configuration
function validateR2Config() {
  const missing: string[] = []
  
  if (!process.env.R2_ENDPOINT && !process.env.R2_ACCOUNT_ID) {
    missing.push("R2_ENDPOINT or R2_ACCOUNT_ID")
  }
  if (!process.env.R2_ACCESS_KEY_ID) {
    missing.push("R2_ACCESS_KEY_ID")
  }
  if (!process.env.R2_SECRET_ACCESS_KEY) {
    missing.push("R2_SECRET_ACCESS_KEY")
  }
  if (!process.env.R2_BUCKET_NAME) {
    missing.push("R2_BUCKET_NAME")
  }
  
  if (missing.length > 0) {
    console.warn(`⚠️  Missing R2 environment variables: ${missing.join(", ")}`)
  }
}

// Validate on module load
if (typeof window === "undefined") {
  validateR2Config()
}

const r2Client = new S3Client({
  region: "auto",
  endpoint: getEndpoint(),
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: false, // R2 uses virtual-hosted-style by default
})

export async function uploadFile(
  key: string,
  file: Buffer,
  contentType: string
) {
  if (!process.env.R2_BUCKET_NAME) {
    throw new Error("R2_BUCKET_NAME environment variable is not set")
  }

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: contentType,
  })

  try {
    await r2Client.send(command)
  } catch (error: any) {
    console.error("R2 Upload Error:", {
      message: error.message,
      code: error.code,
      endpoint: getEndpoint(),
      bucket: process.env.R2_BUCKET_NAME,
      hasAccessKey: !!process.env.R2_ACCESS_KEY_ID,
      hasSecretKey: !!process.env.R2_SECRET_ACCESS_KEY,
    })
    throw new Error(`Failed to upload to R2: ${error.message}`)
  }

  // Return public URL if configured, otherwise return the key
  if (process.env.R2_PUBLIC_URL) {
    return `${process.env.R2_PUBLIC_URL}/${key}`
  }
  return key
}

export async function getFileUrl(key: string, expiresIn = 3600) {
  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
  })

  return await getSignedUrl(r2Client, command, { expiresIn })
}

export function generateBillDocumentKey(
  jurisdictionCode: string,
  year: string,
  billNumber: string,
  type: "original" | "version" | "amendment",
  filename: string
): string {
  const sanitizedBillNumber = billNumber.replace(/\s+/g, "-")
  const timestamp = Date.now()
  return `bills/${jurisdictionCode}/${year}/${sanitizedBillNumber}/${type}/${timestamp}-${filename}`
}

