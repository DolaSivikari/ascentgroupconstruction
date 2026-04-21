// Shared email template for branded customer-facing confirmations.
// Provides consistent header, footer, and styling across all auto-reply emails.

export interface EmailTemplateOptions {
  preheader?: string;
  heading: string;
  bodyHtml: string;
  ctaText?: string;
  ctaUrl?: string;
}

const BRAND = {
  name: "Ascent Group Construction",
  tagline: "Building Envelope, Restoration & Specialty Trades",
  phone: "+1 (647) 528-6804",
  email: "info@ascentgroupconstruction.com",
  address: "2 Jody Ave, North York, ON M3N 1H1",
  website: "https://ascentgroupconstruction.com",
  // Navy primary, orange accent — matches site brand
  navy: "#003366",
  orange: "#FF6B35",
};

export function renderBrandedEmail({
  preheader,
  heading,
  bodyHtml,
  ctaText,
  ctaUrl,
}: EmailTemplateOptions): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <title>${escapeHtml(heading)}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1a1a1a;-webkit-font-smoothing:antialiased;">
  ${preheader ? `<div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${escapeHtml(preheader)}</div>` : ""}
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f4f6f9;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
          <!-- Header -->
          <tr>
            <td style="background-color:${BRAND.navy};padding:28px 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td>
                    <div style="font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-0.01em;">
                      ${BRAND.name}
                    </div>
                    <div style="font-size:12px;color:rgba(255,255,255,0.75);margin-top:4px;letter-spacing:0.02em;text-transform:uppercase;">
                      ${BRAND.tagline}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Accent stripe -->
          <tr><td style="height:4px;background-color:${BRAND.orange};line-height:4px;font-size:0;">&nbsp;</td></tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 32px 24px 32px;">
              <h1 style="margin:0 0 20px 0;font-size:22px;line-height:1.3;font-weight:700;color:${BRAND.navy};">
                ${escapeHtml(heading)}
              </h1>
              <div style="font-size:15px;line-height:1.6;color:#333333;">
                ${bodyHtml}
              </div>
              ${
                ctaText && ctaUrl
                  ? `
              <div style="margin:28px 0 8px 0;">
                <a href="${escapeAttr(ctaUrl)}" style="display:inline-block;background-color:${BRAND.orange};color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:12px 28px;border-radius:6px;">
                  ${escapeHtml(ctaText)}
                </a>
              </div>`
                  : ""
              }
            </td>
          </tr>

          <!-- Trust line -->
          <tr>
            <td style="padding:0 32px 24px 32px;">
              <div style="border-top:1px solid #e5e7eb;padding-top:16px;font-size:12px;color:#6b7280;line-height:1.5;">
                <strong style="color:${BRAND.navy};">Why Ascent:</strong> Licensed &amp; bonded · COR-certified · WSIB compliant · $2M CGL coverage · Self-performed building envelope &amp; restoration trades across the GTA.
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f9fafb;padding:20px 32px;border-top:1px solid #e5e7eb;">
              <div style="font-size:12px;line-height:1.6;color:#6b7280;">
                <strong style="color:#1a1a1a;">${BRAND.name}</strong><br>
                ${BRAND.address}<br>
                <a href="tel:6475286804" style="color:${BRAND.navy};text-decoration:none;">${BRAND.phone}</a> ·
                <a href="mailto:${BRAND.email}" style="color:${BRAND.navy};text-decoration:none;">${BRAND.email}</a><br>
                <a href="${BRAND.website}" style="color:${BRAND.navy};text-decoration:none;">ascentgroupconstruction.com</a>
              </div>
              <div style="font-size:11px;color:#9ca3af;margin-top:12px;">
                You received this email because you contacted ${BRAND.name} via our website.
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// Plain-text version for deliverability — improves inbox placement.
export function renderPlainText({
  heading,
  textBody,
}: {
  heading: string;
  textBody: string;
}): string {
  return `${heading}

${textBody}

— Why Ascent —
Licensed & bonded · COR-certified · WSIB compliant · $2M CGL coverage
Self-performed building envelope & restoration trades across the GTA.

${BRAND.name}
${BRAND.address}
${BRAND.phone} · ${BRAND.email}
${BRAND.website}

You received this email because you contacted ${BRAND.name} via our website.`;
}

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

function escapeAttr(str: string): string {
  return String(str).replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export const REPLY_TO_EMAIL = "info@ascentgroupconstruction.com";
