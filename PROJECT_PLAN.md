# RepairIt - Project Architecture & Implementation Plan

## 1. Technology Stack Recommendation

Optimized for a solo developer/small team seeking a production-ready, highly maintainable, and scalable application without over-engineering.

*   **Frontend & Backend Framework:** **Next.js (App Router)**
    *   *Reasoning:* Excellent for SEO (crucial for repair guides), built-in API routes simplify the backend by keeping it in the same repository, and fast development cycle.
*   **Database & Vector Store:** **PostgreSQL via Supabase**
    *   *Reasoning:* Supabase provides managed PostgreSQL, which is perfect for structured relational data. Crucially, it includes the `pgvector` extension, allowing you to store guide embeddings in the *same* database as your regular data, eliminating the need for a separate vector database.
*   **ORM:** **Prisma**
    *   *Reasoning:* Type-safe, excellent developer experience, and integrates seamlessly with Next.js and PostgreSQL.
*   **Authentication:** **NextAuth.js (Auth.js) or Supabase Auth**
    *   *Reasoning:* Handles OAuth (Google/GitHub) and email/password easily, integrates perfectly with Next.js and Prisma.
*   **Styling:** **Vanilla CSS Modules** (or standard CSS)
    *   *Reasoning:* Keeps styles scoped locally to components, avoiding global conflicts. 
*   **AI / RAG Assistant:** **OpenAI API (`gpt-4o-mini` & `text-embedding-3-small`)**
    *   *Reasoning:* Industry standard, easy to use, cost-effective for embeddings and basic chat completions.
*   **Maps / Geolocation:** **Mapbox GL JS**
    *   *Reasoning:* Generous free tier, excellent developer experience, and beautiful customizable map styles for technician search. Postgres/PostGIS will handle the backend spatial queries.
*   **Video Embedding:** **`lite-youtube-embed` package**
    *   *Reasoning:* Drastically improves page load performance compared to standard iframes, improving Core Web Vitals and SEO.
*   **Payments / Booking:** **Stripe Connect**
    *   *Reasoning:* Essential for marketplace dynamics (routing money to technicians while you take a platform fee) while handling tax compliance and identity verification (KYC).
*   **Hosting:** **Vercel**
    *   *Reasoning:* Zero-config deployments for Next.js, automatically handles serverless edge functions.

---

## 2. Core Database Schema

This schema is designed for a relational database (PostgreSQL) using Prisma ORM.

### Tables & Key Fields

*   **User**
    *   `id` (UUID, PK)
    *   `email` (String, Unique)
    *   `name` (String)
    *   `role` (Enum: `USER`, `TECHNICIAN`, `ADMIN`)
    *   `createdAt` (DateTime)

*   **TechnicianProfile**
    *   `id` (UUID, PK)
    *   `userId` (UUID, FK to User, Unique)
    *   `bio` (Text)
    *   `hourlyRate` (Decimal)
    *   `latitude` (Float)
    *   `longitude` (Float)
    *   `serviceRadiusKm` (Int)
    *   `isVerified` (Boolean)

*   **Category**
    *   `id` (UUID, PK)
    *   `name` (String)
    *   `slug` (String, Unique)

*   **Tool**
    *   `id` (UUID, PK)
    *   `name` (String)
    *   `affiliateLink` (String, Optional)
    *   `imageUrl` (String, Optional)

*   **Guide**
    *   `id` (UUID, PK)
    *   `title` (String)
    *   `slug` (String, Unique)
    *   `categoryId` (UUID, FK to Category)
    *   `authorId` (UUID, FK to User)
    *   `difficulty` (Enum: `EASY`, `MEDIUM`, `HARD`)
    *   `estimatedTimeMinutes` (Int)
    *   `youtubeVideoId` (String, Optional)
    *   `status` (Enum: `DRAFT`, `PENDING_REVIEW`, `PUBLISHED`)
    *   `embedding` (Vector, for pgvector similarity search)

