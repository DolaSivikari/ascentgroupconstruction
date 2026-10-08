import {
  AdminSectionWorkspace,
  AdminSectionScreen,
} from "@/components/admin/AdminSectionWorkspace";
import type { SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useSettingsData } from "@/hooks/useSettingsData";
import { supabase } from "@/integrations/supabase/client";
import {
  ABOUT_DEFAULTS,
  resolveAboutContent,
  type AboutContent,
} from "@/lib/aboutContent";
import {
  PUBLIC_ABOUT_COLUMNS,
  notifySettingsSaved,
} from "@/lib/publicSettings";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageUploadField } from "../ImageUploadField";
import { ConfirmDialog } from "../ConfirmDialog";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { adminErrorMessage } from "@/lib/admin/editorValues";
import { SettingsRecordState } from "./SettingsRecordState";
import { toast } from "sonner";

export const AboutPageSettingsTab = () => {
  const {
    data: record,
    loading,
    error,
    refetch,
  } = useSettingsData<Partial<AboutContent> & { id: string }>(
    "about_page_settings",
    PUBLIC_ABOUT_COLUMNS,
  );
  const [values, setValues] = useState<AboutContent>({
    ...ABOUT_DEFAULTS,
    story_content: [],
    stats: [],
    hero_headline: "",
    hero_intro: "",
    story_headline: "",
    founder_name: "",
    founder_title: "",
    founder_bio: "",
    founder_quote: "",
  });
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);
  const [saveError, setSaveError] = useState("");
  const guard = useUnsavedChanges({
    hasUnsavedChanges: dirty,
    preserveDraftQueryKeys: ["section"],
  });
  useEffect(() => {
    if (record)
      setValues((current) => ({
        ...current,
        ...Object.fromEntries(
          Object.entries(record).filter(([key]) => key in ABOUT_DEFAULTS),
        ),
        story_content: Array.isArray(record.story_content)
          ? record.story_content
          : [],
        stats: Array.isArray(record.stats) ? record.stats : [],
      }));
  }, [record]);
  const change = (updates: Partial<AboutContent>) => {
    setValues((current) => ({ ...current, ...updates }));
    setDirty(true);
  };
  const publish = async () => {
    if (!record || saving) return;
    setSaving(true);
    setSaveError("");
    try {
      if (
        values.founder_image_url &&
        !/^(https:\/\/|\/(?!\/))/i.test(values.founder_image_url)
      )
        throw new Error(
          "Use an HTTPS founder image URL or a public asset path.",
        );
      const result = await (supabase as SupabaseClient)
        .from("about_page_settings")
        .update({
          ...values,
          stats: values.stats.slice(0, 6),
          story_content: values.story_content.filter((value) => value.trim()),
        })
        .eq("id", record.id)
        .select("id")
        .single();
      if (result.error) throw result.error;
      if (!result.data) throw new Error("Could not verify the saved row.");
      setDirty(false);
      guard.markSaved();
      notifySettingsSaved("about_page_settings");
      setPublishOpen(false);
      await refetch();
      toast.success("About page published");
    } catch (failure) {
      setSaveError(adminErrorMessage(failure));
    } finally {
      setSaving(false);
    }
  };
  if (loading) return <p role="status">Loading About settings…</p>;
  if (error)
    return (
      <div role="alert" className="space-y-3 rounded-lg border p-4">
        <p>
          About editing needs the reviewed 0002_about_page_fields.sql and
          visitor read permission. Public text continues to use its existing
          defaults.
        </p>
        <p className="text-sm">{error.message}</p>
        <Button variant="outline" onClick={() => void refetch()}>
          Recheck setup
        </Button>
      </div>
    );
  if (!record)
    return (
      <SettingsRecordState
        table="about_page_settings"
        loading={false}
        error={null}
        onRetry={refetch}
      />
    );
  const preview = resolveAboutContent(values);
  const reorder = <T,>(rows: T[], index: number, direction: number): T[] => {
    const next = [...rows];
    if (index + direction < 0 || index + direction >= rows.length) return rows;
    [next[index], next[index + direction]] = [
      next[index + direction],
      next[index],
    ];
    return next;
  };
  return (
    <div className="space-y-4">
      <a
        href="/about"
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline"
      >
        View About page
      </a>
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
        title="Publish About changes?"
        description="Changes become public. Empty fields restore the original text; credential wording remains protected."
        confirmText="Publish"
      />
      <fieldset disabled={saving} className="space-y-5 min-w-0">
        <AdminSectionWorkspace
          label="About settings sections"
          items={[
            { id: "hero", title: "Hero" },
            { id: "story", title: "Company story" },
            { id: "founder", title: "Founder" },
            { id: "stats", title: "Stats" },
            { id: "preview", title: "Unsaved preview" },
          ]}
        >
          <AdminSectionScreen id="hero" title="Hero">
            {[
              ["hero_headline", "Hero headline", 160],
              ["hero_intro", "Hero intro", 600],
            ].map(([key, label, limit]) => (
              <div key={String(key)} className="space-y-2">
                <Label htmlFor={`about-${key}`}>{label}</Label>
                <Textarea
                  id={`about-${key}`}
                  value={String(values[key as keyof AboutContent] || "")}
                  maxLength={Number(limit)}
                  placeholder={String(
                    ABOUT_DEFAULTS[key as keyof AboutContent],
                  )}
                  onChange={(event) => change({ [key]: event.target.value })}
                />
              </div>
            ))}
          </AdminSectionScreen>
          <AdminSectionScreen id="story" title="Company story">
            {[["story_headline", "Story heading", 160]].map(
              ([key, label, limit]) => (
                <div key={String(key)} className="space-y-2">
                  <Label htmlFor={`about-${key}`}>{label}</Label>
                  <Textarea
                    id={`about-${key}`}
                    value={String(values[key as keyof AboutContent] || "")}
                    maxLength={Number(limit)}
                    placeholder={String(
                      ABOUT_DEFAULTS[key as keyof AboutContent],
                    )}
                    onChange={(event) => change({ [key]: event.target.value })}
                  />
                </div>
              ),
            )}
            <section className="space-y-3">
              <h2 className="text-xl font-semibold">Story paragraphs</h2>
              {values.story_content.map((paragraph, index) => (
                <div key={index} className="space-y-2">
                  <Textarea
                    aria-label={`Story paragraph ${index + 1}`}
                    value={paragraph}
                    onChange={(event) =>
                      change({
                        story_content: values.story_content.map(
                          (value, position) =>
                            position === index ? event.target.value : value,
                        ),
                      })
                    }
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={index === 0}
                      onClick={() =>
                        change({
                          story_content: reorder(
                            values.story_content,
                            index,
                            -1,
                          ),
                        })
                      }
                    >
                      Up
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={index === values.story_content.length - 1}
                      onClick={() =>
                        change({
                          story_content: reorder(
                            values.story_content,
                            index,
                            1,
                          ),
                        })
                      }
                    >
                      Down
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        change({
                          story_content: values.story_content.filter(
                            (_, position) => position !== index,
                          ),
                        })
                      }
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  change({ story_content: [...values.story_content, ""] })
                }
              >
                Add paragraph
              </Button>
            </section>
          </AdminSectionScreen>
          <AdminSectionScreen id="founder" title="Founder">
            {[
              ["founder_name", "Founder name", 120],
              ["founder_title", "Founder title", 120],
              ["founder_bio", "Founder biography", 4000],
              ["founder_quote", "Founder quote", 600],
            ].map(([key, label, limit]) => (
              <div key={String(key)} className="space-y-2">
                <Label htmlFor={`about-${key}`}>{label}</Label>
                <Textarea
                  id={`about-${key}`}
                  value={String(values[key as keyof AboutContent] || "")}
                  maxLength={Number(limit)}
                  placeholder={String(
                    ABOUT_DEFAULTS[key as keyof AboutContent],
                  )}
                  onChange={(event) => change({ [key]: event.target.value })}
                />
              </div>
            ))}
            <ImageUploadField
              value={values.founder_image_url}
              onChange={(founder_image_url) => change({ founder_image_url })}
              label="Founder image"
            />
          </AdminSectionScreen>
          <AdminSectionScreen id="stats" title="Stats">
            <section className="space-y-3">
              <h2 className="text-xl font-semibold">Stats</h2>
              <p className="text-sm text-muted-foreground">
                CGL and WSIB values remain in code until the credentials phase.
              </p>
              {values.stats.map((stat, index) => (
                <div key={index} className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      aria-label={`Stat ${index + 1} value`}
                      value={stat.value}
                      onChange={(event) =>
                        change({
                          stats: values.stats.map((value, position) =>
                            position === index
                              ? { ...value, value: event.target.value }
                              : value,
                          ),
                        })
                      }
                    />
                    <Input
                      aria-label={`Stat ${index + 1} label`}
                      value={stat.label}
                      onChange={(event) =>
                        change({
                          stats: values.stats.map((value, position) =>
                            position === index
                              ? { ...value, label: event.target.value }
                              : value,
                          ),
                        })
                      }
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={index === 0}
                      onClick={() =>
                        change({ stats: reorder(values.stats, index, -1) })
                      }
                    >
                      Up
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={index === values.stats.length - 1}
                      onClick={() =>
                        change({ stats: reorder(values.stats, index, 1) })
                      }
                    >
                      Down
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        change({
                          stats: values.stats.filter(
                            (_, position) => position !== index,
                          ),
                        })
                      }
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                disabled={values.stats.length >= 4}
                onClick={() =>
                  change({ stats: [...values.stats, { value: "", label: "" }] })
                }
              >
                Add stat
              </Button>
            </section>
          </AdminSectionScreen>
          <AdminSectionScreen id="preview" title="Unsaved preview">
            <aside
              className="rounded-lg border bg-card p-5 space-y-4 self-start"
              aria-label="About content preview"
            >
              <p className="text-sm text-muted-foreground">
                Unsaved preview — does not publish
              </p>
              <h2 className="text-2xl font-semibold">
                {preview.hero_headline}
              </h2>
              <p>{preview.hero_intro}</p>
              <h3 className="text-xl font-semibold whitespace-pre-line">
                {preview.story_headline}
              </h3>
              {preview.story_content.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
              <div className="grid grid-cols-2 gap-3">
                {preview.stats.map((stat, index) => (
                  <div key={index}>
                    <strong>{stat.value}</strong>
                    <p>{stat.label}</p>
                  </div>
                ))}
              </div>
            </aside>
          </AdminSectionScreen>
        </AdminSectionWorkspace>
        {saveError && (
          <p role="alert" className="text-destructive">
            {saveError} Your edits are retained.
          </p>
        )}
        <div className="admin-section-save-bar">
          <Button
            disabled={!dirty || saving}
            onClick={() => setPublishOpen(true)}
          >
            Publish About changes
          </Button>
        </div>
      </fieldset>
    </div>
  );
};
