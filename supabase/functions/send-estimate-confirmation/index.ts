import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { checkRateLimit, getClientIdentifier, createRateLimitResponse } from "../_shared/rateLimiter.ts";
import { renderBrandedEmail, renderPlainText, REPLY_TO_EMAIL } from "../_shared/emailTemplate.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EstimateConfirmationRequest {
  name: string;
  email: string;
  phone?: string;
  serviceName: string;
  estimateMin?: number;
  estimateMax?: number;
  region?: string;
  sqft?: string;
  notes?: string;
}

const sanitize = (str: string): string =>
  str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");

const validateInput = (d: EstimateConfirmationRequest): string | null => {
  if (!d.name || d.name.trim().length === 0 || d.name.length > 100) return "Invalid name";
  if (!d.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email) || d.email.length > 255) return "Invalid email";
  if (!d.serviceName || d.serviceName.length > 200) return "Invalid service name";
  if (d.phone && (d.phone.length > 20 || !/^[\d\s()+-]+$/.test(d.phone))) return "Invalid phone";
  return null;
};

const formatMoney = (n: number): string => `$${Math.round(n).toLocaleString("en-US")}`;

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: { ...corsHeaders, "Access-Control-Max-Age": "86400" } });
  }

  try {
    const supabaseClient = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_ANON_KEY") ?? "");
    const clientId = getClientIdentifier(req);
    const rateLimit = await checkRateLimit(supabaseClient, `estimate-${clientId}`, "send-estimate-confirmation", 5, 1);
    if (!rateLimit.allowed) {
      return createRateLimitResponse(rateLimit.retry_after_seconds || 60, corsHeaders);
    }

    const data: EstimateConfirmationRequest = await req.json();
    const validationError = validateInput(data);
    if (validationError) {
      return new Response(JSON.stringify({ error: validationError }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const name = sanitize(data.name.trim());
    const email = data.email.trim().toLowerCase();
    const phone = data.phone ? sanitize(data.phone.trim()) : "";
    const serviceName = sanitize(data.serviceName.trim());
    const region = data.region ? sanitize(data.region.trim()) : "";
    const sqft = data.sqft ? sanitize(String(data.sqft).trim()) : "";
    const notes = data.notes ? sanitize(data.notes.trim()) : "";

    const hasRange =
      typeof data.estimateMin === "number" &&
      typeof data.estimateMax === "number" &&
      data.estimateMin > 0 &&
      data.estimateMax > 0;
    const rangeText = hasRange ? `${formatMoney(data.estimateMin!)} – ${formatMoney(data.estimateMax!)} CAD` : "";

    // ===== Customer confirmation =====
    const customerHeading = `Estimate request received — thank you, ${name}`;
    const customerBody = `
      <p>Hi ${name},</p>
      <p>Thank you for using our project estimator. We've received your request for <strong>${serviceName}</strong> and our estimating team will review it shortly.</p>
      ${
        hasRange
          ? `
      <div style="margin:20px 0;padding:16px 18px;background-color:#f0f5fa;border-left:4px solid #003366;border-radius:4px;">
        <div style="font-size:12px;text-transform:uppercase;letter-spacing:0.05em;color:#6b7280;margin-bottom:6px;">Preliminary range</div>
        <div style="font-size:20px;font-weight:700;color:#003366;">${rangeText}</div>
        <div style="font-size:12px;color:#6b7280;margin-top:6px;">Indicative only — final pricing follows site review and confirmed scope.</div>
      </div>`
          : ""
      }
      <p><strong>Your request summary:</strong></p>
      <ul style="padding-left:20px;margin:8px 0 16px 0;">
        <li><strong>Service:</strong> ${serviceName}</li>
        ${sqft ? `<li><strong>Square footage:</strong> ${sqft}</li>` : ""}
        ${region ? `<li><strong>Region:</strong> ${region}</li>` : ""}
        ${notes ? `<li><strong>Notes:</strong> ${notes}</li>` : ""}
      </ul>
      <p><strong>What happens next:</strong></p>
      <ol style="padding-left:20px;margin:8px 0 16px 0;">
        <li>A project manager reviews your request within <strong>24 business hours</strong>.</li>
        <li>We follow up to confirm scope, timing, and any site-specific factors.</li>
        <li>You receive a detailed written estimate or proposal.</li>
      </ol>
      <p>Need to reach us sooner? Call <a href="tel:6475286804" style="color:#003366;font-weight:600;">+1 (647) 528-6804</a> or reply directly to this email.</p>
    `;

    const customerText = `Hi ${data.name.trim()},

Thank you for using our project estimator. We've received your request for ${data.serviceName} and our estimating team will review it shortly.
${hasRange ? `\nPreliminary range: ${rangeText}\n(Indicative only — final pricing follows site review and confirmed scope.)\n` : ""}
Your request summary:
- Service: ${data.serviceName}${data.sqft ? `\n- Square footage: ${data.sqft}` : ""}${data.region ? `\n- Region: ${data.region}` : ""}${data.notes ? `\n- Notes: ${data.notes}` : ""}

What happens next:
1. A project manager reviews your request within 24 business hours.
2. We follow up to confirm scope, timing, and any site-specific factors.
3. You receive a detailed written estimate or proposal.

Need to reach us sooner? Call +1 (647) 528-6804 or reply to this email.`;

    const userEmail = await resend.emails.send({
      from: "Ascent Group Construction <onboarding@resend.dev>",
      to: [email],
      reply_to: REPLY_TO_EMAIL,
      subject: `Estimate request received — ${data.serviceName}`,
      html: renderBrandedEmail({
        preheader: `We received your estimate request for ${data.serviceName}.`,
        heading: customerHeading,
        bodyHtml: customerBody,
        ctaText: "View Our Portfolio",
        ctaUrl: "https://ascentgroupconstruction.com/projects",
      }),
      text: renderPlainText({ heading: customerHeading, textBody: customerText }),
    });

    // ===== Admin notification (estimating@) =====
    const adminEmail = await resend.emails.send({
      from: "Ascent Group <onboarding@resend.dev>",
      to: ["estimating@ascentgroupconstruction.com"],
      reply_to: email,
      subject: `[Estimate] ${name} — ${serviceName}`,
      html: `
        <h2>New Estimate Request</h2>
        <p><strong>Service:</strong> ${serviceName}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
        ${sqft ? `<p><strong>Square footage:</strong> ${sqft}</p>` : ""}
        ${region ? `<p><strong>Region:</strong> ${region}</p>` : ""}
        ${hasRange ? `<p><strong>Calculated range:</strong> ${rangeText}</p>` : ""}
        ${notes ? `<p><strong>Notes:</strong><br>${notes}</p>` : ""}
        <hr>
        <p><small>View full submission in admin panel.</small></p>
      `,
    });

    return new Response(JSON.stringify({ adminEmail, userEmail }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("send-estimate-confirmation error:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred processing your request." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
