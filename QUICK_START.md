# Quick Start Guide

## Tech Stack Summary

### Core Technologies
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: NextAuth.js v5 (Auth.js)
- **File Storage**: Cloudflare R2 (S3-compatible)
- **Package Manager**: pnpm (recommended)

---

## Initial Setup Commands

### 1. Create Next.js Project
```bash
npx create-next-app@latest legislative-intake --typescript --tailwind --app --no-src-dir
cd legislative-intake
```

**Note**: If using `--src-dir`, adjust paths accordingly.

### 2. Install Core Dependencies
```bash
# Package manager
npm install -g pnpm  # or use npm/yarn

# Core dependencies
pnpm add next-auth@beta @auth/prisma-adapter
pnpm add prisma @prisma/client
pnpm add bcryptjs
pnpm add zod
pnpm add @aws-sdk/client-s3  # For R2 (S3-compatible)
pnpm add pdf-parse mammoth  # For document parsing

# Dev dependencies
pnpm add -D @types/bcryptjs @types/node
pnpm add -D eslint-config-next
```

### 3. Initialize shadcn/ui
```bash
npx shadcn-ui@latest init
# Follow prompts:
# - Style: Default
# - Base color: Slate
# - CSS variables: Yes
```

### 4. Install Initial shadcn Components
```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add form
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add avatar
```

### 5. Initialize Prisma
```bash
npx prisma init
```

### 6. Set Up Environment Variables
Create `.env.local`:
```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/legislative_intake"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"

# File Storage (Cloudflare R2)
R2_ACCOUNT_ID="your-account-id"
R2_ACCESS_KEY_ID="your-access-key"
R2_SECRET_ACCESS_KEY="your-secret-key"
R2_BUCKET_NAME="legislative-intake"
R2_PUBLIC_URL="https://your-bucket.r2.cloudflarestorage.com"
```

---

## Database Setup

### 1. Create Database


### 2. Create API Route
File: `src/app/api/auth/[...nextauth]/route.ts`
```typescript
import { handlers } from "@/lib/auth"

export const { GET, POST } = handlers
```

### 3. Create Middleware
File: `src/middleware.ts`
```typescript
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnDashboard = req.nextUrl.pathname.startsWith("/dashboard")
  
  if (isOnDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url))
  }
  
  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
}
```

---

## File Storage (Cloudflare R2)

### 1. Create R2 Bucket
1. Go to Cloudflare Dashboard
2. Navigate to R2
3. Create bucket: `legislative-intake`
4. Get API credentials

### 2. Create Storage Utility
File: `src/lib/storage.ts`
```typescript
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

export async function uploadFile(key: string, file: Buffer, contentType: string) {
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
```

---

## Project Structure Quick Reference

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/
│   │   └── dashboard/
│   ├── api/
│   │   ├── auth/[...nextauth]/
│   │   └── upload/
│   └── page.tsx
├── components/
│   ├── ui/          # shadcn components
│   ├── auth/
│   └── landing/
├── lib/
│   ├── auth.ts
│   ├── db.ts
│   └── storage.ts
└── middleware.ts
```

---

## Common Commands

### Development
```bash
# Start dev server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

### Database
```bash
# Create migration
npx prisma migrate dev --name migration_name

# Reset database (dev only)
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio

# Generate Prisma Client
npx prisma generate
```

### shadcn/ui
```bash
# Add component
npx shadcn-ui@latest add [component-name]

# List available components
npx shadcn-ui@latest add
```

---

## Key Design Decisions

### Why NextAuth.js v5?
- Free, open-source
- Seamless Next.js integration
- Easy to add MFA later
- TypeScript-first
- Active development

### Why Cloudflare R2?
- S3-compatible (easy migration)
- No egress fees
- Free tier: 10GB storage
- Simple setup

### Why Prisma?
- Type-safe database access
- Excellent developer experience
- Built-in migrations
- Great TypeScript support

### Why shadcn/ui?
- Copy-paste components (not npm package)
- Fully customizable
- Built on Radix UI (accessible)
- Tailwind CSS based

---

## Troubleshooting

### NextAuth Issues
- Ensure `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain
- Verify Prisma adapter is correctly configured

### Database Connection
- Check `DATABASE_URL` format
- Ensure database is running
- Verify credentials

### File Upload Issues
- Verify R2 credentials
- Check bucket name
- Ensure CORS is configured (if needed)

### Prisma Issues
- Run `npx prisma generate` after schema changes
- Check migration status: `npx prisma migrate status`
- Reset if needed: `npx prisma migrate reset` (dev only)

---

## Next Steps

1. Complete Group 1 tasks (Project Foundation)
2. Set up database and run migrations
3. Implement authentication
4. Build landing page
5. Set up file storage
6. Create basic dashboard

Refer to `TASK_BREAKDOWN.md` for detailed task assignments.

---

**Last Updated**: [Current Date]

