import { createClient } from 'npm:@supabase/supabase-js@2';
import { checkRateLimit, getClientIdentifier, createRateLimitResponse } from '../_shared/rateLimiter.ts';
import { createErrorResponse } from '../_shared/errorHandler.ts';

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

    // Send confirmation email to client
    const clientEmailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Ascent Group Construction <onboarding@resend.dev>",
        to: [data.email.trim()],
        subject: "RFP Received - Ascent Group Construction",
        html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #003366 0%, #004080 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .highlight { background: #fff; padding: 20px; border-left: 4px solid #FF6B35; margin: 20px 0; }
            .button { display: inline-block; background: #FF6B35; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">RFP Received Successfully</h1>
            </div>
            <div class="content">
              <p>Dear ${safe.contact_name},</p>
              <p>Thank you for submitting your Request for Proposal to Ascent Group Construction. We've successfully received your project details and our team is reviewing your requirements.</p>
              <div class="highlight">
                <h3 style="margin-top: 0; color: #003366;">Your Project Details:</h3>
                <ul style="list-style: none; padding: 0;">
                  <li><strong>Project:</strong> ${safe.project_name}</li>
                  <li><strong>Type:</strong> ${safe.project_type}</li>
                  <li><strong>Estimated Value:</strong> ${safe.estimated_value_range}</li>
                </ul>
              </div>
              <h3 style="color: #003366;">What Happens Next?</h3>
              <ol>
                <li><strong>Review (24-48 hours):</strong> Our estimating team will carefully review your project requirements</li>
                <li><strong>Initial Contact:</strong> We'll reach out within 2 business days to discuss details and clarify any questions</li>
                <li><strong>Proposal Preparation:</strong> We'll prepare a comprehensive proposal tailored to your specific needs</li>
                <li><strong>Presentation:</strong> We'll schedule a meeting to present our proposal and answer questions</li>
              </ol>
              <p>In the meantime, feel free to review our capabilities and recent projects:</p>
              <div style="text-align: center;">
                <a href="https://ascentgroupconstruction.com/projects" class="button">View Our Portfolio</a>
              </div>
              <p>If you have any immediate questions or need to provide additional information, please don't hesitate to contact us at:</p>
              <ul style="list-style: none; padding: 0;">
                <li>📧 Email: rfp@ascentgroupconstruction.com</li>
                <li>📞 Phone: +1 (647) 528-6804</li>
              </ul>
              <p>We look forward to the opportunity to work with ${safe.company_name} on this project.</p>
              <p style="margin-top: 30px;">Best regards,<br>
              <strong>The Ascent Group Team</strong><br>
              General Contracting &amp; Construction Management</p>
              <div class="footer">
                <p>Ascent Group Construction<br>
                Greater Toronto Area, Ontario<br>
                Licensed &amp; Bonded | COR Certified | WSIB Compliant</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
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
        to: ["info@ascentgroupconstruction.com"],
        subject: `New RFP: ${safe.project_name} - ${safe.company_name}`,
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
