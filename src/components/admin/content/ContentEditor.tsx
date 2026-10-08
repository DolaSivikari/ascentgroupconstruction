import {
  AdminSectionWorkspace,
  AdminSectionScreen,
} from "@/components/admin/AdminSectionWorkspace";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useToast } from "@/hooks/use-toast";
import { defaultHash, type ContentModule } from "@/content/types";
import type {
  ContentEntry,
  ContentVersion,
} from "@/lib/admin/optionalDatabase";
import {
  saveContentDraft,
  publishPageDrafts,
  contentHistory,
  restoreContentVersion,
  importContentDraft,
} from "@/lib/content/admin";
import { prepareContentPreview } from "@/lib/content/store";

type Seo = {
  title: string;
  description: string;
  image: string;
  noindex: boolean;
};
type ImageValue = { url: string; alt: string };
export function ContentEditor({
  module,
  entries,
  available,
  path,
  onRefresh,
}: {
  module: ContentModule;
  entries: ContentEntry[];
  available: boolean;
  path: string;
  onRefresh: () => void;
}) {
  const { toast } = useToast();
  const [drafts, setDrafts] = useState<Record<string, unknown>>({});
  const guard = useUnsavedChanges({
    hasUnsavedChanges: Object.keys(drafts).length > 0,
    preserveDraftQueryKeys: ["section"],
  });
  const [busy, setBusy] = useState(false);
  const [search, setSearch] = useState("");
  const [picker, setPicker] = useState<string | null>(null);
  const [history, setHistory] = useState<ContentEntry | null>(null);
  const [confirm, setConfirm] = useState<"publish" | ContentVersion | null>(
    null,
  );
  const [conflicts, setConflicts] = useState<string[]>([]);
  const rows = useMemo(
    () => entries.filter((e) => e.key.startsWith(`${module.id}.`)),
    [entries, module.id],
  );
  const versionQuery = useQuery({
    queryKey: ["content-history", history?.id],
    enabled: !!history,
    queryFn: () => contentHistory(history!.id),
  });
  useEffect(() => {
    let live = true;
    void Promise.all(
      rows.map(async (e) => {
        const key = e.key.slice(module.id.length + 1);
        return e.default_hash &&
          Object.prototype.hasOwnProperty.call(module.defaults, key) &&
          e.default_hash !== (await defaultHash(module.defaults[key]))
          ? key
          : null;
      }),
    ).then((keys) => {
      if (live) setConflicts(keys.filter((k): k is string => !!k));
    });
    return () => {
      live = false;
    };
  }, [rows, module]);
  const entry = (key: string) =>
    rows.find((e) => e.key === `${module.id}.${key}`);
  const value = (key: string) =>
    Object.prototype.hasOwnProperty.call(drafts, key)
      ? (drafts[key] ?? module.defaults[key])
      : (entry(key)?.draft_value ??
        entry(key)?.published_value ??
        module.defaults[key]);
  const change = (key: string, v: unknown) =>
    setDrafts((old) => ({ ...old, [key]: v }));
  async function act(fn: () => Promise<void>, success: string) {
    setBusy(true);
    try {
      await fn();
      toast({ title: success });
      onRefresh();
    } catch (error) {
      toast({
        title: "Changes were not completed",
        description:
          error instanceof Error
            ? error.message
            : "Your edits are still here. Please retry.",
        variant: "destructive",
      });
    } finally {
      onRefresh();
      setBusy(false);
    }
  }
  const savedDrafts = rows.filter(
    (e) => JSON.stringify(e.draft_value) !== JSON.stringify(e.published_value),
  ).length;
  const save = () =>
    act(async () => {
      for (const [key, v] of Object.entries(drafts)) {
        await saveContentDraft(module, key, v, entry(key));
        setDrafts((old) => {
          const next = { ...old };
          delete next[key];
          return next;
        });
      }
      guard.markSaved();
      setDrafts({});
    }, "Draft saved. Nothing was published.");
  const preview = () =>
    act(async () => {
      await prepareContentPreview(
        module.id,
        Object.fromEntries(
          Object.keys(module.defaults).map((key) => [key, value(key)]),
        ),
      );
      window.open(`${path}?content_preview=1`, "_blank");
    }, "Draft preview opened for your signed-in account.");
  const exportJson = () => {
    const values = Object.fromEntries(
      Object.keys(module.meta)
        .filter((key) => !module.meta[key].locked)
        .map((key) => [key, value(key)]),
    );
    const blob = new Blob(
      [JSON.stringify({ version: 1, module: module.id, values }, null, 2)],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${module.id}-draft.json`;
    link.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className="space-y-5">
      <div className="sticky top-0 z-10 flex flex-wrap gap-2 rounded-lg border bg-background p-3">
        <Button
          disabled={!available || busy || !Object.keys(drafts).length}
          onClick={save}
        >
          Save draft
        </Button>
        <Button variant="outline" disabled={busy} onClick={preview}>
          Preview draft
        </Button>
        <Button
          disabled={
            !available || busy || !savedDrafts || !!Object.keys(drafts).length
          }
          onClick={() => setConfirm("publish")}
        >
          Publish {savedDrafts ? `(${savedDrafts})` : ""}
        </Button>
        <Button variant="outline" onClick={exportJson}>
          Export JSON
        </Button>
        <label className="cursor-pointer rounded-md border px-3 py-2 text-sm">
          Import draft
          <input
            className="sr-only"
            type="file"
            accept="application/json"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              void act(async () => {
                if (file.size > 500000)
                  throw new Error("Import must be under 500 KB.");
                setDrafts(importContentDraft(module, await file.text()));
              }, "Imported locally. Save draft when ready.");
              event.target.value = "";
            }}
          />
        </label>
        <Link className="px-3 py-2 text-sm underline" to={path} target="_blank">
          View public page
        </Link>
      </div>
      <p className="text-sm text-muted-foreground">
        Drafts do not affect visitors. Publish updates the override layer; its
        master switch and admin-only mode still apply. Protected claims cannot
        be edited here.
      </p>
      {!available && (
        <p role="status" className="rounded-lg border p-4">
          Page editing is waiting for database setup. You can inspect defaults
          and prepare a local preview.
        </p>
      )}
      {!!Object.keys(drafts).length && (
        <p role="status">
          You have unsaved local changes. Save before switching pages.
        </p>
      )}
      <Input
        aria-label="Find a content field"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Find a heading, paragraph or section…"
      />
      <AdminSectionWorkspace
        label="Page content sections"
        items={Array.from(
          new Set(
            Object.entries(module.meta)
              .filter(([key, meta]) =>
                `${meta.label} ${module.defaults[key]}`
                  .toLowerCase()
                  .includes(search.toLowerCase()),
              )
              .map(([, meta]) => meta.section),
          ),
        ).map((section) => ({ id: section, title: section }))}
      >
        {" "}
        {Object.entries(module.meta)
          .filter(([key, meta]) =>
            `${meta.label} ${module.defaults[key]}`
              .toLowerCase()
              .includes(search.toLowerCase()),
          )
          .map(([key, meta]) => {
            const current = value(key);
            const disabled = meta.locked || busy;
            return (
              <AdminSectionScreen key={key} id={meta.section}>
                <section className="space-y-3 rounded-xl border p-4">
                  <div className="flex flex-wrap justify-between gap-2">
                    <label
                      htmlFor={`content-${module.id}-${key}`}
                      className="font-semibold"
                    >
                      {meta.label}{" "}
                      {meta.locked && (
                        <span className="text-xs text-muted-foreground">
                          (locked)
                        </span>
                      )}
                    </label>
                    <span className="text-xs text-muted-foreground">
                      {meta.section} · {key}
                    </span>
                  </div>
                  {meta.help && (
                    <p className="text-sm text-muted-foreground">{meta.help}</p>
                  )}
                  {conflicts.includes(key) && (
                    <p role="alert" className="text-sm text-destructive">
                      The code default changed since this override was
                      published. Review both versions before publishing.
                    </p>
                  )}
                  {meta.kind === "seo" ? (
                    <div className="space-y-3">
                      <Input
                        id={`content-${module.id}-${key}`}
                        aria-label="SEO title"
                        value={(current as Seo).title}
                        maxLength={120}
                        disabled={disabled}
                        onChange={(e) =>
                          change(key, {
                            ...(current as Seo),
                            title: e.target.value,
                          })
                        }
                        placeholder="Use current page title"
                      />
                      <p className="text-xs">
                        {(current as Seo).title.length}/60 recommended
                        characters
                      </p>
                      <Textarea
                        aria-label="SEO description"
                        value={(current as Seo).description}
                        maxLength={320}
                        disabled={disabled}
                        onChange={(e) =>
                          change(key, {
                            ...(current as Seo),
                            description: e.target.value,
                          })
                        }
                        placeholder="Use current description"
                      />
                      <p className="text-xs">
                        {(current as Seo).description.length}/160 recommended
                        characters
                      </p>
                      <div className="rounded border p-3">
                        <p className="text-blue-700">
                          {(current as Seo).title || "Current page title"}
                        </p>
                        <p className="text-sm">
                          www.ascentgroupconstruction.com{path}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {(current as Seo).description ||
                            "Current page description"}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        disabled={disabled}
                        onClick={() => setPicker(key)}
                      >
                        Choose share image
                      </Button>
                      {(current as Seo).image && (
                        <Button
                          variant="outline"
                          disabled={disabled}
                          onClick={() =>
                            change(key, { ...(current as Seo), image: "" })
                          }
                        >
                          Use default share image
                        </Button>
                      )}
                      <label className="flex gap-2">
                        <input
                          type="checkbox"
                          checked={(current as Seo).noindex}
                          disabled={disabled || module.meta.hidden?.locked}
                          onChange={(e) =>
                            change(key, {
                              ...(current as Seo),
                              noindex: e.target.checked,
                            })
                          }
                        />
                        Exclude from search engines
                      </label>
                    </div>
                  ) : meta.kind === "image" ? (
                    <div className="space-y-3">
                      {(current as ImageValue).url && (
                        <img
                          src={(current as ImageValue).url}
                          alt={(current as ImageValue).alt}
                          className="h-32 rounded object-cover"
                        />
                      )}
                      <Button
                        variant="outline"
                        disabled={disabled}
                        onClick={() => setPicker(key)}
                      >
                        Choose from library
                      </Button>
                      <Input
                        id={`content-${module.id}-${key}`}
                        aria-label="Header image alt text"
                        value={(current as ImageValue).alt}
                        disabled={disabled}
                        maxLength={300}
                        onChange={(e) =>
                          change(key, {
                            ...(current as ImageValue),
                            alt: e.target.value,
                          })
                        }
                        placeholder="Describe the image"
                      />
                    </div>
                  ) : meta.kind === "flag" ? (
                    <label className="flex gap-2">
                      <input
                        id={`content-${module.id}-${key}`}
                        type="checkbox"
                        checked={!!current}
                        disabled={disabled}
                        onChange={(e) => change(key, e.target.checked)}
                      />
                      Hide this page
                    </label>
                  ) : (
                    <Textarea
                      id={`content-${module.id}-${key}`}
                      value={String(current ?? "")}
                      disabled={disabled}
                      maxLength={meta.maxLength || 5000}
                      onChange={(e) => change(key, e.target.value)}
                      rows={String(current).length > 140 ? 4 : 2}
                    />
                  )}
                  <details>
                    <summary className="cursor-pointer text-sm">
                      Code default and published value
                    </summary>
                    <pre className="mt-2 whitespace-pre-wrap break-words text-xs">
                      Code: {JSON.stringify(module.defaults[key], null, 2)}
                      {"\n"}Published:{" "}
                      {JSON.stringify(
                        entry(key)?.published_value ?? module.defaults[key],
                        null,
                        2,
                      )}
                    </pre>
                  </details>
                  <div className="flex flex-wrap gap-3">
                    {!meta.locked && (
                      <Button
                        variant="outline"
                        disabled={busy}
                        onClick={() => change(key, null)}
                      >
                        Draft restore to code default
                      </Button>
                    )}
                    {entry(key) && (
                      <Button
                        variant="outline"
                        disabled={busy}
                        onClick={() => setHistory(entry(key)!)}
                      >
                        History
                      </Button>
                    )}
                  </div>
                </section>
              </AdminSectionScreen>
            );
          })}
      </AdminSectionWorkspace>{" "}
      {history && (
        <section className="space-y-3 rounded border p-4">
          <div className="flex justify-between">
            <h3 className="font-bold">History: {history.key}</h3>
            <Button variant="outline" onClick={() => setHistory(null)}>
              Close history
            </Button>
          </div>
          {versionQuery.isPending ? (
            <p>Loading versions…</p>
          ) : versionQuery.error ? (
            <p role="alert">
              Could not load history.{" "}
              <Button onClick={() => void versionQuery.refetch()}>Retry</Button>
            </p>
          ) : !versionQuery.data?.length ? (
            <p>No published versions.</p>
          ) : (
            versionQuery.data.map((v) => (
              <div key={v.id} className="space-y-2 border-t pt-3">
                <p className="text-sm">
                  {new Date(v.published_at).toLocaleString()} ·{" "}
                  {v.published_by || "Unknown author"}
                </p>
                <pre className="whitespace-pre-wrap break-words text-xs">
                  {JSON.stringify(v.value, null, 2)}
                </pre>
                <Button
                  variant="outline"
                  disabled={busy}
                  onClick={() => setConfirm(v)}
                >
                  Restore this published version
                </Button>
              </div>
            ))
          )}
        </section>
      )}
      <ConfirmDialog
        open={guard.showDialog}
        onOpenChange={(open) => {
          if (!open) guard.cancelNavigation();
        }}
        title="Leave unsaved page edits?"
        description="Saved drafts remain in the database. Your unsaved local edits will be discarded."
        onConfirm={guard.confirmNavigation}
        variant="destructive"
      />
      <MediaPicker
        open={!!picker}
        onOpenChange={(open) => {
          if (!open) setPicker(null);
        }}
        onChoose={(asset) => {
          if (picker)
            change(
              picker,
              module.meta[picker].kind === "seo"
                ? { ...(value(picker) as Seo), image: asset.url }
                : { url: asset.url, alt: asset.altText },
            );
          setPicker(null);
        }}
      />
      <ConfirmDialog
        open={!!confirm}
        onOpenChange={(open) => {
          if (!open) setConfirm(null);
        }}
        title={
          confirm === "publish"
            ? "Publish saved page drafts?"
            : "Restore this version?"
        }
        description="This updates published overrides. Visitor visibility still follows the master switch and admin-only mode."
        confirmText="Confirm publication"
        onConfirm={() => {
          const action = confirm;
          void act(async () => {
            if (action === "publish") await publishPageDrafts(module, rows);
            else if (action && history)
              await restoreContentVersion(action.id, history);
          }, "Published override updated.");
        }}
      />
    </div>
  );
}
