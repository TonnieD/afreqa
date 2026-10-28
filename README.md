# Afreqa Website — Official Brand & Showcase Platform

> **Kenya's Hub for Electronic Dance Music**  
> Full-stack web application, hybrid ticketing, audience capture, and media showcase for Afreqa.

---

## ⚡ 10-Minute Local Quickstart (Docker Compose)

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) & [Docker Compose](https://docs.docker.com/compose/)
- [Node.js 22+](https://nodejs.org/) & [pnpm 10+](https://pnpm.io/)

### 1. Clone & Setup Environment
```bash
cp .env.example .env
```

### 2. Boot the Entire Stack
```bash
make dev
```
This single command spins up:
- **Web**: Next.js 15 App Router at [http://localhost:3000](http://localhost:3000)
- **Database**: PostgreSQL 16 on port `5432` with dual DB roles (`afreqa_owner` & `afreqa_app`)
- **Worker**: Background queue runner (`pg-boss` + `ffmpeg`) for async emails, photos, and video transcoding
- **Mailpit**: Dev SMTP mail catcher & web viewer at [http://localhost:8025](http://localhost:8025)

### 3. Seed Demo Data
In a new terminal window:
```bash
make migrate
make seed
```

This seeds:
- Super Admin: `admin@afreqa.local` / `AfreqaAdmin2026!` (forced password reset on first login)
- Sample Event: *Afreqa: Resonance* with 4 ticket phases and venue directions
- 4 Fictional Sample DJs (DJ Nova Rift, Kazi Pulse, Zuri Bass, Solar Soundwave)
- Sample FAQs, festival partners, and demo merch (when `DEMO_MODE=true`)

---

## 🛠️ Architecture Overview

The repository is organized as a **pnpm workspaces monorepo**:

* **`apps/web`**: Next.js 15 App Router (Server Components, Route Handlers, Server Actions).
* **`packages/core`**: Shared domain logic, Prisma ORM schema, dual DB role client, `StorageProvider`, `sharp` photo processing pipeline, Postgres-backed atomic rate limiter, and `@node-rs/argon2` authentication.
* **`worker`**: Asynchronous background job processor running `pg-boss` with `ffmpeg`/`ffprobe` inside a dedicated worker container.
* **`docker/`**: Multi-stage Dockerfiles (`Dockerfile.web` lean without ffmpeg; `Dockerfile.worker` with ffmpeg), Caddy reverse proxy config, role initialization SQL, and backup/restore scripts.

---

## 🔐 Security & Append-Only Audit Trail

* **Database Role Separation**:
  * `afreqa_owner`: Schema migrations and DDL.
  * `afreqa_app`: Runtime application queries with `UPDATE` and `DELETE` explicitly REVOKED on the `AuditLog` table.
* **Data Sanitization**: Personal identifiable information (raw emails and phone numbers) is automatically masked before writing to audit payloads.
* **CSV Export Hardening**: All exported CSV cells starting with `=, +, -, @, \t, \r` are prefixed with `'` to prevent spreadsheet formula injection.

---

## 📋 Common Makefile Commands

| Command | Description |
|---|---|
| `make dev` | Boot complete local stack with Docker Compose |
| `make dev-down` | Stop and teardown local containers |
| `make migrate` | Execute Prisma database migrations |
| `make seed` | Ingest demo event, DJs, FAQs, and super-admin |
| `make test` | Run Vitest unit & integration test suite |
| `make lint` | Run ESLint across all workspaces |
| `make typecheck` | Run strict TypeScript compiler verification |
| `make backup` | Create a compressed `.sql.gz` PostgreSQL backup in `./backups/` |
| `make restore FILE=...` | Restore database from a backup archive |

