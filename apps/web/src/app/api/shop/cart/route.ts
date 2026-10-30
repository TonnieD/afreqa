import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@afreqa/core";
import { isShopEnabled } from "@/lib/shop";

const CART_COOKIE_NAME = "afreqa_cart_token";

async function getOrCreateCart(req: NextRequest) {
  let token = req.cookies.get(CART_COOKIE_NAME)?.value;
  let isNew = false;

  if (!token) {
    token = `cart_${crypto.randomBytes(16).toString("hex")}`;
    isNew = true;
  }

  const cart = await db.cart.upsert({
    where: { guestToken: token },
    create: { guestToken: token },
    update: {},
    include: {
      items: {
        include: {
          variant: {
            include: { product: true },
          },
        },
      },
    },
  });

  return { cart, token, isNew };
}

export async function GET(req: NextRequest) {
  if (!(await isShopEnabled())) {
    return NextResponse.json({ error: "Shop is currently disabled" }, { status: 404 });
  }

  const { cart, token, isNew } = await getOrCreateCart(req);
  const response = NextResponse.json(cart);

  if (isNew) {
    response.cookies.set(CART_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });
  }

  return response;
}

export async function POST(req: NextRequest) {
  if (!(await isShopEnabled())) {
    return NextResponse.json({ error: "Shop is currently disabled" }, { status: 404 });
  }

  const { cart, token, isNew } = await getOrCreateCart(req);
  const body = await req.json();
  const { variantId, quantity = 1 } = body;

  if (!variantId) {
    return NextResponse.json({ error: "variantId is required" }, { status: 400 });
  }

  const variant = await db.productVariant.findUnique({
    where: { id: variantId },
  });

  if (!variant || variant.stockQuantity < quantity) {
    return NextResponse.json({ error: "Item is out of stock" }, { status: 400 });
  }

  // Upsert cart item
  await db.cartItem.upsert({
    where: {
      cartId_variantId: { cartId: cart.id, variantId },
    },
    create: {
      cartId: cart.id,
      variantId,
      quantity: Math.max(1, quantity),
    },
    update: {
      quantity: { increment: Math.max(1, quantity) },
    },
  });

  const updatedCart = await db.cart.findUnique({
    where: { id: cart.id },
    include: {
      items: {
        include: {
          variant: { include: { product: true } },
        },
      },
    },
  });

  const response = NextResponse.json(updatedCart);
  if (isNew) {
    response.cookies.set(CART_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });
  }

  return response;
}