*   **GuideStep**
    *   `id` (UUID, PK)
    *   `guideId` (UUID, FK to Guide)
    *   `stepNumber` (Int)
    *   `instruction` (Text)
    *   `imageUrl` (String, Optional)

*   **GuideTool** (Join Table)
    *   `guideId` (UUID, FK to Guide)
    *   `toolId` (UUID, FK to Tool)

*   **Booking**
    *   `id` (UUID, PK)
    *   `userId` (UUID, FK to User)
    *   `technicianId` (UUID, FK to TechnicianProfile)
    *   `status` (Enum: `PENDING`, `ACCEPTED`, `COMPLETED`, `CANCELLED`)
    *   `scheduledAt` (DateTime)
    *   `description` (Text)

*   **Review**
    *   `id` (UUID, PK)
    *   `reviewerId` (UUID, FK to User)
    *   `targetId` (UUID - Polymorphic, can be Guide or Technician)
    *   `targetType` (Enum: `GUIDE`, `TECHNICIAN`)
    *   `rating` (Int 1-5)
    *   `comment` (Text)

---

## 3. Core API Endpoints

Using Next.js API Routes (`/app/api/...`):

### Guides & Content
*   `GET /api/categories` - List all categories
*   `GET /api/guides` - List/search published guides (Query params: category, difficulty, search term)
*   `GET /api/guides/[slug]` - Get specific guide details, including its steps and tools
*   `POST /api/guides` - Submit a new user-generated guide (Requires Auth)

### AI Assistant
*   `POST /api/chat` - Accepts a user query, generates an embedding, performs a pgvector similarity search on `Guide.embedding`, and returns a grounded streaming AI response.

### Technicians & Market
*   `GET /api/technicians` - Search technicians (Query params: lat, lng, radius, category)
*   `GET /api/technicians/[id]` - Get technician profile and their reviews
*   `POST /api/bookings` - Request a booking (Requires Auth)
*   `PATCH /api/bookings/[id]` - Accept/Cancel booking (Requires Auth)

### Admin
*   `GET /api/admin/guides/pending` - List user-submitted guides pending review
*   `PATCH /api/admin/guides/[id]/status` - Approve or reject a guide

---

## 4. Phased Implementation Plan

This section outlines a fully synchronized, step-by-step phased approach. Each phase lays the groundwork for the next, detailing the goals, terminal commands for library installments, and the file structures to create.

### Phase 1: Foundation & Project Setup
*   **Goal:** Initialize the Next.js project, install core dependencies, and establish a scalable file structure.
*   **Step-by-Step:**
    1.  **Initialize Project:** Run `npx create-next-app@latest ./` (Select TypeScript, ESLint, App Router, and your preferred styling option like Vanilla CSS Modules or Tailwind).
    2.  **Library Installments:**
        *   `npm install lucide-react` (Icons)
        *   `npm install clsx tailwind-merge` (Utility for class merging if using Tailwind, otherwise skip)
    3.  **Establish File Structure:** Create the following baseline structure:
        *   `src/app/` (Next.js app router pages)
        *   `src/components/ui/` (Reusable base components like Buttons, Inputs)
        *   `src/components/layout/` (Navbar, Footer, Sidebar)
        *   `src/lib/` (Utility functions, constants)
        *   `src/types/` (TypeScript interfaces)
        *   `src/assets/` (Static images, fonts)
*   **Files to Create:**
    *   `src/app/layout.tsx` & `src/app/page.tsx` (Initial layout and homepage)
    *   `src/components/layout/Navbar.tsx` & `src/components/layout/Footer.tsx`

