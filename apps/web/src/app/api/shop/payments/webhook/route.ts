import { NextRequest, NextResponse } from "next/server";
import {
  db,
  defaultPaystackPaymentProvider,
  renderOrderReceiptEmail,
  sendEmail,
  recordAuditLog,
  logger,
} from "@afreqa/core";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-paystack-signature");

    const verification = await defaultPaystackPaymentProvider.verifyWebhook(rawBody, signature);

    if (!verification.isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    if (verification.orderId && verification.status === "SUCCESS") {
      const order = await db.order.findUnique({
        where: { id: verification.orderId },
        include: { items: true },
      });

      if (order && order.status !== "PAID") {
        await db.order.update({
          where: { id: order.id },
          data: { status: "PAID" },
        });

        await db.payment.updateMany({
          where: { orderId: order.id },
          data: {
            status: "SUCCESS",
            rawWebhookPayload: verification.rawPayload as object,
          },
        });

        await recordAuditLog({
          action: "ORDER_PAID",
          resource: "Order",
          resourceId: order.id,
          payload: { orderNumber: order.orderNumber, totalKes: order.totalKes },
        });

        // Send HTML-only receipt
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
            subject: `Order Receipt — ${order.orderNumber} [Afreqa Merch]`,
            html: receiptHtml,
          });
        } catch (mailErr) {
          logger.error("Failed to send webhook receipt email", mailErr);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    logger.error("Error processing payment webhook", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

