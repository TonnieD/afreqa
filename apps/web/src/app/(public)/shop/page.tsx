import Link from "next/link";
import Image from "next/image";
import { db } from "@afreqa/core";
import { requireShopEnabled } from "@/lib/shop";
import { ShoppingBag, Sparkles, Tag, ArrowUpRight } from "lucide-react";

export const metadata = {
  title: "Official Merch Catalog | Afreqa Nairobi",
  description: "Limited edition festival apparel, rave hoodies, and official Afreqa electronic music merchandise.",
};

const SAMPLE_PRODUCTS = [
  {
    id: "prod-01",
    title: "Afreqa 'Resonance' Acid Black Hoodie",
    slug: "resonance-acid-black-hoodie",
    description: "450GSM ultra-heavyweight brushed cotton hoodie featuring high-density chrome typography and neon teal cuff embroidery.",
    basePriceKes: 3500,
    images: ["/brand/logo.jpg"],
    variants: [
      { id: "v1", name: "Medium", size: "M", stockQuantity: 15 },
      { id: "v2", name: "Large", size: "L", stockQuantity: 20 },
      { id: "v3", name: "XL", size: "XL", stockQuantity: 8 },
    ],
  },
  {
    id: "prod-02",
    title: "Afreqa Nocturnal Heavyweight Rave Tee",
    slug: "nocturnal-rave-tee",
    description: "Vintage washed streetwear cut featuring reflective silver back graphic and breathable festival-tested cotton.",
    basePriceKes: 2200,
    images: ["/brand/logo.jpg"],
    variants: [
      { id: "v4", name: "Small", size: "S", stockQuantity: 12 },
      { id: "v5", name: "Medium", size: "M", stockQuantity: 25 },
      { id: "v6", name: "Large", size: "L", stockQuantity: 30 },
    ],
  },
  {
    id: "prod-03",
    title: "Afreqa Laser Reflective 5-Panel Cap",
    slug: "reflective-5-panel-cap",
    description: "Custom nylon ripstop cap with holographic under-visor and quick-release tactical buckle.",
    basePriceKes: 1500,
    images: ["/brand/logo.jpg"],
    variants: [{ id: "v7", name: "One Size", size: "OS", stockQuantity: 40 }],
  },
];

export default async function ShopPage() {
  await requireShopEnabled();

  let products = SAMPLE_PRODUCTS;

  try {
    const dbProducts = await db.product.findMany({
      where: { isActive: true },
      include: { variants: true },
      orderBy: { createdAt: "desc" },
    });

    if (dbProducts.length > 0) {
      products = dbProducts.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        description: p.description,
        basePriceKes: p.basePriceKes,
        images: p.images.length > 0 ? p.images : ["/brand/logo.jpg"],
        variants: p.variants.map((v) => ({
          id: v.id,
          name: v.name,
          size: v.size || "M",
          stockQuantity: v.stockQuantity,
        })),
      }));
    }
  } catch {
    // If DB offline
  }

  return (
    <div className="space-y-16 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      {/* Shop Header */}
      <section className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-afreqa-teal/15 border border-afreqa-teal/40 text-afreqa-teal text-xs font-mono font-bold tracking-widest uppercase mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Official Drop</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-afreqa-chrome-high uppercase tracking-tight">
          Afreqa Merch Supply
        </h1>
        <p className="text-sm sm:text-base text-afreqa-silver max-w-xl mx-auto mt-4 leading-relaxed">
          High-performance festival streetwear engineered for the soundwaves. Limited quantities per edition.
        </p>
      </section>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/shop/${product.slug}`}
            className="group rounded-3xl bg-afreqa-stage/80 border border-afreqa-chrome-high/10 overflow-hidden hover:border-afreqa-teal/50 transition-all duration-300 shadow-xl flex flex-col justify-between hover:-translate-y-1"
          >
            <div>
              <div className="relative aspect-square w-full bg-afreqa-shadow overflow-hidden">
                <Image
                  src={product.images[0] || "/brand/logo.jpg"}
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-xs font-mono font-bold text-afreqa-teal">
                  KES {product.basePriceKes.toLocaleString()}
                </div>
              </div>

              <div className="p-6 space-y-2">
                <h3 className="font-display font-bold text-lg text-afreqa-chrome-high group-hover:text-afreqa-teal transition-colors">
                  {product.title}
                </h3>
                <p className="text-xs text-afreqa-silver line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0 flex items-center justify-between border-t border-afreqa-chrome-high/5 mt-4">
              <span className="text-[11px] font-mono text-afreqa-silver-mid">
                {product.variants.reduce((acc, v) => acc + v.stockQuantity, 0)} units in stock
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-afreqa-teal">
                <span>View Options</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

