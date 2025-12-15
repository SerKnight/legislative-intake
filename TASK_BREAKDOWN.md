# Legislative Intake: Task Breakdown for Agent Assignment

This document breaks down the infrastructure plan into discrete, assignable tasks for parallel development.

---

## Task Groups

### Group 1: Project Foundation & Setup
**Estimated Time**: 2-3 hours  
**Dependencies**: None  
**Priority**: Critical

#### Task 1.1: Initialize Next.js Project
- [ ] Create Next.js 14+ project with TypeScript
- [ ] Configure App Router structure
- [ ] Set up `src/` directory structure
- [ ] Configure `next.config.js`
- [ ] Set up `tsconfig.json` with strict mode
- [ ] Initialize Git repository
- [ ] Create `.gitignore`

#### Task 1.2: Configure Tailwind & shadcn/ui
- [ ] Install and configure Tailwind CSS
- [ ] Set up `tailwind.config.ts`
- [ ] Install shadcn/ui CLI
- [ ] Initialize shadcn/ui (`components.json`)
- [ ] Install initial shadcn components (Button, Card, Input, Label)
- [ ] Set up global CSS with Tailwind directives
- [ ] Test component rendering

#### Task 1.3: Development Environment
- [ ] Set up pnpm (or npm/yarn)
- [ ] Configure ESLint
- [ ] Configure Prettier
- [ ] Set up Husky for Git hooks (optional)
- [ ] Create `.env.example` file
- [ ] Document setup process in README

---

### Group 2: Database Setup
**Estimated Time**: 2-3 hours  
**Dependencies**: Group 1  
**Priority**: Critical

#### Task 2.1: Prisma Setup
- [ ] Install Prisma CLI and client
- [ ] Initialize Prisma (`prisma init`)
- [ ] Configure `schema.prisma` with PostgreSQL provider
- [ ] Set up database connection string
- [ ] Create Prisma client utility (`src/lib/db.ts`)

#### Task 2.2: Database Schema
- [ ] Create User model
- [ ] Create Account model (OAuth)
- [ ] Create Session model
- [ ] Create VerificationToken model
- [ ] Create Jurisdiction model
- [ ] Create Bill model
- [ ] Create BillVersion model
- [ ] Create Amendment model
- [ ] Create Organization model
- [ ] Create OrganizationMember model
- [ ] Add all enums (UserRole, BillStatus, etc.)
- [ ] Add indexes and relationships
- [ ] Run initial migration

#### Task 2.3: Seed Data
- [ ] Create seed script structure
- [ ] Create jurisdictions seed data
- [ ] Create sample bills seed data
- [ ] Set up Prisma seed command in `package.json`
- [ ] Test seed execution
- [ ] Verify data in database

---

### Group 3: Authentication System
**Estimated Time**: 4-5 hours  
**Dependencies**: Group 2  
**Priority**: Critical

#### Task 3.1: NextAuth.js Setup
- [ ] Install NextAuth.js v5 and Prisma adapter
- [ ] Install bcryptjs for password hashing
- [ ] Create `src/lib/auth.ts` with NextAuth configuration
- [ ] Set up Credentials provider
- [ ] Configure session strategy (JWT or database)
- [ ] Set up environment variables for NextAuth
- [ ] Create API route handler (`src/app/api/auth/[...nextauth]/route.ts`)

#### Task 3.2: Signup Flow
- [ ] Create signup page (`src/app/(auth)/signup/page.tsx`)
- [ ] Create SignupForm component
- [ ] Add form validation (Zod schema)
- [ ] Implement password hashing
- [ ] Create user in database
- [ ] Handle errors gracefully
- [ ] Add loading states
- [ ] Redirect to dashboard after signup
- [ ] Style with shadcn components

