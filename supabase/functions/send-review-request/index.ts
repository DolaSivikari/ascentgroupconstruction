import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const resendApiKey = Deno.env.get('RESEND_API_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { email, clientName, projectId, templateName } = await req.json();

    if (!email || !clientName) {
      return new Response(
        JSON.stringify({ error: 'Email and client name are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch email template
    const { data: template, error: templateError } = await supabase
      .from('email_templates')
      .select('*')
      .eq('name', templateName || 'review_request_day_0')
      .eq('is_active', true)
      .single();

    if (templateError || !template) {
      console.error('Template fetch error:', templateError);
      return new Response(
        JSON.stringify({ error: 'Email template not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create review request record
    const { data: reviewRequest, error: reviewError } = await supabase
      .from('review_requests')
      .insert({
        email,
        client_name: clientName,
        project_id: projectId,
        status: 'pending'
      })
      .select()
      .single();

    if (reviewError) {
      console.error('Review request creation error:', reviewError);
      return new Response(
        JSON.stringify({ error: 'Failed to create review request' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate review landing page URL with tracking
    const reviewLandingPage = `${supabaseUrl.replace('supabase.co', 'lovableproject.com')}/reviews?r=${reviewRequest.id}`;
    
    // Replace template variables
    const googleReviewLink = 'https://g.page/r/YOUR_GOOGLE_PLACE_ID/review';
    const homestarsReviewLink = 'https://homestars.com/companies/YOUR_COMPANY_ID';
    const trustedprosReviewLink = 'https://trustedpros.ca/company/YOUR_COMPANY_ID';

    let htmlBody = template.body_html
      .replace(/{{client_name}}/g, clientName)
      .replace(/{{google_review_link}}/g, googleReviewLink)
      .replace(/{{homestars_review_link}}/g, homestarsReviewLink)
      .replace(/{{trustedpros_review_link}}/g, trustedprosReviewLink)
      .replace(/{{review_landing_page}}/g, reviewLandingPage);

    let textBody = template.body_text
      .replace(/{{client_name}}/g, clientName)
      .replace(/{{review_landing_page}}/g, reviewLandingPage);

    // Send email via Resend
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Ascent Group Construction <noreply@ascentgroupconstruction.com>',
        to: [email],
        subject: template.subject,
        html: htmlBody,
        text: textBody,
      }),
    });

    if (!resendResponse.ok) {
      const resendError = await resendResponse.text();
      console.error('Resend API error:', resendError);
      
      // Update status to bounced
      await supabase
        .from('review_requests')
        .update({ status: 'bounced' })
        .eq('id', reviewRequest.id);

      return new Response(
        JSON.stringify({ error: 'Failed to send email', details: resendError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const resendData = await resendResponse.json();

    // Update review request status
    await supabase
      .from('review_requests')
      .update({ 
        status: 'sent',
        sent_at: new Date().toISOString()
      })
      .eq('id', reviewRequest.id);

    console.log('Review request sent successfully:', resendData);

    return new Response(
      JSON.stringify({ 
        success: true, 
        reviewRequestId: reviewRequest.id,
        emailId: resendData.id 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
