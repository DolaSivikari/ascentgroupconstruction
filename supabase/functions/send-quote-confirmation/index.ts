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

interface QuoteConfirmationRequest {
  name: string;
  email: string;
  phone?: string;
  serviceName: string;
  projectDescription?: string;
  ballparkRange?: string;
}

const sanitize = (str: string): string =>
  str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");

const validateInput = (d: QuoteConfirmationRequest): string | null => {
  if (!d.name || d.name.trim().length === 0 || d.name.length > 100) return "Invalid name";
  if (!d.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email) || d.email.length > 255) return "Invalid email";
  if (!d.serviceName || d.serviceName.length > 200) return "Invalid service name";
  if (d.phone && (d.phone.length > 20 || !/^[\d\s()+-]+$/.test(d.phone))) return "Invalid phone";
  if (d.projectDescription && d.projectDescription.length > 2000) return "Description too long";
  return null;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: { ...corsHeaders, "Access-Control-Max-Age": "86400" } });
  }

  try {
    const supabaseClient = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_ANON_KEY") ?? "");
    const clientId = getClientIdentifier(req);
    const rateLimit = await checkRateLimit(supabaseClient, `quote-${clientId}`, "send-quote-confirmation", 5, 1);
    if (!rateLimit.allowed) {
      return createRateLimitResponse(rateLimit.retry_after_seconds || 60, corsHeaders);
    }

    const data: QuoteConfirmationRequest = await req.json();
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
    const projectDescription = data.projectDescription ? sanitize(data.projectDescription.trim()) : "";
    const ballparkRange = data.ballparkRange ? sanitize(data.ballparkRange.trim()) : "";

    // ===== Customer confirmation =====
    const customerHeading = `Quote request received — ${data.serviceName}`;
    const customerBody = `
      <p>Hi ${name},</p>
      <p>Thank you for requesting a quote for <strong>${serviceName}</strong>. Because this scope requires a tailored review, our estimating team will reach out personally to discuss your project.</p>
      ${
        ballparkRange
          ? `
      <div style="margin:20px 0;padding:16px 18px;background-color:#f0f5fa;border-left:4px solid #003366;border-radius:4px;">
        <div style="font-size:12px;text-transform:uppercase;letter-spacing:0.05em;color:#6b7280;margin-bottom:6px;">Typical range</div>
        <div style="font-size:18px;font-weight:700;color:#003366;">${ballparkRange}</div>
        <div style="font-size:12px;color:#6b7280;margin-top:6px;">Final pricing depends on site conditions, material selection, and scope.</div>
      </div>`
          : ""
      }
      ${
        projectDescription
          ? `<p><strong>Your project description:</strong></p>
      <p style="background-color:#f9fafb;padding:12px 14px;border-radius:4px;font-size:14px;color:#444;">${projectDescription.replace(/\n/g, "<br>")}</p>`
          : ""
      }
      <p><strong>What happens next:</strong></p>
      <ol style="padding-left:20px;margin:8px 0 16px 0;">
        <li>A project manager contacts you within <strong>24 business hours</strong>.</li>
        <li>We schedule a brief consultation or site visit if needed.</li>
        <li>You receive a detailed written quote tailored to your project.</li>
      </ol>
      <p>Need to reach us sooner? Call <a href="tel:6475286804" style="color:#003366;font-weight:600;">+1 (647) 528-6804</a> or reply directly to this email.</p>
    `;

    const customerText = `Hi ${data.name.trim()},

Thank you for requesting a quote for ${data.serviceName}. Because this scope requires a tailored review, our estimating team will reach out personally to discuss your project.
${ballparkRange ? `\nTypical range: ${data.ballparkRange}\n(Final pricing depends on site conditions, material selection, and scope.)\n` : ""}${projectDescription ? `\nYour project description:\n${data.projectDescription}\n` : ""}
What happens next:
1. A project manager contacts you within 24 business hours.
2. We schedule a brief consultation or site visit if needed.
3. You receive a detailed written quote tailored to your project.

Need to reach us sooner? Call +1 (647) 528-6804 or reply to this email.`;

    const userEmail = await resend.emails.send({
      from: "Ascent Group Construction <onboarding@resend.dev>",
      to: [email],
      reply_to: REPLY_TO_EMAIL,
      subject: `Quote request received — ${data.serviceName}`,
      html: renderBrandedEmail({
        preheader: `We received your quote request for ${data.serviceName}.`,
        heading: customerHeading,
        bodyHtml: customerBody,
      }),
      text: renderPlainText({ heading: customerHeading, textBody: customerText }),
    });

    // ===== Admin notification (estimating@) =====
    const adminEmail = await resend.emails.send({
      from: "Ascent Group <onboarding@resend.dev>",
      to: ["estimating@ascentgroupconstruction.com"],
      reply_to: email,
      subject: `[Quote] ${name} — ${serviceName}`,
      html: `
        <h2>New Quote Request</h2>
        <p><strong>Service:</strong> ${serviceName}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
        ${ballparkRange ? `<p><strong>Typical range:</strong> ${ballparkRange}</p>` : ""}
        ${projectDescription ? `<p><strong>Project description:</strong></p><p>${projectDescription.replace(/\n/g, "<br>")}</p>` : ""}
        <hr>
        <p><small>View full submission in admin panel.</small></p>
      `,
    });

    return new Response(JSON.stringify({ adminEmail, userEmail }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("send-quote-confirmation error:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred processing your request." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
