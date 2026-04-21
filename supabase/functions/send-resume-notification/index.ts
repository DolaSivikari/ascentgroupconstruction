import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { checkRateLimit, getClientIdentifier, createRateLimitResponse } from "../_shared/rateLimiter.ts";
import { renderBrandedEmail, renderPlainText } from "../_shared/emailTemplate.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ResumeNotificationRequest {
  applicantName: string;
  email: string;
  phone?: string;
  coverMessage?: string;
  jobTitle?: string;
}

// Input validation function
const validateInput = (data: ResumeNotificationRequest): string | null => {
  const { applicantName, email, phone, coverMessage, jobTitle } = data;

  if (!applicantName || applicantName.trim().length === 0) {
    return "Applicant name is required";
  }
  if (applicantName.length > 100) {
    return "Applicant name must be less than 100 characters";
  }
  if (!/^[a-zA-Z\s-'.]+$/.test(applicantName)) {
    return "Applicant name contains invalid characters";
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

  if (coverMessage && coverMessage.length > 2000) {
    return "Cover message must be less than 2000 characters";
  }

  if (jobTitle && jobTitle.length > 100) {
    return "Job title must be less than 100 characters";
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
      `resume-${clientId}`,
      'send-resume-notification',
      5, // 5 resume submissions per minute (strict limit)
      1
    );

    if (!rateLimitResult.allowed) {
      return createRateLimitResponse(rateLimitResult.retry_after_seconds || 60, corsHeaders);
    }

    const requestData: ResumeNotificationRequest = await req.json();

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
    const applicantName = sanitize(requestData.applicantName.trim());
    const email = requestData.email.trim().toLowerCase();
    const phone = requestData.phone ? sanitize(requestData.phone.trim()) : undefined;
    const coverMessage = requestData.coverMessage ? sanitize(requestData.coverMessage.trim()) : undefined;
    const jobTitle = requestData.jobTitle ? sanitize(requestData.jobTitle.trim()) : undefined;

    // Send notification to admin
    const adminEmail = await resend.emails.send({
      from: "Ascent Group Careers <onboarding@resend.dev>",
      to: ["careers@ascentgroupconstruction.com"],
      reply_to: email,
      subject: `[Resume] ${applicantName}${jobTitle ? ` — ${jobTitle}` : ''}`,
      html: `
        <h2>New Resume Submission</h2>
        ${jobTitle ? `<p><strong>Position:</strong> ${jobTitle}</p>` : ''}
        <p><strong>Applicant Name:</strong> ${applicantName}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
        ${coverMessage ? `
          <p><strong>Cover Message:</strong></p>
          <p>${coverMessage}</p>
        ` : ''}
        <hr>
        <p><small>View full application in admin panel</small></p>
      `,
    });

    // Send confirmation to applicant (branded template)
    const customerHeading = `Application received — thank you, ${applicantName}`;
    const customerBodyHtml = `
      <p>Hi ${applicantName},</p>
      <p>We've received your application${jobTitle ? ` for the <strong>${jobTitle}</strong> position` : ""} and appreciate your interest in joining Ascent Group Construction.</p>
      <p><strong>What happens next:</strong></p>
      <ol style="padding-left:20px;margin:8px 0 16px 0;">
        <li>Our hiring team carefully reviews your resume and qualifications.</li>
        <li>If your experience matches our needs, we'll contact you within <strong>1–2 weeks</strong> to discuss next steps.</li>
        <li>Your information stays on file for future opportunities that match your background.</li>
      </ol>
      <p>Thank you again for considering a career with us.</p>
    `;
    const customerBodyText = `Hi ${applicantName},

We've received your application${jobTitle ? ` for the ${jobTitle} position` : ""} and appreciate your interest in joining Ascent Group Construction.

What happens next:
1. Our hiring team carefully reviews your resume and qualifications.
2. If your experience matches our needs, we'll contact you within 1–2 weeks to discuss next steps.
3. Your information stays on file for future opportunities that match your background.

Thank you again for considering a career with us.`;

    const userEmail = await resend.emails.send({
      from: "Ascent Group Careers <onboarding@resend.dev>",
      to: [email],
      reply_to: "careers@ascentgroupconstruction.com",
      subject: `Application received — thank you, ${applicantName}`,
      html: renderBrandedEmail({
        preheader: `We received your application${jobTitle ? ` for ${jobTitle}` : ""}.`,
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
