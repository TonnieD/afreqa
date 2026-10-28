# Afreqa Website — Implementation Plan (Living Document)

> **Status:** APPROVED — Phase 0 in Progress  
> **Source of Truth for Scope:** `docs/PRD.md`  
> **Rule:** This file is updated whenever scope, design, or approach changes. Every change gets a Change Log entry. Task status is updated as work completes.  
> **Legend:** `[ ]` Not started · `[~]` In progress · `[x]` Done · `[-]` Dropped (with reason in Change Log)

---

## 0. Plan Approval & Governance

| Item | Value |
|---|---|
| **Plan Approved By** | Owner / User (Approved with Amendments) |
| **Approval Date** | 2026-10-28 |
| **Confirmed Stack** | **Next.js 15 (App Router, Strict TypeScript, Stable Major)** · **pnpm Workspaces Monorepo** · **PostgreSQL 16 (Owner + Restricted App DB Roles)** · **Prisma ORM** · **Tailwind CSS + shadcn/ui + Framer Motion** · **pg-boss** · **Nodemailer + React Email** · **sharp (Phase 0 Image Pipeline) + @tus/server** · **ffmpeg (Worker image only)** · **@node-rs/argon2** · **Docker + Docker Compose** · **Caddy v2** · **next/og** |

---

## 1. Monorepo Layout & Architecture (pnpm Workspaces)

The repository uses **pnpm workspaces** consistently. All shared domain logic (Prisma client, database migrations, queue dispatchers, mailer, storage abstraction, sharp photo pipeline, payment providers, messaging providers, and Zod schemas) resides in `packages/core`, imported by `apps/web` and `worker`.

```
afreqa-website/
├── pnpm-workspace.yaml                      # apps/* and packages/*
├── package.json                             # Root workspace tooling & scripts
├── apps/
│   └── web/                                 # Next.js 15 App Router (Full-Stack Frontend & API)
│       ├── public/                          # Static assets, favicon, manifest
│       ├── src/
│       │   ├── app/
│       │   │   ├── (public)/                # Raver-facing public routes
│       │   │   │   ├── layout.tsx           # Global festival shell (nav, footer, glow)
│       │   │   │   ├── page.tsx             # Cinematic Home (Hero, Countdown, Lineup, Tickets)
│       │   │   │   ├── sitemap.ts           # Dynamic sitemap.xml
│       │   │   │   ├── robots.ts            # Dynamic robots.txt
│       │   │   │   ├── events/              # Events listing & detail pages
│       │   │   │   │   ├── page.tsx
│       │   │   │   │   └── [slug]/
│       │   │   │   │       ├── page.tsx
│       │   │   │   │       └── opengraph-image.tsx # Dynamic OG image using next/og
│       │   │   │   ├── gallery/             # Photo masonry & after-movie players
│       │   │   │   │   ├── page.tsx
│       │   │   │   │   └── [slug]/page.tsx
│       │   │   │   ├── shop/                # Feature-flagged merch shop
│       │   │   │   │   ├── page.tsx
│       │   │   │   │   ├── [slug]/page.tsx
│       │   │   │   │   ├── cart/page.tsx
│       │   │   │   │   └── checkout/page.tsx
│       │   │   │   ├── about/page.tsx       # Brand story & community values
│       │   │   │   ├── faq/page.tsx         # Searchable festival FAQs
│       │   │   │   ├── contact/page.tsx     # Contact & sponsorship enquiry
│       │   │   │   ├── unsubscribe/page.tsx # Self-service email unsubscribe
│       │   │   │   └── legal/               # KDPA Privacy, Terms, Data Requests
│       │   │   ├── admin/                   # Secure Admin Panel (/admin)
│       │   │   │   ├── layout.tsx           # Responsive admin shell with RBAC nav
│       │   │   │   ├── login/page.tsx       # Secure login & password reset
│       │   │   │   ├── page.tsx             # Dashboard KPI & conversion stats
│       │   │   │   ├── events/              # Events & ticket phase management
│       │   │   │   ├── artists/             # DJ lineups & profile management
│       │   │   │   ├── gallery/             # Album & media asset management
│       │   │   │   ├── subscribers/         # Audience CRM & CSV exports (CSV injection escaped)
│       │   │   │   ├── campaigns/           # Newsletter composer & sender
│       │   │   │   ├── shop/                # Product & order fulfillment
│       │   │   │   ├── settings/            # System settings & feature flags
│       │   │   │   └── audit-log/           # Append-only admin audit log
│       │   │   └── api/                     # Route Handlers
│       │   │       ├── health/route.ts      # Health check (/api/health)
│       │   │       ├── go/tickets/[slug]/   # Non-blocking click-logging & instant redirect
│       │   │       ├── uploads/
│       │   │       │   ├── images/route.ts  # Authenticated Sharp image upload route
│       │   │       │   └── tus/             # Authenticated Tus resumable upload route
│       │   │       ├── webhooks/            # Payment & email bounce/complaint webhooks
│       │   │       └── auth/                # Session management
│       │   ├── components/
│       │   │   ├── ui/                      # shadcn/ui primitives
│       │   │   ├── festival/                # Hero, countdown, glow, audio/video player
│       │   │   ├── gallery/                 # Masonry grid, fullscreen lightbox
│       │   │   ├── forms/                   # Double opt-in, WhatsApp consent, contact
│       │   │   └── admin/                   # Data tables, modals, metric cards, image uploader
│       │   └── emails/                      # React Email templates (HTML-only output)
│       │       ├── verification.tsx
│       │       ├── welcome.tsx
│       │       ├── campaign.tsx
│       │       └── order-receipt.tsx        # HTML-only transactional receipt
│       ├── package.json
│       ├── tsconfig.json
│       └── tailwind.config.ts
├── packages/
│   └── core/                                # Shared Domain Logic & Infrastructure
│       ├── src/
│       │   ├── db/                          # Prisma client singleton (app role & owner role)
│       │   ├── auth/                        # @node-rs/argon2, session cookies, RBAC matrix
│       │   ├── queue/                       # pg-boss client & job dispatchers
│       │   ├── mailer/                      # Nodemailer provider & queue producer
│       │   ├── messaging/                   # MessagingProvider (Manual & Cloud stub)
│       │   ├── payments/                    # PaymentProvider (Mock & Paystack)
│       │   ├── storage/                     # StorageProvider (Local volume & S3 stub)
│       │   ├── media/                       # sharp photo pipeline (EXIF strip, responsive sizes)
│       │   ├── rate-limit/                  # Postgres-backed rate limiter
│       │   ├── validation/                  # Zod schemas (forms, API, env)
│       │   └── logger.ts                    # Structured JSON logger
│       ├── prisma/
│       │   ├── schema.prisma                # Full database model
│       │   ├── migrations/                  # Versioned SQL migrations + DB role grants
│       │   └── seed.ts                      # Demo seed script (events, fictional DJs, fake merch)
│       ├── package.json
│       └── tsconfig.json
├── worker/                                  # Background Worker Entrypoint
│   ├── src/
│   │   ├── index.ts                         # pg-boss job consumers entrypoint
│   │   └── jobs/
│   │       ├── email.worker.ts              # Async email delivery with retries
│   │       ├── photo.worker.ts              # sharp image pipeline & EXIF strip
│   │       ├── video.worker.ts              # ffmpeg/ffprobe transcoding (720p/1080p MP4)
│   │       ├── cleanup.worker.ts            # Abandoned tus upload & expired session pruning
│   │       └── campaign.worker.ts           # Bulk newsletter dispatch
│   ├── package.json
│   └── tsconfig.json
├── docker/
│   ├── Dockerfile.web                       # Lean Next.js image (no ffmpeg)
│   ├── Dockerfile.worker                    # Worker image with ffmpeg + sharp
│   ├── Caddyfile                            # Caddy reverse proxy & large upload limits
│   └── scripts/
│       ├── init-db-roles.sql                # Setup afreqa_owner and afreqa_app roles
│       ├── backup.sh                        # pg_dump backup script
│       └── restore.sh                       # pg_restore script
├── .github/
│   ├── workflows/
│   │   └── ci.yml                           # GitHub Actions CI (lint, typecheck, tests, build, Docker build)
│   └── dependabot.yml                       # Automated dependency updates
├── assets/
│   └── brand/                               # Official logo (`logo.jpg`)
├── seed-media/                              # Licence-free or generated sample media
├── docs/
│   ├── PRD.md                               # Product Requirements Document
│   ├── IMPLEMENTATION_PLAN.md               # This living document
│   ├── CONTENT_TODO.md                      # Audit of sample content & placeholders
│   ├── RUNBOOK.md                           # Deployment, domains, backups, operations
│   └── DEMO.md                              # 5-minute showcase script for Afreqa team
├── docker-compose.yml                       # Base compose definition
├── docker-compose.override.yml              # Local dev profile (hot reload, Mailpit)
├── docker-compose.prod.yml                  # Production profile (Caddy, restart policies)
├── .env.example                             # Fully documented environment template
├── Makefile                                 # make dev, seed, migrate, test, backup
└── README.md                                # 10-minute setup guide
```

