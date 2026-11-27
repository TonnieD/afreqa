import React from "react";
import { requireShopEnabled } from "@/lib/shop";

export const dynamic = "force-dynamic";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireShopEnabled();
  return <>{children}</>;
}
