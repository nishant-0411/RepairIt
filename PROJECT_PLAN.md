# RepairIt - Project Architecture & Implementation Plan

## Suggested File Structure

```text
RepairIt/
├── PROJECT_PLAN.md
├── README.md
├── frontend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.mjs
│   ├── tailwind.config.ts
│   ├── middleware.ts
│   ├── playwright.config.ts
│   ├── tests/
│   │   └── guides.test.ts
│   └── src/
│       ├── app/
│       │   ├── layout.tsx
│       │   ├── page.tsx
│       │   ├── login/
│       │   ├── dashboard/
│       │   ├── troubleshoot/
│       │   ├── technicians/
│       │   └── guides/
│       ├── components/
│       │   ├── ui/
│       │   └── layout/
│       ├── lib/
│       └── types/
└── backend/
    ├── requirements.txt
    ├── alembic.ini
    ├── main.py
    ├── tests/
    │   └── test_guides.py
    ├── alembic/
    │   └── versions/
    └── app/
        ├── api/
        │   ├── v1/
        │   │   ├── endpoints/
        │   │   │   ├── auth.py
        │   │   │   ├── chat.py
        │   │   │   ├── guides.py
        │   │   │   ├── technicians.py
        │   │   │   └── bookings.py
        │   │   └── api.py
        ├── core/
        │   ├── config.py
        │   └── security.py
        ├── models/
        │   └── domain.py
        ├── schemas/
        │   ├── guide.py
        │   ├── user.py
        │   └── technician.py
        ├── services/
        │   ├── ai.py
        │   └── mapbox.py
        └── db/
            ├── session.py
            └── base.py
```

## 1. Technology Stack Recommendation

Optimized for a developer with Python and FastAPI knowledge, maintaining a highly scalable decoupled architecture.

*   **Backend Framework:** **FastAPI (Python)**
    *   *Reasoning:* High performance, extremely fast development, automatic interactive API documentation (Swagger UI), and native asynchronous support perfect for AI integrations and external API calls.
*   **Frontend Framework:** **Next.js (App Router)**
    *   *Reasoning:* Excellent for SEO (crucial for repair guides), fast page loads, and modern React features. It will consume the FastAPI backend.
*   **Database & Vector Store:** **PostgreSQL via Supabase**
    *   *Reasoning:* Supabase provides managed PostgreSQL, which is perfect for structured relational data. Crucially, it includes the `pgvector` extension, allowing you to store guide embeddings in the *same* database as your regular data.
*   **ORM:** **SQLAlchemy 2.0 & Alembic (Python)**
    *   *Reasoning:* The standard ORM in the Python ecosystem. SQLAlchemy 2.0 supports async database queries, and Alembic handles robust database migrations.
*   **Authentication:** **Supabase Auth or FastAPI Users**
    *   *Reasoning:* Supabase handles OAuth and email/password securely. FastAPI can verify the JWT tokens sent by the frontend via middleware.
*   **AI / RAG Assistant:** **OpenAI API (`gpt-4o-mini` & `text-embedding-3-small`)**
    *   *Reasoning:* Easily integrated via the official `openai` Python package or `langchain` in the FastAPI backend for RAG and semantic search.
*   **Maps / Geolocation:** **Mapbox GL JS**
    *   *Reasoning:* Generous free tier, excellent developer experience. FastAPI backend will handle spatial queries using PostGIS or math-based bounding boxes.
*   **Payments / Booking:** **Stripe Connect**
    *   *Reasoning:* Stripe's Python SDK is excellent for handling marketplace dynamics, routing money, and KYC identity verification.
*   **Hosting:** **Vercel (Frontend) & Render/Railway (Backend)**
    *   *Reasoning:* Vercel is best-in-class for Next.js. Render or Railway provide simple Docker-based or native Python deployments for the FastAPI application.

---

## 2. Core Database Schema

This schema is designed for a relational database (PostgreSQL) using SQLAlchemy ORM.

### Tables & Key Fields

*   **User**
    *   `id` (UUID, PK)
    *   `email` (String, Unique)
    *   `name` (String)
    *   `role` (Enum: `USER`, `TECHNICIAN`, `ADMIN`)
    *   `created_at` (DateTime)

*   **TechnicianProfile**
    *   `id` (UUID, PK)
    *   `user_id` (UUID, FK to User, Unique)
    *   `bio` (Text)
    *   `hourly_rate` (Decimal)
    *   `latitude` (Float)
    *   `longitude` (Float)
    *   `service_radius_km` (Int)
    *   `is_verified` (Boolean)

*   **Category**
    *   `id` (UUID, PK)
    *   `name` (String)
    *   `slug` (String, Unique)

*   **Tool**
    *   `id` (UUID, PK)
    *   `name` (String)
    *   `affiliate_link` (String, Optional)
    *   `image_url` (String, Optional)