---

## 2. Phased Implementation Plan

### Phase 0 — Foundation, Workspaces, Storage & Docker Architecture
**Goal:** A rock-solid, containerized development environment booting with a single command (`make dev`), using pnpm workspaces, dual DB roles with append-only audit logging, `StorageProvider` with `sharp` image processing pipeline, GitHub Actions CI, and Dependabot.

- [~] **pnpm Workspaces & Monorepo Initialization**
  - Setup root `pnpm-workspace.yaml` encompassing `apps/*` and `packages/*`.
  - Create `packages/core` containing shared Prisma client, queue, mailer, storage abstraction, sharp image pipeline, rate limiting, and Zod schemas.
  - Setup ESLint, Prettier, strict TypeScript configs across workspaces.
  - Setup GitHub Actions CI workflow (`.github/workflows/ci.yml`) covering:
    - Code checkout, pnpm setup, cache.
    - Lint (`pnpm run lint`).
    - Typecheck (`pnpm run typecheck`).
    - Unit tests (`pnpm run test:unit`).
    - Production build (`pnpm run build`).
    - Docker build validation (`docker build`).
  - Add `.github/dependabot.yml` for automated dependency security updates.
- [ ] **Dual DB Roles & Append-Only Audit Logging**
  - PostgreSQL role separation:
    - `afreqa_owner`: Migration and schema owner role with full DDL/DML permissions.
    - `afreqa_app`: Restricted runtime application user role granted `SELECT`, `INSERT`, `UPDATE`, `DELETE` on operational tables, but strictly `SELECT` and `INSERT` only on `AuditLog` (`UPDATE` and `DELETE` explicitly REVOKED).
  - Mask/sanitize personal data (emails, phone numbers) before writing to audit payloads to maintain privacy compliance.
