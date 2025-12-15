# Legislative Intake: Infrastructure Plan

## Executive Summary

This document outlines the initial infrastructure setup for the Legislative Intake platform, focusing on MVP requirements: landing page, authentication, database schema, and file storage. This plan prioritizes simplicity, scalability, and seamless user experience.

---

## Technology Stack Decisions

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Component Library**: shadcn/ui
- **Type Safety**: TypeScript

### Authentication
**Recommendation: NextAuth.js v5 (Auth.js)**

**Rationale:**
- ✅ Free and open-source
- ✅ Seamless Next.js integration
- ✅ Built-in email/password support
- ✅ Easy to add OAuth providers (Google, GitHub, etc.)
- ✅ Future MFA support via plugins (e.g., `@auth/mfa-adapter`)
- ✅ SMS MFA can be added via Twilio/other providers
- ✅ Simple setup, minimal configuration
- ✅ Session management built-in
- ✅ TypeScript-first

**Alternative Considered:**
- Supabase Auth: Good option, but ties you to Supabase ecosystem
- Clerk: Excellent but has usage limits on free tier
- Auth0: Enterprise-focused, more complex

### Database
- **Primary DB**: PostgreSQL (via Supabase, Neon, or Railway)
- **ORM**: Prisma (type-safe, excellent DX, migrations)
- **Connection**: Connection pooling for scalability

### File Storage
**Recommendation: Cloudflare R2 (S3-compatible)**

**Rationale:**
- ✅ S3-compatible API (easy migration later)
- ✅ No egress fees (cost-effective)
- ✅ Free tier: 10GB storage, 1M Class A operations/month
- ✅ Simple integration
- ✅ CDN-ready

**Alternative:**
- AWS S3: Industry standard, but egress fees
- Supabase Storage: If using Supabase for DB
- Local storage: Only for development

### Development Environment
- **Package Manager**: pnpm (faster, efficient)
- **Environment Variables**: `.env.local` with validation (zod)
- **Code Quality**: ESLint, Prettier
- **Git Hooks**: Husky for pre-commit checks

---

## Project Structure

```
legislative-intake/
├── .env.local                    # Environment variables (gitignored)
├── .env.example                  # Example env file
├── .gitignore
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── seeds/                   # Seed data
│       └── bills.ts
├── public/                      # Static assets
│   ├── images/
│   └── favicon.ico
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── (auth)/              # Auth routes (grouped)
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   └── verify-email/
│   │   ├── (dashboard)/         # Protected routes
│   │   │   ├── dashboard/
│   │   │   ├── bills/
│   │   │   └── layout.tsx       # Auth guard
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   ├── bills/
│   │   │   └── upload/
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Landing page
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                  # shadcn components
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignupForm.tsx
│   │   │   └── EmailVerification.tsx
│   │   ├── landing/
│   │   │   ├── Hero.tsx
│   │   │   ├── Features.tsx
│   │   │   ├── Pricing.tsx
│   │   │   └── CTA.tsx
│   │   └── bills/
│   │       ├── BillCard.tsx
│   │       └── BillList.tsx
│   ├── lib/
│   │   ├── auth.ts              # NextAuth configuration
│   │   ├── db.ts                # Prisma client
│   │   ├── storage.ts           # File storage client
│   │   ├── utils.ts             # Utility functions
│   │   └── validations.ts       # Zod schemas
│   ├── hooks/                   # React hooks
│   ├── types/                   # TypeScript types
│   └── middleware.ts            # Next.js middleware (auth)
└── docs/                        # Documentation
    └── API.md
```

---

## Database Schema

### Core Tables

