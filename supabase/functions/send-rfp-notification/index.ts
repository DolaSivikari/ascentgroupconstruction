// FALLBACK SENDER — primary path is `send-transactional-email` (built-in Lovable email queue).
// This function is invoked from the client only when the primary send fails.
// It also sends to estimating@ascentgroupconstruction.com via Resend.
import { createClient } from 'npm:@supabase/supabase-js@2';
import { checkRateLimit, getClientIdentifier, createRateLimitResponse } from '../_shared/rateLimiter.ts';
import { createErrorResponse } from '../_shared/errorHandler.ts';
import { renderBrandedEmail, renderPlainText, REPLY_TO_EMAIL } from '../_shared/emailTemplate.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RFPNotificationRequest {
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  project_name: string;
  project_type: string;
  estimated_value_range: string;
  reference_id?: string;
  rfp_id?: string;
}

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

// HTML-escape user input to prevent injection
const escapeHtml = (str: string): string =>
  str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');

// Validate email format
const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;

// Validate a text field
const validateField = (value: unknown, name: string, maxLength: number): string | null => {
  if (typeof value !== 'string' || !value.trim()) return `${name} is required`;
  if (value.length > maxLength) return `${name} must be under ${maxLength} characters`;
  return null;
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting: 5 requests per 5 minutes per IP
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const identifier = getClientIdentifier(req);
    const rateLimit = await checkRateLimit(supabase, identifier, 'send-rfp-notification', 5, 5);

    if (!rateLimit.allowed) {
      return createRateLimitResponse(rateLimit.retry_after_seconds || 300, corsHeaders);
    }

    const data: RFPNotificationRequest = await req.json();

    // Validate all fields
    const validationErrors: string[] = [];
    
    let err: string | null;
    err = validateField(data.company_name, 'Company name', 200);
    if (err) validationErrors.push(err);
    err = validateField(data.contact_name, 'Contact name', 200);
    if (err) validationErrors.push(err);
    err = validateField(data.project_name, 'Project name', 300);
    if (err) validationErrors.push(err);
    err = validateField(data.project_type, 'Project type', 100);
    if (err) validationErrors.push(err);
    err = validateField(data.estimated_value_range, 'Estimated value range', 100);
    if (err) validationErrors.push(err);

    if (!data.email || !isValidEmail(data.email)) {
      validationErrors.push('Valid email is required');
    }

    if (data.phone && (typeof data.phone !== 'string' || data.phone.length > 30)) {
      validationErrors.push('Phone must be under 30 characters');
    }

    if (validationErrors.length > 0) {
      return createErrorResponse(
        new Error(validationErrors.join('; ')),
        validationErrors.join('; '),
        400,
        'send-rfp-notification'
      );
    }

    // Sanitize all fields for HTML output
    const safe = {
      company_name: escapeHtml(data.company_name.trim()),
      contact_name: escapeHtml(data.contact_name.trim()),
      email: escapeHtml(data.email.trim()),
      phone: escapeHtml((data.phone || '').trim()),
      project_name: escapeHtml(data.project_name.trim()),
      project_type: escapeHtml(data.project_type.trim()),
      estimated_value_range: escapeHtml(data.estimated_value_range.trim()),
    };

    // Send confirmation email to client (branded template)
    const customerHeading = `RFP received — thank you, ${data.contact_name.trim()}`;
    const customerBodyHtml = `
      <p>Hi ${safe.contact_name},</p>
      <p>Thank you for submitting your Request for Proposal to Ascent Group Construction. We've received your project details and our estimating team is reviewing your requirements.</p>
      <div style="margin:20px 0;padding:16px 18px;background-color:#f0f5fa;border-left:4px solid #003366;border-radius:4px;">
        <div style="font-size:12px;text-transform:uppercase;letter-spacing:0.05em;color:#6b7280;margin-bottom:8px;">Project details</div>
        <div style="font-size:14px;line-height:1.7;color:#333;">
          <strong>Project:</strong> ${safe.project_name}<br>
          <strong>Type:</strong> ${safe.project_type}<br>
          <strong>Estimated value:</strong> ${safe.estimated_value_range}<br>
          <strong>Company:</strong> ${safe.company_name}
        </div>
      </div>
      <p><strong>What happens next:</strong></p>
      <ol style="padding-left:20px;margin:8px 0 16px 0;">
        <li><strong>Review (24–48 hours):</strong> Our estimating team carefully reviews your project requirements.</li>
        <li><strong>Initial contact:</strong> We reach out within 2 business days to discuss details and clarify questions.</li>
        <li><strong>Proposal:</strong> We prepare a comprehensive proposal tailored to your scope.</li>
        <li><strong>Presentation:</strong> We schedule a meeting to walk you through the proposal.</li>
      </ol>
      <p>For immediate questions, call <a href="tel:6475286804" style="color:#003366;font-weight:600;">+1 (647) 528-6804</a> or reply directly to this email.</p>
    `;
    const customerBodyText = `Hi ${data.contact_name.trim()},

Thank you for submitting your Request for Proposal to Ascent Group Construction. We've received your project details and our estimating team is reviewing your requirements.

Project details:
- Project: ${data.project_name.trim()}
- Type: ${data.project_type.trim()}
- Estimated value: ${data.estimated_value_range.trim()}
- Company: ${data.company_name.trim()}

What happens next:
1. Review (24–48 hours): Our estimating team carefully reviews your project requirements.
2. Initial contact: We reach out within 2 business days to discuss details and clarify questions.
3. Proposal: We prepare a comprehensive proposal tailored to your scope.
4. Presentation: We schedule a meeting to walk you through the proposal.

For immediate questions, call +1 (647) 528-6804 or reply to this email.`;

    const clientEmailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Ascent Group Construction <onboarding@resend.dev>",
        to: [data.email.trim()],
        reply_to: REPLY_TO_EMAIL,
        subject: `RFP received — ${data.project_name.trim()}`,
        html: renderBrandedEmail({
          preheader: `We received your RFP for ${data.project_name.trim()}.`,
          heading: customerHeading,
          bodyHtml: customerBodyHtml,
          ctaText: "View Our Portfolio",
          ctaUrl: "https://ascentgroupconstruction.com/projects",
        }),
        text: renderPlainText({ heading: customerHeading, textBody: customerBodyText }),
      }),
    });

    const clientEmail = await clientEmailResponse.json();

    // Send notification to admin
    const adminEmailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "RFP System <onboarding@resend.dev>",
        to: ["estimating@ascentgroupconstruction.com"],
        reply_to: data.email.trim(),
        subject: `[RFP] ${safe.company_name} — ${safe.project_name}`,
        html: `
        <h2>🚨 New RFP Submission</h2>
        <p><strong>Company:</strong> ${safe.company_name}</p>
        <p><strong>Contact:</strong> ${safe.contact_name}</p>
        <p><strong>Email:</strong> ${safe.email}</p>
        <p><strong>Phone:</strong> ${safe.phone}</p>
        <hr>
        <h3>Project Details:</h3>
        <p><strong>Name:</strong> ${safe.project_name}</p>
        <p><strong>Type:</strong> ${safe.project_type}</p>
        <p><strong>Est. Value:</strong> ${safe.estimated_value_range}</p>
        <hr>
        <p><a href="https://ascentgroupconstruction.com/admin/rfp-submissions">View in Admin Dashboard →</a></p>
      `,
      }),
    });

    const adminEmail = await adminEmailResponse.json();

    console.log("RFP notification emails sent successfully");

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    console.error("Error in send-rfp-notification:", error);
    return createErrorResponse(
      error,
      'Failed to process RFP notification',
      500,
      'send-rfp-notification'
    );
  }
});
