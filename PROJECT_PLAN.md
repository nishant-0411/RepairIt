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

### Phase 1: Static MVP & Foundation
*   **Goal:** Set up the Next.js project structure, design the core UI layout, and display hardcoded guide data to establish the visual aesthetic.
*   **Files/Folders to Create/Modify:**
    *   `package.json` (Initialize Next.js)
    *   `app/layout.tsx` (Root layout, global CSS, navbar, footer)
    *   `app/page.tsx` (Homepage with search bar, categories, and featured guides)
    *   `app/guides/[slug]/page.tsx` (Guide detail page UI for steps and tools)
    *   `components/GuideCard.tsx` (Reusable UI component for listing guides)
    *   `data/mockGuides.ts` (Hardcoded JSON data for testing UI without a DB)
*   **Third-Party:** `lite-youtube-embed` (for performant video UI).

### Phase 2: Database Integration
*   **Goal:** Replace hardcoded mock data with a live PostgreSQL database and establish the schema.
*   **Files/Folders to Create/Modify:**
    *   `prisma/schema.prisma` (Define the database schema from Section 2)
    *   `lib/db.ts` (Prisma client singleton instantiation)
    *   `app/api/guides/route.ts` (API to fetch guides from DB)
    *   `app/guides/[slug]/page.tsx` (Update to fetch data dynamically via API/Server Components)
*   **Third-Party:** Supabase (Database hosting), Prisma ORM.

### Phase 3: User Accounts & Contributions
*   **Goal:** Allow users to sign up, log in, save favorite guides, and submit their own guides.
*   **Files/Folders to Create/Modify:**
    *   `app/api/auth/[...nextauth]/route.ts` (NextAuth configuration)
    *   `app/login/page.tsx` (Login UI with OAuth/Email providers)
    *   `app/guides/submit/page.tsx` (Multi-step form for users to write instructions and select tools)
    *   `app/api/guides/route.ts` (Add POST method to handle guide DB insertions)
    *   `app/dashboard/page.tsx` (User dashboard to view saved/submitted guides)
*   **Third-Party:** NextAuth.js.

### Phase 4: RAG Troubleshooting Assistant
*   **Goal:** Implement the AI chatbot that retrieves relevant guides based on semantic vector search.
*   **Files/Folders to Create/Modify:**
    *   `lib/openai.ts` (OpenAI client setup)
    *   `lib/embeddings.ts` (Utility to generate embeddings for guides when published)
    *   `app/api/chat/route.ts` (Handles chat logic: Vector DB search -> Context assembly -> Streaming OpenAI response)
    *   `app/troubleshoot/page.tsx` (Chatbot UI interface)
    *   `components/ChatBubble.tsx` (Individual chat message UI component)
*   **Third-Party:** OpenAI API, Vercel AI SDK (for UI stream handling), Supabase `pgvector`.

### Phase 5: Technician Marketplace
*   **Goal:** Add location-based technician search and service booking capabilities.
*   **Files/Folders to Create/Modify:**
    *   `app/technicians/page.tsx` (Interactive map and list view of nearby technicians)
    *   `components/Map.tsx` (Mapbox rendering component)
    *   `app/api/technicians/route.ts` (Backend PostGIS spatial query to find technicians within radius)
    *   `app/technicians/[id]/book/page.tsx` (Booking request form)
    *   `app/api/bookings/route.ts` (Handle booking DB transactions)
*   **Third-Party:** Mapbox GL JS, Stripe Connect (if integrating payments directly).

### Phase 6: Polish, Testing & Admin Deployment
*   **Goal:** Finalize moderation tools, write automated tests, and deploy to production.
*   **Files/Folders to Create/Modify:**
    *   `app/admin/page.tsx` (Dashboard for admins to approve/reject user guides)
    *   `tests/guides.test.ts` (Unit tests for core guide submission logic)
    *   `playwright.config.ts` (E2E testing setup)
*   **Third-Party:** Vercel (Hosting Platform).

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