- [ ] **Phase 0 Storage & Photo Processing Pipeline (Moved from Phase 4)**
  - Implement `StorageProvider` interface (`packages/core/src/storage/`):
    - `LocalStorageProvider` mounted to `/app/uploads` Docker volume.
    - S3-compatible provider interface stubbed.
  - Implement `sharp` image processing utility in `packages/core/src/media/`:
    - Strips all EXIF/GPS metadata.
    - Generates responsive WebP/AVIF renditions (thumbnail 400w, medium 1200w, full 2400w).
    - Extracts low-quality image placeholder (LQIP base64 blur) for smooth rendering.
  - Implement authenticated admin image upload route handler (`/api/uploads/images`) so event poster and DJ photo uploads are fully functional before Phase 4 gallery.
- [ ] **Super-Admin Seeding & DEMO_MODE Flag**
  - Seed super-admin strictly from `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` env vars with `mustChangePassword: true` (fails in production if unset).
  - Add `DEMO_MODE` env flag: when `true`, seeds the shop as enabled with clearly fake sample merch; production default stays `false` (shop disabled).
  - Authentication with `@node-rs/argon2` for high-performance, secure password hashing.
- [ ] **Docker Multi-Container Architecture**
  - Separate `Dockerfile.web` (Next.js runner, lean, no ffmpeg) and `Dockerfile.worker` (worker runner with `ffmpeg` installed for video transcoding).
  - Setup `docker-compose.yml` (base services: `web`, `worker`, `db`).
  - Setup `docker-compose.override.yml` (dev mode: hot-reload volume mounts, `mailpit` SMTP catcher on ports 1025/8025).
  - Setup `docker-compose.prod.yml` (production profile: Caddy reverse proxy, restart policies, hardened resource limits).
  - Setup persistent Docker volumes: `pgdata`, `uploads`, `caddy_data`.
- [ ] **Postgres-Backed Rate Limiter & Healthcheck**
  - Implement Postgres-backed atomic rate limiter in `packages/core/src/rate-limit/`.
  - Implement `/api/health` checking DB connectivity, disk space, and worker status.
  - Implement structured JSON logger (`packages/core/src/logger.ts`).
- [ ] **Developer Tooling & Makefile**
  - Create root `Makefile` (`dev`, `build`, `migrate`, `seed`, `test`, `backup`, `restore`).
  - Write starter `README.md` with 10-minute setup instructions.
- [ ] **Acceptance Criteria**:
  1. Running `make dev` successfully builds and boots `web`, `worker`, `db`, and `mailpit` via pnpm.
  2. `curl http://localhost:3000/api/health` returns `{ "status": "ok", "db": "connected" }`.
  3. Image upload via `/api/uploads/images` strips EXIF GPS and outputs responsive WebP/AVIF.
  4. App DB user cannot execute `UPDATE` or `DELETE` on `AuditLog` table.
  5. Super-admin seeds only when `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` are provided; fails if missing in production.
  6. When `DEMO_MODE=true`, shop is seeded enabled with fake merch; when false, shop is disabled.
  7. CI workflow and Dependabot config pass syntax checks.
  8. Pause after Phase 0 with a summary and the logo colour swatches for Owner confirmation before building UI themes.

---

### Phase 1 — Public Site Core, SEO & Non-Blocking Hybrid Ticketing
**Goal:** Deliver an electric, festival-grade public web experience that captivates ravers, showcases upcoming events and lineups, includes complete SEO and dynamic OG images via `next/og`, and drives rate-limited, non-blocking tracked ticket sales to HustleSasa.

- [ ] **Festival Shell & Navigation**
  - Responsive festival header with translucent glassmorphism, animated glow accents, mobile navigation drawer, and quick "Get Tickets" CTA.
  - Festival footer with Afreqa brand emblem, unconfirmed social link placeholders, WhatsApp community link, legal links, and copyright.
  - Build reduced-motion safe motion engine (smooth scroll triggers, subtle aurora beam background).
- [ ] **SEO Infrastructure & Dynamic Social Cards (`next/og`)**
  - Dynamic `sitemap.xml` (`apps/web/src/app/sitemap.ts`) indexing all active public routes, events, and gallery albums.
  - Dynamic `robots.txt` (`apps/web/src/app/robots.ts`) allowing indexing of public pages while disallowing `/admin/*`, `/api/*`, and `/go/*`.
  - Comprehensive per-page metadata (title templates, descriptions, canonical URLs, keywords).
  - Dynamic OpenGraph / Twitter preview images (`opengraph-image.tsx`) using `next/og` (`ImageResponse` from `next/og`) generating branded festival cards with event title, date, and venue.
  - Rich JSON-LD structured data (`schema.org/Event`, `schema.org/Organization`, `schema.org/Offer`).
- [ ] **Cinematic Landing Page (`/`)**
  - Ambient video hero with automatic poster image fallback for slow connections / mobile data-saver.
  - Large chrome typography for Afreqa headline and upcoming event announcement.
  - Live countdown timer ticking down to doors opening.
  - Primary "Get Tickets" button pulsing with neon glow.
  - Next event spotlight with fictional sample DJ teaser cards.
  - Dynamic ticket phase strip (Early Bird, Phase 1, Final Release, Gate) with admin-configured prices (never hardcoded) and "Buy on HustleSasa" / "Notify Me" triggers.
  - Gallery teaser, sponsors/partners logo marquee, and FAQ preview.
- [ ] **Events Hub & Event Details (`/events` & `/events/[slug]`)**
  - Events listing page with tabbed view (Upcoming vs. Past Editions).
  - Event detail page with high-res poster art, Google Maps directions link, DJ lineup with fictional DJs, ticket phase strip, add-to-calendar (.ics + Google Calendar), native share, and event FAQ.
