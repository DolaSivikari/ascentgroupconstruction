import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import type { RowTable } from "@/lib/admin/optionalDatabase";
export interface Inquiry extends Record<string, unknown> {
  id: string;
  reference_code: string;
  submission_key: string | null;
  created_at: string;
  updated_at: string;
  inquiry_type: string;
  status: string;
  priority: string;
  contact_name: string;
  email: string;
  phone: string | null;
  company: string | null;
  project_name: string | null;
  project_location: string | null;
  message: string | null;
  bid_due_at: string | null;
  drawings_url: string | null;
  attachment_paths: string[];
  assigned_to: string | null;
  bid_amount: number | null;
  first_viewed_at: string | null;
  archived_at: string | null;
  archived_by: string | null;
  alert_status: string;
  alert_attempts: number;
  alert_last_error: string | null;
  alert_sent_at: string | null;
  alert_lease_until: string | null;
  confirmation_status: string;
  source_path: string | null;
}
export type InquiryNote = {
  id: string;
  inquiry_id: string;
  author_id: string | null;
  body: string;
  created_at: string;
};
export type InquiryEvent = {
  id: string;
  inquiry_id: string;
  actor_id: string | null;
  event_type: string;
  from_value: string | null;
  to_value: string | null;
  created_at: string;
};
export type AlertDelivery = {
  id: string;
  inquiry_id: string;
  attempt: number;
  recipient: string;
  status: string;
  error: string | null;
  idempotency_key: string;
  message_id: string | null;
  created_at: string;
};
export type NotificationRecipient = {
  id: string;
  inquiry_type: string;
  email: string;
  is_active: boolean;
  created_at: string;
  created_by: string | null;
};
export type InquiryDatabase = {
  public: {
    Tables: {
      inquiries: RowTable<Inquiry>;
      inquiry_notes: RowTable<InquiryNote>;
      inquiry_events: RowTable<InquiryEvent>;
      inquiry_alert_deliveries: RowTable<AlertDelivery>;
      notification_recipients: RowTable<NotificationRecipient>;
    };
    Views: Record<string, never>;
    Functions: {
      admin_inquiry_summary: { Args: Record<string, never>; Returns: Json };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
export const inquiryDb = supabase as unknown as SupabaseClient<InquiryDatabase>;