#### 1. Users
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  emailVerified DateTime?
  name          String?
  passwordHash  String?   // For email/password auth
  phone         String?   // For future SMS MFA
  phoneVerified Boolean   @default(false)
  image         String?   // Profile picture URL
  role          UserRole  @default(USER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  accounts      Account[]
  sessions      Session[]
  organizations OrganizationMember[]
  
  @@index([email])
}
```

#### 2. Accounts (OAuth providers)
```prisma
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String  // "oauth" | "email"
  provider          String  // "google", "github", "credentials"
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([provider, providerAccountId])
  @@index([userId])
}
```

#### 3. Sessions
```prisma
model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
}
```

#### 4. Verification Tokens (Email verification, password reset)
```prisma
model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  
  @@unique([identifier, token])
}
```

#### 5. Jurisdictions
```prisma
model Jurisdiction {
  id          String   @id @default(cuid())
  name        String   // "California", "Federal", "New York"
  type        JurisdictionType // STATE, FEDERAL, LOCAL
  code        String   @unique // "CA", "US", "NY"
  website     String?
  apiEndpoint String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  bills       Bill[]
  
  @@index([code])
}
```

#### 6. Bills (Core legislative data)
```prisma
model Bill {
  id              String        @id @default(cuid())
  billNumber      String        // "HB 1234", "SB 567", "HR 1"
  title           String
  summary         String?       // AI-generated summary
  fullText        String?       @db.Text // Extracted text from PDF/DOCX
  status          BillStatus    @default(INTRODUCED)
  jurisdictionId  String
  session         String?       // "2024-2025"
  introducedDate  DateTime?
  lastActionDate  DateTime?
  lastAction      String?       // "Referred to Committee"
  
  // File storage references
  documentUrl     String?       // URL to PDF/DOCX in R2
  documentKey     String?       // S3 key for file storage
  
  // Metadata
  primarySponsor  String?       // Legislator name
  sponsors        String[]      // Array of sponsor names
  committees      String[]      // Array of committee names
  topics          String[]      // Tags: ["privacy", "healthcare", "AI"]
  
  // AI-generated fields
  aiSummary       String?       @db.Text
  keyProvisions   String[]      // Extracted provisions
  impactAnalysis  String?       @db.Text
  
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  
  jurisdiction    Jurisdiction  @relation(fields: [jurisdictionId], references: [id])
  versions        BillVersion[]
  amendments      Amendment[]
  
  @@index([jurisdictionId])
  @@index([status])
  @@index([introducedDate])
  @@index([billNumber])
  @@fulltext([title, summary, fullText]) // For full-text search
}
```

#### 7. Bill Versions (Track changes over time)
```prisma
model BillVersion {
  id          String   @id @default(cuid())
  billId      String
  version     String   // "Introduced", "Amended", "Enrolled"
  documentUrl String?  // URL to this version's document
  documentKey String?  // S3 key
  fullText    String?  @db.Text
  changes     String?  @db.Text // AI-generated diff summary
  createdAt   DateTime @default(now())
  
  bill        Bill     @relation(fields: [billId], references: [id], onDelete: Cascade)
  
  @@index([billId])
}
```

#### 8. Amendments
```prisma
model Amendment {
  id          String   @id @default(cuid())
  billId      String
  number      String   // "Amendment 1"
  description String?
  documentUrl String?
  documentKey String?
  status      AmendmentStatus @default(PROPOSED)
  createdAt   DateTime @default(now())
  
  bill        Bill     @relation(fields: [billId], references: [id], onDelete: Cascade)
  
  @@index([billId])
}
```

#### 9. Organizations (Multi-tenant support)
```prisma
model Organization {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  plan        PlanType @default(FREE)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  members     OrganizationMember[]
  
  @@index([slug])
}
```

#### 10. Organization Members
```prisma
model OrganizationMember {
  id             String   @id @default(cuid())
  userId         String
  organizationId String
  role           MemberRole @default(MEMBER)
  joinedAt       DateTime @default(now())
  
  user           User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  organization   Organization  @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  
  @@unique([userId, organizationId])
  @@index([organizationId])
}
```

### Enums
```prisma
enum UserRole {
  USER
  ADMIN
}

enum JurisdictionType {
  FEDERAL
  STATE
  LOCAL
}

enum BillStatus {
  INTRODUCED
  IN_COMMITTEE
  PASSED_COMMITTEE
  ON_FLOOR
  PASSED
  VETOED
  ENACTED
  FAILED
  WITHDRAWN
}

enum AmendmentStatus {
  PROPOSED
  ADOPTED
  REJECTED
  WITHDRAWN
}

enum PlanType {
  FREE
  PRO
  ENTERPRISE
}

