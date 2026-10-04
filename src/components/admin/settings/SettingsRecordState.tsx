import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { adminErrorMessage } from "@/lib/admin/editorValues";
import { Button } from "@/ui/Button";
import {
  COMPANY_EMAIL,
  COMPANY_NAME,
  COMPANY_PHONE,
} from "@/constants/company";

type SettingsTable =
  | "site_settings"
  | "footer_settings"
  | "contact_page_settings"
  | "about_page_settings";
interface Props {
  table: SettingsTable;
  loading: boolean;
  error: Error | null;
  onRetry: () => Promise<void>;
}

/** A missing record is different from a failed read; never create after an error. */
export function SettingsRecordState({ table, loading, error, onRetry }: Props) {
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const create = async () => {
    if (creating || error) return;
    setCreating(true);
    setCreateError(null);
    try {
      // Recheck just before creating, to reuse a row another admin created.
      const existing = await supabase
        .from(table)
        .select("id")
        .eq("is_active", true)
        .limit(1)
        .maybeSingle();
      if (existing.error) throw existing.error;
      if (!existing.data) {
        // Do not turn schema defaults into new business claims.
        const result =
          table === "site_settings"
            ? await supabase
                .from("site_settings")
                .insert({
                  is_active: true,
                  company_name: COMPANY_NAME,
                  phone: COMPANY_PHONE,
                  email: COMPANY_EMAIL,
                  founded_year: null,
                  company_tagline: null,
                  business_hours: null,
                  certifications: null,
                  social_links: null,
                })
                .select("id")
                .single()
            : table === "about_page_settings"
              ? await supabase
                  .from("about_page_settings")
                  .insert({
                    is_active: true,
                    years_in_business: null,
                    total_projects: null,
                    satisfaction_rate: null,
                  })
                  .select("id")
                  .single()
              : await supabase
                  .from(table)
                  .insert({ is_active: true })
                  .select("id")
                  .single();
        if (result.error) throw result.error;
        if (!result.data)
          throw new Error("The settings record could not be verified.");
      }
      await onRetry();
    } catch (failure) {
      setCreateError(adminErrorMessage(failure));
    } finally {
      setCreating(false);
    }
  };
  if (loading) return <p role="status">Loading settings…</p>;
  if (error)
    return (
      <div role="alert" className="rounded-lg border p-4 space-y-3">
        <p>Could not load settings. {adminErrorMessage(error)}</p>
        <Button onClick={() => void onRetry()} variant="outline">
          Retry loading settings
        </Button>
      </div>
    );
  return (
    <div className="rounded-lg border p-4 space-y-3">
      <p>No settings record yet — Create a record to begin editing.</p>
      {createError && (
        <p role="alert" className="text-destructive">
          {createError}
        </p>
      )}
      <Button onClick={() => void create()} disabled={creating}>
        {creating ? "Creating…" : "Create settings record"}
      </Button>
    </div>
  );
}
