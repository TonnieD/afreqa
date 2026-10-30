import { notFound } from "next/navigation";
import { db } from "@afreqa/core";

export async function isShopEnabled(): Promise<boolean> {
  // If explicitly in DEMO_MODE, shop is enabled with fake sample merch
  if (process.env.DEMO_MODE === "true") {
    return true;
  }

  try {
    const setting = await db.siteSetting.findUnique({
      where: { key: "shop.enabled" },
    });
    return setting?.value === "true";
  } catch {
    return false;
  }
}

export async function requireShopEnabled(): Promise<void> {
  const enabled = await isShopEnabled();
  if (!enabled) {
    notFound();
  }
}

