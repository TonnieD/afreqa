# AFREQA — Host-Agnostic Deployment & Vercel Demo Guide

## Hosting Policy
- **Year 1 Strategy**: Free-tier hosting for the first year, re-evaluated after 12 months.
- **Demo Deployment (`*.vercel.app`)**: Vercel Hobby is used strictly for the non-commercial preview/demo deployment (`ROBOTS_NOINDEX=true`, `DEMO_BANNER=true`, `DEMO_CONTENT_UNVERIFIED=true`, `DEMO_MODE=false`).
- **Live Production Deployment**: Hosted on a platform whose free tier permits commercial use (evaluated in Phase B: Netlify vs Cloudflare vs Vercel Pro), or container-hosted via `docker/Dockerfile.web` and `docker/Dockerfile.worker`.
- **Ticketing & Shop**: Ticketing is strictly external via `HUSTLESASA_STORE_URL` (`https://afreqamusicfestival.hustlesasa.shop/`). The merch shop is parked (`shop.enabled = false`).

---

## Vercel Hobby Monorepo & Cron Configuration

Both [`vercel.json`](../vercel.json) and [`apps/web/vercel.json`](../apps/web/vercel.json) are kept in sync with the Vercel Dashboard settings:

| Setting | Value | Notes |
| :--- | :--- | :--- |
| **Framework Preset** | `Next.js` | Auto-detected |
| **Root Directory** | `apps/web` | Monorepo web app |
| **Node.js Version** | `22.x` | Pinned in root [`package.json`](../package.json) `engines` |
| **Install Command** | `cd ../.. && pnpm install --frozen-lockfile` | Runs from monorepo root |
| **Build Command** | `cd ../.. && pnpm vercel-build` | Runs `prisma generate`, `@afreqa/core` build, and `next build` |
| **Output Directory** | `.next` | Relative to `apps/web` (auto-detected) |
| **Function Region** | `Frankfurt (fra1)` *(recommended)* or `London (lhr1)` | Hobby allows selecting 1 default Serverless Function Region in **Project Settings -> Functions**. Match your Neon EU region (`eu-central-1` -> `fra1`, `eu-west-2` -> `lhr1`) to minimize DB latency. |

### Cron & Immediate Email Delivery
- **Vercel Cron**: Vercel Cron sends an HTTP **`GET`** request with `Authorization: Bearer <CRON_SECRET>` and Hobby is limited to **once per day** (`"0 3 * * *"` in `apps/web/vercel.json`).
- **Immediate Emails**: Verification, welcome, and contact/vendor/partner notification emails are sent immediately via Next.js `after()` (`runAfterResponse`) and only fall back to `pg-boss` queues if direct SMTP delivery fails.
- **Endpoint Security**: `/api/internal/cron` accepts `GET` and `POST`, fails closed (`401`/`503`) if `CRON_SECRET` is unset or invalid (constant-time comparison), never reads secrets from query strings, and caps batch size/runtime.
- **Alternative Schedulers** (for sub-daily intervals on non-Vercel hosts): GitHub Actions (`*/5 * * * *`), Netlify Scheduled Functions, Cloudflare Workers Cron Triggers, or `worker/src/index.ts` in Docker.

---

## Media Storage (Vercel Blob Hobby Demo)

The app uses `StorageProvider` (`local` | `vercel-blob` | `r2`). The demo uses **Vercel Blob** (Hobby free tier, no credit card required).
> **Experimental Notice**: `R2StorageProvider` is **experimental / untested** and disabled by default (`STORAGE_DRIVER` defaults to `local` or `vercel-blob`). If R2 is ever enabled in production, replace the hand-rolled SigV4 adapter with the official `@aws-sdk/client-s3` SDK.

> **Public URLs Notice**: Public Vercel Blob URLs are **not private** — anyone with the URL can fetch the image. Download-protection / deterrent badges are disabled in the demo/Vercel Blob mode.

