/**
 * Afreqa Website — HTML-Only Transactional & Marketing Email Templates
 * Styled with Tomorrowland-inspired dark theme, chrome typography, and neon accents.
 */

interface BaseEmailOptions {
  appUrl?: string;
  unsubscribeUrl?: string;
}

interface VerificationEmailOptions extends BaseEmailOptions {
  recipientName?: string | null;
  verifyUrl: string;
  tokenExpiresHours?: number;
}

interface WelcomeEmailOptions extends BaseEmailOptions {
  recipientName?: string | null;
  whatsappCommunityUrl?: string;
  vcardUrl?: string;
}

const EMAIL_BASE_STYLES = `
  body { margin: 0; padding: 0; background-color: #0B0504; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #EDECEC; }
  .wrapper { width: 100%; max-width: 600px; margin: 0 auto; background-color: #162229; border: 1px solid rgba(237, 236, 236, 0.15); border-radius: 16px; overflow: hidden; }
  .header { padding: 36px 32px 24px; text-align: center; background: radial-gradient(circle at 50% 0%, rgba(123, 47, 247, 0.4) 0%, rgba(22, 34, 41, 0) 70%); border-bottom: 1px solid rgba(237, 236, 236, 0.1); }
  .logo-title { font-size: 32px; font-weight: 900; letter-spacing: 0.1em; color: #EDECEC; margin: 0; text-transform: uppercase; }
  .tagline { font-size: 11px; font-family: monospace; letter-spacing: 0.25em; color: #16F4D0; margin-top: 4px; text-transform: uppercase; }
  .content { padding: 36px 32px; font-size: 15px; line-height: 1.6; color: #B6B5B5; }
  .h1 { font-size: 24px; font-weight: 800; color: #EDECEC; margin-top: 0; margin-bottom: 16px; }
  .btn-container { text-align: center; margin: 32px 0; }
  .btn { display: inline-block; padding: 14px 32px; border-radius: 50px; background: linear-gradient(90deg, #16F4D0 0%, #7B2FF7 100%); color: #0B0504 !important; font-weight: 800; font-size: 14px; text-decoration: none; text-transform: uppercase; letter-spacing: 0.08em; box-shadow: 0 4px 20px rgba(22, 244, 208, 0.4); }
  .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; background: rgba(22, 244, 208, 0.15); border: 1px solid rgba(22, 244, 208, 0.4); color: #16F4D0; font-size: 11px; font-family: monospace; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 16px; }
  .card { background-color: #0B0504; border: 1px solid rgba(237, 236, 236, 0.1); border-radius: 12px; padding: 20px; margin: 24px 0; }
  .footer { padding: 28px 32px; text-align: center; font-size: 12px; font-family: monospace; color: #ADADAC; border-top: 1px solid rgba(237, 236, 236, 0.08); background-color: #0B0504; }
  .footer a { color: #16F4D0; text-decoration: underline; }
`;

export function renderVerificationEmail({
  recipientName,
  verifyUrl,
  tokenExpiresHours = 24,
  unsubscribeUrl,
}: VerificationEmailOptions): string {
  const greeting = recipientName ? `Hello ${recipientName},` : "Hello Electronic Music Lover,";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Confirm Your Afreqa Frequency</title>
  <style>${EMAIL_BASE_STYLES}</style>
</head>
<body>
  <div style="padding: 32px 16px;">
    <div class="wrapper">
      <div class="header">
        <h1 class="logo-title">AFREQA</h1>
        <div class="tagline">Nairobi Electronic Movement</div>
      </div>
      <div class="content">
        <div class="badge">Inner Circle Access</div>
        <div class="h1">Confirm Your Subscription</div>
        <p>${greeting}</p>
        <p>You requested to join the official <strong>Afreqa Inner Circle</strong>. We require one click to verify your frequency and ensure our communications reach real dancers only.</p>
        
        <div class="btn-container">
          <a href="${verifyUrl}" class="btn" target="_blank">Verify My Frequency</a>
        </div>

        <p style="font-size: 13px; color: #ADADAC;">This cryptographic confirmation link expires in <strong>${tokenExpiresHours} hours</strong>. If you did not make this request, you can safely ignore this transmission and no further emails will be sent.</p>
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} Afreqa Productions Ltd. • Nairobi, Kenya</p>
        <p>In full compliance with Kenya Data Protection Act, 2019 (KDPA).</p>
        ${
          unsubscribeUrl
            ? `<p><a href="${unsubscribeUrl}">One-Click Unsubscribe</a> • <a href="${verifyUrl.replace(
                /\/verify-email.*$/,
                "/legal/privacy"
              )}">Privacy Notice</a></p>`
            : ""
        }
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