- [ ] **Non-Blocking Hybrid Ticketing Route (`/go/tickets/[slug]`)**
  - Route handler with Postgres rate limiting to prevent link scraping/abuse.
  - Asynchronous / non-blocking click logging (`ClickEvent` table recording event ID, placement, phase, UTMs, user-agent, IP hash) without delaying the HTTP 302 redirect.
  - Formulates outbound URL appending UTM parameters and immediately redirects to the phase-specific URL or fallback event HustleSasa link.
- [ ] **Content & Information Pages**
  - About Page (`/about`): story, mission, electronic music culture.
  - FAQ Page (`/faq`): Category-based accordion with unconfirmed factual questions clearly logged in `docs/CONTENT_TODO.md`.
  - Contact Page (`/contact`): Form with honeypot + Postgres rate limiting, DB persistence, admin alert email, and direct WhatsApp click-to-chat.
  - Legal Pages (`/legal/*`): Privacy policy, terms, cookie notice, KDPA data deletion request form.
  - Custom on-brand 404 and 500 error pages.
- [ ] **Acceptance Criteria**:
  1. All public pages render cleanly from the PostgreSQL database.
  2. `sitemap.xml` and `robots.txt` serve valid XML/text and dynamically include active event routes.
  3. Dynamic OG images generate on `/events/:slug/opengraph-image` via `next/og`.
  4. `/go/tickets/:slug` redirects immediately without delay while logging clicks asynchronously in DB.
  5. Mobile Google Lighthouse score reaches ≥ 90 in Performance, Accessibility, Best Practices, and SEO.

---

### Phase 2 — Audience Capture & Background Email Engine
**Goal:** Build an owned audience engine capturing double opt-in email subscribers and WhatsApp contacts with strict privacy compliance, backed by a persistent queue, Postgres rate limiter, and transactional mailer.

- [ ] **Subscriber Capture & Consent Engine**
  - Email subscription form with email validation, optional first name, and raver interest checkboxes.
  - **Separate WhatsApp Opt-In:**
    - Unbundled phone number field with Kenyan default (`+254`).
    - Real-time E.164 normalization and validation using `libphonenumber-js`.
    - Explicit, unbundled consent checkbox with versioned consent text.
  - Record audit log in `ConsentLog` (subscriber ID, consent version, IP hash, user agent, timestamp, source page).
- [ ] **Post-Signup Flow & Community Growth**
  - Urgent prompt: "Save the Afreqa WhatsApp number in your phone" (for broadcast list delivery).
  - One-click vCard download + button to join the Official Afreqa WhatsApp Community/Channel.
- [ ] **Waitlist / Notify-Me per Event**
  - Modal component allowing ravers to register interest for sold-out ticket phases.
- [ ] **Background Job Queue (`pg-boss`)**
  - Configure `pg-boss` running against PostgreSQL in `packages/core`.
  - Worker process (`worker/src/index.ts`) handling `email:send`, `campaign:dispatch`, `cleanup:worker` (pruning expired unverified signups and abandoned uploads).
- [ ] **Transactional Email System & React Email Templates (HTML-Only)**
  - Provider-agnostic Nodemailer transport configured via environment variables.
  - Mailpit integration in local Docker environment.
  - Responsive, dark festival-themed React Email templates with clean HTML-only outputs (Verification, Welcome, Contact Alert, KDPA Data Request Confirmation).
  - One-click Unsubscribe handler (`/unsubscribe?token=...`) with signed JWT tokens and RFC 8058 `List-Unsubscribe` headers.
- [ ] **Messaging Provider Abstraction**
  - `MessagingProvider` interface with `ManualWhatsAppProvider` (CSV export & manual templates) and stubbed `CloudApiProvider`.
- [ ] **Security & Postgres-Backed Rate Limiting**
  - Sliding-window rate limiter on subscription and contact endpoints backed by PostgreSQL table `RateLimitEntry`.
  - Hidden honeypot field + optional Cloudflare Turnstile verification.
- [ ] **Acceptance Criteria**:
  1. Signup creates unverified subscriber and enqueues verification email in `pg-boss`.
  2. Verification email appears in Mailpit; confirming verifies subscriber and dispatches welcome email.
  3. WhatsApp phone numbers are stored in E.164 format with unbundled consent logs.
  4. Unsubscribe link immediately sets `unsubscribedAt` and suppresses subsequent emails.
  5. Rate limiter blocks requests beyond threshold using PostgreSQL table, surviving container restarts.

---

### Phase 3 — Admin Panel Core & Role-Based Access Control (RBAC)
**Goal:** Empower Afreqa staff to manage events, lineups, ticket phases, subscribers, and announcements through a secure, responsive admin panel with strict server-side permissions, sanitized CSV exports, and append-only audit logging.

- [ ] **Admin Authentication & Session Security**
  - Self-hosted session authentication using `@node-rs/argon2` for password hashing.
  - HttpOnly, SameSite=Lax, Secure session cookies stored in PostgreSQL.
  - Brute-force rate limiting on `/admin/login` using Postgres rate limiter.
  - Super-admin seeded from env vars with `mustChangePassword: true`.
  - Password reset flow via queued email with expiring tokens.
  - Optional TOTP 2FA secret generation and QR verification for super admins.
- [ ] **Role-Based Access Control (RBAC) Matrix**
  - Roles: `SUPER_ADMIN`, `ADMIN`, `EDITOR`, `SUPPORT`.
  - Server-side authorization guards:
    - `SUPER_ADMIN`: Full access (user management, system settings, feature flags, audit logs).
    - `ADMIN`: Events, artists, media assets, subscribers, campaigns, shop products, orders.
    - `EDITOR`: Events, artists, gallery albums, FAQ and page content (cannot view subscribers, orders, or change system settings).
    - `SUPPORT`: Read-only subscribers and orders; contact messages inbox management.
