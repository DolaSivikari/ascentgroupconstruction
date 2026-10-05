import type { SupabaseClient } from "npm:@supabase/supabase-js@2";
import { sendTemplateEmail } from "./transactional-email-templates/send-email.ts";
import {
  ESTIMATING_EMAIL,
  aggregateAlertStatus,
  recipientList,
  recipientKey,
  emailErrorCode,
} from "./inquiry-alert-contract.ts";
export async function loggedInquiryEmail(
  db: SupabaseClient,
  template: string,
  to: string,
  data: Record<string, unknown>,
  key: string,
  inquiryId?: string,
) {
  let status = "failed";
  let errorCode: string | null = null;
  try {
    const result = await sendTemplateEmail(template, to, {
      templateData: data,
      idempotencyKey: key,
      replyTo: ESTIMATING_EMAIL,
    });
    status = result.sent ? "sent" : "suppressed";
  } catch (error) {
    errorCode = emailErrorCode(error);
  }
  const log = await db.from("email_send_log").insert({
    template_name: template,
    recipient_email: to,
    status,
    message_id: null,
    error_message: errorCode,
    metadata: inquiryId ? { inquiry_id: inquiryId } : {},
  });
  if (log.error)
    console.warn("Inquiry email log unavailable", { code: log.error.code });
  return { status, error: errorCode };
}
export async function sendInquiryAlerts(
  db: SupabaseClient,
  id: string,
  all = false,
) {
  const lookup = await db.from("inquiries").select("*").eq("id", id).single();
  if (lookup.error || !lookup.data) throw new Error("inquiry_unavailable");
  const lead = lookup.data;
  const now = new Date().toISOString();
  const attempt =
    lead.alert_status === "pending" && lead.alert_attempts > 0
      ? lead.alert_attempts
      : lead.alert_attempts + 1;
  const claimed = await db
    .from("inquiries")
    .update({
      alert_lease_until: new Date(Date.now() + 120000).toISOString(),
      alert_attempts: attempt,
      alert_status: "pending",
    })
    .eq("id", id)
    .eq("alert_attempts", lead.alert_attempts)
    .or(`alert_lease_until.is.null,alert_lease_until.lt.${now}`)
    .select("id")
    .maybeSingle();
  if (claimed.error) throw new Error("lease_unavailable");
  if (!claimed.data) return { status: "sending", lease_active: true };
  try {
    const recipients = await db
      .from("notification_recipients")
      .select("email")
      .eq("is_active", true)
      .in("inquiry_type", ["all", lead.inquiry_type]);
    if (recipients.error) throw new Error("recipients_unavailable");
    const emails = recipientList(recipients.data || []);
    if (!emails.length) emails.push(ESTIMATING_EMAIL);
    const deliveries = await db
      .from("inquiry_alert_deliveries")
      .select("*")
      .eq("inquiry_id", id)
      .order("attempt", { ascending: false })
      .limit(1000);
    if (deliveries.error) throw new Error("delivery_history_unavailable");
    const latest = new Map<string, { status: string; error: string | null }>();
    for (const row of deliveries.data || [])
      if (!latest.has(row.recipient.toLowerCase()))
        latest.set(row.recipient.toLowerCase(), row);
    // Expired pending sends reuse the same attempt and provider key. This covers a
    // crash between provider acceptance and recording the result.
    const targets = all
      ? emails
      : emails.filter(
          (email) =>
            !latest.has(email) || latest.get(email)?.status === "failed",
        );
    for (const email of targets) {
      const key = `inquiry-alert-${id}-a${attempt}-${await recipientKey(email)}`;
      const result = await loggedInquiryEmail(
        db,
        "inquiry-alert",
        email,
        lead,
        key,
        id,
      );
      const recorded = await db.from("inquiry_alert_deliveries").upsert(
        {
          inquiry_id: id,
          attempt,
          recipient: email,
          status: result.status,
          error: result.error,
          idempotency_key: key,
          message_id: null,
        },
        { onConflict: "idempotency_key" },
      );
      if (recorded.error) throw new Error("delivery_record_failed");
      latest.set(email, result);
    }
    const status = aggregateAlertStatus(
      emails.map((email) => latest.get(email)?.status || "failed"),
    );
    const failure =
      emails.map((email) => latest.get(email)?.error).find(Boolean) || null;
    const complete = await db
      .from("inquiries")
      .update({
        alert_status: status,
        alert_last_error: failure,
        alert_sent_at: ["sent", "partial"].includes(status)
          ? new Date().toISOString()
          : lead.alert_sent_at,
        alert_lease_until: null,
      })
      .eq("id", id)
      .eq("alert_attempts", attempt);
    if (complete.error) throw new Error("alert_summary_failed");
    return { status, recipients: emails.length, attempted: targets.length };
  } catch (error) {
    // Leave pending and keep the lease: retry recovers this same attempt after expiry.
    console.warn("Inquiry alert attempt incomplete", {
      code: emailErrorCode(error),
    });
    throw error;
  }
}
export async function sendInquiryConfirmation(
  db: SupabaseClient,
  lead: Record<string, unknown>,
) {
  if (lead.confirmation_status === "sent") return;
  const result = await loggedInquiryEmail(
    db,
    "inquiry-confirmation",
    String(lead.email),
    lead,
    `inquiry-confirmation-${lead.id}`,
    String(lead.id),
  );
  const saved = await db
    .from("inquiries")
    .update({ confirmation_status: result.status })
    .eq("id", lead.id);
  if (saved.error)
    console.warn("Confirmation status unavailable", { code: saved.error.code });
}
