import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, handleCors } from '../_shared/http.ts';

const TRANSACTIONAL_TEMPLATE = 'review-request';
const SITE_URL = 'https://ascentgroupconstruction.com';
const GOOGLE_REVIEW_LINK = 'https://g.page/r/YOUR_GOOGLE_PLACE_ID/review';
const HOMESTARS_REVIEW_LINK = 'https://homestars.com/companies/YOUR_COMPANY_ID';
const TRUSTEDPROS_REVIEW_LINK = 'https://trustedpros.ca/company/YOUR_COMPANY_ID';

Deno.serve(async (req) => {
  const cors = handleCors(req);
  if (cors) return cors;

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { email, clientName, projectId } = await req.json();

    if (!email || !clientName) {
      return new Response(
        JSON.stringify({ error: 'Email and client name are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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

    // Enqueue email through the Lovable transactional-email pipeline
    const reviewLandingPage = `${SITE_URL}/reviews?r=${reviewRequest.id}`;

    const { data: sendResult, error: sendError } = await supabase.functions.invoke(
      'send-transactional-email',
      {
        body: {
          templateName: TRANSACTIONAL_TEMPLATE,
          recipientEmail: email,
          idempotencyKey: `review-request:${reviewRequest.id}`,
          templateData: {
            clientName,
            reviewLandingPage,
            googleReviewLink: GOOGLE_REVIEW_LINK,
            homestarsReviewLink: HOMESTARS_REVIEW_LINK,
            trustedprosReviewLink: TRUSTEDPROS_REVIEW_LINK,
          },
        },
      }
    );

    if (sendError) {
      console.error('send-transactional-email error:', sendError);
      await supabase
        .from('review_requests')
        .update({ status: 'bounced' })
        .eq('id', reviewRequest.id);

      return new Response(
        JSON.stringify({ error: 'Failed to send email', details: sendError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    await supabase
      .from('review_requests')
      .update({
        status: 'sent',
        sent_at: new Date().toISOString(),
      })
      .eq('id', reviewRequest.id);

    console.log('Review request enqueued successfully:', sendResult);

    return new Response(
      JSON.stringify({
        success: true,
        reviewRequestId: reviewRequest.id,
        result: sendResult,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
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