- [ ] **Admin Layout & Dashboard (`/admin`)**
  - Neutral dark/light admin shell with sidebar, user profile menu, and live website link.
  - Real-time KPI summary cards (Subscribers, WhatsApp opt-ins, Ticket outbound clicks, Active events).
  - Ticket CTA Click Conversion analytics chart.
  - Recent audit log activity feed.
- [ ] **Events & Lineup Management Module**
  - Full CRUD interface for Events with image uploader (`/api/uploads/images`), date picker, venue details, description, status (`DRAFT`, `PUBLISHED`, `ARCHIVED`).
  - Ticket Phase Manager: Create/edit phases, toggle status, set optional prices (KES), set custom HustleSasa target URLs.
  - Artist & Lineup Builder: Manage DJ roster with fictional DJs and photo upload, assign DJs to events with stage and time slots.
- [ ] **Audience CRM & CSV Export Security**
  - Subscriber table with live search and interest filters.
  - **CSV Export Security:**
    - Restrict CSV export functionality to `ADMIN` and `SUPER_ADMIN` roles only.
    - Sanitize all exported fields against CSV Formula Injection: prefix cells starting with `=`, `+`, `-`, `@`, `\t`, `\r` with a single quote `'`.
    - Audit-log every export action in `AuditLog`.
  - Manual subscriber suppression and GDPR/KDPA permanent deletion action.
- [ ] **Email Campaign Composer & Dispatcher**
  - Rich markdown/HTML composer with live email preview and test send action.
  - Target audience selector (All Verified, or filtered by interest tags).
  - Queue campaign dispatch through `pg-boss` with real-time progress bar.
- [ ] **Content & Settings Management**
  - Contact inbox, FAQ and Partner management (CRUD).
  - Site Settings & Feature Flags (HustleSasa base URL, WhatsApp community link, social URLs, `shop.enabled`).
  - User Management: Invite/edit admin users and assign roles (`SUPER_ADMIN` only).
- [ ] **Append-Only Audit Logging System**
  - Record every mutating admin action: `userId`, `action`, `resource`, `resourceId`, payload diff, `ipAddress`, and `timestamp`.
  - Mask raw personal data (emails, phone numbers) before writing to audit payloads.
  - Database-enforced append-only security: `UPDATE` and `DELETE` revoked from application DB user.
- [ ] **Acceptance Criteria**:
  1. Default super-admin logs in with credentials from env vars and is forced to change password before navigating admin views.
  2. Role permissions strictly prevent `EDITOR` from seeing subscribers or settings, and prevent `SUPPORT` from modifying events.
  3. CSV exports escape formula injection characters and are logged in `AuditLog`.
  4. Raw emails and phone numbers are masked in audit payloads.
  5. Creating or updating an event with ticket phases updates the public site instantly.

---

### Phase 4 — Tus Resumable Spike, Gallery & Media Pipeline
**Goal:** Prove large video resumability via a dedicated spike, deliver an electric festival gallery for photos and embedded videos, and process after-movies with ffmpeg in the worker container with disk-space checks and cleanup.

- [ ] **Pre-Phase 4 Technical Spike: Tus Resumable Upload (1 GB+)**
  - Execute spike: Upload a 1 GB test file via `@tus/server` with simulated network interruption and resume verification.
  - Evaluation gate: Test `@tus/server` inside Next.js Route Handlers (`/api/uploads/tus`). If buffering, streaming timeouts, or route handler lifecycle issues occur, configure Tus as a lightweight standalone Node service (`services/tusd` or `@tus/server`) routed behind Caddy at `/api/uploads/tus`.
  - Security requirement: The Tus upload endpoint must require an authenticated admin session with `ADMIN` or `SUPER_ADMIN` role.
  - Large files must never be uploaded through Next.js server actions.
- [ ] **Upload Hardening & Cleanup Jobs**
  - Add server disk-space check before accepting a video upload (reject upload if available disk space is less than 3x the video file size).
  - Add scheduled worker job (`cleanup.worker.ts`) expiring and removing abandoned Tus partial uploads older than 24 hours.
- [ ] **Video Embeds Module**
  - Support pasting YouTube, Vimeo, and Instagram video/reel URLs with oEmbed validation.
  - Privacy-preserving "lite" embed component that displays poster image and loads external iframe only when raver clicks play.
- [ ] **Resumable After-Movie Video Uploads & FFmpeg Worker**
  - Tus protocol server mounted on `/api/uploads/tus` supporting chunked resumable uploads up to 4 GB.
  - Caddy reverse proxy tuned with `request_body max_size 4500MB` and extended timeouts.
  - Asynchronous video processing worker running `ffmpeg` and `ffprobe` (in worker image only):
    - Probe incoming video container, codecs, resolution, and duration.
    - Extract crisp high-resolution poster frame at 10% duration.
    - Transcode web-optimized MP4 renditions (720p and 1080p, H.264 video, AAC audio, with `+faststart` flag for instant browser streaming).
    - Update processing status in database: `UPLOADING` → `PROCESSING` (with percentage) → `READY` / `FAILED`.
- [ ] **Public Gallery & After-Movie Experience**
  - Responsive masonry grid layout with filter tabs (by Year and Event edition).
  - Fullscreen lightbox modal with keyboard navigation (Esc, Arrow keys), touch swipe gestures, and photographer credits.
  - Public gallery images serve resized/watermarked derivative files; download protection is explicitly treated as a visual deterrent rather than absolute DRM.
  - Dedicated "After Movies" showcase section featuring custom video player with seekable HTTP 206 partial content streaming.
