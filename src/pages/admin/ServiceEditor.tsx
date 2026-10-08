import { validateSectionForm } from "@/lib/admin/sectionValidation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { StructuredListEditor } from "@/components/admin/StructuredListEditor";
import { EditorActions } from "@/components/admin/EditorActions";
import { EditorSections } from "@/components/admin/EditorSections";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { LocalDraftRecovery } from "@/components/admin/LocalDraftRecovery";
import { useLocalDraft } from "@/hooks/useLocalDraft";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { useSlugAvailability } from "@/hooks/useSlugAvailability";
import { normalizeSlug, adminErrorMessage } from "@/lib/admin/editorValues";
import { savePreviewLink } from "@/lib/admin/contentPreview";
import { getStaticServiceEntries } from "@/data/service-registry";
import { toast } from "sonner";

const EMPTY = {
  name: "",
  slug: "",
  short_description: "",
  long_description: "",
  service_overview: "",
  featured_image: "",
  category: "",
  icon_name: "",
  seo_title: "",
  seo_description: "",
  seo_keywords: "",
  publish_state: "draft",
  process_steps: [] as Record<string, string | number>[],
  key_benefits: [] as Record<string, string | number>[],
  faq_items: [] as Record<string, string | number>[],
  what_we_provide: [] as string[],
  typical_applications: [] as string[],
};
function structuredRows(value: unknown): Record<string, string | number>[] {
  return Array.isArray(value)
    ? value
        .filter((row) => row && typeof row === "object" && !Array.isArray(row))
        .map((row) =>
          Object.fromEntries(
            Object.entries(row).filter(
              (entry): entry is [string, string | number] =>
                typeof entry[1] === "string" || typeof entry[1] === "number",
            ),
          ),
        )
    : [];
}
function stringRows(value: unknown): string[] {
  return Array.isArray(value)
    ? value
        .map((row) =>
          typeof row === "string" ? row : row?.label || row?.title || "",
        )
        .filter(Boolean)
    : [];
}
export default function ServiceEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [ready, setReady] = useState(id === "new");
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [failure, setFailure] = useState("");
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const sequence = useRef(0);
  const guard = useUnsavedChanges({
    hasUnsavedChanges: dirty,
    preserveDraftQueryKeys: ["section"],
  });
  const draftKey = `service-draft-${id || "new"}`;
  const draft = useLocalDraft(form, draftKey, ready && dirty);
  const slug = useSlugAvailability(
    "services",
    form.slug || normalizeSlug(form.name),
    id,
  );
  const codeManaged = getStaticServiceEntries().some(
    (entry) => entry.slug === form.slug,
  );
  const change = (updates: Partial<typeof form>) => {
    setForm((current) => ({ ...current, ...updates }));
    setDirty(true);
  };
  const load = useCallback(async () => {
    const request = ++sequence.current;
    setReady(false);
    setFailure("");
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("id", id)
      .single();
    if (request !== sequence.current) return;
    if (error || !data) {
      setFailure(
        `Could not load the complete service. ${adminErrorMessage(error)}`,
      );
      return;
    }
    setForm({
      ...EMPTY,
      ...Object.fromEntries(
        Object.keys(EMPTY)
          .filter((key) => typeof data[key as keyof typeof data] === "string")
          .map((key) => [key, data[key as keyof typeof data]]),
      ),
      process_steps: structuredRows(data.process_steps),
      key_benefits: structuredRows(data.key_benefits),
      faq_items: structuredRows(data.faq_items),
      what_we_provide: stringRows(data.what_we_provide),
      typical_applications: stringRows(data.typical_applications),
      seo_keywords: (data.seo_keywords || []).join(", "),
    });
    setReady(true);
    setDirty(false);
  }, [id]);
  useEffect(() => {
    setForm(EMPTY);
    setDirty(false);
    setFailure("");
    setReady(id === "new");
    if (id && id !== "new") void load();
    const request = sequence.current;
    return () => {
      sequence.current = request + 1;
    };
  }, [id, load]);
  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!ready || busy) return;
    if (!validateSectionForm(event.currentTarget as HTMLFormElement, navigate))
      return;
    if (slug.checking || !slug.available) {
      setFailure(slug.message);
      return;
    }
    if (
      form.featured_image &&
      (!/^(https:\/\/|\/(?!\/))/i.test(form.featured_image) ||
        /^\/src(?:\/|$)/i.test(form.featured_image))
    ) {
      setFailure(
        "Use an HTTPS image URL or a public asset path; /src/ paths are unavailable after publishing.",
      );
      return;
    }
    setBusy(true);
    setFailure("");
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user)
        throw new Error("Sign in again to save. Your local draft is retained.");
      const payload: Database["public"]["Tables"]["services"]["Insert"] = {
        ...form,
        slug: normalizeSlug(form.slug || form.name),
        featured_image: form.featured_image || null,
        publish_state:
          form.publish_state as Database["public"]["Enums"]["publish_state"],
        seo_keywords: form.seo_keywords
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean),
        process_steps: form.process_steps.map((row, index) => ({
          ...row,
          step_number: index + 1,
        })),
        updated_by: user.id,
        ...(id === "new" && { created_by: user.id }),
      };
      const result =
        id === "new"
          ? await supabase
              .from("services")
              .insert(payload)
              .select("id")
              .single()
          : await supabase
              .from("services")
              .update(payload)
              .eq("id", id)
              .select("id")
              .single();
      if (result.error) throw result.error;
      if (!result.data) throw new Error("Could not verify the saved service.");
      setDirty(false);
      guard.markSaved();
      draft.clearLocalStorage();
      setSavedAt(new Date());
      toast.success("Service saved");
      if (id === "new")
        navigate(`/admin/services/${result.data.id}`, { replace: true });
    } catch (error) {
      setFailure(adminErrorMessage(error));
    } finally {
      setBusy(false);
    }
  };
  const preview = async () => {
    try {
      const url = await savePreviewLink("services", id || "", form.slug);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (error) {
      setFailure(adminErrorMessage(error));
    }
  };
  const plainField = (
    key:
      | "name"
      | "slug"
      | "category"
      | "icon_name"
      | "seo_title"
      | "seo_description"
      | "seo_keywords",
    label: string,
    required = false,
  ) => (
    <div className="space-y-2">
      <Label htmlFor={`service-${key}`}>
        {label}
        {required && " *"}
      </Label>
      <Input
        id={`service-${key}`}
        value={form[key]}
        required={required}
        onChange={(event) =>
          change({
            [key]:
              key === "slug"
                ? normalizeSlug(event.target.value)
                : event.target.value,
          })
        }
      />
    </div>
  );
  return (
    <div className="admin-page-shell">
      <Button
        type="button"
        variant="ghost"
        className="self-start"
        onClick={() => navigate("/admin/services-manager")}
      >
        Back to Services
      </Button>
      <EditorActions
        title={id === "new" ? "New service" : "Edit service"}
        state={form.publish_state}
        onStateChange={(publish_state) => change({ publish_state })}
        formId="service-editor-form"
        disabled={!ready || busy || slug.checking || !slug.available}
        onPreview={id !== "new" ? preview : undefined}
        savedAt={savedAt}
        draftAt={draft.lastSaved}
      />
      <ConfirmDialog
        open={guard.showDialog}
        onOpenChange={guard.cancelNavigation}
        onConfirm={guard.confirmNavigation}
        title="Unsaved changes"
        description={guard.message}
        confirmText="Leave"
        cancelText="Stay"
      />
      {failure && (
        <div role="alert" className="rounded-lg border p-4 text-destructive">
          <p>{failure} Your edits are retained.</p>
          {!ready && id !== "new" && (
            <Button variant="outline" onClick={() => void load()}>
              Retry loading
            </Button>
          )}
        </div>
      )}
      {form.featured_image.startsWith("/src/") && (
        <p role="alert" className="text-destructive">
          This source image path will not work after publishing. Choose an
          uploaded image or public asset path.
        </p>
      )}
      {draft.error && <p role="alert">{draft.error}</p>}
      <LocalDraftRecovery
        storageKey={draftKey}
        load={draft.loadFromLocalStorage}
        discard={draft.clearLocalStorage}
        restore={(value) => change(value)}
      />
      {codeManaged && (
        <div className="rounded-lg border p-4 bg-muted">
          <strong>
            This page is managed in code; edits here don't affect it.
          </strong>
          <p className="text-sm">
            The service directory record can be edited here. Its dedicated
            public page retains its code-managed content.
          </p>
        </div>
      )}
      <form noValidate id="service-editor-form" onSubmit={save}>
        <fieldset disabled={!ready || busy} className="min-w-0">
          <EditorSections
            sections={[
              {
                id: "service-basics",
                title: "Basics",
                content: (
                  <>
                    {plainField("name", "Service name", true)}
                    {plainField("slug", "Slug")}
                    <p
                      role="status"
                      className={
                        slug.available
                          ? "text-sm text-muted-foreground"
                          : "text-sm text-destructive"
                      }
                    >
                      {slug.message}
                    </p>
                    {plainField("category", "Category")}
                    {plainField("icon_name", "Icon name")}
                    <Label htmlFor="service-short-description">
                      Short description
                    </Label>
                    <Textarea
                      id="service-short-description"
                      value={form.short_description}
                      maxLength={500}
                      onChange={(event) =>
                        change({ short_description: event.target.value })
                      }
                    />
                  </>
                ),
              },
              {
                id: "service-content",
                title: "Overview",
                content: (
                  <>
                    <RichTextEditor
                      id="service-overview"
                      label="Overview"
                      value={form.service_overview}
                      onChange={(service_overview) =>
                        change({ service_overview })
                      }
                      maxLength={20000}
                    />
                  </>
                ),
              },
              {
                id: "service-description",
                title: "Fallback description",
                content: (
                  <>
                    <RichTextEditor
                      id="service-description"
                      label="Long description (fallback when Overview is empty)"
                      value={form.long_description}
                      onChange={(long_description) =>
                        change({ long_description })
                      }
                      maxLength={20000}
                    />
                  </>
                ),
              },
              {
                id: "service-images",
                title: "Images",
                content: (
                  <>
                    <ImageUploadField
                      value={form.featured_image}
                      onChange={(featured_image) => change({ featured_image })}
                      label="Featured image"
                      targetAspectRatio="16/9"
                    />
                    <Input
                      aria-label="Featured image URL"
                      value={form.featured_image}
                      onChange={(event) =>
                        change({ featured_image: event.target.value })
                      }
                      placeholder="https://… or /image.webp"
                    />
                  </>
                ),
              },
              {
                id: "service-process",
                title: "Process",
                content: (
                  <>
                    <StructuredListEditor
                      label="Process"
                      fields={[
                        { key: "title", label: "Title" },
                        {
                          key: "description",
                          label: "Description",
                          multiline: true,
                        },
                      ]}
                      rows={form.process_steps}
                      onChange={(process_steps) => change({ process_steps })}
                    />
                  </>
                ),
              },
              {
                id: "service-benefits",
                title: "Benefits",
                content: (
                  <>
                    <StructuredListEditor
                      label="Benefits"
                      fields={[
                        { key: "title", label: "Title" },
                        {
                          key: "description",
                          label: "Description",
                          multiline: true,
                        },
                      ]}
                      rows={form.key_benefits}
                      onChange={(key_benefits) => change({ key_benefits })}
                    />
                  </>
                ),
              },
              {
                id: "service-faq",
                title: "FAQ",
                content: (
                  <>
                    <StructuredListEditor
                      label="FAQ"
                      fields={[
                        { key: "question", label: "Question" },
                        { key: "answer", label: "Answer", multiline: true },
                      ]}
                      rows={form.faq_items}
                      onChange={(faq_items) => change({ faq_items })}
                    />
                  </>
                ),
              },
              {
                id: "service-details",
                title: "Scope & applications",
                content: (
                  <>
                    {(["what_we_provide", "typical_applications"] as const).map(
                      (key) => (
                        <div key={key} className="space-y-2">
                          <Label htmlFor={`service-${key}`}>
                            {key === "what_we_provide"
                              ? "What we provide"
                              : "Typical applications"}{" "}
                            (one per line)
                          </Label>
                          <Textarea
                            id={`service-${key}`}
                            value={form[key].join("\n")}
                            onChange={(event) =>
                              change({ [key]: event.target.value.split("\n") })
                            }
                          />
                        </div>
                      ),
                    )}
                  </>
                ),
              },
              {
                id: "service-seo",
                title: "SEO",
                content: (
                  <>
                    {plainField("seo_title", "SEO title")}
                    {plainField("seo_description", "SEO description")}
                    {plainField(
                      "seo_keywords",
                      "SEO keywords (comma separated)",
                    )}
                  </>
                ),
              },
            ]}
          />
        </fieldset>
      </form>
    </div>
  );
}
