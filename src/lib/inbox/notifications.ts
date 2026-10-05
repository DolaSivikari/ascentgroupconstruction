import { supabase } from "@/integrations/supabase/client";
import { INBOX_SOURCES, type InboxKind } from "./model";
import type { Database } from "@/integrations/supabase/types";
import { isLeadSource } from "@/lib/leads/model";

export type InboxNotification =
  Database["public"]["Tables"]["admin_notifications"]["Row"];
export function notificationDestination(
  notification: InboxNotification,
): string {
  if (notification.notification_type === "inquiry")
    return `/admin/inbox?tab=leads&source=inquiry&highlight=${encodeURIComponent(notification.reference_id)}`;
  const tab = Object.prototype.hasOwnProperty.call(
    INBOX_SOURCES,
    notification.notification_type,
  )
    ? (notification.notification_type as InboxKind)
    : "all";
  const params = new URLSearchParams({
    tab: isLeadSource(tab) ? "leads" : tab,
    highlight: notification.reference_id,
  });
  if (isLeadSource(tab)) params.set("source", tab);
  return `/admin/inbox?${params}`;
}
export async function loadNotifications(userId: string) {
  const [recent, unread] = await Promise.all([
    supabase
      .from("admin_notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("admin_notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_read", false),
  ]);
  if (recent.error || unread.error || unread.count === null)
    throw new Error("Notifications unavailable");
  return { recent: recent.data || [], unread: unread.count || 0 };
}
export async function markNotificationsRead(userId: string, id?: string) {
  let query = supabase
    .from("admin_notifications")
    .update({ is_read: true })
    .eq("user_id", userId)
    .eq("is_read", false);
  if (id) query = query.eq("id", id);
  const { error } = await query;
  if (error) throw error;
}
