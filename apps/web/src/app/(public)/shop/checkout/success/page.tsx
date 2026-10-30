import Link from "next/link";
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";

interface SuccessPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const orderNumber = typeof params.orderNumber === "string" ? params.orderNumber : "AFQ-ORDER";

  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-xl mx-auto text-center">
      <div className="rounded-3xl bg-afreqa-stage/90 border border-afreqa-teal/30 p-8 sm:p-12 shadow-glow-teal relative overflow-hidden backdrop-blur-xl">
        <div className="w-16 h-16 rounded-full bg-afreqa-teal/20 border border-afreqa-teal/50 flex items-center justify-center mx-auto mb-6 text-afreqa-teal">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <span className="text-xs font-mono uppercase tracking-widest text-afreqa-teal font-bold">
          Order Confirmed
        </span>

        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-afreqa-chrome-high uppercase tracking-tight mt-2 mb-3">
          Gear Locked In
        </h1>

        <p className="text-xs sm:text-sm text-afreqa-silver leading-relaxed mb-6">
          Thank you for securing official festival merchandise! Your HTML receipt has been dispatched to your email with order number:
        </p>

        <div className="p-3.5 rounded-xl bg-afreqa-shadow border border-white/10 font-mono text-sm font-bold text-afreqa-teal mb-8">
          {orderNumber}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-afreqa-chrome-high text-xs uppercase font-bold tracking-wider transition border border-white/10"
          >
            <span>Return to Shop</span>
          </Link>

          <Link
            href="/events"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-afreqa-teal text-afreqa-shadow text-xs uppercase font-extrabold tracking-wider shadow-glow-teal hover:opacity-90 transition"
          >
            <span>Explore Events</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