- [ ] **Seed Media Ingestion Script**
  - CLI script (`pnpm run seed:media` / `make seed`) scanning `seed-media/` directory.
  - Ingests licence-free or generated festival photos and after-movies into the database.
- [ ] **Acceptance Criteria**:
  1. Pre-Phase 4 spike verifies 1 GB video upload resumes smoothly after forced disconnect; Tus route strictly rejects unauthenticated requests.
  2. Upload endpoint checks available disk space before accepting large video files.
  3. Worker container ffmpeg transcode generates poster image and `faststart` MP4 playable with HTTP 206 range requests.
  4. Scheduled cleanup job purges abandoned partial uploads older than 24 hours.
  5. Public gallery renders a smooth masonry grid and responsive lightbox on mobile and desktop.

---

### Phase 5 — Merch Shop (Feature-Flagged, Default OFF)
**Goal:** Build a complete festival merch store with guest cart, delivery options, and payment provider abstraction, kept securely behind a feature flag until Afreqa is ready to launch merchandise.

- [ ] **Feature Flag Guard Architecture**
  - Global `shop.enabled` setting stored in database.
  - When `DEMO_MODE=true`, seed script enables shop with fake merchandise; default production config is strictly `false`.
  - Server middleware and layout guard returning 404 for all `/shop/*` and `/api/shop/*` routes when disabled.
  - Conditionally render navigation links, mobile menu items, and homepage teaser cards based on flag state.
- [ ] **Product Catalog & Inventory Management**
  - Product model: Title, slug, description, gallery images, base price (KES), active/draft status.
  - Variant model: Size (S, M, L, XL, XXL) and Color, with independent SKU and real-time stock quantity.
  - Admin product management: Image uploads, variant matrix, stock adjustments, pricing.
- [ ] **Cart & Guest Checkout Experience**
  - Persistent guest cart backed by secure cookie and database synchronization.
  - Slide-out cart drawer with live subtotal, quantity selectors, and stock validation.
  - Streamlined single-page checkout collecting customer info and delivery choice (Event Pickup or Courier Delivery with admin-configured fee).
- [ ] **Payment Provider Abstraction Layer (`PaymentProvider`)**
  - Define `PaymentProvider` interface (`createTransaction`, `verifyWebhook`, `handleWebhook`).
  - Implement **`MockProvider`** (default for local dev & showcase demo) with simulated success, failure, and delayed webhook scenarios.
  - Implement **`PaystackProvider`** (production-ready sandbox/live) for M-Pesa and Card payments in KES, with secure webhook route verifying HMAC-SHA512 signatures and idempotent transaction processing.
- [ ] **Order Fulfillment & HTML-Only Receipts**
  - Atomic inventory decrement inside Prisma transaction upon confirmed payment.
  - Order status workflow: `PENDING` → `PAID` → `FULFILLED` → `CANCELLED` → `REFUNDED`.
  - Automated transactional order confirmation email with clean, responsive **HTML-only receipt** (avoiding heavy PDF generation dependencies).
  - Admin Order Manager: Filter orders by status, view shipping addresses, update fulfillment status, add courier tracking numbers.
- [ ] **Acceptance Criteria**:
  1. When `shop.enabled` is false, `/shop` routes return 404 and nav items are completely hidden.
  2. When `shop.enabled` is true, a raver can add items to cart, complete checkout via `MockProvider`, and view order confirmation.
  3. Payment webhooks verify signatures and are strictly idempotent (duplicate webhooks do not double-decrement stock).
  4. Customer receives automated HTML-only receipt email in Mailpit upon payment.

---

### Phase 6 — Launch Readiness, Analytics, Automated Testing & Runbook
**Goal:** Harden security, add Umami analytics compose profile, implement email bounce/complaint webhooks, execute automated tests across critical user journeys, and package turnkey deployment documentation.

- [ ] **Automated Testing Suite**
  - **Vitest Unit & Integration Tests:**
    - Zod schema validation (forms, environment variables, phone numbers).
    - Session authentication, password hashing with `@node-rs/argon2`, and RBAC permission matrix.
    - Image processing & EXIF GPS stripping verification.
    - E.164 phone normalization and consent log validation.
    - Postgres-backed rate limiter and honeypot bot defense.
    - CSV formula injection escaping.
  - **Playwright End-to-End (E2E) Tests:**
    1. *Audience Capture Flow:* Signup with email + WhatsApp → intercept verification in Mailpit → confirm email → verify welcome email and community redirect.
    2. *Hybrid Ticketing Flow:* Navigate home/events → click "Get Tickets" → verify `ClickEvent` logged in DB and non-blocking redirect executed.
    3. *Admin Security Flow:* Login with seeded super-admin → verify forced password change → verify RBAC restrictions (editor cannot access subscribers).
    4. *Gallery Pipeline Flow:* Upload album photo → verify responsive images generated and lightbox navigates.
    5. *Shop Purchase Flow:* (Flag ON) Add variant to cart → complete checkout with `MockProvider` → verify stock decrement and HTML receipt.
- [ ] **Privacy-Friendly Analytics (Umami Profile)**
  - Add optional `umami` profile in `docker-compose.yml` (`docker compose --profile analytics up`) with lightweight container and dedicated Postgres DB schema.
  - Integrate privacy-friendly script tag in public layout, conditional on env toggle (`NEXT_PUBLIC_UMAMI_WEBSITE_ID`).
  - Internal click dashboard in Admin tracks ticket outbound clicks without third-party cookies.
