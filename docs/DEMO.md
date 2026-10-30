# Afreqa Website — 5-Minute Founder Showcase Script

> **Purpose:** Script for demonstrating the newly engineered Afreqa web platform to the brand founders and leadership team.

---

## 🎪 Step 1: Cinematic Public Festival Site (0:00 – 1:00)
1. **Navigate to `http://localhost:3001` (or production URL)**.
2. **Point out Brand Theme & Motion Engine:**
   * Showcase the Tomorrowland-inspired nocturnal aesthetic (Crowd Night Shadow `#0B0504`, Canvas Deep Sky `#162229`, Aurora Teal `#16F4D0`, Electric Violet `#7B2FF7`).
   * Observe the subtle ambient laser beams in the background and the audio wave indicator in the navigation header.
3. **Hero & Countdown Timer:**
   * Review the large typography, event date, doors open countdown timer, and venue details.
4. **Dynamic Ticket Phase Strip:**
   * Highlight the 4 ticket phases (*Early Bird*, *Phase 1*, *Final Release*, *Gate*).
   * Note how prices and active on-sale statuses are driven directly from the PostgreSQL database, never hardcoded.

---

## 🎟️ Step 2: Non-Blocking Hybrid Ticketing (1:00 – 1:45)
1. **Click "Get Tickets" or any Phase Strip CTA**.
2. **Observe Instant HTTP 302 Redirect:**
   * Raver is redirected immediately to Afreqa's official HustleSasa portal (`https://afreqanairobi.hustlesasa.shop/`) with clean UTM tracking parameters (`utm_source=afreqa_website&utm_medium=hero_cta`).
3. **Point out Behind-the-Scenes Mechanics:**
   * The redirect occurs with zero delay (non-blocking).
   * A Postgres sliding-window rate limiter prevents click bot scraping.
   * Every click is asynchronously recorded in `ClickEvent` for conversion analytics in the Admin dashboard.

---

## 📱 Step 3: Audience Capture & WhatsApp Growth (1:45 – 2:45)
1. **Scroll to "Inner Circle Access" or click "Join Frequency"**:
   * Open the subscription modal.
2. **Demonstrate Unbundled Privacy-First Consent:**
   * Enter email (`dancer@example.com`).
   * Enter a Kenyan mobile number (`0712 345 678`). Observe that it automatically formats to international E.164 (`+254 712 345 678`).
   * Check "Opt into WhatsApp Broadcasts" and select music interests.
   * Point out the KDPA 2019 compliance notice and hidden honeypot bot trap.
3. **Submit Subscription:**
   * Open Mailpit at `http://localhost:8025`.
   * Open the dark festival-themed verification email and click **Verify My Frequency**.
4. **Post-Signup Frequency Activation Screen:**
   * Show the celebratory confirmation screen.
   * **Click "Download .VCF Contact Card"**: Shows how the generated vCard saves Afreqa to the raver's phone in one tap, guaranteeing WhatsApp broadcast delivery!
   * Click "Open WhatsApp" to join the community group.

---

## 📸 Step 4: Visual Gallery & Media Engine (2:45 – 3:30)
1. **Navigate to `/gallery`**:
   * Browse festival edition albums with cover art and media counters.
2. **Featured Video Player:**
   * Point out the privacy-preserving "lite" facade that prevents tracking cookies from loading until the user hits Play.
3. **Navigate to `/gallery/resonance-2026`**:
   * View the photo grid.
   * **Attempt to Right-Click or Drag an Image:** Show the visual deterrent protection in action.
   * Click any photo to open the fullscreen Lightbox with photographer credits and keyboard arrow navigation.

---

## 🛡️ Step 5: Operations Control & Admin Panel (3:30 – 4:30)
1. **Navigate to `/admin/login`**:
   * Sign in with staff credentials.
   * If first time, observe forced password change for super-admin security.
2. **Explore Dashboard (`/admin`)**:
   * Review real-time KPI metrics: Total Audience, Verified Members, WhatsApp Broadcast Reach, HustleSasa Ticket Leads, Active Events.
   * Review the live ticket click stream and security audit feed.
3. **Events & Lineup Manager (`/admin/events`)**:
   * Show how festival editions, ticket phase prices, and DJ slots can be updated in seconds.
   * Show the image uploader using sharp (GPS data stripped automatically).
4. **Audience CRM & CSV Export (`/admin/subscribers`)**:
   * View subscriber records with interest filters.
   * **Click "Export Sanitized CSV"**: Point out that cells are escaped against formula injection (`=, +, -, @` prefixed with `'`) and the export is recorded in the append-only audit trail!
5. **Audit Log Trail (`/admin/audit`)**:
   * Show the immutable log trail where personal data (emails/phones) is masked and DB-level `UPDATE`/`DELETE` are permanently revoked.

---

## 🛍️ Step 6: Feature-Flagged Merch Shop (4:30 – 5:00)
1. **Explain the Feature Flag Safety Architecture:**
   * In production, the shop defaults to `OFF` (returns 404).
   * In `DEMO_MODE=true`, the shop is activated with fake sample merch for demonstration.
2. **Navigate to `/shop`**:
   * View festival apparel (Hoodie, Rave Tee, 5-Panel Cap).
   * Select a variant, add to cart, and click "Express Checkout".
3. **Simulate Checkout (`/shop/checkout`)**:
   * Enter customer details, choose "Event Gate Pickup" or "Nairobi Courier Delivery".
   * Click "Pay (M-Pesa / Card)".
   * Order is atomically created, inventory decremented, and an automated HTML-only receipt arrives in Mailpit!

---

## 🏁 Summary for Founders
* **100% Owned Platform:** Captures real dancer emails and WhatsApp numbers without platform lock-in.
* **Cheapest-First Architecture:** Zero marginal API costs for local ticketing, vCard downloads, and community broadcast lists.
* **Enterprise Security:** KDPA 2019 compliant, OWASP formula-injection hardened, and append-only database roles.

