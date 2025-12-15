# Legislative Intake

AI-powered legislative intelligence platform for tracking bills, predicting outcomes, and staying ahead of legislative changes.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Database**: PostgreSQL with Prisma
- **Auth**: NextAuth.js v5 (Auth.js)
- **File Storage**: Cloudflare R2 (S3-compatible)

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm (or npm/yarn)
- PostgreSQL database (local or cloud)
- Cloudflare R2 account (for file storage)

### Installation

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Set up the database** (choose one option):

   **Option A: Using Docker (Recommended - Easiest)**:
   ```bash
   # Start PostgreSQL in Docker
   docker-compose up -d
   
   # Verify it's running
   docker ps
   ```

   **Option B: Using Homebrew (macOS)**:
   ```bash
   # Install PostgreSQL
   brew install postgresql@16
   brew services start postgresql@16
   
   # Create database
   createdb legislative_intake
   ```

   **Option C: Using Supabase/Neon/Railway (Cloud)**:
   - Create a free PostgreSQL database
   - Copy the connection string

3. **Set up environment variables**:
   ```bash
   # Create .env.local file
   cat > .env.local << 'EOF'
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/legislative_intake"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="$(openssl rand -base64 32)"
   EOF
   ```
   
   Or manually create `.env.local` with:
   - `DATABASE_URL`: PostgreSQL connection string
     - Docker: `postgresql://postgres:postgres@localhost:5432/legislative_intake`
     - Local: `postgresql://your_user:your_password@localhost:5432/legislative_intake`
     - Cloud: Your provider's connection string
   - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
   - `NEXTAUTH_URL`: `http://localhost:3000` for dev
   - R2 credentials (optional for MVP)

4. **Set up the database**:
   ```bash
   # Generate Prisma Client
   pnpm db:generate
   
   # Run migrations
   pnpm db:migrate
   
   # Seed the database
   pnpm db:seed
   ```

5. **Start the development server**:
   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
legislative-intake/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seeds/              # Seed data
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── (auth)/        # Auth routes
│   │   ├── (dashboard)/   # Protected routes
│   │   └── api/           # API routes
│   ├── components/        # React components
│   │   ├── ui/           # shadcn components
│   │   ├── auth/         # Auth components
│   │   ├── bills/        # Bill components
│   │   ├── dashboard/    # Dashboard components
│   │   └── landing/      # Landing page components
│   ├── lib/              # Utilities
│   │   ├── auth.ts       # NextAuth config
│   │   ├── db.ts         # Prisma client
│   │   ├── storage.ts    # File storage
│   │   └── validations.ts # Zod schemas
│   └── hooks/            # React hooks
└── public/               # Static assets
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm db:generate` - Generate Prisma Client
- `pnpm db:migrate` - Run database migrations
- `pnpm db:seed` - Seed the database
- `pnpm db:studio` - Open Prisma Studio

## Features

### MVP Features

- ✅ User authentication (signup/login)
- ✅ Landing page
- ✅ Dashboard with bill overview
- ✅ Bills list and detail views
- ✅ Basic search functionality
- ✅ File upload and storage (R2)
- ✅ Document text extraction (PDF/DOCX)

### Coming Soon

- AI-powered bill summarization
- Real-time bill tracking
- Advanced semantic search
- Predictive analytics
- Email notifications
- Multi-factor authentication

## Database Schema

The application uses Prisma with PostgreSQL. Key models include:

- **User**: User accounts and authentication
- **Bill**: Legislative bills with metadata
- **Jurisdiction**: Federal, state, and local jurisdictions
- **BillVersion**: Track bill changes over time
- **Amendment**: Bill amendments
- **Organization**: Multi-tenant support

See `prisma/schema.prisma` for the complete schema.

## Authentication

The app uses NextAuth.js v5 with:
- Email/password authentication
- JWT sessions
- Protected routes via middleware

## File Storage

Files are stored in Cloudflare R2 with:
- Structured key organization by jurisdiction/year/bill
- Pre-signed URLs for secure access
- Support for PDF and DOCX documents
- Automatic text extraction

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

[Add your license here]

## Support

For issues and questions, please open an issue on GitHub.

