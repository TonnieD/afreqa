# Antigravity Kickoff Prompt — Afreqa Website

> Paste everything below the line into Antigravity. Before you do: put `PRD.md` and `IMPLEMENTATION_PLAN.md` in `projects/afreqa-website/docs/`, the logo in `projects/afreqa-website/assets/brand/`, and (optionally) exported photos/videos in `projects/afreqa-website/seed-media/`.

---

You are the lead full-stack engineer building the official website for **Afreqa**, a Nairobi EDM event brand. This is an unpaid showcase project that will be demoed to the Afreqa team for approval, so it must run end-to-end locally with seed data and no external accounts.

## 1. Read first
Before doing anything, read in full:
- `docs/PRD.md` — the requirements and source of truth for scope
- `docs/IMPLEMENTATION_PLAN.md` — a draft phased plan that you will refine and keep updated
- Anything in `assets/brand/` (logo) and `seed-media/` (demo media)

## 2. Non-negotiables
- **Database: PostgreSQL. Containerisation: Docker + Docker Compose.** Everything (web, worker, db, mailpit, proxy) runs via compose; `make dev` must boot the whole stack.
- **Stack:** Next.js (App Router, TypeScript strict) full-stack, Tailwind + shadcn/ui + Framer Motion, Prisma, Zod, pg-boss, Nodemailer + React Email, sharp, ffmpeg, tus resumable uploads, Caddy. If you believe a different choice is materially better for any layer other than Postgres/Docker, propose it in the plan with a short justification instead of silently switching.
- **Hybrid ticketing for v1:** "Get Tickets" buttons go through an internal `/go/tickets/:slug` route that logs the click and redirects to the configured external HustleSasa URL (`https://afreqanairobi.hustlesasa.shop/`, configurable in site settings). Ticket **phases** (Early Bird, Phase 1, Final Release, Gate…) are admin-defined with status and *optional* price; never hard-code prices. Native checkout is Phase 7 — design the schema for it, don't build it.
- **WhatsApp, cheapest-first:** no paid API in v1. Phone opt-in with separate consent, community/channel link, click-to-chat, CSV export of opted-in numbers, and a `MessagingProvider` interface with a manual implementation and a stubbed Cloud API one.
- **The site sends its own email** (double opt-in, welcome, campaigns, transactional) via SMTP through a queue with retries; Mailpit in dev; provider chosen later by Afreqa.
- **Gallery:** photo uploads (processed with sharp, EXIF stripped), video **embeds** (YouTube/Vimeo/Instagram) and large resumable video **uploads** for edited after-movies (ffmpeg worker → poster + web MP4 renditions, status shown in admin).
- **Merch shop is built but feature-flagged OFF by default**, with a `PaymentProvider` abstraction, a `MockProvider` for the demo and a Paystack (sandbox) implementation.
- **Admin panel with RBAC:** SUPER_ADMIN, ADMIN, EDITOR, SUPPORT; permissions enforced server-side; every mutation audit-logged.
- **Design:** Tomorrowland-style festival fantasy + African EDM energy (immersive dark theme, glow, light beams, parallax, big cinematic hero), derived from the Afreqa logo's colours. Inspired by the aesthetic only — do **not** copy Tomorrowland assets, logos, copy or trademarks. Mobile-first, respects `prefers-reduced-motion`, degrades gracefully on slow connections.
- **Privacy/security:** Kenya Data Protection Act–minded consent handling, unsubscribe, data deletion flow, OWASP baseline, upload hardening, rate limiting, secure headers.
- **Never invent facts about Afreqa** (dates, artists, attendance, prices). Use clearly-labelled sample data and log every placeholder in `docs/CONTENT_TODO.md`.
- **No domain/hosting assumptions.** The build must run on any VPS; Caddy serves HTTP until a domain is configured.

## 3. Process (important)
1. **Plan first, code second.** Review the PRD and the draft `IMPLEMENTATION_PLAN.md`. Refine it: confirm or improve the stack, break phases into concrete tasks with acceptance criteria, flag risks and any questions. Save the result to `docs/IMPLEMENTATION_PLAN.md`.
2. **STOP and wait for my approval of the plan.** Do not write application code until I approve.
3. After approval, build **phase by phase** (Phase 0 → 6), in order. At the end of each phase: run lint, typecheck and tests; make sure `make dev` works from a clean state; update task checkboxes in `docs/IMPLEMENTATION_PLAN.md`; add a Change Log entry for anything that deviated; then give me a short summary and pause for review.
4. **Keep `docs/IMPLEMENTATION_PLAN.md` as the living plan.** Any change in scope, design or approach — whether you suggest it or I request it — must be reflected in the plan (task list, decision log, change log) in the same piece of work.
5. Ask me questions only when genuinely blocked; otherwise make a sensible decision, record it in the decision log, and continue.

## 4. Deliverables by the end of Phase 6
- Running stack via Docker Compose (dev + prod compose files, `.env.example`, `Makefile`)
- Public site, audience capture, admin, gallery, feature-flagged shop, as specified in the PRD
- Seed script that produces a complete, realistic demo (using `seed-media/` if present)
- Automated tests (Vitest unit + Playwright e2e for: sign-up/verify, ticket CTA click-through, admin login + RBAC, album upload, shop checkout with MockProvider)
- `README.md` (10-minute setup), `docs/RUNBOOK.md` (VPS deploy, attach a domain, SMTP, backups/restore, upgrades), `docs/DEMO.md` (a 5-minute walkthrough script for showing Afreqa)
- Default seeded super-admin with a forced password change on first login (credentials documented in README, never committed in real form)

Begin with step 1 of the process: read the docs, refine the plan, and present it for my approval.