### Vercel Blob Hobby Operations & Transfer Math
- **Hobby Monthly Limits**: 1 GB storage, 10,000 simple ops (`GET`/`HEAD`), 2,000 advanced ops (`PUT`/`LIST`/`COPY`; `DEL` is free), 10 GB transfer.
- **Single-Part Upload + Key-Based Cleanup** (`multipart: false`, max 15 MB, 40 MP `sharp` pixel cap, **0 `list()` calls**):
  - Client direct upload of temporary original (`temp/originals/<key>`): **1 `PUT`** (advanced)
  - `/api/uploads/token` records key in `PendingUpload` table (no `list()` needed)
  - `/api/uploads/process` fetches via `storage.getStream(key)`: **1 `GET`** (simple)
  - Server uploads 3 WebP variants (`400w`, `1200w`, `2400w`, original NOT stored): **3 `PUT`s** (advanced)
  - Server deletes temporary original + `PendingUpload` row: **1 `DEL`** (free)
  - Daily cron deletes any orphaned `PendingUpload` rows (>2h old) **by key** (max once per 24h, 0 `list()` calls)
  - **Total per photo**: **4 advanced ops + 1 simple op** -> **500 photos/month max** on Hobby (`GALLERY_MAX_PHOTOS=100` uses ~400 advanced ops).
- **Transfer Estimate (vs 10 GB/month limit)**:
  - Gallery grid renders **`400w`** (~25–40 KB/photo): 24 photos = ~0.8 MB/page view (~12,500 album page views/month within 10 GB).
  - Lightbox renders **`1200w`** (~120–180 KB/photo): ~65,000 lightbox views/month within 10 GB.
  - **`2400w`** (~350–500 KB/photo) loads **only** when the user clicks **View Full Size (2400w)**.
  - Next.js Image Optimization is disabled (`unoptimized`) on gallery images.

---

## Environment Variables Table (Vercel Demo Project)

### Generate Secrets in Windows PowerShell
```powershell
# Run twice — once for SESSION_SECRET, once for CRON_SECRET (64-char hex)
-join ((1..32) | ForEach-Object { '{0:x2}' -f (Get-Random -Maximum 256) })
```

| Variable | Where to Get It | Required | Scope | Value Format / Example |
| :--- | :--- | :--- | :--- | :--- |
| `NODE_ENV` | Vercel sets automatically | Yes | Prod / Preview | `production` |
| `NEXT_PUBLIC_APP_URL` | Your Vercel demo URL | Yes | Prod / Preview | `https://afreqa-demo.vercel.app` |
| `DATABASE_URL` | Neon `review` branch **pooled** endpoint (`afreqa_app`) | Yes | Prod / Preview *(Host-only secret)* | `postgresql://afreqa_app:<PASS>@ep-xxx-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require&pgbouncer=true&connect_timeout=10` |
| `DIRECT_URL` | Neon `review` branch **direct** endpoint (`afreqa_owner`) | Migrations/CLI only | Local / CI *(Host-only secret)* | `postgresql://afreqa_owner:<PASS>@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require&connect_timeout=15` |
| `SESSION_SECRET` | PowerShell random 64-char hex | Yes | Prod / Preview *(Host-only secret)* | 64-char hex string |
| `CRON_SECRET` | PowerShell random 64-char hex | Yes | Prod / Preview *(Host-only secret)* | 64-char hex string |
| `STORAGE_DRIVER` | Fixed for Vercel demo | Yes | Prod / Preview | `vercel-blob` |
| `BLOB_READ_WRITE_TOKEN` | Auto-created by Vercel Blob Store | Yes | Prod / Preview *(Host-only secret)* | `vercel_blob_rw_...` |
| `BLOB_PUBLIC_BASE_URL` | Vercel Storage -> Blob -> Store URL | Yes | Prod / Preview | `https://<store-id>.public.blob.vercel-storage.com` |
| `GALLERY_MAX_PHOTOS` | Demo quota cap | Optional | Prod / Preview | `100` |
| `HUSTLESASA_STORE_URL` | Afreqa HustleSasa storefront | Yes | Prod / Preview | `https://afreqamusicfestival.hustlesasa.shop/` |
| `WHATSAPP_PHONE` | Afreqa WhatsApp number | Optional | Prod / Preview | `+254743836164` |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `SMTP_FROM` | Your transactional SMTP provider (e.g. Resend/Brevo/Mailgun) | Yes (for real email) | Prod / Preview *(SMTP_PASS host-only)* | e.g. `smtp.resend.com` / `465` / `resend` / `<API_KEY>` / `Afreqa <hello@afreqa.com>` |
| `ADMIN_NOTIFY_EMAIL` | Your email for demo form alerts | Yes | Prod / Preview *(Host-only)* | `you@example.com` |
| `EMAIL_ALLOWLIST` | Comma-separated test recipients | Yes (Demo) | Prod / Preview *(Host-only)* | `you@example.com,reviewer@example.com` |
| `DEMO_MODE` | Keep merch shop off | Yes | Prod / Preview | `false` |
| `DEMO_BANNER` | Show demo notice banner | Yes (Demo) | Prod / Preview | `true` |
| `DEMO_CONTENT_UNVERIFIED` | Label unverified seed content | Yes (Demo) | Prod / Preview | `true` |
| `ROBOTS_NOINDEX` | Block search indexing on demo | Yes (Demo) | Prod / Preview | `true` |
| `VIDEO_UPLOAD_ENABLED` | Disable direct video upload (embeds only) | Yes | Prod / Preview | `false` |

