# Afreqa Website — Product Requirements Document (PRD)

**Version:** 1.0 (draft for Antigravity review)
**Status:** Awaiting plan approval
**Owner:** Tonny
**Companion docs:** `IMPLEMENTATION_PLAN.md` (living plan), `ANTIGRAVITY_PROMPT.md`

---

## 1. Overview

Afreqa is a Nairobi-based EDM event brand ("Kenya's hub for Electronic Dance Music"). Today it has no official website: tickets and links live on a HustleSasa storefront (`afreqanairobi.hustlesasa.shop`) and Instagram (`@afreqa_`).

This project builds Afreqa an official website that:

1. Acts as the **brand home and information hub** (events, line-ups, venue, FAQ).
2. **Captures and owns the audience** (email + WhatsApp opt-ins) so Afreqa can market directly.
3. **Drives ticket sales** (v1: deep-links to HustleSasa checkout; native checkout is a future phase).
4. Hosts a **merch shop** (built, feature-flagged off until Afreqa has merch).
5. Preserves and promotes memories via a **gallery** (photos, embedded videos, uploaded after-movies).
6. Gives non-technical staff an **admin panel** with role-based access.

This is an unpaid showcase build to demonstrate possibilities to the Afreqa team. It must therefore be **demo-ready with seed data, no external accounts required to run locally**, and easy for Afreqa to take over hosting/domain decisions later.

## 2. Goals and success metrics

| Goal | Metric |
|---|---|
| Grow owned audience | Email + WhatsApp opt-in conversion rate on the landing page |
| Drive ticket sales | Click-through rate on "Get Tickets" CTAs (tracked per event and per placement) |
| Build community | Gallery page views, after-movie plays, returning visitors |
| Reduce admin friction | Staff can publish an event or album without developer help |
| Technical quality | Lighthouse ≥ 90 (Performance/SEO/Best Practices/Accessibility) on mobile for landing page |

## 3. Users

- **Raver / attendee** (primary): 18–35, Nairobi, mobile-first, on Instagram/WhatsApp, pays with M-Pesa. Wants to know: when, where, who's playing, how much, how to buy, what's the vibe.
- **Returning community member**: wants to relive past events (photos, after-movies) and hear first about the next one.
- **Merch buyer**: wants to see and buy branded items.
- **Afreqa admin / organiser**: updates events, line-ups, ticket links, media; sends announcements; views signups.
- **Sponsor / artist / booker** (secondary): wants proof of audience quality and a contact route.

## 4. Scope

### In scope for v1
- Public website (all pages in §6.1)
- Email + WhatsApp opt-in with consent records
- Email sending from the site (verification, welcome, announcements)
- Hybrid ticketing: external ticket links (HustleSasa), ticket phase display
- Gallery with photo uploads, video embeds, video uploads
- Merch shop with cart + checkout (behind a feature flag, default OFF)
- Admin panel with roles
- Docker-based dev and production setup
- SEO, analytics, performance, accessibility, legal pages

### Explicitly out of scope for v1 (designed-for, not built)
- Native ticket checkout, QR ticket generation, gate scanning (Phase 7)
- WhatsApp Business Cloud API automation (Phase 7; see §6.3)
- Native mobile app
- Multi-currency, multi-language
- Marketplace / third-party vendors

## 5. Brand and design direction

