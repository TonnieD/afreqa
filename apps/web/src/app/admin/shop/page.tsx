import { requireAuth } from "@/lib/auth";
import { db } from "@afreqa/core";
import { ShoppingBag, Tag, ToggleLeft, ToggleRight, AlertTriangle } from "lucide-react";

export default async function AdminShopPage() {
  await requireAuth("shop:read");

  let isShopEnabled = process.env.DEMO_MODE === "true";
  let productCount = 0;
  let orderCount = 0;

  try {
    const setting = await db.siteSetting.findUnique({
      where: { key: "shop.enabled" },
    });
    if (setting && setting.value) {
      isShopEnabled = setting.value === "true";
    }

    const [products, orders] = await Promise.all([
      db.product.count(),
      db.order.count(),
    ]);

    productCount = products;
    orderCount = orders;
  } catch {
    // If DB offline
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-afreqa-chrome-high/10">
        <div>
          <h1 className="font-display font-extrabold text-2xl text-afreqa-chrome-high uppercase tracking-wide">
            Merch Shop & Orders
          </h1>
          <p className="text-xs text-afreqa-silver-mid mt-1 font-mono">
            Feature-flagged merchandise catalog, inventory variants, and order fulfillment
          </p>
        </div>

        <div
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-mono font-bold uppercase ${
            isShopEnabled
              ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
              : "bg-amber-500/15 border-amber-500/30 text-amber-400"
          }`}
        >
          {isShopEnabled ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
          <span>Shop Status: {isShopEnabled ? "ENABLED" : "DISABLED (DEFAULT)"}</span>
        </div>
      </div>

      <div className="rounded-2xl bg-afreqa-stage/70 border border-afreqa-chrome-high/10 p-8 text-center space-y-3">
        <ShoppingBag className="w-12 h-12 text-afreqa-violet mx-auto opacity-80" />
        <h3 className="font-bold text-base text-afreqa-chrome-high">Merch & E-Commerce Module</h3>
        <p className="text-xs text-afreqa-silver-mid max-w-md mx-auto leading-relaxed">
          The Afreqa shop is gated behind the <code className="text-afreqa-teal">DEMO_MODE</code> environment flag to prevent premature live orders while festival merchandising is finalized.
        </p>

        <div className="flex justify-center gap-4 pt-2">
          <div className="px-4 py-2 rounded-xl bg-black/40 border border-white/10 text-xs font-mono">
            <span className="text-afreqa-silver-mid">Active Products: </span>
            <span className="text-afreqa-chrome-high font-bold">{productCount}</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-black/40 border border-white/10 text-xs font-mono">
            <span className="text-afreqa-silver-mid">Total Orders: </span>
            <span className="text-afreqa-chrome-high font-bold">{orderCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

