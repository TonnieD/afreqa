# Afreqa Website — Content Audit & Placeholder Tracker (`CONTENT_TODO.md`)

> **Purpose:** In accordance with project requirements, the website never invents factual claims about Afreqa (dates, artists, attendance, prices, policies). All initial demo data uses strictly fictional sample artists, license-free/generated placeholder media, and clearly marked sample events. This document tracks every placeholder entity, policy detail, copy block, and external link that needs real confirmation from the Afreqa team before production deployment.

---

## 1. Brand Identity & Social Links (All Placeholders Pending Confirmation)

| Item | Current Value / Placeholder | Source / Needed Input | Status |
|---|---|---|---|
| **Official Logo** | `assets/brand/logo.jpg` (chrome 3D lettering with African continent frequency bars) | Verified in repo | Awaiting transparent PNG/SVG |
| **Color Palette Swatches** | Sampled from `assets/brand/logo.jpg` (see Section 6 below) | Direct pixel sampling | Awaiting Owner Swatch Approval |
| **Official Instagram** | `https://instagram.com/afreqa_` | Unconfirmed placeholder | **Pending Owner Confirmation** |
| **Official TikTok** | `https://tiktok.com/@afreqa_` | Unconfirmed placeholder | **Pending Owner Confirmation** |
| **Official YouTube** | `https://youtube.com/@afreqanairobi` | Unconfirmed placeholder | **Pending Owner Confirmation** |
| **WhatsApp Community Link** | `https://chat.whatsapp.com/sample-afreqa-community` | Unconfirmed placeholder | **Pending Owner Confirmation** |
| **Official WhatsApp Number** | `+254 700 000 000` (for click-to-chat & vCard) | Unconfirmed placeholder | **Pending Owner Confirmation** |
| **HustleSasa Store URL** | `https://afreqanairobi.hustlesasa.shop/` | PRD §12, Admin configurable | Configured default |
| **Hero Video Loop** | License-free dark ambient festival laser loop (Unsplash/Pexels license) | Placeholder media | Sample placeholder |

---

## 2. Event & Fictional DJ Placeholders (Demo Dataset)

*Note: All artist names and personas below are strictly fictional for showcase demonstration.*

| Entity | Placeholder Value | Required Real Value | Notes |
|---|---|---|---|
| **Next Event Title** | "Afreqa: Resonance" | Real next event title | Labeled `[Sample Demo Event]` |
| **Next Event Date/Time** | +30 days from launch, 18:00 – 06:00 EAT | Actual event date & doors time | Live countdown binds to this |
| **Venue & Location** | "The Carnivore Grounds / Waterfront Karen, Nairobi" | Actual confirmed venue | Maps link & directions placeholder |
| **Lineup (Fictional Artists)** | DJ Nova Rift (Afro-Tech), Kazi Pulse (Deep Melodic), Zuri Bass (Amapiano/EDM), Solar Soundwave (Progressive House) | Actual booked DJ roster | Purely fictional sample DJs |
| **Ticket Phases** | Early Bird: KES 1,500; Phase 1: KES 2,000; Final: KES 2,500; Gate: KES 3,500 | Actual phase names, prices & HustleSasa ticket links | Configured in admin; never hardcoded |
| **Past Editions** | "Afreqa Edition 001", "Afreqa Solstice 2025" | Historical dates, lineups, attendance numbers | Gallery albums linked to these |

---

## 3. Critical Festival Policies (Must Confirm with Afreqa — Never Invented)

| Policy / Rule | Current Placeholder Assumption | Real Policy Requirement from Afreqa | Action Item |
|---|---|---|---|
| **Refund Policy** | HustleSasa standard policy: "All ticket sales are final and non-refundable unless the event is cancelled." | Official Afreqa / HustleSasa refund and postponement policy | **Confirm with Afreqa Team** |
| **Age Policy** | Strict 18+ policy with mandatory government ID / passport check at gate | Official age limit and acceptable identification forms | **Confirm with Afreqa Team** |
| **Door & Gate Policy** | Doors open 18:00, last entry 02:00, no pass-outs | Confirmed entry times and re-entry / pass-out rules | **Confirm with Afreqa Team** |
| **Prohibited Items** | Standard list: outside food/drinks, weapons, illicit substances, professional camera rigs without press pass | Afreqa venue security prohibited items list | **Confirm with Afreqa Team** |
| **Parking & Transport** | Dedicated on-site parking + designated Uber / Bolt drop-off & pick-up zone | Venue-specific parking fees, designated rideshare location | **Confirm with Afreqa Team** |
| **Health & Safety** | On-site medics, emergency medical tent, earplugs available at merchandise booth | Medical partner name, security protocols, accessibility accommodations | **Confirm with Afreqa Team** |

---

## 4. Copy & Editorial Text

| Page / Section | Current Placeholder Text | Notes / Action Item |
|---|---|---|
| **About Page** | Festival fantasy origin story and mission statement for electronic music in East Africa | Afreqa team to review and provide authentic founder story |
| **FAQ Page** | Searchable answers reflecting the unconfirmed policies in Section 3 above | Must be verified against Afreqa operations |
| **Contact Form Topics** | General Enquiries, Sponsorship & Partnerships, Artist Bookings, Media & Press | Recipient email addresses configured in site settings |
| **Privacy Policy & Terms** | KDPA 2019-aligned privacy terms & cookie notice | Afreqa legal review prior to production launch |

---

## 5. Merch Shop (Feature-Flagged OFF — DEMO_MODE for Showcase)

| Item | Placeholder Value | Notes |
|---|---|---|
| **Products** | "Afreqa Signature Oversized Rave Hoodie", "Afreqa Chrome Acid Tee", "Afreqa Bucket Hat" | License-free 3D apparel mockups; enabled in `DEMO_MODE=true` |
| **Pricing & Stock** | Sample KES pricing with variant matrix (S, M, L, XL, XXL) | Managed in Admin |
| **Delivery Fees** | Nairobi Courier (KES 300), Rest of Kenya (KES 600), Event Booth Pickup (Free) | Admin configurable |

---

## 6. Sampled Palette Swatches from `assets/brand/logo.jpg`

The following exact color values were sampled directly from `assets/brand/logo.jpg` via pixel analysis:

| Swatch Name | Sampled Hex | RGB Values | Role in Design System |
|---|---|---|---|
| **Canvas Deep Sky** | `#162229` | `22, 34, 41` | Deep slate/midnight canvas with subtle cool undertone |
| **Crowd Night Shadow** | `#0B0504` | `11, 5, 4` | Deepest background base & card backgrounds |
| **Stage Dark Foliage** | `#24201D` | `36, 32, 29` | Warm dark neutral for borders and card surfaces |
| **Africa Frequency Bars**| `#B6B5B5` | `182, 181, 181` | Metallic silver for icons, secondary text, and divider lines |
| **Chrome High Reflection**| `#EDECEC` | `237, 236, 236` | Specular chrome highlight for primary headings & hero typography |
| **Chrome Metallic Mid** | `#ADADAC` | `173, 173, 172` | Brushed silver for buttons, badges, and active states |
| **Dark 3D Bevel Edge** | `#261E1D` | `38, 30, 29` | Drop shadow and border bevel for metallic card effects |
| **Warm Amber Stage Light**| `#372308` | `55, 35, 8` | Warm gold/amber accent for VIP ticket phases and countdown |
| **Festival Crimson Light** | `#370609` | `55, 6, 9` | Neon laser crimson for alerts and urgent "Sold Out" badges |

---

*Last Updated: 2026-10-28 by Antigravity*
