import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { checkRateLimit, getClientIdentifier, createRateLimitResponse } from "../_shared/rateLimiter.ts";
import { renderBrandedEmail, renderPlainText, REPLY_TO_EMAIL } from "../_shared/emailTemplate.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PackageNotificationRequest {
  name: string;
  email: string;
  phone?: string;
  packageName: string;
  message?: string;
}

// Input validation function
const validateInput = (data: PackageNotificationRequest): string | null => {
  const { name, email, phone, packageName, message } = data;

  if (!name || name.trim().length === 0) {
    return "Name is required";
  }
  if (name.length > 100) {
    return "Name must be less than 100 characters";
  }
  if (!/^[a-zA-Z\s-'.]+$/.test(name)) {
    return "Name contains invalid characters";
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Valid email address is required";
  }
  if (email.length > 255) {
    return "Email must be less than 255 characters";
  }

  if (phone && phone.length > 0) {
    if (!/^[\d\s()+-]+$/.test(phone)) {
      return "Phone number contains invalid characters";
    }
    if (phone.length > 20) {
      return "Phone number must be less than 20 characters";
    }
  }

  if (!packageName || packageName.trim().length === 0) {
    return "Package name is required";
  }
  if (packageName.length > 100) {
    return "Package name must be less than 100 characters";
  }

  if (message && message.length > 1000) {
    return "Message must be less than 1000 characters";
  }

  return null;
};

// Sanitize HTML special characters to prevent XSS
const sanitize = (str: string): string => {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
};

// Helper function for safe error responses
function createErrorResponse(error: any) {
  console.error('Function error:', {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });
  
  const isValidationError = error.message.includes('required') || 
                           error.message.includes('invalid') ||
                           error.message.includes('must be') ||
                           error.message.includes('characters');
  
  const clientMessage = isValidationError 
    ? error.message
    : 'An error occurred processing your request. Please try again later.';
  
  return new Response(
    JSON.stringify({ 
      error: clientMessage,
      timestamp: new Date().toISOString()
    }),
    { 
      status: isValidationError ? 400 : 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests with comprehensive headers
  if (req.method === "OPTIONS") {
    return new Response(null, { 
      status: 200,
      headers: {
        ...corsHeaders,
        'Access-Control-Max-Age': '86400', // 24 hours
      }
    });
  }

  try {
    // Rate limiting check
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );
    
    const clientId = getClientIdentifier(req);
    const rateLimitResult = await checkRateLimit(
      supabaseClient,
      `package-${clientId}`,
      'send-package-notification',
      10, // 10 requests per minute for package requests
      1
    );

    if (!rateLimitResult.allowed) {
      return createRateLimitResponse(rateLimitResult.retry_after_seconds || 60, corsHeaders);
    }

    const requestData: PackageNotificationRequest = await req.json();

    // Validate input
    const validationError = validateInput(requestData);
    if (validationError) {
      return new Response(
        JSON.stringify({ error: validationError }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Sanitize all inputs
    const name = sanitize(requestData.name.trim());
    const email = requestData.email.trim().toLowerCase();
    const phone = requestData.phone ? sanitize(requestData.phone.trim()) : undefined;
    const packageName = sanitize(requestData.packageName.trim());
    const message = requestData.message ? sanitize(requestData.message.trim()) : undefined;

    // Send notification to admin
    const adminEmail = await resend.emails.send({
      from: "Ascent Group <onboarding@resend.dev>",
      to: ["projects@ascentgroupconstruction.com"],
      reply_to: email,
      subject: `[Package] ${packageName} — ${name}`,
      html: `
        <h2>New Package Request</h2>
        <p><strong>Package:</strong> ${packageName}</p>
        <p><strong>Customer Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
        ${message ? `
          <p><strong>Additional Message:</strong></p>
          <p>${message}</p>
        ` : ''}
        <hr>
        <p><small>View full request in admin panel</small></p>
      `,
    });

    // Send confirmation to user (branded template)
    const customerHeading = `Your ${packageName} package is on the way`;
    const customerBodyHtml = `
      <p>Hi ${name},</p>
      <p>Thank you for requesting our <strong>${packageName}</strong> package. We've received your request and our team will be in touch shortly.</p>
      <p><strong>What happens next:</strong></p>
      <ol style="padding-left:20px;margin:8px 0 16px 0;">
        <li>Our team reviews your request.</li>
        <li>We contact you within <strong>24 business hours</strong> to discuss details.</li>
        <li>We schedule a convenient time for consultation if needed.</li>
        <li>You receive the package and a tailored proposal for your needs.</li>
      </ol>
      <p>Have an immediate question? Call <a href="tel:6475286804" style="color:#003366;font-weight:600;">+1 (647) 528-6804</a> or reply directly to this email.</p>
    `;
    const customerBodyText = `Hi ${name},

Thank you for requesting our ${packageName} package. We've received your request and our team will be in touch shortly.

What happens next:
1. Our team reviews your request.
2. We contact you within 24 business hours to discuss details.
3. We schedule a convenient time for consultation if needed.
4. You receive the package and a tailored proposal for your needs.

Have an immediate question? Call +1 (647) 528-6804 or reply to this email.`;

    const userEmail = await resend.emails.send({
      from: "Ascent Group Construction <onboarding@resend.dev>",
      to: [email],
      reply_to: REPLY_TO_EMAIL,
      subject: `Your vendor information package is on the way — ${packageName}`,
      html: renderBrandedEmail({
        preheader: `We received your ${packageName} package request.`,
        heading: customerHeading,
        bodyHtml: customerBodyHtml,
      }),
      text: renderPlainText({ heading: customerHeading, textBody: customerBodyText }),
    });

    return new Response(JSON.stringify({ adminEmail, userEmail }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    return createErrorResponse(error);
  }
};

serve(handler);
