import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
export type RowTable<Row> = {
  Row: Row;
  Insert: Partial<Row>;
  Update: Partial<Row>;
  Relationships: [];
};
export type ContentEntry = {
  id: string;
  key: string;
  page_id: string;
  kind: string;
  draft_value: Json | null;
  published_value: Json | null;
  default_hash: string | null;
  published_at: string | null;
  published_by: string | null;
  updated_at: string;
  updated_by: string | null;
};
export type ContentVersion = {
  id: string;
  entry_id: string;
  value: Json | null;
  default_hash: string | null;
  published_at: string;
  published_by: string | null;
};
export type OptionalDatabase = {
  public: {
    Tables: {
      content_entries: RowTable<ContentEntry>;
      content_entry_versions: RowTable<ContentVersion>;
      site_flags: RowTable<{
        key: string;
        enabled: boolean;
        updated_at: string;
        updated_by: string | null;
      }>;
    };
    Views: Record<string, never>;
    Functions: {
      publish_content_entries_checked: {
        Args: {
          _ids: string[];
          _default_hashes: string[];
          _expected_updated_ats: string[];
        };
        Returns: number;
      };
      rollback_content_entry_checked: {
        Args: {
          _version_id: string;
          _entry_id: string;
          _expected_updated_at: string;
        };
        Returns: undefined;
      };
      set_site_flag: {
        Args: { _key: string; _enabled: boolean };
        Returns: undefined;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
export const contentDatabase =
  supabase as unknown as SupabaseClient<OptionalDatabase>;
export const missingOptionalSchema = (error: { code?: string } | null) =>
  !!error &&
  ["42P01", "42703", "PGRST205", "PGRST204", "PGRST202", "42883"].includes(
    error.code || "",
  );