enum MemberRole {
  MEMBER
  ADMIN
  OWNER
}
```

---

## File Storage Architecture

### Storage Structure
```
r2://legislative-intake/
├── bills/
│   ├── {jurisdiction}/
│   │   ├── {year}/
│   │   │   ├── {billNumber}/
│   │   │   │   ├── original/
│   │   │   │   │   └── {billNumber}-{timestamp}.pdf
│   │   │   │   ├── versions/
│   │   │   │   │   └── {version}-{timestamp}.pdf
│   │   │   │   └── amendments/
│   │   │   │       └── {amendmentNumber}-{timestamp}.pdf
```

### File Upload Flow
1. User/System uploads bill document (PDF/DOCX)
2. File validated (size, type, virus scan if needed)
3. Upload to R2 with structured key
4. Extract text using library (pdf-parse, mammoth)
5. Store extracted text in `Bill.fullText`
6. Store `documentUrl` and `documentKey` in database
7. Trigger AI processing (summary, provisions extraction)

### File Access
- **Public URLs**: Pre-signed URLs for temporary access
- **Private Access**: Authenticated users only
- **CDN**: Cloudflare CDN for fast delivery

---

## Authentication Flow

### Signup Flow (Seamless)
1. **Landing Page** → User clicks "Get Started"
2. **Signup Form** → Email + Password (minimal fields)
3. **Email Verification** → Send verification email (optional for MVP, can require later)
4. **Welcome Screen** → Onboarding or redirect to dashboard
5. **Session Created** → User logged in automatically

### Login Flow
1. **Login Page** → Email + Password
2. **Optional**: "Remember me" checkbox
3. **Session Created** → Redirect to dashboard or intended page

### Future MFA Flow (Phase 2)
1. After password verification
2. If MFA enabled → Send SMS code or TOTP prompt
3. Verify code → Complete login

### NextAuth Configuration
```typescript
// src/lib/auth.ts
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./db"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" }
      },
      async authorize(credentials) {
        // Verify credentials and return user
      }
    }),
    // Future: Google, GitHub providers
  ],
  pages: {
    signIn: "/login",
    signUp: "/signup",
  },
  session: {
    strategy: "jwt", // or "database" for more control
  },
  callbacks: {
    async jwt({ token, user }) {
      // Add custom claims
      return token
    },
    async session({ session, token }) {
      // Add user data to session
      return session
    }
  }
})
```

---

## Landing Page Structure

### Sections (in order)
1. **Hero Section**
   - Headline: "AI-Powered Legislative Intelligence"
   - Subheadline: "Track bills, predict outcomes, stay ahead"
   - CTA: "Get Started Free" → Signup
   - Secondary CTA: "See Demo" → Video/modal

2. **Problem Statement**
   - "Legacy systems are slow. We're real-time."
   - Pain points: Slow updates, poor search, no AI

3. **Key Features** (3-4 cards)
   - Real-time tracking
   - AI summaries
   - Semantic search
   - Predictive analytics

4. **How It Works** (Simple 3-step)
   - Step 1: Sign up
   - Step 2: Set alerts
   - Step 3: Get insights

5. **Social Proof** (Placeholder for MVP)
   - "Trusted by government affairs teams"
   - Logos (placeholder)

6. **Pricing** (Simple tiers)
   - Free: Limited features
   - Pro: Full features
   - Enterprise: Custom

7. **Final CTA**
   - "Start tracking legislation today"
   - Signup button

8. **Footer**
   - Links, legal, contact

### Design Principles
- Clean, professional, trustworthy
- Mobile-first responsive
- Fast loading (< 2s)
- Clear CTAs
- Minimal friction to signup

---

## Seed Data

### Jurisdictions
```typescript
// prisma/seeds/jurisdictions.ts
export const jurisdictions = [
  {
    name: "California",
    type: "STATE",
    code: "CA",
    website: "https://leginfo.legislature.ca.gov",
  },
  {
    name: "New York",
    type: "STATE",
    code: "NY",
    website: "https://www.nysenate.gov",
  },
  {
    name: "Federal",
    type: "FEDERAL",
    code: "US",
    website: "https://www.congress.gov",
  },
]
```

### Sample Bills
```typescript
// prisma/seeds/bills.ts
export const sampleBills = [
  {
    billNumber: "AB 1234",
    title: "California Consumer Privacy Act Amendments",
    summary: "Amends the California Consumer Privacy Act to strengthen data protection requirements...",
    status: "IN_COMMITTEE",
    jurisdictionCode: "CA",
    introducedDate: new Date("2024-01-15"),
    primarySponsor: "Assemblymember Jane Doe",
    sponsors: ["Assemblymember Jane Doe", "Senator John Smith"],
    committees: ["Privacy and Consumer Protection"],
    topics: ["privacy", "data protection", "consumer rights"],
    // Mock document URL
    documentUrl: "https://example.com/bills/CA/AB-1234.pdf",
  },
  {
    billNumber: "SB 567",
    title: "Artificial Intelligence Transparency Act",
    summary: "Requires AI systems to disclose when content is AI-generated...",
    status: "PASSED_COMMITTEE",
    jurisdictionCode: "CA",
    introducedDate: new Date("2024-02-01"),
    primarySponsor: "Senator John Smith",
    topics: ["AI", "transparency", "technology"],
  },
  {
    billNumber: "HR 1",
    title: "Federal Data Privacy Protection Act",
    summary: "Establishes comprehensive federal data privacy framework...",
    status: "INTRODUCED",
    jurisdictionCode: "US",
    introducedDate: new Date("2024-01-10"),
    primarySponsor: "Rep. Jane Representative",
    topics: ["privacy", "federal", "data protection"],
  },
]
```

---

## Environment Variables

```bash
# .env.example
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/legislative_intake"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# File Storage (Cloudflare R2)
R2_ACCOUNT_ID="your-account-id"
R2_ACCESS_KEY_ID="your-access-key"
R2_SECRET_ACCESS_KEY="your-secret-key"
R2_BUCKET_NAME="legislative-intake"
R2_PUBLIC_URL="https://your-bucket.r2.cloudflarestorage.com"

