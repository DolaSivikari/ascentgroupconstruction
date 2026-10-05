import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";
import {
  createErrorResponse,
  createRateLimitResponse,
  logSecurityError,
} from "../_shared/errorHandler.ts";
import {
  renderBrandedEmail,
  renderPlainText,
  REPLY_TO_EMAIL,
} from "../_shared/emailTemplate.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactNotificationRequest {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  submissionType: string;
}

// Input validation function
const validateInput = (
  data: ContactNotificationRequest,
): { valid: boolean; error?: string } => {
  // Name validation
  if (
    !data.name ||
    data.name.trim().length < 2 ||
    data.name.trim().length > 100
  ) {
    return { valid: false, error: "Invalid name length" };
  }
  if (!/^[\p{L}\p{M}\s.'-]+$/u.test(data.name)) {
    return { valid: false, error: "Invalid name characters" };
  }

  // Email validation
  if (!data.email || data.email.trim().length > 255) {
    return { valid: false, error: "Invalid email length" };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return { valid: false, error: "Invalid email format" };
  }

  // Phone validation (if provided)
  if (
    data.phone &&
    (data.phone.length > 20 || !/^[0-9\s()+-]*$/.test(data.phone))
  ) {
    return { valid: false, error: "Invalid phone format" };
  }

  // Company validation (if provided)
  if (data.company && data.company.length > 100) {
    return { valid: false, error: "Invalid company name length" };
  }

  // Message validation
  if (
    !data.message ||
    data.message.trim().length < 10 ||
    data.message.trim().length > 2000
  ) {
    return { valid: false, error: "Invalid message length" };
  }

  return { valid: true };
};

// Sanitize input to prevent XSS
const sanitize = (str: string): string => {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests with comprehensive headers
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Access-Control-Max-Age": "86400", // 24 hours
      },
    });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    );

    // Get client identifier for rate limiting (IP or user ID)
    const clientIP =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const identifier = `contact-${clientIP}`;

    // Enhanced rate limiting: 5 requests per minute (reduced from 50)
    const { data: rateLimitResult, error: rateLimitError } =
      await supabaseClient.rpc("check_and_update_rate_limit", {
        p_identifier: identifier,
        p_endpoint: "send-contact-notification",
        p_limit: 5, // Reduced to 5 per minute for contact forms
        p_window_minutes: 1,
      });

    if (rateLimitError) {
      logSecurityError("rate_limit_check", rateLimitError, { identifier });
      // Allow request on error to prevent blocking legitimate users
      console.warn(
        "Rate limit check failed, allowing request:",
        rateLimitError,
      );
    } else if (rateLimitResult && !rateLimitResult.allowed) {
      logSecurityError(
        "rate_limit_exceeded",
        new Error("Rate limit exceeded"),
        {
          identifier,
          request_count: rateLimitResult.request_count,
          limit: rateLimitResult.limit,
        },
      );

      return createRateLimitResponse(rateLimitResult.retry_after_seconds || 60);
    }

    const requestData: ContactNotificationRequest = await req.json();

    // Validate input
    const validation = validateInput(requestData);
    if (!validation.valid) {
      return createErrorResponse(
        new Error(validation.error),
        validation.error,
        400,
        "input_validation",
      );
    }

    // Sanitize all inputs
    const { name, email, phone, company, message, submissionType } = {
      name: sanitize(requestData.name.trim()),
      email: sanitize(requestData.email.trim()),
      phone: requestData.phone ? sanitize(requestData.phone.trim()) : undefined,
      company: requestData.company
        ? sanitize(requestData.company.trim())
        : undefined,
      message: sanitize(requestData.message.trim()),
      submissionType: sanitize(requestData.submissionType),
    };

    // Send notification to admin
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) {
      console.error(
        "RESEND_API_KEY is not configured; skipping notification emails",
      );
      return new Response(
        JSON.stringify({ success: false, reason: "email_not_configured" }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }
    const resend = new Resend(resendKey);

    const adminEmail = await resend.emails.send({
      from: "Ascent Group <onboarding@resend.dev>",
      to: ["info@ascentgroupconstruction.com"],
      reply_to: requestData.email.trim(),
      subject: `[Contact] ${name} — ${submissionType}`,
      html: `
        <h2>New Contact Submission</h2>
        <p><strong>Type:</strong> ${submissionType}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
        ${company ? `<p><strong>Company:</strong> ${company}</p>` : ""}
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <hr>
        <p><small>Submitted from Ascent Group Construction website</small></p>
      `,
    });

    // Send confirmation to user (branded template)
    const customerHeading = `Thanks for reaching out, ${name}`;
    const customerBodyHtml = `
      <p>Hi ${name},</p>
      <p>We've received your message and a member of our team will respond within <strong>1 business day</strong>. For urgent matters, please call us directly.</p>
      <div style="margin:18px 0;padding:14px 16px;background-color:#f9fafb;border-radius:4px;">
        <div style="font-size:12px;text-transform:uppercase;letter-spacing:0.05em;color:#6b7280;margin-bottom:6px;">Your message</div>
        <div style="font-size:14px;color:#333;line-height:1.5;">${message.replace(/\n/g, "<br>")}</div>
      </div>
      <p>Need immediate assistance? Call <a href="tel:6475286804" style="color:#003366;font-weight:600;">+1 (647) 528-6804</a> or reply directly to this email.</p>
    `;
    const customerBodyText = `Hi ${name},

We've received your message and a member of our team will respond within 1 business day. For urgent matters, please call us directly.

Your message:
${requestData.message.trim()}

Need immediate assistance? Call +1 (647) 528-6804 or reply to this email.`;

    const userEmail = await resend.emails.send({
      from: "Ascent Group Construction <onboarding@resend.dev>",
      to: [email],
      reply_to: REPLY_TO_EMAIL,
      subject:
        "Thanks for contacting Ascent Group Construction — we'll respond within 1 business day",
      html: renderBrandedEmail({
        preheader:
          "We received your message and will respond within 1 business day.",
        heading: customerHeading,
        bodyHtml: customerBodyHtml,
      }),
      text: renderPlainText({
        heading: customerHeading,
        textBody: customerBodyText,
      }),
    });

    return new Response(JSON.stringify({ adminEmail, userEmail }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    return createErrorResponse(
      error,
      "Failed to process contact submission",
      500,
      "send_contact_notification",
    );
  }
};

serve(handler);
