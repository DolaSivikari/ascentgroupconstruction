import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { getClientIdentifier } from "../_shared/rateLimiter.ts";
import { createErrorResponse } from "../_shared/errorHandler.ts";
import { corsHeaders, handleCors, jsonResponse } from "../_shared/http.ts";

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
  // Frontend may send either a newline-separated string OR an array of links
  portfolioLinks: z.union([z.string().max(1000), z.array(z.string()).max(20)]).optional().nullable(),
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

const rfpSchema = z.object({
  company_name: z.string().min(1).max(200),
  contact_name: z.string().min(1).max(100),
  email: z.string().email().max(255),
  phone: z.string().min(10).max(20),
  title: z.string().max(100).optional().nullable(),
  project_name: z.string().min(1).max(300),
  project_type: z.string().min(1).max(100),
  project_location: z.string().min(1).max(500),
  estimated_value_range: z.string().min(1).max(50),
  estimated_timeline: z.string().min(1).max(200),
  project_start_date: z.string().optional().nullable(),
  delivery_method: z.string().min(1).max(100),
  bonding_required: z.boolean().optional(),
  prequalification_complete: z.boolean().optional(),
  scope_of_work: z.string().min(1).max(5000),
  additional_requirements: z.string().max(2000).optional().nullable(),
  plans_available: z.boolean().optional(),
  site_visit_required: z.boolean().optional(),
  attachment_urls: z.array(z.string()).optional().nullable(),
});

type FormSubmission = {
  formType: 'contact' | 'resume' | 'prequalification' | 'rfp';
  data: any;
  honeypot?: string;
  startedAt?: number;
};

// Spam heuristics
function looksLikeLinkSpam(text: string | undefined | null): boolean {
  if (!text) return false;
  const matches = text.match(/(https?:\/\/|www\.)/gi);
  return (matches?.length ?? 0) >= 3;
}

