import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { checkRateLimit, getClientIdentifier, createRateLimitResponse } from "../_shared/rateLimiter.ts";

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
  if (!/^[a-zA-Z\s\-'\.]+$/.test(name)) {
    return "Name contains invalid characters";
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Valid email address is required";
  }
  if (email.length > 255) {
    return "Email must be less than 255 characters";
  }

  if (phone && phone.length > 0) {
    if (!/^[\d\s\-\+\(\)]+$/.test(phone)) {
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
      to: ["info@ascentgroupconstruction.com"],
      subject: `New ${packageName} Package Request from ${name}`,
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

    // Send confirmation to user
    const userEmail = await resend.emails.send({
      from: "Ascent Group Construction <onboarding@resend.dev>",
      to: [email],
      subject: `Your ${packageName} Package Request - Ascent Group Construction`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a1a1a;">Thank you for your interest!</h1>
          <p>Dear ${name},</p>
          <p>We have received your request for our <strong>${packageName}</strong> package.</p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">What's Next?</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Our team will review your request</li>
              <li>We'll contact you within 24 hours to discuss details</li>
              <li>We'll schedule a convenient time for consultation</li>
              <li>Get a detailed quote tailored to your needs</li>
            </ul>
          </div>
          <p>If you have any immediate questions, please call us at <strong>(416) 555-PAINT</strong></p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="color: #666; font-size: 14px;">
            <strong>Ascent Group Construction</strong><br>
            123 Industrial Parkway, Mississauga, ON L5T 1A1<br>
            Phone: (416) 555-PAINT | Email: info@ascentgroupconstruction.com
          </p>
        </div>
      `,
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
