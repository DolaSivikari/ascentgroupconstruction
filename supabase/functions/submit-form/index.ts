import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { checkRateLimit, getClientIdentifier, createRateLimitResponse } from "../_shared/rateLimiter.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    // Rate limiting configuration based on form type
    let rateLimitConfig = { limit: 5, windowMinutes: 15 };
    if (formType === 'resume' || formType === 'prequalification') {
      rateLimitConfig = { limit: 3, windowMinutes: 30 };
    }

    // Check rate limit
    const rateLimitResult = await checkRateLimit(
      supabase,
      clientId,
      `form-${formType}`,
      rateLimitConfig.limit,
      rateLimitConfig.windowMinutes
    );

    if (!rateLimitResult.allowed) {
      console.log(`[Rate Limit] Blocked ${formType} submission from ${clientId}`);
      return createRateLimitResponse(
        rateLimitResult.retry_after_seconds || 60,
        corsHeaders
      );
    }

    // Process submission based on form type
    let insertResult;
    
    switch (formType) {
      case 'contact':
        insertResult = await supabase
          .from('contact_submissions')
          .insert({
            name: data.name,
            email: data.email,
            phone: data.phone || null,
            company: data.company || null,
            message: data.message,
            submission_type: data.submission_type || 'contact',
            status: 'new'
          });
        break;

      case 'resume':
        insertResult = await supabase
          .from('resume_submissions')
          .insert({
            applicant_name: data.name,
            email: data.email,
            phone: data.phone || null,
            cover_message: data.coverMessage || null,
            portfolio_links: data.portfolioLinks || null,
            status: 'new'
          });
        break;

      case 'prequalification':
        insertResult = await supabase
          .from('prequalification_downloads')
          .insert({
            company_name: data.companyName,
            contact_name: data.contactName,
            email: data.email,
            phone: data.phone || null,
            project_type: data.projectType || null,
            project_value_range: data.projectValueRange || null,
            message: data.message || null,
            status: 'new'
          });
        break;

      default:
        throw new Error('Invalid form type');
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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process submission',
        message: errorMessage 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
