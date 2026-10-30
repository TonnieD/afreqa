# Afreqa Website — Production Operations Runbook

> **Target Platform:** Single Ubuntu 22.04/24.04 LTS Virtual Private Server (VPS)  
> **Container Engine:** Docker & Docker Compose with Caddy Reverse Proxy  
> **Stack Components:** Next.js 15 Web, PostgreSQL 16 (dual-role), Background Worker (`pg-boss` + `ffmpeg`), Caddy (Auto-HTTPS)

---

## 1. Server Sizing & Initial VPS Provisioning

### Recommended Specifications
* **CPU:** 2 to 4 vCPUs (AMD EPYC or Intel Xeon)
* **RAM:** 4 GB minimum (8 GB recommended for heavy video transcoding)
* **Storage:** 50 GB to 100 GB NVMe SSD
* **Bandwidth:** 2 TB+ monthly transfer

### Initial Host Setup (Ubuntu 22.04 / 24.04)

```bash
# Update base system packages
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git ufw htop gzip

# Configure UFW firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP (Caddy ACME challenge)
sudo ufw allow 443/tcp   # HTTPS (TLS traffic)
sudo ufw enable
```

### Install Docker Engine & Compose Plugin
```bash
# Install official Docker repository
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
newgrp docker
docker --version && docker compose version
```

---

## 2. Codebase Deployment & Production Configuration

```bash
# Clone repository to production directory
sudo mkdir -p /var/www/afreqa
sudo chown -R $USER:$USER /var/www/afreqa
git clone https://github.com/afreqa/afreqa-website.git /var/www/afreqa
cd /var/www/afreqa
```

### Create `/var/www/afreqa/.env`
Generate cryptographic keys with `openssl rand -hex 32`:

```env
# Node Environment
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://afreqa.com

# PostgreSQL Dual-Role Credentials
POSTGRES_USER=postgres
POSTGRES_PASSWORD=GENERATE_STRONG_POSTGRES_PASSWORD_HERE
POSTGRES_DB=afreqa_db
POSTGRES_PORT=5432

# Runtime Application URL (Restricted DB user)
DATABASE_URL=postgresql://afreqa_app:APP_PASSWORD_HERE@db:5432/afreqa_db
# Migration Owner URL
DATABASE_OWNER_URL=postgresql://postgres:GENERATE_STRONG_POSTGRES_PASSWORD_HERE@db:5432/afreqa_db

# Security & Session Secrets
SESSION_SECRET=GENERATE_64_CHAR_HEX_SECRET_HERE

# Super-Admin Initial Seed (Forced password reset on first login)
SEED_ADMIN_EMAIL=operations@afreqa.com
SEED_ADMIN_PASSWORD=GENERATE_TEMPORARY_ADMIN_PASSWORD_HERE

# Merch Shop Feature Flag (Set false for initial launch; true only when merch is ready)
DEMO_MODE=false

# HustleSasa Production Portal
HUSTLESASA_STORE_URL=https://afreqanairobi.hustlesasa.shop/

# Production SMTP (e.g., Brevo, Resend, or AWS SES)
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your-smtp-login@afreqa.com
SMTP_PASS=your-smtp-password
SMTP_FROM=Afreqa Nairobi <frequencies@afreqa.com>

# Optional WhatsApp Cloud API (Keep empty for manual cheapest-first mode)
WHATSAPP_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
```

---

## 3. Production Boot & Database Migration

```bash
# Build and boot the production containers with Caddy reverse proxy
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Run database migrations with the owner role
docker compose exec web pnpm --filter @afreqa/core db:migrate

# Seed administrative accounts and initial festival configuration
docker compose exec web pnpm --filter @afreqa/core db:seed
```

---

## 4. Domain Name & Automated SSL/TLS (Caddy)

1. **Point DNS Records** at your registrar (Cloudflare, Namecheap, GoDaddy):
   * `A` record: `afreqa.com` → `YOUR_SERVER_IP`
   * `A` record: `www.afreqa.com` → `YOUR_SERVER_IP`
2. Update `docker/Caddyfile`:
   Replace `:80` with `afreqa.com, www.afreqa.com` and specify your contact email for Let's Encrypt expiry notices:
   ```caddy
   afreqa.com, www.afreqa.com {
       tls admin@afreqa.com
       request_body {
           max_size 4500MB
       }
       # ...
   }
   ```
3. Reload Caddy without downtime:
   ```bash
   docker compose restart caddy
   ```

---

## 5. Automated Daily Database Backups (Cron)

Set up a daily automated backup at 03:00 EAT (00:00 UTC):

```bash
# Test backup script manually
bash docker/scripts/backup.sh

# Open crontab
crontab -e
```

Add the following cron line:
```cron
0 0 * * * cd /var/www/afreqa && bash docker/scripts/backup.sh >> /var/log/afreqa_backup.log 2>&1
# Prune backups older than 14 days
0 1 * * * find /var/www/afreqa/backups -type f -name "*.sql.gz" -mtime +14 -delete
```

### Restoring from Backup
```bash
# To restore a previous database state:
bash docker/scripts/restore.sh backups/afreqa_db_20261029_120000.sql.gz
```

---

## 6. Healthchecks & Monitoring

* **Application Health Endpoint:**
  ```bash
  curl -i https://afreqa.com/api/health
  # Response: {"status":"ok","db":"connected","uptime":...}
  ```
* **Container Resource Monitoring:**
  ```bash
  docker stats --no-stream
  ```
* **Real-time Log Streaming:**
  ```bash
  # Web application
  docker compose logs -f web --tail=100

  # Background queue & worker
  docker compose logs -f worker --tail=100
  ```

---

## 7. Zero-Downtime Deployment & Code Updates

To deploy new code updates:

```bash
cd /var/www/afreqa
git pull origin main

# Rebuild changed containers
docker compose -f docker-compose.yml -f docker-compose.prod.yml build web worker

# Apply any pending schema migrations
docker compose exec web pnpm --filter @afreqa/core db:migrate

# Gracefully restart application containers
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --no-deps web worker
```

