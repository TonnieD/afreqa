import { notFound } from "next/navigation";
import { db } from "@afreqa/core";

export async function isShopEnabled(): Promise<boolean> {
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
