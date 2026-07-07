# Claude & Cursor Rules (Masjid Miftahlul Jannah)

This project uses Next.js 16 (App Router), TypeScript, Prisma, and Tailwind CSS.
Follow these rules strictly when generating, modifying, or reviewing code.

## 1. Project Architecture
- **Directory Structure:** 
  - `app/`: Next.js App Router. Use Server Components by default.
  - `components/ui/`: Reusable basic components (Input, Button, dll).
  - `components/features/`: Feature-specific components (DonasiForm, KasChart).
  - `components/shared/`: Layout components (Navbar, Footer).
  - `lib/`: Utility functions (prisma, rate-limit, utils).
- **Styling:** We use Tailwind CSS. Maintain the "editorial luxury" aesthetic. Stick to the emerald-950, emerald-900, and off-white (#FDFBF7) color palette. Use inset shadows for cards. Do NOT introduce random arbitrary Tailwind colors unless it fits the existing theme.

## 2. Server vs Client Components
- Keep data fetching in Server Components (`async function Page()`).
- Add `"use client"` ONLY when necessary (e.g., using `useState`, `useEffect`, `onClick`, or `framer-motion`).
- When importing client-only libraries (like `@phosphor-icons/react`), import from `dist/ssr` if possible to avoid hydration mismatches.

## 3. Database & Prisma Best Practices
- **Connection Limit:** We deploy to Vercel/Serverless using Supabase PgBouncer with `connection_limit=1`. 
- **CRITICAL RULE:** Never use `Promise.all()` for concurrent Prisma queries in Server Components (e.g., `await Promise.all([prisma.user.count(), prisma.donation.count()])`). This WILL exhaust the connection pool and cause a timeout error (`P2024`).
- **SOLUTION:** Always use `await prisma.$transaction([ ... ])` to execute multiple independent reads safely using a single connection.

## 4. Security
- **Validations:** Always use `zod` for API request body validations. Remember: Zod v4 uses `.issues`, not `.errors` (`validated.error.issues[0].message`).
- **Rate Limiting:** Protect all public POST/PUT/DELETE API routes with `checkRateLimit()` from `lib/rate-limit.ts`.
- **Uploads:** Verify file magic bytes in `lib/upload.ts` to prevent extension spoofing.

## 5. Typescript
- No `any`. Use `unknown` for caught errors and type guard them (`if (err instanceof Error)`).
- Never use `@ts-ignore` or disable TypeScript build checking.