export function renderWelcomeEmail({
  recipientName,
  whatsappCommunityUrl = "https://chat.whatsapp.com/sample-afreqa-community",
  vcardUrl = "https://afreqa.com/api/whatsapp/vcard",
  unsubscribeUrl,
}: WelcomeEmailOptions): string {
  const greeting = recipientName ? `Welcome to the tribe, ${recipientName}!` : "Welcome to the tribe!";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Welcome to Afreqa Nairobi</title>
  <style>${EMAIL_BASE_STYLES}</style>
</head>
<body>
  <div style="padding: 32px 16px;">
    <div class="wrapper">
      <div class="header">
        <h1 class="logo-title">AFREQA</h1>
        <div class="tagline">Where Frequencies Unite</div>
      </div>
      <div class="content">
        <div class="badge" style="color: #F5C542; border-color: rgba(245, 197, 66, 0.4); background: rgba(245, 197, 66, 0.1);">Verified Member</div>
        <div class="h1">${greeting}</div>
        <p>Your subscription is officially active. You now possess front-row access to upcoming festival editions, secret lineup reveals, and Early Bird allocations via our official ticketing portal.</p>
        
        <div class="card">
          <h4 style="margin: 0 0 8px; color: #16F4D0; font-family: monospace; text-transform: uppercase;">Step 2: Guarantee Ticket Drop Delivery</h4>
          <p style="margin: 0 0 16px; font-size: 13px; color: #B6B5B5;">WhatsApp broadcast lists only deliver messages if you have the sender saved as a contact in your phone. Download our official vCard contact in one tap:</p>
          <div style="text-align: center;">
            <a href="${vcardUrl}" class="btn" style="background: #162229; border: 1px solid #16F4D0; color: #16F4D0 !important; font-size: 12px; padding: 10px 24px;">Download Afreqa Contact (.vcf)</a>
          </div>
        </div>

        <div class="btn-container">
          <a href="${whatsappCommunityUrl}" class="btn" target="_blank">Join Official WhatsApp Community</a>
        </div>

        <p style="font-size: 13px; color: #ADADAC;">See you under the laser beams.<br>— The Afreqa Operations Team</p>
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} Afreqa Productions Ltd. • Nairobi, Kenya</p>
        ${
          unsubscribeUrl
            ? `<p><a href="${unsubscribeUrl}">One-Click Unsubscribe</a> • <a href="https://afreqa.com/legal/privacy">Privacy Policy</a></p>`
            : ""
        }
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

export interface OrderItemReceipt {
  title: string;
  variantName?: string | null;
  quantity: number;
  unitPriceKes: number;
  lineTotalKes: number;
}

export interface OrderReceiptEmailOptions extends BaseEmailOptions {
  customerName: string;
  orderNumber: string;
  deliveryMethod: "PICKUP" | "COURIER";
  shippingAddress?: string | null;
  items: OrderItemReceipt[];
  subtotalKes: number;
  deliveryFeeKes: number;
  totalKes: number;
  orderUrl?: string;
}