### Phase 2: Mock Data & Static UI Implementation
*   **Goal:** Build the core UI components and page layouts using hardcoded mock data to validate the design before backend integration.
*   **Step-by-Step:**
    1.  **Define Mock Data:** Create mock JSON objects representing guides, categories, and technicians.
    2.  **Library Installments:**
        *   `npm install lite-youtube-embed` (For performant video embeds)
    3.  **Build UI Components:** Implement reusable elements like `GuideCard`, `CategoryPill`, and `TechnicianCard`.
    4.  **Develop Pages:** Build out the static UI for the Homepage, Search results, and Guide Detail pages.
*   **Files to Create:**
    *   `src/data/mockGuides.ts` & `src/data/mockTechnicians.ts`
    *   `src/components/ui/GuideCard.tsx`
    *   `src/components/ui/TechnicianCard.tsx`
    *   `src/app/guides/[slug]/page.tsx` (Static representation of guide steps/tools)

### Phase 3: Database & ORM Integration
*   **Goal:** Replace mock data with a live PostgreSQL database via Supabase and Prisma ORM.
*   **Step-by-Step:**
    1.  **Setup Supabase:** Create a new Supabase project, enable `pgvector` extension, and obtain the Postgres connection string.
    2.  **Library Installments:**
        *   `npm install prisma --save-dev`
        *   `npm install @prisma/client`
    3.  **Initialize Prisma:** Run `npx prisma init`.
    4.  **Define Schema:** Update `prisma/schema.prisma` with the complete database schema.
    5.  **Migrate Database:** Run `npx prisma migrate dev --name init`.
    6.  **Create API Routes:** Build API routes or Server Actions to fetch data dynamically from the database.
*   **Files to Create:**
    *   `prisma/schema.prisma`
    *   `src/lib/db.ts` (Prisma singleton client instantiation)
    *   `src/app/api/guides/route.ts` (Dynamic data fetching)

### Phase 4: Authentication & User Accounts
*   **Goal:** Implement user registration, login, protected routes, and user dashboards.
*   **Step-by-Step:**
    1.  **Configure Auth Providers:** Set up Google/GitHub OAuth apps and configure email providers.
    2.  **Library Installments:**
        *   `npm install next-auth`
        *   `npm install @auth/prisma-adapter`
    3.  **Setup NextAuth:** Implement the NextAuth configuration and wrap the app in a Session Provider (if needed for client components).
    4.  **Develop Auth Pages:** Build Login and Registration forms.
    5.  **Protect Routes:** Add Next.js middleware to protect user-specific pages.
*   **Files to Create:**
    *   `src/app/api/auth/[...nextauth]/route.ts`
    *   `src/app/login/page.tsx`
    *   `src/middleware.ts`
    *   `src/app/dashboard/page.tsx`

### Phase 5: Guide Submission & AI RAG Integration
*   **Goal:** Allow users to create guides and integrate the semantic AI troubleshooting assistant.
*   **Step-by-Step:**
    1.  **Develop Submission Form:** Create a multi-step form for submitting guides, writing steps, and selecting tools.
    2.  **Library Installments:**
        *   `npm install openai ai` (Vercel AI SDK and OpenAI client)
    3.  **Embeddings Setup:** Write utilities to generate text embeddings when a guide is published and store them in the `pgvector` enabled database.
    4.  **Build Chat API:** Implement the backend route to handle vector similarity search and streaming OpenAI responses.
    5.  **Create Chat UI:** Build the user-facing AI chat interface for troubleshooting.
*   **Files to Create:**
    *   `src/app/guides/submit/page.tsx`
    *   `src/lib/openai.ts` & `src/lib/embeddings.ts`
    *   `src/app/api/chat/route.ts`
    *   `src/app/troubleshoot/page.tsx`
    *   `src/components/ui/ChatBubble.tsx`

