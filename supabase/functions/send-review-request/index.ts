// @ts-nocheck — email_send_log is not present in the generated types
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, handleCors } from '../_shared/http.ts';
import { sendTemplateEmail } from '../_shared/transactional-email-templates/send-email.ts';

const TRANSACTIONAL_TEMPLATE = 'review-request';

// Notification-only bookkeeping for the admin dashboard.
async function logSend(
  supabase: any,
  recipient: string,
  status: string,
  errorMessage?: string,
) {
  const { error } = await supabase.from('email_send_log').insert({
    message_id: null,
    template_name: TRANSACTIONAL_TEMPLATE,
    recipient_email: recipient,
    status,
    error_message: errorMessage ?? null,
  });
  if (error) {
    console.error('Failed to write email_send_log', { code: error.code, message: error.message });
  }
}
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

    // Only signed-in staff may send review requests — otherwise anyone could
    // email arbitrary addresses from the company's sender.
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData?.user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: canSend } = await supabase.rpc('can_edit_content', {
      _user_id: userData.user.id,
    });
    if (!canSend) {
      return new Response(
        JSON.stringify({ error: 'Forbidden' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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

    // Send through Lovable's managed email API
    const reviewLandingPage = `${SITE_URL}/reviews?r=${reviewRequest.id}`;

    let sendResult;
    try {
      sendResult = await sendTemplateEmail(TRANSACTIONAL_TEMPLATE, email, {
        idempotencyKey: `review-request-${reviewRequest.id}`,
        templateData: {
          clientName,
          reviewLandingPage,
          googleReviewLink: GOOGLE_REVIEW_LINK,
          homestarsReviewLink: HOMESTARS_REVIEW_LINK,
          trustedprosReviewLink: TRUSTEDPROS_REVIEW_LINK,
        },
      });
    } catch (sendError) {
      const message = sendError instanceof Error ? sendError.message : String(sendError);
      console.error('Review request email failed:', message);
      await logSend(supabase, email, 'failed', message.slice(0, 1000));
      await supabase
        .from('review_requests')
        .update({ status: 'bounced' })
        .eq('id', reviewRequest.id);

      return new Response(
        JSON.stringify({ error: 'Failed to send email', details: message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!sendResult.sent) {
      // Recipient previously bounced, complained, or unsubscribed.
      await logSend(supabase, email, 'suppressed');
      await supabase
        .from('review_requests')
        .update({ status: 'bounced' })
        .eq('id', reviewRequest.id);

      return new Response(
        JSON.stringify({ success: false, reason: 'recipient_suppressed' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    await logSend(supabase, email, 'sent');

    await supabase
      .from('review_requests')
      .update({
        status: 'sent',
        sent_at: new Date().toISOString(),
      })
      .eq('id', reviewRequest.id);

    console.log('Review request sent successfully:', reviewRequest.id);

    return new Response(
      JSON.stringify({
        success: true,
        reviewRequestId: reviewRequest.id,
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
