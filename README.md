# RepairIt

RepairIt is a modern web application designed to be a comprehensive repair guide platform and technician marketplace. It empowers users to fix things themselves with step-by-step guides and an AI-powered troubleshooting assistant, while also providing a marketplace to find and book local, verified repair technicians.

## Features

- **Repair Guides:** Browse, search, and view detailed step-by-step repair guides with integrated tool lists and video instructions.
- **User Contributions:** Registered users can submit their own repair guides to help the community.
- **AI Troubleshooting Assistant:** A RAG-powered chatbot that uses semantic search to provide relevant troubleshooting help based on the platform's repair guides.
- **Technician Marketplace:** Find nearby verified repair technicians on an interactive map and book their services directly through the platform.
- **Reviews & Ratings:** Community-driven reviews for both guides and technicians.

## Tech Stack

- **Frontend:** Next.js (App Router), Vanilla CSS Modules
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL via Supabase
- **ORM:** Prisma
- **Authentication:** NextAuth.js (Auth.js) / Supabase Auth
- **AI / RAG:** OpenAI API (`gpt-4o-mini` & `text-embedding-3-small`), pgvector
- **Maps:** Mapbox GL JS
- **Payments/Booking:** Stripe Connect
- **Deployment:** Vercel

## Project Structure

The project implementation is organized into the following phases:
1. Static MVP & Foundation
2. Database Integration
3. User Accounts & Contributions
4. RAG Troubleshooting Assistant
5. Technician Marketplace
6. Polish, Testing & Admin Deployment

For more detailed architectural and planning information, please refer to the [PROJECT_PLAN.md](./PROJECT_PLAN.md).

## Getting Started

*(Instructions for local development will be added as the project implementation begins.)*