### Phase 6: Technician Marketplace & Geolocation
*   **Goal:** Add technician discovery, interactive mapping, and booking capabilities.
*   **Step-by-Step:**
    1.  **Integrate Maps:** Set up a Mapbox account and obtain API tokens.
    2.  **Library Installments:**
        *   `npm install mapbox-gl`
        *   `npm install stripe @stripe/stripe-js` (For booking payments, platform fees, and KYC)
    3.  **Implement Map UI:** Render an interactive map showing pins for nearby technicians based on user location.
    4.  **Spatial Queries:** Implement backend spatial queries to find technicians within a specific radius.
    5.  **Booking Flow:** Create the UI and backend logic for requesting, accepting, and managing bookings.
*   **Files to Create:**
    *   `src/app/technicians/page.tsx`
    *   `src/components/ui/Map.tsx`
    *   `src/app/api/technicians/route.ts`
    *   `src/app/technicians/[id]/book/page.tsx`
    *   `src/app/api/bookings/route.ts`

### Phase 7: Polish, Testing & Deployment
*   **Goal:** Finalize moderation tools, write automated tests, and deploy the application to production.
*   **Step-by-Step:**
    1.  **Admin Dashboard:** Create an admin interface for approving or rejecting user-submitted guides.
    2.  **Library Installments:**
        *   `npm install vitest --save-dev` (Unit testing)
        *   `npm init playwright@latest` (E2E testing)
    3.  **Write Tests:** Implement unit tests for core logic and E2E tests for critical user paths (e.g., booking a technician, chatting with AI).
    4.  **Deploy to Vercel:** Push code to GitHub, connect to Vercel, and configure environment variables.
    5.  **Database Migration:** Run final production database migrations.
*   **Files to Create:**
    *   `src/app/admin/page.tsx`
    *   `tests/guides.test.ts`
    *   `playwright.config.ts`

---

## 5. Testing & Deployment Strategy

### Testing
*   **Unit/Integration Tests:** Use `Vitest` to test business logic (e.g., verifying booking date validity, ensuring the RAG context builder returns the correct top-k guides).
*   **End-to-End (E2E) Tests:** Use `Playwright` to test critical user paths on a staging database:
    *   *Path A:* User signs up -> browses a guide -> interacts with the AI troubleshooting assistant.
    *   *Path B:* Technician creates a profile -> Sets location -> User finds technician on map -> User books technician.

### Deployment Steps (via Vercel)
1.  Push the finalized code to a GitHub repository.
2.  Connect the GitHub repository to a new Vercel project.
3.  Set necessary Environment Variables in the Vercel dashboard (`DATABASE_URL`, `NEXTAUTH_SECRET`, `OPENAI_API_KEY`, `MAPBOX_TOKEN`, etc.).
4.  Vercel will automatically build and deploy the `main` branch.
5.  Run database migrations against the production Supabase database (`npx prisma migrate deploy`).

---

## 6. Legal & Content Considerations

*   **Safety Disclaimers:** DIY repair involves significant risks (especially electrical or plumbing repairs). Every guide must have a prominent disclaimer: *"RepairIt provides guides for informational purposes only. Proceed at your own risk. Unplug electrical devices before starting any repair."*
*   **Technician Liability:** The Terms of Service must clearly state that RepairIt acts solely as a *directory/marketplace* and is not liable for property damage or injuries caused by independent technicians.
*   **Content Copyright:** Ensure user-submitted guides are original. Implement a Terms of Service stating users own their submissions but grant RepairIt an irrevocable license to display them. Do NOT scrape guides from existing sites like iFixit.
*   **Video Embedding ToS:** By using the standard YouTube embed API (or `lite-youtube-embed`), you comply with YouTube's Terms of Service since you are not rehosting or downloading their content.
*   **Affiliate Disclosures:** If you embed Amazon or other affiliate links for tools/materials, you must prominently display an FTC disclosure on the guide page (e.g., *"We may earn a commission from purchases made through our affiliate links."*).
*   **Payments & KYC:** If taking a percentage cut of technician bookings, you must use a service like Stripe Connect to handle KYC (Know Your Customer) identity verification to comply with money transmission regulations.