#### Task 3.3: Login Flow
- [ ] Create login page (`src/app/(auth)/login/page.tsx`)
- [ ] Create LoginForm component
- [ ] Add form validation
- [ ] Implement credential verification
- [ ] Create session on successful login
- [ ] Handle errors (invalid credentials, etc.)
- [ ] Add "Remember me" option (optional)
- [ ] Redirect to intended page or dashboard
- [ ] Style with shadcn components

#### Task 3.4: Protected Routes
- [ ] Create middleware (`src/middleware.ts`)
- [ ] Implement auth check for protected routes
- [ ] Create dashboard layout with auth guard
- [ ] Add redirect logic for unauthenticated users
- [ ] Test protected route access

#### Task 3.5: Session Management
- [ ] Create user profile component (optional)
- [ ] Add logout functionality
- [ ] Test session persistence
- [ ] Add session refresh logic

---

### Group 4: Landing Page
**Estimated Time**: 4-6 hours  
**Dependencies**: Group 1  
**Priority**: High

#### Task 4.1: Landing Page Structure
- [ ] Create landing page (`src/app/page.tsx`)
- [ ] Set up page layout
- [ ] Add navigation header
- [ ] Create footer component
- [ ] Make responsive (mobile-first)

#### Task 4.2: Hero Section
- [ ] Create Hero component
- [ ] Add headline and subheadline
- [ ] Add primary CTA button (links to signup)
- [ ] Add secondary CTA (demo link)
- [ ] Add hero image or illustration (placeholder)
- [ ] Style with Tailwind

#### Task 4.3: Features Section
- [ ] Create Features component
- [ ] Design feature cards (3-4 features)
- [ ] Add icons or illustrations
- [ ] Write feature descriptions
- [ ] Make responsive grid layout

#### Task 4.4: Additional Sections
- [ ] Create "How It Works" section
- [ ] Create Pricing section (simple tiers)
- [ ] Create final CTA section
- [ ] Add smooth scrolling (optional)
- [ ] Optimize images and assets

#### Task 4.5: Navigation & Footer
- [ ] Create navigation header with logo
- [ ] Add navigation links
- [ ] Add "Sign In" and "Get Started" buttons
- [ ] Create footer with links
- [ ] Add social media links (placeholder)
- [ ] Make sticky header (optional)

---

### Group 5: File Storage System
**Estimated Time**: 3-4 hours  
**Dependencies**: Group 2  
**Priority**: High

#### Task 5.1: Cloudflare R2 Setup
- [ ] Create Cloudflare R2 bucket (or alternative)
- [ ] Get access credentials
- [ ] Install AWS SDK (S3-compatible)
- [ ] Create storage utility (`src/lib/storage.ts`)
- [ ] Set up environment variables
- [ ] Test connection

#### Task 5.2: File Upload API
- [ ] Create upload API route (`src/app/api/upload/route.ts`)
- [ ] Add file validation (type, size)
- [ ] Implement upload to R2
- [ ] Generate structured file keys
- [ ] Return file URL and key
- [ ] Add error handling
- [ ] Add authentication check

#### Task 5.3: Document Processing
- [ ] Install PDF parsing library (pdf-parse)
- [ ] Install DOCX parsing library (mammoth)
- [ ] Create text extraction utility
- [ ] Integrate with upload flow
- [ ] Store extracted text in database
- [ ] Handle extraction errors

#### Task 5.4: File Access
- [ ] Create file retrieval API route
- [ ] Implement pre-signed URL generation
- [ ] Add access control (authenticated users)
- [ ] Test file download flow

---

### Group 6: Basic Dashboard (MVP)
**Estimated Time**: 3-4 hours  
**Dependencies**: Groups 2, 3, 5  
**Priority**: Medium

#### Task 6.1: Dashboard Layout
- [ ] Create dashboard page (`src/app/(dashboard)/dashboard/page.tsx`)
- [ ] Create dashboard layout with sidebar
- [ ] Add navigation menu
- [ ] Add user profile section
- [ ] Make responsive