*   **Guide**
    *   `id` (UUID, PK)
    *   `title` (String)
    *   `slug` (String, Unique)
    *   `category_id` (UUID, FK to Category)
    *   `author_id` (UUID, FK to User)
    *   `difficulty` (Enum: `EASY`, `MEDIUM`, `HARD`)
    *   `estimated_time_minutes` (Int)
    *   `youtube_video_id` (String, Optional)
    *   `status` (Enum: `DRAFT`, `PENDING_REVIEW`, `PUBLISHED`)
    *   `embedding` (Vector, pgvector type)

*   **GuideStep**
    *   `id` (UUID, PK)
    *   `guide_id` (UUID, FK to Guide)
    *   `step_number` (Int)
    *   `instruction` (Text)
    *   `image_url` (String, Optional)

*   **GuideTool** (Join Table)
    *   `guide_id` (UUID, FK to Guide)
    *   `tool_id` (UUID, FK to Tool)

*   **Booking**
    *   `id` (UUID, PK)
    *   `user_id` (UUID, FK to User)
    *   `technician_id` (UUID, FK to TechnicianProfile)
    *   `status` (Enum: `PENDING`, `ACCEPTED`, `COMPLETED`, `CANCELLED`)
    *   `scheduled_at` (DateTime)
    *   `description` (Text)

---

## 3. Core API Endpoints (FastAPI)

Using FastAPI Routers under `/api/v1`:

### Guides & Content
*   `GET /api/v1/categories` - List all categories
*   `GET /api/v1/guides` - List/search published guides (Query params: category, difficulty, search)
*   `GET /api/v1/guides/{slug}` - Get specific guide details, including its steps and tools
*   `POST /api/v1/guides` - Submit a new user-generated guide (Requires Auth token)

### AI Assistant
*   `POST /api/v1/chat` - Accepts user query, generates embedding via OpenAI, performs pgvector similarity search on `Guide.embedding` via SQLAlchemy, and returns streaming response.

### Technicians & Market
*   `GET /api/v1/technicians` - Search technicians (Query params: lat, lng, radius, category)
*   `GET /api/v1/technicians/{id}` - Get technician profile and reviews
*   `POST /api/v1/bookings` - Request a booking (Requires Auth token)
*   `PATCH /api/v1/bookings/{id}` - Accept/Cancel booking (Requires Auth token)

### Admin
*   `GET /api/v1/admin/guides/pending` - List user-submitted guides pending review
*   `PATCH /api/v1/admin/guides/{id}/status` - Approve or reject a guide

---

## 4. Phased Implementation Plan

### Phase 1 - Foundation & Project Setup
**Goal:** Initialize the Next.js frontend and FastAPI backend repositories/folders with basic routing and health checks.

**Files to create and what to write in it:**
- `frontend/package.json`: Define frontend scripts and dependencies.
- `frontend/tsconfig.json`: TypeScript compiler configuration for Next.js.
- `frontend/tailwind.config.ts`: TailwindCSS theme configuration.
- `frontend/src/app/layout.tsx`: Root layout containing the global navbar, footer, and font imports.
- `frontend/src/app/page.tsx`: Landing page with calls-to-action for troubleshooting and finding technicians.
- `backend/requirements.txt`: List of Python dependencies.
- `backend/main.py`: FastAPI application setup, CORS configuration, and a `/api/v1/health` endpoint.
- `backend/app/api/v1/api.py`: FastAPI router aggregating all v1 endpoint routers.
- `backend/app/core/config.py`: Pydantic settings management for environment variables.

**Install in this phase:**
- **Frontend:** `next`, `react`, `react-dom`, `tailwindcss`, `postcss`, `autoprefixer`, `typescript`, `@types/node`, `@types/react`
- **Backend:** `fastapi`, `uvicorn`, `pydantic`, `pydantic-settings`

### Phase 2 - Database & ORM Integration (Backend)
**Goal:** Set up Supabase PostgreSQL, SQLAlchemy ORM, pgvector for AI, and Alembic migrations.

**Files to create and what to write in it:**
- `backend/alembic.ini`: Alembic configuration file pointing to the database URL.
- `backend/app/db/session.py`: SQLAlchemy engine setup and `get_db` dependency for routes.
- `backend/app/db/base.py`: Base class for declarative models and imports to expose models to Alembic.
- `backend/app/models/domain.py`: SQLAlchemy models for `User`, `TechnicianProfile`, `Category`, `Tool`, `Guide`, `GuideStep`, and `Booking`.
- `backend/app/schemas/user.py`: Pydantic schemas for User creation and responses.
- `backend/app/schemas/guide.py`: Pydantic schemas for Guide submission and retrieval.
- `backend/app/schemas/technician.py`: Pydantic schemas for Technician profiles.

**Install in this phase:**
- **Backend:** `sqlalchemy`, `alembic`, `asyncpg`, `psycopg2-binary`, `pgvector`

### Phase 3 - Static UI & Mock Integration (Frontend)
**Goal:** Build the Next.js UI using mocked API calls before connecting the real database routes.

