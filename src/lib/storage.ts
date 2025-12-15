import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

export async function uploadFile(
  key: string,
  file: Buffer,
  contentType: string
) {
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
    Body: file,
    ContentType: contentType,
  })

  await r2Client.send(command)
  return `${process.env.R2_PUBLIC_URL}/${key}`
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

