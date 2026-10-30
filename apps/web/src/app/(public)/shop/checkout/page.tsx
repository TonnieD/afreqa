"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, ArrowLeft, ShieldCheck, Check, Lock } from "lucide-react";

interface CartItemData {
  id: string;
  quantity: number;
  variant: {
    id: string;
    name: string;
    priceKes?: number | null;
    product: {
      title: string;
      basePriceKes: number;
      images: string[];
    };
  };
}

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItemData[]>([]);
  const [loadingCart, setLoadingCart] = useState(true);

  // Form
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<"PICKUP" | "COURIER">("PICKUP");
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingCity, setShippingCity] = useState("Nairobi");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/shop/cart")
      .then((res) => {
        if (!res.ok) throw new Error("Could not load cart");
        return res.json();
      })
      .then((data) => {
        setItems(data.items || []);
        setLoadingCart(false);
      })
      .catch(() => setLoadingCart(false));
  }, []);

  const subtotalKes = items.reduce((acc, item) => {
    const price = item.variant.priceKes ?? item.variant.product.basePriceKes;
    return acc + price * item.quantity;
  }, 0);

  const deliveryFeeKes = deliveryMethod === "COURIER" ? 300 : 0;
  const totalKes = subtotalKes + deliveryFeeKes;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/shop/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          deliveryMethod,
          shippingAddress: deliveryMethod === "COURIER" ? shippingAddress : undefined,
          shippingCity: deliveryMethod === "COURIER" ? shippingCity : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to process checkout");
      }

      if (data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
      } else {
        router.push(`/shop/checkout/success?orderNumber=${data.orderNumber}`);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  };

  if (loadingCart) {
    return (
      <div className="py-24 text-center text-xs font-mono text-afreqa-silver-mid">
        Loading cart details...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-24 text-center max-w-md mx-auto px-4">
        <ShoppingBag className="w-12 h-12 text-afreqa-silver-mid mx-auto mb-3 opacity-50" />
        <h2 className="text-xl font-bold text-afreqa-chrome-high">Your Cart is Empty</h2>
        <p className="text-xs text-afreqa-silver-mid mt-2 mb-6">
          Explore limited festival drops and grab your gear before sizes sell out.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-afreqa-teal text-afreqa-shadow font-extrabold text-xs uppercase tracking-wider"
        >
          <span>Browse Merch</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Link
        href="/shop"
        className="inline-flex items-center gap-1.5 text-xs font-mono text-afreqa-silver hover:text-afreqa-teal transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Continue Shopping</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <form onSubmit={handleCheckout} className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl bg-afreqa-stage/80 border border-afreqa-chrome-high/15 p-6 sm:p-8 space-y-4">
            <h2 className="font-display font-extrabold text-xl text-afreqa-chrome-high uppercase tracking-wide border-b border-afreqa-chrome-high/10 pb-3">
              1. Customer Information
            </h2>

            {error && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-afreqa-silver mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Amani Mwangi"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-afreqa-shadow border border-afreqa-chrome-high/15 text-afreqa-chrome-high text-sm focus:outline-none focus:border-afreqa-teal transition"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-afreqa-silver mb-1">
                  Email Address (Receipt Dispatch) *
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="amani@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-afreqa-shadow border border-afreqa-chrome-high/15 text-afreqa-chrome-high text-sm focus:outline-none focus:border-afreqa-teal transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-afreqa-silver mb-1">
                Phone Number (M-Pesa / Courier) *
              </label>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="0712 345 678 or +254 712 345 678"
                className="w-full px-3.5 py-2.5 rounded-xl bg-afreqa-shadow border border-afreqa-chrome-high/15 text-afreqa-chrome-high text-sm focus:outline-none focus:border-afreqa-teal transition font-mono"
              />
            </div>
          </div>

          {/* Delivery Method */}
          <div className="rounded-3xl bg-afreqa-stage/80 border border-afreqa-chrome-high/15 p-6 sm:p-8 space-y-4">
            <h2 className="font-display font-extrabold text-xl text-afreqa-chrome-high uppercase tracking-wide border-b border-afreqa-chrome-high/10 pb-3">
              2. Fulfillment Option
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeliveryMethod("PICKUP")}
                className={`p-4 rounded-2xl text-left border transition ${
                  deliveryMethod === "PICKUP"
                    ? "bg-afreqa-teal/15 border-afreqa-teal text-afreqa-chrome-high shadow-glow-teal"
                    : "bg-white/5 border-white/10 text-afreqa-silver"
                }`}
              >
                <span className="font-bold text-sm block mb-1">Event Gate Pickup</span>
                <span className="text-xs text-afreqa-silver-mid block">
                  Free pickup at official merchandise booth during Afreqa festival hours.
                </span>
                <span className="text-xs font-mono text-afreqa-teal font-bold block mt-2">
                  FREE (0 KES)
                </span>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryMethod("COURIER")}
                className={`p-4 rounded-2xl text-left border transition ${
                  deliveryMethod === "COURIER"
                    ? "bg-afreqa-teal/15 border-afreqa-teal text-afreqa-chrome-high shadow-glow-teal"
                    : "bg-white/5 border-white/10 text-afreqa-silver"
                }`}
              >
                <span className="font-bold text-sm block mb-1">Nairobi Courier Delivery</span>
                <span className="text-xs text-afreqa-silver-mid block">
                  Dispatched directly to your address within Nairobi (1-2 business days).
                </span>
                <span className="text-xs font-mono text-afreqa-teal font-bold block mt-2">
                  +300 KES
                </span>
              </button>
            </div>

            {deliveryMethod === "COURIER" && (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-mono uppercase text-afreqa-silver mb-1">
                    Delivery Address / Building / Estate *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="e.g. Westlands, Mpaka Road, Apartment 4B"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-afreqa-shadow border border-afreqa-chrome-high/15 text-afreqa-chrome-high text-sm focus:outline-none focus:border-afreqa-teal transition"
                  />
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-afreqa-teal text-afreqa-shadow font-extrabold text-sm uppercase tracking-widest shadow-glow-teal hover:opacity-90 transition disabled:opacity-50"
          >
            <Lock className="w-4 h-4" />
            <span>
              {submitting
                ? "Connecting Secure Gateway..."
                : `Pay KES ${totalKes.toLocaleString()} (M-Pesa / Card)`}
            </span>
          </button>
        </form>

        {/* Order Summary Sidebar */}
        <div className="rounded-3xl bg-afreqa-stage/80 border border-afreqa-chrome-high/15 p-6 h-fit space-y-4">
          <h3 className="font-bold text-base text-afreqa-chrome-high border-b border-afreqa-chrome-high/10 pb-3">
            Order Summary
          </h3>

          <div className="divide-y divide-afreqa-chrome-high/5 space-y-3">
            {items.map((item) => (
              <div key={item.id} className="pt-3 flex items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-semibold text-afreqa-chrome-high">
                    {item.variant.product.title}
                  </div>
                  <div className="text-[11px] text-afreqa-silver-mid font-mono">
                    {item.variant.name} × {item.quantity}
                  </div>
                </div>
                <span className="font-mono font-bold text-afreqa-teal">
                  KES{" "}
                  {(
                    (item.variant.priceKes ?? item.variant.product.basePriceKes) * item.quantity
                  ).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-afreqa-chrome-high/10 pt-4 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-afreqa-silver">
              <span>Subtotal</span>
              <span>KES {subtotalKes.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-afreqa-silver">
              <span>Delivery Fee</span>
              <span>{deliveryFeeKes === 0 ? "FREE" : `KES ${deliveryFeeKes}`}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-afreqa-chrome-high pt-2 border-t border-afreqa-chrome-high/5">
              <span>Total</span>
              <span className="text-afreqa-teal">KES {totalKes.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