export function renderOrderReceiptEmail({
  customerName,
  orderNumber,
  deliveryMethod,
  shippingAddress,
  items,
  subtotalKes,
  deliveryFeeKes,
  totalKes,
  orderUrl,
  unsubscribeUrl,
}: OrderReceiptEmailOptions): string {
  const itemRows = items
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px 0; border-bottom: 1px solid rgba(237, 236, 236, 0.08); color: #EDECEC;">
        <strong>${item.title}</strong>
        ${item.variantName ? `<br><span style="font-size: 11px; color: #ADADAC; font-family: monospace;">${item.variantName}</span>` : ""}
      </td>
      <td style="padding: 10px 0; border-bottom: 1px solid rgba(237, 236, 236, 0.08); text-align: center; color: #B6B5B5; font-family: monospace;">
        ×${item.quantity}
      </td>
      <td style="padding: 10px 0; border-bottom: 1px solid rgba(237, 236, 236, 0.08); text-align: right; color: #16F4D0; font-family: monospace; font-weight: bold;">
        KES ${item.lineTotalKes.toLocaleString()}
      </td>
    </tr>
  `
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Order Receipt — ${orderNumber}</title>
  <style>${EMAIL_BASE_STYLES}</style>
</head>
<body>
  <div style="padding: 32px 16px;">
    <div class="wrapper">
      <div class="header">
        <h1 class="logo-title">AFREQA</h1>
        <div class="tagline">Official Merch Dispatch</div>
      </div>
      <div class="content">
        <div class="badge" style="color: #16F4D0; border-color: rgba(22, 244, 208, 0.4);">Payment Confirmed</div>
        <div class="h1">Thank you for your order, ${customerName}!</div>
        <p>Your official Afreqa festival gear has been confirmed and locked in. Below is your official HTML purchase receipt.</p>
        
        <div class="card">
          <div style="display: flex; justify-content: space-between; font-size: 12px; font-family: monospace; color: #ADADAC; margin-bottom: 12px;">
            <span>ORDER NUMBER: <strong style="color: #EDECEC;">${orderNumber}</strong></span>
            <span>METHOD: <strong style="color: #16F4D0;">${deliveryMethod}</strong></span>
          </div>

          ${
            shippingAddress
              ? `<p style="font-size: 12px; color: #B6B5B5; margin: 0 0 16px;">Delivery Destination: <strong>${shippingAddress}</strong></p>`
              : ""
          }

          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <thead>
              <tr style="border-bottom: 1px solid rgba(237, 236, 236, 0.15); font-family: monospace; font-size: 11px; text-transform: uppercase; color: #ADADAC;">
                <th style="text-align: left; padding-bottom: 8px;">Item</th>
                <th style="text-align: center; padding-bottom: 8px;">Qty</th>
                <th style="text-align: right; padding-bottom: 8px;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemRows}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding-top: 12px; color: #ADADAC; font-size: 12px;">Subtotal</td>
                <td style="padding-top: 12px; text-align: right; font-family: monospace; color: #EDECEC;">KES ${subtotalKes.toLocaleString()}</td>
              </tr>
              <tr>
                <td colspan="2" style="padding-top: 4px; color: #ADADAC; font-size: 12px;">Delivery Fee</td>
                <td style="padding-top: 4px; text-align: right; font-family: monospace; color: #EDECEC;">KES ${deliveryFeeKes.toLocaleString()}</td>
              </tr>
              <tr style="font-size: 15px; font-weight: bold;">
                <td colspan="2" style="padding-top: 12px; color: #EDECEC;">Total Paid</td>
                <td style="padding-top: 12px; text-align: right; font-family: monospace; color: #16F4D0;">KES ${totalKes.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        ${
          orderUrl
            ? `<div class="btn-container"><a href="${orderUrl}" class="btn">View Order Details</a></div>`
            : ""
        }

        <p style="font-size: 12px; color: #ADADAC; text-align: center;">For order inquiries or courier tracking, email <a href="mailto:frequencies@afreqa.com" style="color: #16F4D0;">frequencies@afreqa.com</a>.</p>
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} Afreqa Productions Ltd. • Nairobi, Kenya</p>
        <p>In full compliance with Kenya Data Protection Act, 2019.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