**Files to create and what to write in it:**
- `frontend/src/components/ui/GuideCard.tsx`: Reusable component displaying guide title, difficulty, and thumbnail.
- `frontend/src/components/ui/TechnicianCard.tsx`: Reusable component displaying technician name, rating, and rate.
- `frontend/src/app/guides/page.tsx`: Guides directory page with filtering UI (category, difficulty).
- `frontend/src/app/guides/[slug]/page.tsx`: Individual guide detail page showing steps and tools.
- `frontend/src/app/technicians/page.tsx`: Technicians directory page for searching nearby pros.

**Install in this phase:**
- **Frontend:** `lucide-react`, `clsx`, `tailwind-merge` (optional shadcn/ui utilities)

### Phase 4 - Authentication & User Accounts
**Goal:** Secure the API and UI using Supabase Auth or standard JWTs.

**Files to create and what to write in it:**
- `backend/app/api/v1/endpoints/auth.py`: Endpoints to handle user registration, login, and token generation/validation.
- `backend/app/core/security.py`: JWT encoding/decoding and password hashing logic.
- `frontend/middleware.ts`: Next.js middleware to protect routes like `/dashboard` from unauthenticated users.
- `frontend/src/app/login/page.tsx`: Login and signup forms.
- `frontend/src/app/dashboard/page.tsx`: User dashboard to view saved guides, active bookings, and submitted guides.
- `frontend/src/lib/auth.ts`: Supabase client initialization for the frontend.

**Install in this phase:**
- **Backend:** `passlib[bcrypt]`, `pyjwt`
- **Frontend:** `@supabase/supabase-js`, `@supabase/ssr`

### Phase 5 - AI RAG & Guide Submission
**Goal:** Implement user guide creation and the AI troubleshooting assistant.

**Files to create and what to write in it:**
- `backend/app/api/v1/endpoints/guides.py`: Endpoints to CRUD guides, triggering embeddings upon guide creation.
- `backend/app/api/v1/endpoints/chat.py`: Endpoint accepting user troubleshooting queries, doing pgvector similarity search, and streaming AI responses.
- `backend/app/services/ai.py`: Abstraction logic interacting with the OpenAI API for embeddings and chat completions.
- `frontend/src/app/troubleshoot/page.tsx`: Chat UI interface utilizing the Vercel AI SDK to stream troubleshooting assistance.

**Install in this phase:**
- **Backend:** `openai`
- **Frontend:** `ai` (Vercel AI SDK)

### Phase 6 - Technician Marketplace & Geolocation
**Goal:** Add maps and Stripe integration for technician booking.

**Files to create and what to write in it:**
- `backend/app/api/v1/endpoints/technicians.py`: Endpoints to query technicians by spatial bounding boxes.
- `backend/app/api/v1/endpoints/bookings.py`: Endpoints handling Stripe Connect payments, booking creation, and status updates.
- `backend/app/services/mapbox.py`: Optional helper service to interact with external map APIs if reverse geocoding is needed.
- `frontend/src/components/ui/Map.tsx`: Interactive map component displaying technician pins.

**Install in this phase:**
- **Backend:** `stripe`
- **Frontend:** `mapbox-gl`, `react-map-gl`, `@stripe/stripe-js`, `@stripe/react-stripe-js`

### Phase 7 - Polish, Testing & Deployment
**Goal:** Implement unit tests and prepare for production deployment.

**Files to create and what to write in it:**
- `backend/tests/test_guides.py`: Pytest file for testing guide CRUD and embedding generation.
- `frontend/playwright.config.ts`: E2E testing configuration.
- `frontend/tests/guides.test.ts`: Playwright test to verify a user can view a guide end-to-end.

**Install in this phase:**
- **Backend:** `pytest`, `httpx`
- **Frontend:** `@playwright/test`

---

## 5. Testing & Deployment Strategy

### Testing
*   **Backend (FastAPI):** Use `pytest` alongside `httpx` to test API routes. Use an in-memory SQLite database or a test PostgreSQL instance for database testing.
*   **Frontend (Next.js):** Use `Playwright` to test critical user paths across the frontend, mocking backend API responses if necessary.

### Deployment Steps
1.  **Frontend:** Connect the `frontend` folder to Vercel. Configure the `NEXT_PUBLIC_API_URL` environment variable to point to the backend deployment.
2.  **Backend:** Create a `Dockerfile` or use native Python hosting (like Render). Set `DATABASE_URL` (Supabase), `OPENAI_API_KEY`, and `STRIPE_SECRET_KEY` in the hosting environment variables.
3.  **Migrations:** Ensure Alembic migrations are run during the backend CI/CD deployment phase before the app starts (`alembic upgrade head`).

---

## 6. Legal & Content Considerations

*   **Safety Disclaimers:** DIY repair involves significant risks. Every guide must have a prominent disclaimer: *"RepairIt provides guides for informational purposes only. Proceed at your own risk."*
*   **Technician Liability:** The Terms of Service must clearly state that RepairIt acts solely as a *directory/marketplace* and is not liable for property damage or injuries caused by independent technicians.
*   **Content Copyright:** Ensure user-submitted guides are original.
*   **Payments & KYC:** If taking a percentage cut of technician bookings, you must use a service like Stripe Connect to handle KYC (Know Your Customer) identity verification to comply with money transmission regulations.
