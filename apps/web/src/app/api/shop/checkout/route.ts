import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import {
  db,
  defaultPaystackPaymentProvider,
  defaultMockPaymentProvider,
  normalizeAndValidatePhone,
  sendEmail,
  renderOrderReceiptEmail,
  logger,
} from "@afreqa/core";
import { isShopEnabled } from "@/lib/shop";

const CART_COOKIE_NAME = "afreqa_cart_token";

export async function POST(req: NextRequest) {
  if (!(await isShopEnabled())) {
    return NextResponse.json({ error: "Shop is currently disabled" }, { status: 404 });
  }

  const token = req.cookies.get(CART_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ error: "No active cart found" }, { status: 400 });
  }

  const cart = await db.cart.findUnique({
    where: { guestToken: token },
    include: {
      items: {
        include: {
          variant: { include: { product: true } },
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const body = await req.json();
  const { customerName, customerEmail, customerPhone, deliveryMethod, shippingAddress, shippingCity } =
    body;

  if (!customerName || !customerEmail || !customerPhone) {
    return NextResponse.json(
      { error: "Customer name, email, and phone are required." },
      { status: 400 }
    );
  }

  const phoneE164 = normalizeAndValidatePhone(customerPhone, "KE") || customerPhone;
  const isCourier = deliveryMethod === "COURIER";
  const deliveryFeeKes = isCourier ? 300 : 0; // 300 KES standard courier fee in Nairobi

  // Calculate subtotal
  let subtotalKes = 0;
  for (const item of cart.items) {
    const unitPrice = item.variant.priceKes ?? item.variant.product.basePriceKes;
    subtotalKes += unitPrice * item.quantity;
  }
  const totalKes = subtotalKes + deliveryFeeKes;

  const orderNumber = `AFQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  try {
    // 1. Transactional Order Creation + Inventory Decrement
    const order = await db.$transaction(async (tx) => {
      // Validate and decrement stock
      for (const item of cart.items) {
        if (item.variant.stockQuantity < item.quantity) {
          throw new Error(`Insufficient stock for ${item.variant.product.title} (${item.variant.name})`);
        }

        await tx.productVariant.update({
          where: { id: item.variant.id },
          data: { stockQuantity: { decrement: item.quantity } },
        });
      }

      // Create Order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          customerName,
          customerEmail,
          customerPhone: phoneE164,
          deliveryMethod: isCourier ? "COURIER" : "PICKUP",
          shippingAddress: isCourier ? shippingAddress : null,
          shippingCity: isCourier ? shippingCity || "Nairobi" : null,
          deliveryFeeKes,
          subtotalKes,
          totalKes,
          status: "PENDING",
          items: {
            create: cart.items.map((item) => ({
              variantId: item.variant.id,
              title: item.variant.product.title,
              variantName: item.variant.name,
              unitPriceKes: item.variant.priceKes ?? item.variant.product.basePriceKes,
              quantity: item.quantity,
              lineTotalKes:
                (item.variant.priceKes ?? item.variant.product.basePriceKes) * item.quantity,
            })),
          },
        },
        include: { items: true },
      });

      // Clear cart
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return newOrder;
    });

    // 2. Initialize Payment
    const paymentProvider = defaultPaystackPaymentProvider.isConfigured
      ? defaultPaystackPaymentProvider
      : defaultMockPaymentProvider;

    const origin =
      req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";
    const callbackUrl = `${origin}/shop/checkout/success?orderNumber=${order.orderNumber}`;

    const paymentResult = await paymentProvider.initializePayment({
      orderId: order.id,
      orderNumber: order.orderNumber,
      amountKes: order.totalKes,
      customerEmail: order.customerEmail,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      callbackUrl,
    });

    // Record initial pending payment
    await db.payment.create({
      data: {
        orderId: order.id,
        provider: defaultPaystackPaymentProvider.isConfigured ? "PAYSTACK" : "MOCK",
        providerTransactionId: paymentResult.reference,
        amountKes: order.totalKes,
        status: "PENDING",
      },
    });

    // If using Mock provider, automatically dispatch HTML receipt for seamless local testing
    if (!defaultPaystackPaymentProvider.isConfigured) {
      await db.order.update({
        where: { id: order.id },
        data: { status: "PAID" },
      });

      try {
        const receiptHtml = renderOrderReceiptEmail({
          customerName: order.customerName,
          orderNumber: order.orderNumber,
          deliveryMethod: order.deliveryMethod,
          shippingAddress: order.shippingAddress,
          items: order.items,
          subtotalKes: order.subtotalKes,
          deliveryFeeKes: order.deliveryFeeKes,
          totalKes: order.totalKes,
        });

        await sendEmail({
          to: order.customerEmail,
          subject: `Order Receipt — ${order.orderNumber} [Afreqa Official Merch]`,
          html: receiptHtml,
        });
      } catch (mailErr) {
        logger.error("Could not send receipt email", mailErr);
      }
    }

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      authorizationUrl: paymentResult.authorizationUrl,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Checkout transaction failed";
    logger.error("Checkout failure", error);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

