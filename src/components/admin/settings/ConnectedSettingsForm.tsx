import { useEffect, useState } from "react";
import { useSettingsData } from "@/hooks/useSettingsData";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { COMPANY_PHONE, COMPANY_EMAIL } from "@/constants/company";
import { notifySettingsSaved, validateSocialLinks } from "@/lib/publicSettings";
import { adminErrorMessage } from "@/lib/admin/editorValues";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { ConfirmDialog } from "../ConfirmDialog";
import { SettingsRecordState } from "./SettingsRecordState";
import { toast } from "sonner";

type SettingsRecord = {
  id: string;
  company_tagline?: string;
  address?: string;
  meta_title?: string;
  meta_description?: string;
  social_links?: Record<string, string>;
  social_media?: Record<string, string>;
};
const socials = ["linkedin", "facebook", "instagram", "twitter", "youtube"];
export function ConnectedSettingsForm({
  table,
}: {
  table: "site_settings" | "footer_settings";
}) {
  const {
    data: record,
    loading,
    error,
    refetch,
  } = useSettingsData<SettingsRecord>(table, "*");
  const [values, setValues] = useState<Record<string, string>>({});
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);
  const [saveError, setSaveError] = useState("");
  const guard = useUnsavedChanges({ hasUnsavedChanges: dirty });
  useEffect(() => {
    if (record)
      setValues({
        company_tagline: record.company_tagline || "",
        address: record.address || "",
        meta_title: record.meta_title || "",
        meta_description: record.meta_description || "",
        ...(table === "site_settings"
          ? record.social_links
          : record.social_media),
      });
  }, [record, table]);
  const change = (key: string, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
    setDirty(true);
  };
  const publish = async () => {
    if (!record || saving) return;
    setSaving(true);
    setSaveError("");
    try {
      const links = Object.fromEntries(
        socials.map((name) => [name, values[name] || ""]),
      );
      validateSocialLinks(links);
      const { data, error } =
        table === "site_settings"
          ? await supabase
              .from("site_settings")
              .update({
                company_tagline: values.company_tagline,
                address: values.address,
                meta_title: values.meta_title,
                meta_description: values.meta_description,
                social_links: links,
              })
              .eq("id", record.id)
              .select("id")
              .single()
          : await supabase
              .from("footer_settings")
              .update({ social_media: links })
              .eq("id", record.id)
              .select("id")
              .single();
      if (error) throw error;
      if (!data) throw new Error("Could not verify the saved settings.");
      setDirty(false);
      guard.markSaved();
      notifySettingsSaved(table);
      setPublishOpen(false);
      await refetch();
      toast.success("Settings published");
    } catch (failure) {
      setSaveError(adminErrorMessage(failure));
    } finally {
      setSaving(false);
    }
  };
  if (loading || error || !record)
    return (
      <SettingsRecordState
        table={table}
        loading={loading}
        error={error}
        onRetry={refetch}
      />
    );
  return (
    <div className="space-y-6">
      <ConfirmDialog
        open={guard.showDialog}
        onOpenChange={guard.cancelNavigation}
        onConfirm={guard.confirmNavigation}
        title="Unsaved changes"
        description={guard.message}
        confirmText="Leave"
        cancelText="Stay"
      />
      <ConfirmDialog
        open={publishOpen}
        onOpenChange={setPublishOpen}
        onConfirm={publish}
        title="Publish settings?"
        description="These values will become visible to visitors. Phone, email and credential wording remain managed in code."
        confirmText={saving ? "Publishing…" : "Publish"}
      />
      <fieldset disabled={saving} className="space-y-6 min-w-0">
        <p className="text-sm text-muted-foreground">
          Only settings with a public consumer are shown. Changes become public
          when you choose Publish.
        </p>
        {table === "site_settings" &&
          [
            ["company_tagline", "Footer tagline (phone layout)"],
            ["address", "Business address"],
            ["meta_title", "Default meta title"],
            ["meta_description", "Default meta description"],
          ].map(([key, label]) => (
            <div key={key} className="space-y-2">
              <Label htmlFor={`${table}-${key}`}>{label}</Label>
              <Textarea
                id={`${table}-${key}`}
                rows={key === "meta_description" ? 3 : 2}
                value={values[key] || ""}
                onChange={(event) => change(key, event.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                {key.startsWith("meta_")
                  ? "Used only when a page has no page-specific value."
                  : ""}
              </p>
            </div>
          ))}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Social profiles</h2>
          <p className="text-sm text-muted-foreground">
            Footer values take priority over General values. Only HTTPS links
            are displayed.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {socials.map((name) => (
              <div key={name} className="space-y-2">
                <Label className="capitalize" htmlFor={`${table}-${name}`}>
                  {name === "twitter" ? "X / Twitter" : name}
                </Label>
                <Input
                  id={`${table}-${name}`}
                  value={values[name] || ""}
                  type="url"
                  placeholder="https://"
                  onChange={(event) => change(name, event.target.value)}
                />
              </div>
            ))}
          </div>
        </section>
        <div className="space-y-2">
          <Label>Phone and email</Label>
          <Input aria-label="Company phone" readOnly value={COMPANY_PHONE} />
          <Input aria-label="Company email" readOnly value={COMPANY_EMAIL} />
          <p className="text-sm text-muted-foreground">
            Set in code (spam protection). Ask a developer to change.
          </p>
        </div>
        {saveError && (
          <p role="alert" className="text-destructive">
            {saveError} Your edits are retained.
          </p>
        )}
        <Button
          onClick={() => setPublishOpen(true)}
          disabled={!dirty || saving}
        >
          Publish settings
        </Button>
      </fieldset>
    </div>
  );
}
