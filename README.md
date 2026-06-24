# RepairIt

RepairIt is a modern web application designed to be your ultimate solution for home device repairs. Whenever a device breaks down, RepairIt provides a seamless flow to diagnose the problem and choose the best path forward: call a professional or fix it yourself.

## How It Works (The Flow)

1. **Select Device:** Choose the device that needs repair.
2. **Describe Problem:** Tell us what's wrong with it.
3. **Choose Option:** Decide between two paths to get your solution.

### 🔧 Option 1: Call a Technician (Technician Bulao)
For when you want professional help right at your doorstep.
- View nearby repair shops and technicians on an interactive map.
- Get direct phone numbers and request at-home repair service.
- See estimated charges upfront before booking.

### 🛠️ Option 2: Do It Yourself (Khud Repair Karo)
For those who prefer to fix things themselves.
- **If you have the tools:** Access detailed step-by-step guides along with curated YouTube tutorial videos.
- **If you don't have the tools:** Get direct purchase links for all the exact tools and replacement parts needed for the repair.

## Core Features

- **Intuitive Flow:** Device select → Problem diagnosis → Solution selection.
- **Repair Guides:** Comprehensive step-by-step instructions and video integration.
- **Affiliate Links:** Direct purchase links for required tools and parts.
- **Technician Marketplace:** Find nearby verified technicians and book their services.
- **Upfront Pricing:** Estimated repair costs provided transparently.
- **AI Troubleshooting Assistant:** A RAG-powered chatbot for advanced troubleshooting.

## Tech Stack

- **Frontend:** Next.js (App Router), Vanilla CSS Modules
- **Backend:** FastAPI (Python)
- **Database:** PostgreSQL via Supabase
- **ORM:** SQLAlchemy 2.0 & Alembic
- **Authentication:** Supabase Auth / FastAPI Users
- **AI / RAG:** OpenAI API (`gpt-4o-mini` & `text-embedding-3-small`), pgvector
- **Maps:** Mapbox GL JS / Google Maps API
- **Payments/Booking:** Stripe Connect
- **Deployment:** Vercel (Frontend), Render/Railway (Backend)

## Project Structure

The project implementation is organized into the following phases:
1. Foundation & Project Setup
2. Database & ORM Integration
3. Static UI & Mock Integration
4. Authentication & User Accounts
5. AI RAG & Guide Submission
6. Technician Marketplace & Geolocation
7. Polish, Testing & Deployment

For more detailed architectural and planning information, please refer to the [PROJECT_PLAN.md](./PROJECT_PLAN.md).

## Getting Started

