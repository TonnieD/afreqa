import { PrismaClient, Role, EventStatus, TicketPhaseStatus, FaqCategory, PartnerTier } from "@prisma/client";
import { hashPassword } from "../src/auth/password.js";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Afreqa database seed...");

  const isProduction = process.env.NODE_ENV === "production";
  const demoMode = process.env.DEMO_MODE === "true";

  // 1. Seed Super Admin
  const adminEmail = process.env.SEED_ADMIN_EMAIL || (isProduction ? undefined : "admin@afreqa.local");
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || (isProduction ? undefined : "AfreqaAdmin2026!");

  if (!adminEmail || !adminPassword) {
    if (isProduction) {
      throw new Error(
        "FATAL: SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD environment variables are strictly required in production.",
      );
    }
  }

  if (adminEmail && adminPassword) {
    const passwordHash = await hashPassword(adminPassword);
    const superAdmin = await prisma.user.upsert({
      where: { email: adminEmail.toLowerCase() },
      update: {
        mustChangePassword: true,
      },
      create: {
        email: adminEmail.toLowerCase(),
        passwordHash,
        name: "Afreqa Lead Organiser",
        role: Role.SUPER_ADMIN,
        mustChangePassword: true,
      },
    });
    console.log(`✅ Seeded Super Admin: ${superAdmin.email} (mustChangePassword: true)`);
  }

  // 2. Site Settings
  const settings = [
    {
      key: "shop.enabled",
      value: demoMode ? "true" : "false",
      description: "Controls visibility of the merchandise shop routes and navigation",
    },
    {
      key: "hustlesasa.url",
      value: process.env.HUSTLESASA_STORE_URL || "https://afreqanairobi.hustlesasa.shop/",
      description: "Primary external HustleSasa ticket storefront link",
    },
    {
      key: "whatsapp.community_url",
      value: "https://chat.whatsapp.com/sample-afreqa-community",
      description: "Official Afreqa WhatsApp Community / Channel invite link",
    },
    {
      key: "whatsapp.number",
      value: "+254 700 000 000",
      description: "Official Afreqa WhatsApp support number for click-to-chat & vCard",
    },
  ];

  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }
  console.log(`✅ Seeded Site Settings (shop.enabled = ${demoMode ? "true (DEMO_MODE)" : "false"})`);

  // 3. Official Artists from Poster
  const sampleArtists = [
    {
      name: "Coco Kahi",
      slug: "coco-kahi",
      bio: "High-energy selector driving heavy melodic techno and afro-electronic rhythms.",
      genres: ["Afro-Tech", "Melodic Techno"],
      isFictional: false,
    },
    {
      name: "Mike Muema",
      slug: "mike-muema",
      bio: "Nairobi club maestro crafting transcendent basslines and seamless B2B energy.",
      genres: ["Techno", "Afro-House"],
      isFictional: false,
    },
    {
      name: "Nayäkaze",
      slug: "nayakaze",
      bio: "Atmospheric, emotive electronic anthems infused with deep percussive grooves.",
      genres: ["Deep Melodic", "Progressive House"],
      isFictional: false,
    },
    {
      name: "Shock",
      slug: "shock",
      bio: "Driving drops, fast-tempo rave cuts, and relentless dancefloor energy.",
      genres: ["EDM", "Club Rave"],
      isFictional: false,
    },
    {
      name: "Ryte",
      slug: "ryte",
      bio: "Precision electronic mixing and electrifying mainstage drops.",
      genres: ["Dance", "Electronic"],
      isFictional: false,
    },
    {
      name: "Z4V3",
      slug: "z4v3",
      bio: "Polyrhythmic sub-bass fused with modern dance floor anthems.",
      genres: ["Amapiano / EDM Fusion"],
      isFictional: false,
    },
    {
      name: "Alex Gvng Gvng",
      slug: "alex-gvng-gvng",
      bio: "High-octane party starter known for explosive festival energy.",
      genres: ["Mainstage", "Electronic"],
      isFictional: false,
    },
    {
      name: "The Arkitekt",
      slug: "the-arkitekt",
      bio: "Sonic architect crafting deep opening atmospheres.",
      genres: ["Support", "Deep House"],
      isFictional: false,
    },
    {
      name: "DJ Myth",
      slug: "dj-myth",
      bio: "Warmup maestro transitioning the early evening into nocturnal rave territory.",
      genres: ["Support", "Tech House"],
      isFictional: false,
    },
  ];

  const createdArtists = [];
  for (const a of sampleArtists) {
    const artist = await prisma.artist.upsert({
      where: { slug: a.slug },
      update: { bio: a.bio, genres: a.genres },
      create: a,
    });
    createdArtists.push(artist);
  }
  console.log(`✅ Seeded ${createdArtists.length} Official Lineup Artists`);

  // 4. Official Event: Afreqa Nairobi: A Tomorrowland Halloween XP
  const eventDate = new Date("2026-10-24T19:00:00+03:00");

  const sampleEvent = await prisma.event.upsert({
    where: { slug: "halloween-alloy" },
    update: {
      title: "Afreqa Nairobi: A Tomorrowland Halloween XP",
      tagline: "A Tomorrowland Halloween Experience • Alloy Bar & Lounge",
      description:
        "Afreqa presents A Tomorrowland Halloween XP at Alloy Bar & Lounge. High-energy electronic dance music, mind-altering production, and monumental B2B sets. Dress Code: Halloween Creative Costumes. VIP & Table Reservations: 0702 665 665.",
      posterUrl: "/images/afreqa-halloween-alloy.jpg",
      date: eventDate,
      doorsOpen: "19:00",
      doorsClose: "05:00",
      venueName: "Alloy Bar & Lounge",
      venueAddress: "Nairobi, Kenya",
      status: EventStatus.PUBLISHED,
    },
    create: {
      title: "Afreqa Nairobi: A Tomorrowland Halloween XP",
      slug: "halloween-alloy",
      tagline: "A Tomorrowland Halloween Experience • Alloy Bar & Lounge",
      description:
        "Afreqa presents A Tomorrowland Halloween XP at Alloy Bar & Lounge. High-energy electronic dance music, mind-altering production, and monumental B2B sets. Dress Code: Halloween Creative Costumes. VIP & Table Reservations: 0702 665 665.",
      posterUrl: "/images/afreqa-halloween-alloy.jpg",
      date: eventDate,
      doorsOpen: "19:00",
      doorsClose: "05:00",
      venueName: "Alloy Bar & Lounge",
      venueAddress: "Nairobi, Kenya",
      venueCoordinates: "-1.2921,36.8219",
      googleMapsUrl: "https://maps.google.com/?q=Alloy+Bar+and+Lounge+Nairobi",
      transportInfo: "Ample secure parking on-site. Designated Uber/Bolt drop-off portal at main entry.",
      agePolicy: "Strictly 18+ with original National ID or valid passport required at gate.",
      refundPolicy: "Refer to HustleSasa ticket terms: all sales are final unless the event is cancelled.",
      status: EventStatus.PUBLISHED,
      ticketPhases: {
        create: [
          {
            name: "Rave Pass",
            priceKes: 1000,
            status: TicketPhaseStatus.ON_SALE,
            sortOrder: 1,
          },
          {
            name: "Advance Ticket",
            priceKes: 1500,
            status: TicketPhaseStatus.ON_SALE,
            sortOrder: 2,
          },
          {
            name: "VIP Table Package",
            priceKes: 15000,
            status: TicketPhaseStatus.ON_SALE,
            sortOrder: 3,
          },
        ],
      },
    },
  });
  console.log(`✅ Seeded Official Event: ${sampleEvent.title} with 3 Ticket Phases`);

  // Connect lineup to event
  for (let i = 0; i < createdArtists.length; i++) {
    const artist = createdArtists[i]!;
    await prisma.eventArtist.upsert({
      where: {
        eventId_artistId: {
          eventId: sampleEvent.id,
          artistId: artist.id,
        },
      },
      update: {},
      create: {
        eventId: sampleEvent.id,
        artistId: artist.id,
        stageName: i < 2 ? "Main Stage" : "Sound Garden",
        setStartTime: `${20 + i * 2}:00`,
        setEndTime: `${22 + i * 2}:00`,
        sortOrder: i + 1,
      },
    });
  }

  // 5. Sample FAQs
  const faqs = [
    {
      question: "What is the age restriction for Afreqa?",
      answer: "Afreqa is strictly an 18+ event. Original physical National ID, Alien ID, or valid Passport is required at the gates. Photocopies or mobile photos are not accepted.",
      category: FaqCategory.POLICIES,
      sortOrder: 1,
    },
    {
      question: "How do tickets work?",
      answer: "Tickets are sold online through our official ticketing partner HustleSasa. After purchasing, you will receive an e-ticket with a secure QR code on email/SMS to scan at the gate.",
      category: FaqCategory.TICKETING,
      sortOrder: 2,
    },
    {
      question: "What is the refund policy?",
      answer: "All ticket purchases are non-refundable in accordance with HustleSasa ticket guidelines. If an event is postponed or cancelled, tickets automatically transfer to the rescheduled date or are refunded per organizer notice.",
      category: FaqCategory.POLICIES,
      sortOrder: 3,
    },
    {
      question: "What items are prohibited?",
      answer: "Outside alcohol/food, weapons of any nature, illegal substances, fireworks, laser pointers, and unaccredited professional video cameras are strictly forbidden.",
      category: FaqCategory.VENUE,
      sortOrder: 4,
    },
    {
      question: "Is there parking and rideshare pickup?",
      answer: "Yes, secure on-site parking is available. A dedicated Uber / Bolt ride-share pickup lounge operates outside Gate B throughout the night.",
      category: FaqCategory.TRANSPORT,
      sortOrder: 5,
    },
  ];

  for (const f of faqs) {
    await prisma.faqItem.create({ data: f });
  }
  console.log(`✅ Seeded ${faqs.length} Festival FAQ items`);

  // 6. Sample Partners
  const partners = [
    { name: "HustleSasa", logoUrl: "/assets/partners/hustlesasa.svg", tier: PartnerTier.OFFICIAL, sortOrder: 1 },
    { name: "Nairobi EDM Scene", logoUrl: "/assets/partners/nairobi-edm.svg", tier: PartnerTier.MEDIA, sortOrder: 2 },
    { name: "Carnivore Grounds", logoUrl: "/assets/partners/carnivore.svg", tier: PartnerTier.OFFICIAL, sortOrder: 3 },
  ];

  for (const p of partners) {
    await prisma.partner.create({ data: p });
  }
  console.log(`✅ Seeded ${partners.length} Partner items`);

  // 7. If DEMO_MODE is true, seed clearly fake sample merch
  if (demoMode) {
    const hoodie = await prisma.product.upsert({
      where: { slug: "afreqa-oversized-rave-hoodie" },
      update: {},
      create: {
        title: "Afreqa Signature Oversized Rave Hoodie [Demo Item]",
        slug: "afreqa-oversized-rave-hoodie",
        description: "Heavyweight 450 GSM brushed fleece with metallic chrome Afreqa frequency bar print. Sample demo merch.",
        basePriceKes: 4500,
        images: ["/assets/shop/hoodie-sample.jpg"],
        isActive: true,
        variants: {
          create: [
            { name: "Medium / Acid Black", size: "M", color: "Acid Black", sku: "HOODIE-BLK-M", stockQuantity: 15 },
            { name: "Large / Acid Black", size: "L", color: "Acid Black", sku: "HOODIE-BLK-L", stockQuantity: 20 },
            { name: "XL / Acid Black", size: "XL", color: "Acid Black", sku: "HOODIE-BLK-XL", stockQuantity: 10 },
          ],
        },
      },
    });

    const tee = await prisma.product.upsert({
      where: { slug: "afreqa-chrome-acid-tee" },
      update: {},
      create: {
        title: "Afreqa Chrome Acid Tee [Demo Item]",
        slug: "afreqa-chrome-acid-tee",
        description: "100% organic cotton oversized rave tee with high-density silver logo print. Sample demo merch.",
        basePriceKes: 2500,
        images: ["/assets/shop/tee-sample.jpg"],
        isActive: true,
        variants: {
          create: [
            { name: "Medium / Off-Black", size: "M", color: "Off-Black", sku: "TEE-BLK-M", stockQuantity: 30 },
            { name: "Large / Off-Black", size: "L", color: "Off-Black", sku: "TEE-BLK-L", stockQuantity: 25 },
          ],
        },
      },
    });

    console.log(`✅ Seeded 2 Demo Merch Products (DEMO_MODE=true)`);
  }

  console.log("✨ Seed completed successfully.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed with error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

