// @ts-nocheck — email_send_log is not present in the generated types
import { createClient } from 'npm:@supabase/supabase-js@2'
import { EmailAPIError } from 'npm:@lovable.dev/email-js@0.1.0'
import { sendTemplateEmail } from '../_shared/transactional-email-templates/send-email.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const ESTIMATING_EMAIL = 'estimating@ascentgroupconstruction.com'
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function json(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

async function log(
  supabase: ReturnType<typeof createClient>,
  templateName: string,
  recipient: string,
  status: string,
  errorMessage?: string,
) {
  const { error } = await supabase.from('email_send_log').insert({
    message_id: null,
    template_name: templateName,
    recipient_email: recipient,
    status,
    error_message: errorMessage ?? null,
  })
  if (error) {
    console.error('Failed to write email_send_log', { code: error.code, message: error.message })
  }
}

// Sends one registered template and records the outcome. Returns true on send.
async function send(
  supabase: ReturnType<typeof createClient>,
  templateName: string,
  recipient: string,
  templateData: Record<string, unknown>,
  idempotencyKey: string,
): Promise<boolean> {
  try {
    const result = await sendTemplateEmail(templateName, recipient, {
      templateData,
      idempotencyKey,
    })
    if (!result.sent) {
      await log(supabase, templateName, recipient, 'suppressed')
      return false
    }
    await log(supabase, templateName, recipient, 'sent')
    return true
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    await log(supabase, templateName, recipient, 'failed', message.slice(0, 1000))
    if (error instanceof EmailAPIError && error.status === 429) {
      // Rate limited — wait out the cooldown, then try once more.
      const waitSeconds = error.retryAfterSeconds ?? 60
      await new Promise((r) => setTimeout(r, waitSeconds * 1000))
      const retry = await sendTemplateEmail(templateName, recipient, {
        templateData,
        idempotencyKey,
      })
      await log(supabase, templateName, recipient, retry.sent ? 'sent' : 'suppressed')
      return retry.sent
    }
    throw error
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!supabaseUrl || !supabaseServiceKey) {
    return json({ error: 'Server configuration error' }, 500)
  }

  let rfpId: string
  try {
    const body = await req.json()
    rfpId = String(body.rfpId ?? body.rfp_id ?? '')
  } catch {
    return json({ error: 'Invalid JSON in request body' }, 400)
  }

  if (!UUID_RE.test(rfpId)) {
    return json({ error: 'A valid rfpId is required' }, 400)
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // Recipient and content come from the stored submission, never from the browser.
  const { data: rfp, error: lookupError } = await supabase
    .from('rfp_submissions')
    .select('*')
    .eq('id', rfpId)
    .maybeSingle()

  if (lookupError) {
    console.error('Failed to load RFP submission', { code: lookupError.code })
    return json({ error: 'Failed to load submission' }, 500)
  }
  if (!rfp) {
    return json({ error: 'Submission not found' }, 404)
  }

  const referenceId = `RFP-${rfpId.slice(0, 8).toUpperCase()}`
  const submittedAt = new Date(rfp.created_at ?? Date.now()).toLocaleString()
  const attachmentsCount = Array.isArray(rfp.attachment_urls) ? rfp.attachment_urls.length : 0

  try {
    await send(
      supabase,
      'rfp-customer-confirmation',
      rfp.email,
      {
        contactName: rfp.contact_name,
        projectName: rfp.project_name,
        projectType: rfp.project_type,
        estimatedValueRange: rfp.estimated_value_range,
        companyName: rfp.company_name,
        referenceId,
      },
      `rfp-customer-confirmation-${rfpId}`,
    )

    await send(
      supabase,
      'rfp-internal-notification',
      ESTIMATING_EMAIL,
      {
        referenceId,
        rfpId,
        companyName: rfp.company_name,
        contactName: rfp.contact_name,
        email: rfp.email,
        phone: rfp.phone,
        projectName: rfp.project_name,
        projectType: rfp.project_type,
        projectLocation: rfp.project_location,
        estimatedValueRange: rfp.estimated_value_range,
        estimatedTimeline: rfp.estimated_timeline,
        deliveryMethod: rfp.delivery_method,
        scopeOfWork: rfp.scope_of_work,
        attachmentsCount,
        submittedAt,
      },
      `rfp-internal-notification-${rfpId}`,
    )
  } catch (error) {
    console.error('RFP email send failed', {
      message: error instanceof Error ? error.message : String(error),
    })
    return json({ error: 'Failed to send RFP emails' }, 500)
  }

  return json({ success: true })
})