- [ ] **Email Bounce & Complaint Webhook Stub**
  - Implement `/api/webhooks/email` route handler.
  - Support standardized payload verification for bounces and spam complaints (e.g., Brevo/SES format).
  - Automatically flag subscriber status as `BOUNCED` or `COMPLAINED` and suppress future campaign dispatches.
- [ ] **Production Hardening & Reverse Proxy**
  - Configure `docker/Caddyfile` for automated Let's Encrypt SSL/TLS certificates once a domain is pointed to the server (with graceful HTTP fallback in dev).
  - Configure strict HTTP security headers: Content-Security-Policy (CSP), Strict-Transport-Security (HSTS), X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy.
  - Implement automated database backup and restore scripts (`docker/scripts/backup.sh`, `docker/scripts/restore.sh`) with compression and verification.
- [ ] **Turnkey Documentation & Demo Package**
  - **`README.md`:** 10-minute setup guide for booting the entire stack locally with Docker.
  - **`docs/RUNBOOK.md`:** Comprehensive VPS deployment guide (Ubuntu 22.04/24.04), Docker Compose setup, domain attachment, Caddy HTTPS, production SMTP configuration (Brevo/Resend/SES), automated backups via cron, updates, and troubleshooting.
  - **`docs/DEMO.md`:** Step-by-step 5-minute showcase script for demoing the website to the Afreqa founders.
  - **`docs/CONTENT_TODO.md`:** Final audit of all sample data, placeholder fictional DJ names, mock ticket prices, and assets needing real Afreqa replacements before live launch.
- [ ] **Acceptance Criteria**:
  1. All Vitest unit tests and Playwright E2E tests pass 100%.
  2. Umami analytics profile boots cleanly when `--profile analytics` is passed.
  3. Email bounce/complaint webhook stub marks subscriber status as suppressed.
  4. Production profile (`docker compose -f docker-compose.yml -f docker-compose.prod.yml up`) boots cleanly with Caddy.
  5. Database backup script creates restorable `.sql.gz` archive.

---

### Phase 7 — Future Evolution (Designed For, Out of v1 Scope)
*Architectural hooks and schema fields are prepared in v1; implementation deferred until data warrants.*

- [ ] **Native Ticket Checkout & Gate Scanning**
  - Full native ticketing with direct M-Pesa Daraja and Paystack checkout.
  - Dynamic encrypted QR ticket generation with anti-screenshot / anti-duplication protection.
  - Gate scanning PWA for event staff with offline ticket validation and check-in stats.
- [ ] **WhatsApp Business Cloud API Automation**
  - Implement `CloudApiProvider` using Meta Graph API.
  - Automated WhatsApp ticket reminders, lineup drops, and two-way concierge bot.
- [ ] **HLS Adaptive Video Streaming & Cloud Object Storage**
  - S3 / Cloudflare R2 storage integration.
  - HLS adaptive bitrate transcoding (1080p, 720p, 480p) for high-traffic after-movie streaming.

---

## 3. Architectural Decision Log (ADR)

| # | Decision | Chosen Approach | Rationale | Status |
|---|---|---|---|---|
| **D1** | Hybrid Ticketing | Non-blocking internal redirect route `/go/tickets/:slug` to external HustleSasa storefront | Eliminates ticket liability on event night while capturing full audience analytics and UTM attribution with zero redirect latency. | **Decided** |
| **D2** | WhatsApp Strategy | Cheapest-first: Opt-in + E.164 validation + Community link + CSV export | Zero cost for v1. Avoids Meta Cloud API expenses until subscriber volume justifies monthly fees. | **Decided** |
| **D3** | In-House Email System | Nodemailer + React Email + `pg-boss` queue + Mailpit | Afreqa owns their audience. Local Mailpit allows full testing without external SMTP credentials. | **Decided** |
| **D4** | Database & Roles | PostgreSQL 16 with `afreqa_owner` (migration/DDL) and `afreqa_app` (restricted runtime) | Hardens database security. `afreqa_app` has `UPDATE/DELETE` revoked on `AuditLog`. | **Decided** |
| **D5** | Web Framework & OG | Next.js 15 (App Router, Strict TypeScript, Stable Major) + `next/og` | Single unified codebase for festival frontend, administrative backend, and API route handlers with native Next.js OG generation. | **Decided** |
| **D6** | Background Job Queue | `pg-boss` over Redis | Leverages existing PostgreSQL 16 database. Eliminates Redis operational overhead and memory cost on low-end VPS. | **Decided** |
| **D7** | Authentication Layer | `@node-rs/argon2` + custom session cookies & PostgreSQL sessions | Zero vendor lock-in. Full control over session cookies, forced password reset, audit logging, and RBAC matrix. | **Decided** |
| **D8** | Media Storage & Photo Pipeline | `LocalStorageProvider` + `sharp` image pipeline in Phase 0 | Built in Phase 0 so event posters and artist headshot uploads work before Phase 4 gallery. | **Decided** |
| **D9** | Large Video Processing | Tus resumable upload protocol + background FFmpeg worker (worker image only) | Supports large 4 GB festival after-movies with network pause/resume; outputs streamable `faststart` MP4s without bloating web image. | **Decided** |
| **D10**| Merch Shop & Payments | Feature-flagged (`shop.enabled`) with `DEMO_MODE` flag, `MockProvider`, `PaystackProvider`, and HTML-only receipts | Shop is fully built and demo-ready without requiring real merchant credentials; toggled off by default for production. | **Decided** |
| **D11**| Monorepo Architecture | pnpm workspaces with `packages/core` | Shares Prisma, queue, mailer, storage, rate limiter, and validation cleanly between `apps/web` and `worker`. | **Decided** |
| **D12**| Super-Admin Provisioning | Environment variables (`SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`) with `mustChangePassword` | Prevents hardcoded credentials. Enforces production credential provision and immediate password change. | **Decided** |
| **D13**| Audit Log Security | Append-only at SQL level (`REVOKE UPDATE, DELETE ON AuditLog`) + personal data masking | Ensures audit trails cannot be altered or pruned by the application database user; keeps raw personal data out of audit diffs. | **Decided** |
| **D14**| Rate Limiting Engine | Postgres-backed table (`RateLimitEntry`) | Eliminates in-memory data loss across multi-instance restarts without requiring Redis. | **Decided** |
| **D15**| CSV Export Hardening | Prefix `=,+,-,@,\t,\r` with `'` + Role restricted (`ADMIN`+) | Prevents CSV formula injection / spreadsheet execution attacks when exporting subscriber lists. | **Decided** |

