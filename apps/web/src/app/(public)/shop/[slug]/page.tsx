import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@afreqa/core";
import { requireShopEnabled } from "@/lib/shop";
import { ArrowLeft } from "lucide-react";
import { ProductDetailView } from "@/components/shop/ProductDetailView";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  await requireShopEnabled();
  const { slug } = await params;

  let product: {
    id: string;
    title: string;
    slug: string;
    description: string;
    basePriceKes: number;
    images: string[];
    variants: Array<{
      id: string;
      name: string;
      size: string | null;
      stockQuantity: number;
      priceKes: number | null;
    }>;
  } | null = null;

  try {
    const dbProduct = await db.product.findUnique({
      where: { slug },
      include: { variants: true },
    });

    if (dbProduct) {
      product = {
        id: dbProduct.id,
        title: dbProduct.title,
        slug: dbProduct.slug,
        description: dbProduct.description,
        basePriceKes: dbProduct.basePriceKes,
        images: dbProduct.images.length > 0 ? dbProduct.images : ["/brand/logo.jpg"],
        variants: dbProduct.variants.map((v) => ({
          id: v.id,
          name: v.name,
          size: v.size,
          stockQuantity: v.stockQuantity,
          priceKes: v.priceKes,
        })),
      };
    }
  } catch {
    // If DB offline
  }

  // Fallback sample product if DB not populated
  if (!product) {
    if (slug === "resonance-acid-black-hoodie") {
      product = {
        id: "prod-mock-1",
        title: "Afreqa 'Resonance' Acid Black Hoodie",
        slug,
        description: "450GSM ultra-heavyweight brushed cotton hoodie with high-density chrome graphics.",
        basePriceKes: 3500,
        images: ["/brand/logo.jpg"],
        variants: [
          { id: "v1", name: "Medium", size: "M", stockQuantity: 15, priceKes: 3500 },
          { id: "v2", name: "Large", size: "L", stockQuantity: 20, priceKes: 3500 },
          { id: "v3", name: "XL", size: "XL", stockQuantity: 8, priceKes: 3500 },
        ],
      };
    } else {
      notFound();
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Link
        href="/shop"
        className="inline-flex items-center gap-1.5 text-xs font-mono text-afreqa-silver hover:text-afreqa-teal transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Merch Supply</span>
      </Link>

      <ProductDetailView product={product} />
    </div>
  );
}

