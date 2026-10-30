"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingBag, ArrowRight, ShieldCheck, Check } from "lucide-react";

interface Variant {
  id: string;
  name: string;
  size?: string | null;
  stockQuantity: number;
  priceKes?: number | null;
}

interface ProductDetailProps {
  product: {
    id: string;
    title: string;
    slug: string;
    description: string;
    basePriceKes: number;
    images: string[];
    variants: Variant[];
  };
}

export function ProductDetailView({ product }: ProductDetailProps) {
  const router = useRouter();
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants[0]?.id || ""
  );
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeVariant =
    product.variants.find((v) => v.id === selectedVariantId) || product.variants[0];
  const priceKes = activeVariant?.priceKes ?? product.basePriceKes;
  const isOutOfStock = !activeVariant || activeVariant.stockQuantity <= 0;

  const handleAddToCart = async () => {
    if (isOutOfStock) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/shop/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variantId: selectedVariantId,
          quantity,
        }),
      });

      if (!res.ok) throw new Error("Could not add item to cart");

      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    router.push("/shop/checkout");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      {/* Product Image Gallery */}
      <div className="rounded-3xl overflow-hidden bg-afreqa-shadow border border-afreqa-chrome-high/15 relative aspect-square">
        <Image
          src={product.images[0] || "/brand/logo.jpg"}
          alt={product.title}
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Product Details & Actions */}
      <div className="space-y-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
            Limited Merch Drop
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight mt-1">
            {product.title}
          </h1>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-3">
            KES {priceKes.toLocaleString()}
          </div>
        </div>

        <p className="text-sm text-zinc-300 leading-relaxed border-y border-white/10 py-4">
          {product.description}
        </p>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
            {error}
          </div>
        )}

        {/* Variant Selectors */}
        <div>
          <label className="block text-xs font-mono uppercase text-zinc-400 mb-2">
            Select Size / Variant
          </label>
          <div className="flex flex-wrap gap-2.5">
            {product.variants.map((v) => {
              const isSelected = v.id === selectedVariantId;
              const disabled = v.stockQuantity <= 0;

              return (
                <button
                  key={v.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => setSelectedVariantId(v.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-mono transition border ${
                    isSelected
                      ? "bg-amber-500 text-black border-amber-400 font-bold shadow-lg shadow-amber-500/10"
                      : disabled
                      ? "bg-white/5 border-white/5 text-zinc-500 cursor-not-allowed line-through"
                      : "bg-white/5 border-white/10 text-white hover:border-white/20"
                  }`}
                >
                  {v.name} {disabled ? "(Sold Out)" : `(${v.stockQuantity} left)`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center gap-4">
          <label className="text-xs font-mono uppercase text-zinc-400">Quantity</label>
          <div className="flex items-center border border-white/15 rounded-xl bg-black/60 text-xs font-mono">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-2 hover:text-amber-400"
            >
              -
            </button>
            <span className="px-3 py-2 text-white font-bold">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="px-3 py-2 hover:text-amber-400"
            >
              +
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="button"
            disabled={loading || isOutOfStock}
            onClick={handleAddToCart}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest transition border ${
              added
                ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                : "bg-white/5 hover:bg-white/10 border-white/15 text-white"
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Added to Cart</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </>
            )}
          </button>

          <button
            type="button"
            disabled={loading || isOutOfStock}
            onClick={handleBuyNow}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-widest shadow-lg hover:shadow-amber-500/20 active:scale-95 transition-all disabled:opacity-50"
          >
            <span>Express Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="pt-4 border-t border-white/10 text-xs text-zinc-400 flex items-center gap-2 font-mono">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Pick up at Gate Turnstiles or Choose Nairobi Courier Delivery</span>
        </div>
      </div>
    </div>
  );
}

