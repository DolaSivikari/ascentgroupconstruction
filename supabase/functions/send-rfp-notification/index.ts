import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
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

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: RFPNotificationRequest = await req.json();

    // Send confirmation email to client using Resend API
    const clientEmailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Ascent Group Construction <onboarding@resend.dev>",
        to: [data.email],
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
              <p>Dear ${data.contact_name},</p>
              
              <p>Thank you for submitting your Request for Proposal to Ascent Group Construction. We've successfully received your project details and our team is reviewing your requirements.</p>
              
              <div class="highlight">
                <h3 style="margin-top: 0; color: #003366;">Your Project Details:</h3>
                <ul style="list-style: none; padding: 0;">
                  <li><strong>Project:</strong> ${data.project_name}</li>
                  <li><strong>Type:</strong> ${data.project_type}</li>
                  <li><strong>Estimated Value:</strong> ${data.estimated_value_range}</li>
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
                <li>📞 Phone: (416) 647-5286</li>
              </ul>
              
              <p>We look forward to the opportunity to work with ${data.company_name} on this project.</p>
              
              <p style="margin-top: 30px;">Best regards,<br>
              <strong>The Ascent Group Team</strong><br>
              General Contracting & Construction Management</p>
              
              <div class="footer">
                <p>Ascent Group Construction<br>
                Greater Toronto Area, Ontario<br>
                Licensed & Bonded | COR Certified | WSIB Compliant</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      }),
    });

    const clientEmail = await clientEmailResponse.json();

    // Send notification to admin using Resend API
    const adminEmailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "RFP System <onboarding@resend.dev>",
      to: ["admin@ascentgroupconstruction.com"],
      subject: `New RFP: ${data.project_name} - ${data.company_name}`,
      html: `
        <h2>🚨 New RFP Submission</h2>
        <p><strong>Company:</strong> ${data.company_name}</p>
        <p><strong>Contact:</strong> ${data.contact_name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <hr>
        <h3>Project Details:</h3>
        <p><strong>Name:</strong> ${data.project_name}</p>
        <p><strong>Type:</strong> ${data.project_type}</p>
        <p><strong>Est. Value:</strong> ${data.estimated_value_range}</p>
        <hr>
        <p><a href="https://ascentgroupconstruction.com/admin/rfp-submissions">View in Admin Dashboard →</a></p>
      `,
      }),
    });

    const adminEmail = await adminEmailResponse.json();

    console.log("Emails sent successfully:", { clientEmail, adminEmail });

    return new Response(
      JSON.stringify({ success: true, clientEmail, adminEmail }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-rfp-notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
