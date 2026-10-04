import { supabase } from "@/integrations/supabase/client";
import {
  INBOX_SOURCES,
  inboxDate,
  inboxKinds,
  inboxText,
  inboxUpdate,
  normalizeInboxItem,
  rfpAttachmentPath,
  type InboxFilter,
  type InboxItem,
  type InboxKind,
} from "./model";

export async function loadInbox(
  kind: InboxFilter,
): Promise<{ items: InboxItem[]; failed: string[] }> {
  const kinds = inboxKinds(kind);
  const results = await Promise.all(
    kinds.map(async (key) => {
      const source = INBOX_SOURCES[key];
      const items: InboxItem[] = [];
      try {
        // Fetch complete details and notes. Stable pagination avoids the REST row cap.
        for (let offset = 0; ; offset += 1000) {
          const { data, error } = await supabase
            .from(source.table)
            .select("*")
            .order(source.date, { ascending: false })
            .order("id")
            .range(offset, offset + 999);
          if (error) throw error;
          const rows = data || [];
          items.push(...rows.map((row) => normalizeInboxItem(key, row)));
          if (rows.length < 1000) break;
        }
        return { items, failed: [] as string[] };
      } catch {
        // Keep other tables visible, and make an incomplete load explicit.
        return { items: [] as InboxItem[], failed: [source.label] };
      }
    }),
  );
  return {
    items: results
      .flatMap((result) => result.items)
      .sort(
        (a, b) =>
          (inboxDate(b.created_at)?.getTime() || 0) -
          (inboxDate(a.created_at)?.getTime() || 0),
      ),
    failed: results.flatMap((result) => result.failed),
  };
}

export async function signRfpAttachment(value: string): Promise<string> {
  const path = rfpAttachmentPath(value, import.meta.env.VITE_SUPABASE_URL);
  const { data, error } = await supabase.storage
    .from("rfp-attachments")
    .createSignedUrl(path, 300);
  if (error || !data?.signedUrl)
    throw new Error("Could not open this attachment. Please try again.");
  return data.signedUrl;
}

export async function saveInboxItem(
  item: InboxItem,
  status: string,
  notes: string,
): Promise<void> {
  const patch = inboxUpdate(item, status, notes);
  if (!Object.keys(patch).length) return;
  if (item.table === "newsletter_subscribers")
    throw new Error("Unsupported update");
  let query =
    item.table === "quote_requests" ||
    item.table === "prequalification_downloads"
      ? supabase.from(item.table).update({ status: patch.status })
      : supabase.from(item.table).update(patch);
  // Protect edits against another staff member's changes while details are open.
  if (patch.status !== undefined)
    query =
      item.status === null
        ? query.is("status", null)
        : query.eq("status", item.status);
  if (patch.admin_notes !== undefined)
    query = query.filter(
      "admin_notes",
      item.admin_notes === null ? "is" : "eq",
      item.admin_notes === null ? null : inboxText(item, "admin_notes"),
    );
  const { error } = await query.eq("id", item.id).select("id").single();
  if (error?.code === "PGRST116")
    throw new Error(
      "This request changed or is no longer editable. Reopen it before saving.",
    );
  if (error) throw error;
}

export async function loadNewInboxCount(
  kind: InboxKind,
  signal?: AbortSignal,
): Promise<number> {
  const table = INBOX_SOURCES[kind].table;
  let query =
    table === "newsletter_subscribers"
      ? supabase
          .from(table)
          .select("id", { count: "exact", head: true })
          .eq("is_active", true)
      : supabase
          .from(table)
          .select("id", { count: "exact", head: true })
          .or("status.is.null,status.eq.new");
  if (signal) query = query.abortSignal(signal);
  const { count, error } = await query;
  if (error || count === null || !Number.isSafeInteger(count) || count < 0)
    throw new Error("Could not load inbox counts");
  return count;
}

export async function loadInboxCounts(): Promise<Record<InboxKind, number>> {
  const results = await Promise.all(
    (Object.keys(INBOX_SOURCES) as InboxKind[]).map(async (kind) => {
      const count = await loadNewInboxCount(kind);
      return [kind, count] as const;
    }),
  );
  return Object.fromEntries(results) as Record<InboxKind, number>;
}
