import { supabase } from "@/integrations/supabase/client";
import { missingOptionalSchema } from "@/lib/admin/optionalDatabase";
import { inquiryDb as db, type Inquiry } from "./types";
import { INQUIRY_STATUSES, PRIORITIES } from "./schema";
import { z } from "zod";
export async function inquiryCapability() {
  const { error } = await db
    .from("inquiries")
    .select("id", { head: true })
    .limit(1);
  if (missingOptionalSchema(error)) return false;
  if (error) throw error;
  return true;
}
export async function loadInquiryDetail(id: string) {
  const { data, error } = await db
    .from("inquiries")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}
const workflow = z
  .object({
    status: z.enum(INQUIRY_STATUSES),
    priority: z.enum(PRIORITIES),
    assigned_to: z.string().uuid().nullable(),
    bid_due_at: z.string().datetime().nullable(),
    bid_amount: z.number().finite().min(0).max(999999999999.99).nullable(),
  })
  .strict();
export async function saveInquiry(baseline: Inquiry, input: unknown) {
  const patch = workflow.parse(input);
  const { data, error } = await db
    .from("inquiries")
    .update(patch)
    .eq("id", baseline.id)
    .eq("updated_at", baseline.updated_at)
    .select("*")
    .maybeSingle();
  if (error) throw error;
  if (!data)
    throw new Error(
      "This lead changed while you were editing. Your draft is preserved; reload before saving.",
    );
  return data;
}
export async function archiveInquiry(baseline: Inquiry, archived: boolean) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Sign in again.");
  const { data, error } = await db
    .from("inquiries")
    .update({
      archived_at: archived ? new Date().toISOString() : null,
      archived_by: archived ? user.id : null,
    })
    .eq("id", baseline.id)
    .eq("updated_at", baseline.updated_at)
    .select("*")
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("The lead changed. Reopen it before archiving.");
  return data;
}
export async function markInquiryViewed(id: string) {
  const { error } = await db
    .from("inquiries")
    .update({ first_viewed_at: new Date().toISOString() })
    .eq("id", id)
    .is("first_viewed_at", null);
  if (error) throw error;
}
export async function inquiryThread(id: string) {
  const results = await Promise.all([
    db
      .from("inquiry_notes")
      .select("*")
      .eq("inquiry_id", id)
      .order("created_at")
      .limit(500),
    db
      .from("inquiry_events")
      .select("*")
      .eq("inquiry_id", id)
      .order("created_at", { ascending: false })
      .limit(500),
    db
      .from("inquiry_alert_deliveries")
      .select("*")
      .eq("inquiry_id", id)
      .order("created_at", { ascending: false })
      .limit(200),
  ]);
  for (const r of results) if (r.error) throw r.error;
  return {
    notes: results[0].data || [],
    events: results[1].data || [],
    deliveries: results[2].data || [],
  };
}
export async function addInquiryNote(id: string, body: string) {
  const text = z.string().trim().min(1).max(5000).parse(body);
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Sign in again.");
  const result = await db
    .from("inquiry_notes")
    .insert({ inquiry_id: id, author_id: user.id, body: text });
  if (result.error) throw result.error;
}
export async function loadAssignees() {
  const { data, error } = await supabase
    .from("user_roles")
    .select("user_id")
    .in("role", ["admin", "super_admin"]);
  if (error) throw error;
  const ids = [...new Set((data || []).map((r) => r.user_id))];
  if (!ids.length) return [];
  const profiles = await supabase
    .from("profiles")
    .select("id,full_name,email")
    .in("id", ids);
  if (profiles.error) throw profiles.error;
  return profiles.data || [];
}
export async function resendInquiryAlert(id: string, all = false) {
  const { data, error } = await supabase.functions.invoke(
    "inquiry-alert-resend",
    { body: { inquiry_id: id, all_recipients: all } },
  );
  if (error || !data?.success)
    throw new Error(
      data?.error || "Alert could not be resent. Your lead is still saved.",
    );
  return data;
}
export const maskedEmail = (email: string) => {
  const [name, domain] = email.split("@");
  return `${name?.slice(0, 1) || "*"}***@${domain || "hidden"}`;
};
export async function loadRecipients() {
  const { data, error } = await db
    .from("notification_recipients")
    .select("*")
    .order("inquiry_type")
    .order("email");
  if (missingOptionalSchema(error))
    return { available: false as const, rows: [] };
  if (error) throw error;
  return { available: true as const, rows: data || [] };
}
export async function saveRecipient(email: string, type: string) {
  const valid = z.string().trim().email().max(320).parse(email).toLowerCase();
  if (
    ![
      "all",
      "general",
      "estimate",
      "bid_invitation",
      "rfp",
      "prequal_request",
    ].includes(type)
  )
    throw new Error("Choose an inquiry type.");
  const { error } = await db
    .from("notification_recipients")
    .upsert(
      { email: valid, inquiry_type: type, is_active: true },
      { onConflict: "inquiry_type,email" },
    );
  if (error) throw error;
}
export async function toggleRecipient(id: string, enabled: boolean) {
  const { error } = await db
    .from("notification_recipients")
    .update({ is_active: enabled })
    .eq("id", id);
  if (error) throw error;
}
export async function testInquiryAlert(email: string) {
  const to = z.string().email().parse(email);
  const { data, error } = await supabase.functions.invoke(
    "inquiry-alert-resend",
    { body: { test_recipient: to } },
  );
  if (error || !data?.success)
    throw new Error(
      "The test alert was not sent. Check Email Delivery and function setup.",
    );
}

export async function loadNewInquiryCount(): Promise<number | null> {
  const { count, error } = await db
    .from("inquiries")
    .select("id", { count: "exact", head: true })
    .eq("status", "new")
    .is("archived_at", null);
  if (missingOptionalSchema(error)) return null;
  if (error || count === null || !Number.isSafeInteger(count) || count < 0)
    throw new Error("New inquiry counts are unavailable");
  return count;
}
