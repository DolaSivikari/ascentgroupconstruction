import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { checkRateLimit, getClientIdentifier, createRateLimitResponse } from "../_shared/rateLimiter.ts";
import { createErrorResponse } from "../_shared/errorHandler.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Validation schemas
const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(255),
  phone: z.string().max(20).optional().nullable(),
  company: z.string().max(100).optional().nullable(),
  message: z.string().min(1).max(2000),
  submission_type: z.string().max(50).optional(),
});

const resumeSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(255),
  phone: z.string().max(20).optional().nullable(),
  coverMessage: z.string().max(2000).optional().nullable(),
  portfolioLinks: z.string().max(500).optional().nullable(),
});

const prequalificationSchema = z.object({
  companyName: z.string().min(1).max(200),
  contactName: z.string().min(1).max(100),
  email: z.string().email().max(255),
  phone: z.string().max(20).optional().nullable(),
  projectType: z.string().max(100).optional().nullable(),
  projectValueRange: z.string().max(50).optional().nullable(),
  message: z.string().max(2000).optional().nullable(),
});

interface FormSubmission {
  formType: 'contact' | 'resume' | 'prequalification';
  data: any;
  honeypot?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { formType, data, honeypot }: FormSubmission = await req.json();

    // Get client identifier
    const clientId = getClientIdentifier(req);

    // Check honeypot (if filled, reject silently)
    if (honeypot && honeypot.trim().length > 0) {
      console.log(`[Bot Detection] Honeypot triggered from ${clientId}`);
      // Return success to avoid alerting bots
      return new Response(
        JSON.stringify({ success: true, message: 'Submission received' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Validate form type
    if (!['contact', 'resume', 'prequalification'].includes(formType)) {
      return createErrorResponse(
        new Error('Invalid form type'),
        'Invalid form type',
        400,
        'submit-form'
      );
    }

    // Validate input and process submission based on form type
    let insertResult;
    
    try {
      switch (formType) {
        case 'contact': {
          const validatedData = contactSchema.parse(data);
          insertResult = await supabase
            .from('contact_submissions')
            .insert({
              name: validatedData.name,
              email: validatedData.email,
              phone: validatedData.phone || null,
              company: validatedData.company || null,
              message: validatedData.message,
              submission_type: validatedData.submission_type || 'contact',
              status: 'new'
            });
          break;
        }

        case 'resume': {
          const validatedData = resumeSchema.parse(data);
          insertResult = await supabase
            .from('resume_submissions')
            .insert({
              applicant_name: validatedData.name,
              email: validatedData.email,
              phone: validatedData.phone || null,
              cover_message: validatedData.coverMessage || null,
              portfolio_links: validatedData.portfolioLinks || null,
              status: 'new'
            });
          break;
        }

        case 'prequalification': {
          const validatedData = prequalificationSchema.parse(data);
          insertResult = await supabase
            .from('prequalification_downloads')
            .insert({
              company_name: validatedData.companyName,
              contact_name: validatedData.contactName,
              email: validatedData.email,
              phone: validatedData.phone || null,
              project_type: validatedData.projectType || null,
              project_value_range: validatedData.projectValueRange || null,
              message: validatedData.message || null,
              status: 'new'
            });
          break;
        }

        default:
          throw new Error('Invalid form type');
      }
    } catch (validationError) {
      console.error('[Validation Error]', validationError);
      return createErrorResponse(
        validationError,
        'Invalid form data',
        400,
        'submit-form'
      );
    }

    if (insertResult.error) {
      throw insertResult.error;
    }

    console.log(`[Success] ${formType} submission from ${clientId}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Submission received successfully' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('[Error]', error);
    return createErrorResponse(
      error,
      'Failed to process submission',
      500,
      'submit-form'
    );
  }
});