---

## Click-by-Click Deployment Guide (Neon + Vercel Hobby)

### Part A — Neon Serverless PostgreSQL (`review` branch)
1. **Create Project**: Sign in at [neon.tech](https://neon.tech) -> **New Project** -> Name: `afreqa-prod`, Postgres `16`, Region: `Europe (Frankfurt) eu-central-1`.
2. **Create `review` Branch**: Go to **Branches** -> **Create branch** -> Name: `review`, Parent: `main`. Switch to the **`review`** branch.
3. **Run Dual-Role Script**:
   > **Status:** `docker/neon-init-roles.sql` has been verified against local PostgreSQL 16, and is **not yet run on a real Neon project** until you execute it here.
   - Open Neon **SQL Editor** on the **`review`** branch (as `neondb_owner`).
   - Paste [`docker/neon-init-roles.sql`](../docker/neon-init-roles.sql), replace `<REPLACE_WITH_STRONG_OWNER_PASSWORD>` and `<REPLACE_WITH_STRONG_APP_PASSWORD>` with generated 32+ char passwords, and click **Run**.
4. **Apply Migrations, `pg-boss`, & `AuditLog` Lock (`pnpm db:deploy`)**:
   From your local terminal in the repo root:
   ```powershell
   $env:DIRECT_URL="postgresql://afreqa_owner:<OWNER_PASSWORD>@ep-xxxx.eu-central-1.aws.neon.tech/neondb?sslmode=require&connect_timeout=15"
   $env:DATABASE_URL="postgresql://afreqa_app:<APP_PASSWORD>@ep-xxxx-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require&pgbouncer=true&connect_timeout=10"
   pnpm db:deploy
   ```
5. **Provision Super Admin & Verify**:
   ```powershell
   pnpm --filter @afreqa/core create-admin --email="ops@afreqa.com" --role="SUPER_ADMIN"
   pnpm --filter @afreqa/core neon:verify
   ```

### Part B — Vercel Hobby Project & Blob Store
1. **Import Private Repo**: In [vercel.com/new](https://vercel.com/new), import `TonnieD/afreqa` (private GitHub repo).
2. **Configure Build & Root**:
   - **Root Directory**: Click **Edit** -> select `apps/web`.
   - **Node.js Version**: Project Settings -> **Build and Deployment** -> `22.x`.
   - **Function Region**: Project Settings -> **Functions** -> select **`Frankfurt (fra1)`** (matching Neon `eu-central-1`).
3. **Public Access for Demo Reviewers**:
   - Go to **Project Settings -> Deployment Protection**.
   - Ensure **Vercel Authentication** is **Disabled** (or disabled for Production) so decision makers can open `https://<project>.vercel.app` directly without a Vercel login wall.
4. **Create Blob Store**:
   - Go to **Storage** -> **Create Database** -> **Blob** -> **Public** access -> connect to **Preview** and **Production**.
   - Copy the store's public base URL (`https://<store-id>.public.blob.vercel-storage.com`).
5. **Set Environment Variables**:
   - Go to **Project Settings -> Environment Variables** and add all variables from the table above (`STORAGE_DRIVER=vercel-blob`, `BLOB_PUBLIC_BASE_URL`, `GALLERY_MAX_PHOTOS=100`, `DATABASE_URL` pooled `afreqa_app`, `SESSION_SECRET`, `CRON_SECRET`, `DEMO_*` flags, `ADMIN_NOTIFY_EMAIL`, `EMAIL_ALLOWLIST`, SMTP vars).
6. **Deploy**: Trigger **Deploy** (do **not** deploy until you have verified all env vars above).

---

## Post-Deploy Smoke Test Checklist

- [ ] **Public Pages & Ticketing**: Open `/`, `/events`, and `/events/[slug]`; verify ticket CTAs redirect to `https://afreqamusicfestival.hustlesasa.shop/`.
- [ ] **Subscribe & Verify Email**: Submit the newsletter form with an `EMAIL_ALLOWLIST` address -> confirm verification email arrives immediately (via `after()`), click the link -> confirm `/verify-email` activates the subscriber and sends the welcome email.
- [ ] **Vendor & Partner Forms**: Submit `/vendors` and `/partners` -> confirm `ADMIN_NOTIFY_EMAIL` receives both notifications immediately and `/admin/inquiries` shows `VENDOR` / `SPONSORSHIP` rows.
- [ ] **Admin Login & Forced Password Change**: Sign in at `/admin/login` with your `create-admin` account -> confirm redirect to `/admin/change-password`, update password, and confirm access to `/admin`.
- [ ] **Photo Upload**: Go to `/admin/gallery`, upload 1 JPEG/PNG/WebP photo -> confirm quota increments (`1/100`), 3 WebP variants render, and temporary original is deleted.
- [ ] **Vercel Usage & Blob Ops**: In **Vercel Dashboard -> Storage -> Blob** and **Usage**, confirm 4 advanced ops + 1 simple op for the uploaded photo and zero `list()` calls.
- [ ] **Manual Cron Trigger**: Run in PowerShell:
  ```powershell
  Invoke-RestMethod -Method Get -Uri "https://<your-demo>.vercel.app/api/internal/cron" -Headers @{ Authorization = "Bearer <CRON_SECRET>" }
  ```
  Confirm `200 OK` JSON response (`ok: true`) and confirm unauthenticated/query-string requests return `401`.
- [ ] **Neon Cold-Start Check**: Wait 5+ minutes for Neon compute to suspend to zero, then load `/events` and submit a form -> confirm `withColdStartRetry` recovers cleanly.
- [ ] **CSP Report-Only Console Check**: Open DevTools Console on `/gallery`, `/gallery/[slug]`, `/music`, `/events`, and `/admin/gallery` -> confirm zero unexpected CSP violations (`*.public.blob.vercel-storage.com`, `BLOB_PUBLIC_BASE_URL`, `blob.vercel-storage.com`, YouTube/Vimeo, Google Maps, Google Fonts).

---

## Repository Privacy & Live Production Cutover Checklist
- `TonnieD/afreqa` is **private**. Never commit `.env` or real secrets.
- Before switching to the final commercial domain: set `DEMO_CONTENT_UNVERIFIED=false`, `DEMO_BANNER=false`, `ROBOTS_NOINDEX=false`, unset `EMAIL_ALLOWLIST`, keep `DEMO_MODE=false`, switch `Content-Security-Policy-Report-Only` to enforcing `Content-Security-Policy`, and decide on HSTS `includeSubDomains; preload`.