# Email (for verification, future)
SMTP_HOST="smtp.resend.com"
SMTP_PORT=465
SMTP_USER="resend"
SMTP_PASSWORD="your-resend-api-key"
SMTP_FROM="noreply@legislativeintake.com"

# Future: AI/LLM
OPENAI_API_KEY="your-openai-key" # For Phase 2
```

---

## Implementation Tasks Breakdown

### Phase 1: Project Setup
- [ ] Initialize Next.js project with TypeScript
- [ ] Configure Tailwind CSS
- [ ] Install and configure shadcn/ui
- [ ] Set up Prisma with PostgreSQL
- [ ] Create database schema
- [ ] Set up environment variables
- [ ] Configure ESLint and Prettier

### Phase 2: Authentication
- [ ] Install and configure NextAuth.js v5
- [ ] Create Prisma adapter setup
- [ ] Build signup page and form
- [ ] Build login page and form
- [ ] Implement email/password authentication
- [ ] Add session management
- [ ] Create protected route middleware
- [ ] Add email verification (optional for MVP)

### Phase 3: Landing Page
- [ ] Create landing page layout
- [ ] Build Hero section
- [ ] Build Features section
- [ ] Build Pricing section
- [ ] Build Footer
- [ ] Add responsive design
- [ ] Optimize for performance

### Phase 4: Database & Storage
- [ ] Run Prisma migrations
- [ ] Create seed script for jurisdictions
- [ ] Create seed script for sample bills
- [ ] Set up Cloudflare R2 (or alternative)
- [ ] Create file upload utility
- [ ] Implement file storage service
- [ ] Add document text extraction

### Phase 5: Basic Dashboard (MVP)
- [ ] Create dashboard layout
- [ ] Build bills list view
- [ ] Add bill detail view
- [ ] Implement basic search
- [ ] Add pagination

### Phase 6: Testing & Polish
- [ ] Write unit tests for auth
- [ ] Test file upload flow
- [ ] Test database queries
- [ ] Performance optimization
- [ ] Accessibility audit
- [ ] Mobile responsiveness check

---

## Security Considerations

1. **Authentication**
   - Password hashing (bcrypt, 10+ rounds)
   - Rate limiting on login/signup
   - CSRF protection (NextAuth handles)
   - Secure session cookies

2. **File Uploads**
   - File type validation
   - File size limits (10MB default)
   - Virus scanning (future)
   - Secure file access (pre-signed URLs)

3. **Database**
   - Parameterized queries (Prisma handles)
   - Connection pooling
   - Regular backups
   - Environment variable security

4. **API Routes**
   - Authentication checks
   - Input validation (Zod)
   - Rate limiting
   - Error handling (no sensitive data leaks)

---

## Next Steps After MVP

1. **AI Integration**
   - Bill summarization
   - Key provisions extraction
   - Semantic search (vector DB)

2. **Real-Time Updates**
   - WebSocket connections
   - Server-sent events
   - Push notifications

3. **Advanced Features**
   - Bill version comparison
   - Amendment tracking
   - Committee hearing schedules
   - Vote tracking

4. **MFA**
   - SMS verification
   - TOTP (Google Authenticator)
   - Backup codes

---

## Questions to Resolve

1. **Email Verification**: Required for MVP or optional?
2. **Organization Model**: Single-tenant or multi-tenant from start?
3. **File Storage**: Start with R2 or use simpler solution (Supabase Storage)?
4. **Database Hosting**: Supabase, Neon, Railway, or self-hosted?
5. **Deployment**: Vercel, Railway, or self-hosted?

---

**Document Status**: Initial Plan
**Last Updated**: [Current Date]
**Next Review**: After Phase 1 completion