#### Task 6.2: Bills List View
- [ ] Create bills page (`src/app/(dashboard)/bills/page.tsx`)
- [ ] Create BillCard component
- [ ] Fetch bills from database
- [ ] Display bills in grid/list
- [ ] Add loading states
- [ ] Add empty state

#### Task 6.3: Bill Detail View
- [ ] Create bill detail page (`src/app/(dashboard)/bills/[id]/page.tsx`)
- [ ] Fetch bill by ID
- [ ] Display bill information
- [ ] Show document download link
- [ ] Add back navigation
- [ ] Handle not found

#### Task 6.4: Basic Search
- [ ] Add search input to bills page
- [ ] Implement simple text search (Prisma)
- [ ] Filter bills by search query
- [ ] Add search debouncing
- [ ] Display search results

---

### Group 7: Testing & Polish
**Estimated Time**: 2-3 hours  
**Dependencies**: All groups  
**Priority**: Medium

#### Task 7.1: Testing
- [ ] Test authentication flows (signup, login, logout)
- [ ] Test file upload and retrieval
- [ ] Test database queries
- [ ] Test protected routes
- [ ] Test responsive design on mobile
- [ ] Fix any bugs found

#### Task 7.2: Performance
- [ ] Optimize images
- [ ] Add loading states
- [ ] Optimize database queries
- [ ] Check bundle size
- [ ] Test page load times

#### Task 7.3: Accessibility
- [ ] Add ARIA labels
- [ ] Test keyboard navigation
- [ ] Check color contrast
- [ ] Test with screen reader (basic)
- [ ] Fix accessibility issues

#### Task 7.4: Documentation
- [ ] Update README with setup instructions
- [ ] Document environment variables
- [ ] Add code comments where needed
- [ ] Create API documentation (basic)

---

## Recommended Agent Assignment Strategy

### Agent 1: Foundation & Setup
**Tasks**: Group 1 (Project Foundation)
- Fastest to complete
- No dependencies
- Sets up the foundation for all other work

### Agent 2: Database & Storage
**Tasks**: Group 2 (Database Setup) + Group 5 (File Storage)
- Can work in parallel with Agent 1 after Group 1 is done
- Database schema is critical for authentication
- File storage can be set up independently

### Agent 3: Authentication
**Tasks**: Group 3 (Authentication System)
- Depends on Group 2 (database)
- Critical path for user access
- Can start as soon as database is ready

### Agent 4: Frontend & UI
**Tasks**: Group 4 (Landing Page) + Group 6 (Dashboard)
- Can work in parallel with Agent 3
- Landing page is independent
- Dashboard depends on authentication

### Agent 5: Testing & Integration
**Tasks**: Group 7 (Testing & Polish)
- Works after all other groups are complete
- Integrates and tests all components
- Final polish and bug fixes

---

## Critical Path

1. **Group 1** → Foundation (blocks everything)
2. **Group 2** → Database (blocks authentication)
3. **Group 3** → Authentication (blocks dashboard)
4. **Group 4** → Landing Page (independent, can be parallel)
5. **Group 5** → File Storage (can be parallel with Group 3)
6. **Group 6** → Dashboard (depends on Groups 2, 3, 5)
7. **Group 7** → Testing (depends on all)

---

## Success Criteria

- [ ] User can sign up with email/password
- [ ] User can log in and access dashboard
- [ ] Landing page is responsive and professional
- [ ] Database has seed data (jurisdictions, sample bills)
- [ ] File upload works and stores in R2
- [ ] Bills can be viewed in dashboard
- [ ] Basic search works
- [ ] All pages are mobile-responsive
- [ ] No critical bugs or errors

---

## Notes

- Tasks can be further broken down if needed
- Some tasks may be combined for efficiency
- Testing should be done incrementally, not just at the end
- Documentation should be updated as work progresses
- Use feature branches for each group

---

**Last Updated**: [Current Date]

