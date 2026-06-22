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

### Phase 1: Foundation & Project Setup
*   **Goal:** Initialize the Next.js frontend and FastAPI backend repositories/folders.
*   **Step-by-Step:**
    1.  **Backend Init:** Create `backend` folder, set up virtual environment (`python -m venv venv`), and install FastAPI: `pip install fastapi uvicorn pydantic`.
    2.  **Frontend Init:** Create `frontend` folder, run `npx create-next-app@latest ./` (Select App Router).
    3.  **Basic Routing:** Setup `/api/v1/health` endpoint in FastAPI and ensure the frontend can fetch from it.

### Phase 2: Database & ORM Integration (Backend)
*   **Goal:** Set up Supabase PostgreSQL, SQLAlchemy, and Alembic.
*   **Step-by-Step:**
    1.  **Setup Supabase:** Create a project, enable `pgvector`, get connection string.
    2.  **Install DB Packages:** `pip install sqlalchemy alembic asyncpg psycopg2-binary pgvector`.
    3.  **Define Models:** Write SQLAlchemy declarative models for Users, Guides, Technicians, etc.
    4.  **Migrations:** Initialize Alembic (`alembic init alembic`), configure it to read your SQLAlchemy metadata, and run the first migration.
    5.  **CRUD Operations:** Write Pydantic schemas and database CRUD functions.

### Phase 3: Static UI & Mock Integration (Frontend)
*   **Goal:** Build the Next.js UI using mocked API calls.
*   **Step-by-Step:**
    1.  **UI Components:** Build `GuideCard`, `TechnicianCard`, etc.
    2.  **Pages:** Develop Homepage, Search, Guide Detail pages.
    3.  **Connect to Backend:** Gradually replace mock data with fetch calls to your running FastAPI backend.

### Phase 4: Authentication & User Accounts
*   **Goal:** Secure the API and UI.
*   **Step-by-Step:**
    1.  **Backend Auth:** Configure FastAPI to validate JWT tokens. You can use Supabase Auth to handle token generation, and FastAPI `Depends` to verify the JWT in protected routes.
    2.  **Frontend Auth:** Integrate Supabase JS client to handle login/signup and store the session.
    3.  **Protect UI Routes:** Add Next.js middleware to block unauthenticated users from `/dashboard`.

### Phase 5: AI RAG & Guide Submission
*   **Goal:** Implement guide creation and the AI assistant in Python.
*   **Step-by-Step:**
    1.  **Install AI Packages:** `pip install openai`.
    2.  **Backend Embeddings:** When a POST request is made to create a guide, trigger OpenAI API to generate an embedding and save it to the `pgvector` column.
    3.  **Chat Endpoint:** Implement `/api/v1/chat`. Use pgvector to find similar guides, build a prompt context, and return a streaming response using FastAPI's `StreamingResponse`.
    4.  **Frontend Chat UI:** Build the Chat interface and handle the text stream.

### Phase 6: Technician Marketplace & Geolocation
*   **Goal:** Add maps and Stripe integration.
*   **Step-by-Step:**
    1.  **Backend Spatial:** Add bounding box math or PostGIS queries in SQLAlchemy to find technicians nearby.
    2.  **Stripe API:** `pip install stripe`. Add endpoints for creating payment intents and managing Connected accounts.
    3.  **Frontend Map:** Integrate `mapbox-gl` into Next.js.
    4.  **Booking Flow:** Complete the frontend and backend loop for requesting bookings.

### Phase 7: Polish, Testing & Deployment
*   **Goal:** Unit tests and production deployment.
*   **Step-by-Step:**
    1.  **Backend Testing:** Write `pytest` fixtures for database and endpoint testing.
    2.  **Frontend Testing:** Use `Playwright` for E2E tests.
    3.  **Deployment:** Deploy Next.js to Vercel. Deploy FastAPI app to Render, Railway, or Heroku via a Dockerfile or standard Python buildpacks.

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