async function sha256Hex(input: string): Promise<string> {
  const buf = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

Deno.serve(async (req) => {
  const cors = handleCors(req);
  if (cors) return cors;

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const payload = (await req.json()) as FormSubmission;
    const { formType, honeypot, startedAt } = payload;

    const clientId = getClientIdentifier(req);

    // --- Spam Filter 1: Honeypot ---
    if (honeypot && honeypot.trim().length > 0) {
      console.log(`[spam_blocked] reason=honeypot client=${clientId} type=${formType}`);
      return jsonResponse({ success: true, message: 'Submission received' });
    }

    // --- Spam Filter 2: Submitted too fast (< 2s from form interaction) ---
    if (typeof startedAt === 'number' && startedAt > 0) {
      const elapsed = Date.now() - startedAt;
      if (elapsed < 2000) {
        console.log(`[spam_blocked] reason=too_fast elapsed=${elapsed}ms client=${clientId} type=${formType}`);
        return jsonResponse({ success: true, message: 'Submission received' });
      }
    }

    // --- Spam Filter 3: Link-heavy message body ---
    const messageBody =
      payload.data?.message ??
      payload.data?.scope_of_work ??
      payload.data?.coverMessage ??
      '';
    if (looksLikeLinkSpam(messageBody)) {
      console.log(`[spam_blocked] reason=link_spam client=${clientId} type=${formType}`);
      return jsonResponse({ success: true, message: 'Submission received' });
    }

    // --- Spam Filter 4: Repeat content (same message+email within 10 min) ---
    // CRITICAL: This is a "nice to have" guard. ANY failure here must NOT block legitimate
    // submissions. Wrapped in a defensive IIFE that always returns { allowed: true } on error.
    const repeatCheck = await (async (): Promise<{ allowed: boolean }> => {
      if (!messageBody || !payload.data?.email) return { allowed: true };
      try {
        const fingerprint = await sha256Hex(`${payload.data.email}:${messageBody}`.toLowerCase());
        const { data: rateData, error: rateErr } = await supabase.rpc(
          'check_and_update_rate_limit',
          {
            p_identifier: `${clientId}:${fingerprint.slice(0, 16)}`,
            p_endpoint: `submit-form-dup:${formType}`,
            p_limit: 1,
            p_window_minutes: 10,
          },
        );
        if (rateErr) {
          console.warn('[spam_filter] repeat-content RPC error (allowing through):', rateErr);
          return { allowed: true };
        }
        const allowed = !(rateData && (rateData as any).allowed === false);
        return { allowed };
      } catch (e) {
        console.warn('[spam_filter] repeat-content check threw (allowing through):', e);
        return { allowed: true };
      }
    })();
    if (!repeatCheck.allowed) {
      console.log(`[spam_blocked] reason=repeat_content client=${clientId} type=${formType}`);
      return jsonResponse({ success: true, message: 'Submission received' });
    }

    if (!['contact', 'resume', 'prequalification', 'rfp'].includes(formType)) {
      return createErrorResponse(new Error('Invalid form type'), 'Invalid form type', 400, 'submit-form');
    }

    let insertResult: any;
    let insertedId: string | null = null;
    let createdAt: string | null = null;

    try {
      switch (formType) {
        case 'contact': {
          const validatedData = contactSchema.parse(payload.data);
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
          const validatedData = resumeSchema.parse(payload.data);
          // Combine optional portfolio links into the cover_letter body since the
          // resume_submissions table doesn't have a dedicated portfolio_links column.
          const coverLetterBody = [
            validatedData.coverMessage?.trim(),
            validatedData.portfolioLinks?.trim()
              ? `\n\nPortfolio links:\n${validatedData.portfolioLinks.trim()}`
              : null,
          ]
            .filter(Boolean)
            .join('') || null;

          insertResult = await supabase
            .from('resume_submissions')
            .insert({
              applicant_name: validatedData.name,
              email: validatedData.email,
              phone: validatedData.phone || null,
              cover_letter: coverLetterBody,
              status: 'new'
            });
          break;
        }
        case 'prequalification': {
          const validatedData = prequalificationSchema.parse(payload.data);
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
        case 'rfp': {
          const validatedData = rfpSchema.parse(payload.data);
          insertResult = await supabase
            .from('rfp_submissions')
            .insert({
              company_name: validatedData.company_name,
              contact_name: validatedData.contact_name,
              email: validatedData.email,
              phone: validatedData.phone,
              title: validatedData.title || null,
              project_name: validatedData.project_name,
              project_type: validatedData.project_type,
              project_location: validatedData.project_location,
              estimated_value_range: validatedData.estimated_value_range,
              estimated_timeline: validatedData.estimated_timeline,
              project_start_date: validatedData.project_start_date || null,
              delivery_method: validatedData.delivery_method,
              bonding_required: validatedData.bonding_required ?? false,
              prequalification_complete: validatedData.prequalification_complete ?? false,
              scope_of_work: validatedData.scope_of_work,
              additional_requirements: validatedData.additional_requirements || null,
              plans_available: validatedData.plans_available ?? false,
              site_visit_required: validatedData.site_visit_required ?? false,
              consent_timestamp: new Date().toISOString(),
              attachment_urls: validatedData.attachment_urls && validatedData.attachment_urls.length > 0
                ? validatedData.attachment_urls
                : null,
            })
            .select('id, created_at')
            .single();
          if (insertResult?.data) {
            insertedId = (insertResult.data as any).id;
            createdAt = (insertResult.data as any).created_at;
          }
          break;
        }
      }
    } catch (validationError) {
      console.error('[Validation Error]', validationError);
      return createErrorResponse(validationError, 'Invalid form data', 400, 'submit-form');
    }

    if (insertResult?.error) {
      throw insertResult.error;
    }

    console.log(`[Success] ${formType} submission from ${clientId}`);
    return jsonResponse({
      success: true,
      message: 'Submission received successfully',
      id: insertedId,
      created_at: createdAt,
    });
  } catch (error) {
    console.error('[Error]', error);
    return createErrorResponse(error, 'Failed to process submission', 500, 'submit-form');
  }
});
