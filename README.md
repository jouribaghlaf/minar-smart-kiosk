# Minar — Smart AI Kiosk for Pilgrims

Production-quality interactive web application simulating the Minar Smart
Kiosk, built with Next.js 15 (App Router), Prisma + PostgreSQL, and
Tailwind CSS. See `PROJECT_REQUIREMENTS.md` (provided separately) for the
full spec this implementation follows.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS (kiosk-optimized design tokens — see `tailwind.config.ts`)
- Prisma ORM + PostgreSQL
- Framer Motion, Lucide React
- Next.js API Routes as the backend layer (no separate server)

## Getting started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure the database**

   Copy `.env.example` to `.env` and point `DATABASE_URL` at a running
   PostgreSQL instance (local, Docker, or hosted — e.g. Supabase, Neon,
   Railway).

   ```bash
   cp .env.example .env
   ```

3. **Run migrations and seed data**

   ```bash
   npm run db:migrate
   npm run db:seed
   ```

4. **Start the dev server**

   ```bash
   npm run dev
   ```

   Open http://localhost:3000. You should see a temporary foundation-check
   page confirming the stack is wired correctly — the real kiosk screens
   are added in subsequent development phases.

## Project structure

See the architecture summary shared during planning; the short version:

```
prisma/            schema.prisma + seed.ts
src/app/            Next.js App Router routes + API routes
src/components/     reusable UI components (common, cards, navigation, map)
src/drawers/         AI Assistant & Accessibility drawers (global, route-independent)
src/context/         LanguageContext, AccessibilityContext, SessionContext, DrawerContext
src/hooks/           thin hooks over each context
src/lib/services/    business logic — the only layer allowed to call Prisma
src/lib/prisma.ts    Prisma client singleton
src/types/           shared TypeScript types (mirror Prisma models + DTOs)
```

## Design tokens

All colors, spacing, and typography are centralized in
`tailwind.config.ts` and derived from the approved UI screenshots. Nothing
in component code should hardcode a hex value or pixel size — extend the
token file instead so the whole app stays visually consistent and a real
brand style-guide can be dropped in later with a single-file change.

## Swapping mocks for real integrations later

Every external dependency (AI, Maps, government ID verification) is
isolated behind `src/lib/services/*`. Pages and API routes call a service
function; only that function's internals change when a real API is
connected — no UI or routing code needs to change. See the header comment
in each service file for the specific swap point.