---

## 4. Key Risks & Technical Mitigations

| Risk | Impact | Mitigation Strategy |
|---|---|---|
| **Large after-movie video uploads (up to 4 GB) fail or time out** | High | Run Pre-Phase 4 spike with 1 GB upload. Use `@tus/server` for chunked resumable uploads. Never upload large files via server actions. Add disk space check before upload acceptance. Add worker cleanup job for abandoned partial uploads. |
| **Festival visual effects slow down mid-range mobile devices** | High | Enforce mobile-first CSS. Automatically disable video hero on mobile/slow connections in favor of optimized WebP poster. Strictly respect `prefers-reduced-motion`. |
| **WhatsApp broadcast messages fail to deliver without paid API** | Medium | WhatsApp broadcast lists only deliver to users who have saved the sender's phone number. Post-signup screen prominently prompts ravers to download Afreqa's vCard and join the official WhatsApp Community/Channel where all posts are visible. |
| **Placeholder content confused for genuine event details** | High | All mock events, DJ lineups, and dates use strictly fictional names and sample badges. Every single placeholder is logged in `docs/CONTENT_TODO.md`. |
| **Next.js server action memory exhaustion during uploads** | High | Route video uploads directly through Tus streaming file-store rather than buffering multipart form data in Next.js server memory. Keep ffmpeg in worker image only. |
| **Spam / bot attacks on ticket waitlists and contact forms** | Medium | Implement hidden honeypot fields, Postgres-backed rate limiting, and prepare optional Cloudflare Turnstile verification. |

---

## 5. Content & Setup Checklist for Owner

- [x] Afreqa official logo verified in `assets/brand/logo.jpg` (chrome 3D lettering with African continent frequency bars).
- [ ] Swatch confirmation: Owner review and confirmation of sampled color swatches from `logo.jpg` (presented at Phase 0 completion pause).
- [ ] Demo festival photos/videos placed in `seed-media/` (optional; license-free or generated sample media used by default).
- [ ] Next event real details (title, confirmed date, venue, DJ headliners) — or keep sample fictional dataset for demo.
- [ ] Afreqa official WhatsApp number & Community/Channel invite link (marked as placeholders in `CONTENT_TODO.md`).
- [ ] Official social links (Instagram, TikTok, YouTube) confirmed (marked as placeholders in `CONTENT_TODO.md`).
- [ ] HustleSasa store URL verified: `https://afreqanairobi.hustlesasa.shop/`.
- [ ] Refund policy, age policy (18+), and all FAQ facts (parking, transport, prohibited items) confirmed with Afreqa.

---

## 6. Change Log

| Date | Author | Change Description | Sections Affected |
|---|---|---|---|
| **2026-10-28** | Antigravity | Initial draft implementation plan created from kickoff requirements. | All |
| **2026-10-28** | Antigravity | Refined implementation plan: expanded all 7 phases with concrete tasks, acceptance criteria, brand color tokens derived from `logo.jpg`, security hardening, and ADR decisions. | Sections 0–5 |
| **2026-10-28** | Antigravity | Applied initial owner amendments (pnpm monorepo, env admin seeding, CI/Dependabot, append-only audit log, Tus spike, HTML receipts, Umami profile). | Sections 0–6 |
| **2026-10-28** | Antigravity | **Applied Second Round of Owner Amendments:**<br>1. Configured dual DB roles: `afreqa_owner` (migration) and `afreqa_app` (`AuditLog` `UPDATE/DELETE` revoked) + raw personal data masking in audit payloads.<br>2. Moved `StorageProvider`, `sharp` image pipeline, and image upload route to Phase 0 for early event/artist poster uploads.<br>3. Verified Next.js 15 stable major in ADR; specified `next/og` instead of `@vercel/og`.<br>4. Added CSV formula injection escaping (`=,+,-,@,\t,\r` prefix with `'`), restricted exports to `ADMIN`+, and audit-logged them.<br>5. Relabeled gallery download protection as deterrent; public gallery serves resized/watermarked derivatives.<br>6. Added refund policy, age policy, and all FAQ facts to `CONTENT_TODO.md`.<br>7. Prohibited large file uploads through server actions; added abandoned tus upload expiry/cleanup job and disk-space checks.<br>8. Added rate limiting on `/go/tickets` and non-blocking asynchronous click logging.<br>9. Added `DEMO_MODE` env flag seeding shop enabled with fake merch; production default stays OFF.<br>10. Configured pause after Phase 0 with summary and color swatches for confirmation. | Sections 0–6 |