- **Vibe:** Tomorrowland-style festival fantasy meets African EDM. Immersive, magical, night-sky, light beams, glow, particles, big cinematic hero video/imagery, confident oversized typography. *Inspired by the aesthetic only — do not copy Tomorrowland logos, assets, copy or trademarks.*
- **Palette:** derive from the Afreqa logo (`assets/brand/`). Fallback palette: deep midnight (#0A0714), electric violet (#7B2FF7), magenta (#F107A3), warm gold (#F5C542), aurora teal (#16F4D0), off-white text.
- **Typography:** one expressive display face for headings (e.g. Unbounded, Syne, or similar) + a clean sans for body (e.g. Inter / Manrope). Self-host fonts.
- **Motion:** tasteful — parallax hero, glow hover states, scroll reveals, countdown timer. Must respect `prefers-reduced-motion`.
- **Mobile-first:** most traffic will be phones on mid-range Android and mobile data. Heavy visuals must degrade gracefully (poster images instead of autoplay video on slow connections / data-saver).
- **Dark theme only** for v1.

## 6. Functional requirements

### 6.1 Public pages

| Page | Contents |
|---|---|
| **Home** | Hero (video/imagery + next event name, date, venue, countdown, primary CTA "Get Tickets"), next event teaser with line-up highlights, ticket phase strip, sign-up block (email + WhatsApp), gallery/after-movie teaser, merch teaser (only if shop enabled), partners/sponsors, FAQ teaser, footer with socials |
| **Events** | Upcoming and past events list; cards with poster, date, venue, status badge |
| **Event detail** | Poster, description, date/time, venue + map link/directions, line-up (artists, stages, set times if known), ticket phases (label, optional price, status: upcoming / on sale / sold out), "Get Tickets" button (external), add-to-calendar (.ics), share buttons, FAQ for that event, related gallery album |
| **Gallery** | Albums grouped by event/year; masonry photo grid with lightbox; "After Movies" section with video player; filters by event/year |
| **Album detail** | Photos + videos for one event; share link |
| **Shop** (flagged) | Product grid, product detail with variants (size/colour), cart, checkout, order confirmation |
| **About** | Afreqa story, mission, community values |
| **FAQ** | Searchable/accordion: age policy, what to bring, refunds (link to HustleSasa policy), transport, safety |
| **Contact** | Form (name, email, message, topic: general / sponsorship / booking / press), WhatsApp click-to-chat button, email, socials |
| **Legal** | Privacy Policy, Terms, Cookie notice, Data deletion request form |
| **404 / error** | On-brand |

**Ticket pricing note:** prices vary by venue, guest DJs and pre-sale phase, and gate tickets are rare. Therefore the site shows **ticket phases** (e.g. Early Bird, Phase 1, Final Release, Gate) with a status and an *optional* price/"from" price, each admin-configurable and each linking to the external ticket URL. Never hard-code prices.

### 6.2 Email capture and communication

- Sign-up form: email (required), first name (optional), interests (optional checkboxes: upcoming events, merch, after-movies).
- **Double opt-in:** send verification email; subscriber is only "active" after confirming.
- Welcome email on confirmation.
- Every email includes a one-click unsubscribe link and `List-Unsubscribe` headers.
- **The site sends email itself** via SMTP using a provider-agnostic mailer (Nodemailer) with configuration from env vars. Dev uses Mailpit (in Docker). Prod provider (Brevo/Resend SMTP/SES etc.) is chosen later by Afreqa.
- Emails are sent through a **background job queue** (Postgres-backed, e.g. pg-boss) with retries, rate-limiting and per-recipient status tracking.
- **Admin campaigns:** compose announcement (subject, rich body/MJML or React Email template), target all verified subscribers or an interest segment, send test, send now or schedule, view sent/failed/unsubscribed counts.
- Transactional emails: verification, welcome, contact-form receipt/notification to admin, order confirmation (shop).
- Bounce/complaint handling: expose a webhook endpoint stub and an admin "suppress email" action.

### 6.3 WhatsApp (cheapest-first strategy — monitor, then decide)

Phase 1 uses **no paid WhatsApp API**:

- Sign-up form phone field with Kenyan default (+254), E.164 normalisation and validation.
- **Separate, explicit WhatsApp consent checkbox** (not bundled with email consent).
- Store consent record (timestamp, source page, IP hash, consent text version).
- **"Join the Afreqa WhatsApp Community/Channel"** button using an admin-configurable invite link; shown right after sign-up success and in the footer.
- **Click-to-chat** (`wa.me`) buttons for contact/support with prefilled message.
- Post-signup step prompts the user to **save the Afreqa number** (WhatsApp Business broadcast lists only deliver to people who saved the sender's number) and join the community/channel.
- Admin: view/filter opted-in numbers, **export CSV** of opted-in numbers, copyable announcement templates for sending manually from the WhatsApp Business app.
- Admin dashboard tracks: WhatsApp opt-ins, community-link clicks. This is the data used to **decide later** whether to move to the paid WhatsApp Business Cloud API.
- **Architecture hook:** a `MessagingProvider` interface (`sendTemplate`, `sendText`) with a `ManualWhatsAppProvider` (no-op/export) now, and a stubbed `CloudApiProvider` for Phase 7. No Meta credentials needed in v1.

### 6.4 Ticketing (hybrid)

- Events have `ticketingMode`: `EXTERNAL` (v1, default) or `NATIVE` (schema-ready, not built).
- Each ticket phase has: label, status, optional price (KES), optional external URL (falls back to the event URL, then the global HustleSasa store URL from site settings), optional sale window.
- All "Get Tickets" CTAs go through an internal redirect route (`/go/tickets/:eventSlug?src=...`) that logs the click (placement, UTM params) then redirects. Appends UTM params to the outbound URL.
- Sold-out phases show disabled state + "Join waitlist / notify me" (captures email/WhatsApp interest tagged to the event).
- Event JSON-LD (`schema.org/Event`) including `offers` for SEO.

### 6.5 Gallery

- **Photos:** admin multi-file drag-and-drop upload (JPEG/PNG/WebP/HEIC), server-side processing with `sharp` (strip EXIF GPS, generate thumbnails + responsive sizes + blur placeholders, convert to WebP/AVIF), assign to album/event, reorder, set cover, caption, photographer credit.
- **Video embeds:** paste YouTube/Vimeo/Instagram URL; system validates and stores provider + ID, fetches title/thumbnail (oEmbed), renders a privacy-friendly lite embed (click-to-load).
- **Video uploads (after-movies):** large-file **resumable upload** (tus protocol or equivalent) supporting files up to ~4 GB; background worker (ffmpeg) validates the file, generates a poster frame and web-optimised MP4 renditions (e.g. 720p and 1080p, `faststart`); status shown in admin (uploading / processing / ready / failed); playback via HTML5 `<video>` with range requests and poster. HLS is a later optimisation.
- Albums: title, slug, event link, date, description, cover, visibility (draft/published), sort order.
- Public gallery: masonry layout, lightbox with keyboard/swipe nav, lazy loading, share-link per album, optional "download disabled" (default) to protect media.
- Bulk seeding: a script ingests media from a local `seed-media/` folder so the demo has real content (the user will export photos/videos from Google Drive into this folder).

### 6.6 Merch shop (feature-flagged, default OFF)

- Products with title, description, images, price (KES), variants (size/colour) with per-variant stock, active/draft.
- Cart (persisted for guests via cookie, DB-backed), checkout with name, email, phone, delivery method (pickup at next event / courier with address + delivery fee configurable).
- **Payment provider abstraction** (`PaymentProvider`): `MockProvider` (default in dev/demo, simulates success/failure), `PaystackProvider` (M-Pesa + card; webhook verified), others pluggable later (Pesapal, Daraja).
- Orders: statuses (pending, paid, fulfilled, cancelled, refunded), admin order list/detail, stock decrement on payment, confirmation email.
- Idempotent webhook handling, amount verification server-side, no card data ever touches our server.
- Feature flag `shop.enabled` in site settings hides all shop UI/nav/routes when off.

### 6.7 Admin panel (`/admin`)

- **Auth:** email + password (Argon2id), session cookies (httpOnly, secure, sameSite), login rate-limiting, optional TOTP 2FA for super admins, password reset by email, forced password change on first login of seeded account.
- **Roles (RBAC):**
  - `SUPER_ADMIN` — everything, including users, settings, feature flags.
  - `ADMIN` — events, artists, media, subscribers, campaigns, orders, products.
  - `EDITOR` — events, artists, FAQ, gallery content (no subscribers/orders/settings).
  - `SUPPORT` — read-only subscribers/orders/contact messages, reply to contact messages.
- **Modules:** Dashboard (key stats), Events + ticket phases, Artists/line-ups, Gallery (albums, uploads, embeds, processing status), Subscribers (search, filter, export CSV, suppress/delete), Campaigns, Contact messages, Products & Orders (if enabled), FAQ/pages content, Site settings (socials, HustleSasa URL, WhatsApp invite link, feature flags, SEO defaults), Users & roles, Audit log.
- Every mutating admin action writes to an **audit log** (who, what, when).
- Admin UI is separate in styling (clean, light/dark neutral) and fully responsive.

### 6.8 Other features to make the site "good enough" to sell tickets and grow community

- **Countdown** to next event and "On sale now" urgency badges.
- **Social proof:** past event stats (attendance, countries, artists), testimonials, press/partner logos (admin-managed).
- **Instagram:** link-outs and a curated "from the gram" section using manually added posts (no scraping, no API dependency).
- **Share & referral:** share buttons per event; optional "refer a friend" link tracked by code (stretch).
- **Add to calendar** (.ics) and Google Calendar links.
- **Notify-me / waitlist** per event.
- **Sponsors/partners** section and a sponsorship enquiry flow via contact topics.
- **Privacy-friendly analytics** (self-hostable Umami or Plausible in an optional compose profile) plus internal click tracking for ticket CTAs.
- **SEO:** metadata, OpenGraph/Twitter cards with dynamic images, sitemap.xml, robots.txt, JSON-LD (Organization, Event), clean slugs.
- **PWA basics:** manifest + icons (installable), no offline complexity in v1.
- **Accessibility:** WCAG 2.1 AA targets; keyboard navigation; reduced motion; alt text required in admin for gallery images (or auto-fallback from caption).
- **Performance:** image optimisation, lazy loading, route-level code splitting, caching headers, CDN-ready static assets.

## 7. Compliance and privacy (Kenya Data Protection Act, 2019)

Build with privacy by default (this is a design requirement, not legal advice; Afreqa should have the final policy text reviewed):

- Explicit, unbundled consent for email and WhatsApp; consent versioning and audit trail.
- Privacy Policy and cookie notice pages; analytics that don't require invasive cookies.
- Subscriber **self-service unsubscribe** and **data deletion/export request** flow (admin-actioned).
- Minimise data collected; hash IPs; strip EXIF location from uploaded photos.
- Age notice for 18+ events where applicable (admin-configurable per event).

## 8. Technical approach

### 8.1 Recommended stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript**, full-stack (server components, route handlers, server actions) | Best-in-class SEO and image handling, one codebase for site + admin + API, huge ecosystem |
| Styling/UI | **Tailwind CSS**, shadcn/ui primitives, **Framer Motion** for animation | Fast to build the immersive visual style; accessible primitives |
| Database | **PostgreSQL 16** | Required |
| ORM/migrations | **Prisma** | Type-safe, migrations, seeding |
| Auth | **Auth.js** (credentials, DB sessions) or Lucia-style custom session layer with Argon2id | Self-hosted, no vendor lock-in |
| Jobs/queue | **pg-boss** (Postgres-backed) | No Redis needed; emails, image/video processing, scheduled campaigns |
| Email | **Nodemailer** (SMTP) + **React Email** templates | Site sends its own email; provider swap via env |
| Media | **sharp** (images), **ffmpeg** (video), **tus** resumable uploads, storage abstraction (local volume now, S3-compatible later) | Handles big after-movie uploads and future CDN/object storage |
| Validation | **Zod** everywhere (forms, API, env) | Single source of truth |
| Testing | **Vitest** (unit), **Playwright** (e2e on key flows) | Confidence while iterating |
| Reverse proxy | **Caddy** | Automatic HTTPS the moment a domain is attached; large upload limits configured |
| Containerisation | **Docker + Docker Compose** | Required |

If Antigravity identifies a materially better option for any layer it may propose it in the plan with justification, but **PostgreSQL and Docker are fixed**.

### 8.2 Docker topology

Compose services:

- `web` — Next.js app (multi-stage build, non-root, healthcheck)
- `worker` — same image, runs pg-boss workers (email, image/video processing)
- `db` — `postgres:16-alpine`, named volume, healthcheck
- `caddy` — reverse proxy (prod profile), HTTP only until a domain is set
- `mailpit` — dev SMTP catcher + web UI (dev profile)
- `umami` (optional profile) — analytics
- Named volumes: `pgdata`, `uploads`, `caddy_data`

Provide `docker-compose.yml` (base), `docker-compose.override.yml` (dev with hot reload) and `docker-compose.prod.yml`. Provide `.env.example`, a `Makefile` (`make dev`, `make seed`, `make migrate`, `make backup`, `make test`), and a documented DB backup/restore script (`pg_dump` to a mounted directory).

### 8.3 Key data model (Prisma — indicative)

`User(role)`, `Session`, `AuditLog`, `SiteSetting(key,value,json)`, `Event`, `TicketPhase`, `Artist`, `EventArtist(stage,slot)`, `Subscriber(email, firstName, phoneE164, emailStatus, whatsappOptIn, interests, source, verifiedAt, unsubscribedAt)`, `ConsentLog`, `Campaign`, `CampaignRecipient(status)`, `Album`, `MediaAsset(type: PHOTO | VIDEO_UPLOAD | VIDEO_EMBED, status, urls, width, height, duration, provider, providerId)`, `ContactMessage`, `FaqItem`, `Partner`, `Product`, `ProductVariant`, `Cart`, `CartItem`, `Order`, `OrderItem`, `Payment`, `ClickEvent(type, eventId, placement, utm, ts)`.

Every table has `createdAt/updatedAt`; soft-delete where history matters (events, products, subscribers via suppression).

## 9. Security requirements

- OWASP Top 10 baseline: input validation (Zod), output encoding, parameterised queries (Prisma), CSRF protection on mutating routes, secure headers (CSP, HSTS, X-Frame-Options, Referrer-Policy), rate limiting on auth, sign-up, contact and checkout endpoints, honeypot + optional Cloudflare Turnstile on public forms.
- Upload hardening: MIME sniffing (not trusting extensions), size limits, filename randomisation, stored outside web root, image re-encoding, video probing with ffprobe before processing.
- Secrets only via env; `.env` git-ignored; no secrets in the image.
- Dependency audit in CI; Dependabot config.
- Least-privilege DB user for the app.
- Webhook signature verification (payments, email provider).

## 10. Non-functional requirements

- **Performance:** LCP < 2.5s on 4G mobile for Home; images served in modern formats with responsive sizes.
- **Availability:** healthchecks, restart policies, graceful shutdown; DB backups documented and scriptable.
- **Observability:** structured JSON logs, error boundary pages, `/api/health` endpoint.
- **Maintainability:** clear folder structure, ADR-style decision log in the plan, README with 10-minute setup, seed data for a full demo.
- **Portability:** runs the same on a laptop and a €5–10 VPS; no vendor lock-in so Afreqa can host wherever they decide.

## 11. Content and assets (inputs from the owner)

- Logo files → `assets/brand/`
- Photos/videos exported from Google Drive → `seed-media/` (git-ignored; large files)
- Real copy (about, FAQ, event details) is not yet available: Antigravity must create realistic **placeholder content** and record every placeholder in `docs/CONTENT_TODO.md` so nothing fake ships unnoticed. Never invent factual claims about Afreqa (attendance numbers, dates, artist names) — mark them clearly as sample data.

## 12. Assumptions and open items

- Domain and production hosting will be chosen by Afreqa after approval; build must not depend on either.
- HustleSasa store URL is `https://afreqanairobi.hustlesasa.shop/` and is configurable in settings.
- Afreqa's per-ticket HustleSasa fee is unknown; only relevant for a future native-ticketing decision (Phase 7).
- WhatsApp approach is deliberately minimal (opt-in capture + community link + CSV export); revisit with real opt-in data.
- Payment provider for merch is not yet chosen; `MockProvider` makes the demo work without any account.
