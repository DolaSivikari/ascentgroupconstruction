import { usePublicSettings } from "@/hooks/usePublicSettings";
import { resolveAboutContent, type AboutContent } from "@/lib/aboutContent";
import { aboutDetailsModule } from "@/content/aboutDetails";
import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AdminPageLayout } from "@/components/admin/AdminPageLayout";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ContentEditor } from "@/components/admin/content/ContentEditor";
import { buildPageHeaders } from "@/data/page-headers";
import { loadHeaderMetadata } from "@/lib/admin/pageHeaders";
import {
  loadContentModules,
  moduleForPath,
  relatedModulesForPath,
} from "@/content/registry";
import { loadContentWorkspace, setContentFlag } from "@/lib/content/admin";
import { pageSettingsModule } from "@/lib/content/pageSettings";
import {
  disableContentOverrides,
  refreshContentOverrides,
} from "@/lib/content/store";
import {
  loadHealthOverview,
  loadHealthResults,
} from "@/lib/admin/site-health/data";
import { useToast } from "@/hooks/use-toast";
export default function Pages() {
  const [params, setParams] = useSearchParams();
  const selected = params.get("page");
  const tab = params.get("tab") || "content";
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [confirm, setConfirm] = useState<
    "off" | "on" | "public" | "canary" | null
  >(null);
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();
  const inventory = useQuery({
    queryKey: ["page-header-metadata"],
    queryFn: loadHeaderMetadata,
  });
  const modules = useQuery({
    queryKey: ["page-content-modules"],
    queryFn: loadContentModules,
  });
  const about = usePublicSettings<Partial<AboutContent>>("about_page_settings");
  const availableModules = useMemo(() => {
    if (!modules.data) return undefined;
    const copy = new Map(modules.data);
    copy.set(
      "about-details",
      aboutDetailsModule(resolveAboutContent(about.data)),
    );
    return copy;
  }, [modules.data, about.data]);
  const workspace = useQuery({
    queryKey: ["content-workspace"],
    queryFn: loadContentWorkspace,
    retry: false,
  });
  const health = useQuery({
    queryKey: ["pages-health"],
    queryFn: async () => {
      const overview = await loadHealthOverview();
      const latest = overview.runs.find(
        (r) => r.kind === "full_crawl" && r.finished_at,
      );
      return latest
        ? { run: latest, results: await loadHealthResults(latest.id) }
        : null;
    },
    retry: false,
  });
  const rows = inventory.data ? buildPageHeaders(inventory.data) : [];
  const page = rows.find((r) => r.path === selected);
  const related =
    selected && availableModules
      ? relatedModulesForPath(availableModules, selected)
      : [];
  const module =
    related.find((m) => m.id === params.get("module")) || related[0];
  const entries = workspace.data?.entries || [];
  const flags = workspace.data?.flags || [];
  const enabled =
    flags.find((f) => f.key === "content_overrides")?.enabled === true;
  const canary =
    flags.find((f) => f.key === "content_overrides_admin_only")?.enabled !==
    false;
  const pageEntries = (path: string) => {
    const settings = pageSettingsModule(path);
    const ids = availableModules
      ? relatedModulesForPath(availableModules, path).map((m) => m.id)
      : [];
    return entries.filter(
      (e) => e.page_id === settings.id || ids.includes(e.page_id),
    );
  };
  const draftCount = (path: string) =>
    pageEntries(path).filter(
      (e) =>
        JSON.stringify(e.draft_value) !== JSON.stringify(e.published_value),
    ).length;
  const healthRows = (path: string) =>
    health.data?.results.filter((r) => r.path === path) || [];
  const healthLabel = (path: string) => {
    const results = healthRows(path);
    return !results.length
      ? "Not checked"
      : results.some((r) => r.issues.some((i) => i.severity === "error"))
        ? "Errors"
        : results.some((r) => r.issues.length)
          ? "Warnings"
          : "Passed";
  };
  const refresh = () => {
    void workspace.refetch();
    void refreshContentOverrides();
  };
  const filtered = rows.filter(
    (r) =>
      `${r.title} ${r.path}`.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "all" ||
        (filter === "drafts" && draftCount(r.path) > 0) ||
        (filter === "errors" && healthLabel(r.path) === "Errors") ||
        (filter === "warnings" && healthLabel(r.path) === "Warnings") ||
        filter === r.group),
  );
  const knownKeys = new Set(
    [...(availableModules?.values() || [])]
      .flatMap((m) => Object.keys(m.meta).map((key) => `${m.id}.${key}`))
      .concat(
        rows.flatMap((r) =>
          Object.keys(pageSettingsModule(r.path).meta).map(
            (key) => `${pageSettingsModule(r.path).id}.${key}`,
          ),
        ),
      ),
  );
  const orphans =
    availableModules && inventory.data
      ? entries.filter((e) => !knownKeys.has(e.key))
      : [];
  return (
    <AdminPageLayout
      title={page ? page.title : "Pages"}
      description="Find every canonical public page, edit drafts and review published history."
      actions={
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => {
              void inventory.refetch();
              refresh();
            }}
          >
            Refresh
          </Button>
          {selected && (
            <Button variant="outline" onClick={() => setParams({})}>
              All pages
            </Button>
          )}
        </div>
      }
    >
      <div className="flex flex-wrap items-center gap-3 rounded-xl border p-4">
        <p className="flex-1 text-sm">
          Overrides:{" "}
          <strong>
            {enabled
              ? canary
                ? "Admins only"
                : "Visible to visitors"
              : "Off — code defaults"}
          </strong>
        </p>
        <Button
          variant="outline"
          disabled={!workspace.data?.available || busy}
          onClick={() =>
            setConfirm(enabled ? (canary ? "public" : "canary") : "on")
          }
        >
          {enabled
            ? canary
              ? "Enable visitor overrides"
              : "Return to admin preview"
            : "Enable admin preview"}
        </Button>
        <Button
          variant="destructive"
          disabled={!workspace.data?.available || busy}
          onClick={() => setConfirm("off")}
        >
          Restore all pages to code defaults
        </Button>
      </div>
      {(inventory.error ||
        !!inventory.data?.failed.length ||
        workspace.error) && (
        <p role="alert">
          Some sources could not be loaded. The page count and draft status may
          be incomplete. Use Refresh to retry.
        </p>
      )}
      {workspace.data && !workspace.data.available && (
        <p className="rounded border p-4">
          Pages is ready for database setup. The existing public site uses its
          current content.
        </p>
      )}
      {orphans.length > 0 && (
        <details className="rounded border p-4">
          <summary>{orphans.length} orphaned content entries</summary>
          <p className="text-sm">
            These have no current code consumer and cannot be published from
            this hub.
          </p>
          {orphans.map((e) => (
            <p key={e.id} className="text-xs">
              {e.key}
            </p>
          ))}
        </details>
      )}
      {!selected ? (
        <>
          <div className="flex flex-wrap gap-3">
            <Input
              aria-label="Search pages"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search page name or URL"
              className="sm:max-w-sm"
            />
            <select
              aria-label="Filter pages"
              className="rounded border bg-background p-2"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              {[
                "all",
                "drafts",
                "errors",
                "warnings",
                "Main & company",
                "Services",
                "Cities",
                "Projects",
                "Articles",
                "Legal",
              ].map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
          <p className="text-sm">
            {rows.length} canonical pages from the code registries and published
            database records. SEO findings come from the last completed crawl,
            not an estimated score.
          </p>
          <div className="grid gap-3 xl:grid-cols-2">
            {filtered.map((r) => {
              const edits = pageEntries(r.path);
              const last = edits.reduce<string | null>(
                (a, e) => (!a || e.updated_at > a ? e.updated_at : a),
                null,
              );
              return (
                <button
                  type="button"
                  key={r.path}
                  className="rounded-xl border p-4 text-left hover:bg-muted/40"
                  onClick={() => setParams({ page: r.path })}
                >
                  <div className="flex justify-between gap-2">
                    <strong>{r.title}</strong>
                    <span className="text-xs">{healthLabel(r.path)}</span>
                  </div>
                  <p className="break-all text-sm text-muted-foreground">
                    {r.path}
                  </p>
                  <p className="mt-2 text-xs">
                    {r.group} · {draftCount(r.path)} drafts ·{" "}
                    {last
                      ? `Edited ${new Date(last).toLocaleDateString()}`
                      : "Using current defaults"}
                  </p>
                </button>
              );
            })}
          </div>
          {!rows.length && (
            <p>
              {inventory.isPending
                ? "Loading inventory…"
                : "No page inventory is available. Please refresh."}
            </p>
          )}
        </>
      ) : page ? (
        <>
          <div className="flex flex-wrap gap-2">
            {["content", "seo", "header", "health"].map((t) => (
              <Button
                key={t}
                variant={tab === t ? "default" : "outline"}
                onClick={() => setParams({ page: selected, tab: t })}
              >
                {t === "seo" ? "SEO and visibility" : t}
              </Button>
            ))}
            <Link
              to={page.path}
              target="_blank"
              className="px-3 py-2 text-sm underline"
            >
              View site
            </Link>
          </div>
          {tab === "content" && (
            <>
              <div className="flex flex-wrap gap-2">
                {related.map((m) => (
                  <Button
                    key={m.id}
                    variant={module?.id === m.id ? "default" : "outline"}
                    onClick={() =>
                      setParams({
                        page: selected,
                        tab: "content",
                        module: m.id,
                      })
                    }
                  >
                    {m.id.startsWith("shared-") ? "Shared FAQs" : "Page copy"}
                  </Button>
                ))}
              </div>
              {page.editPath && (
                <p>
                  <Link className="underline" to={page.editPath}>
                    Open the existing content editor
                  </Link>
                </p>
              )}
              {module ? (
                <ContentEditor
                  key={module.id}
                  module={module}
                  path={selected}
                  entries={entries}
                  available={!!workspace.data?.available}
                  onRefresh={refresh}
                />
              ) : (
                <p>
                  This page uses its dedicated editor or protected code-owned
                  presentation. SEO can be managed in the next tab.
                </p>
              )}
            </>
          )}
          {(tab === "seo" || tab === "header") &&
            (() => {
              const settings = pageSettingsModule(selected);
              const keys = tab === "seo" ? ["seo", "hidden"] : ["hero"];
              return (
                <ContentEditor
                  key={`${selected}-${tab}`}
                  module={{
                    ...settings,
                    defaults: Object.fromEntries(
                      keys.map((key) => [key, settings.defaults[key]]),
                    ),
                    meta: Object.fromEntries(
                      keys.map((key) => [key, settings.meta[key]]),
                    ),
                  }}
                  path={selected}
                  entries={entries.filter((e) =>
                    keys.some((k) => e.key === `${settings.id}.${k}`),
                  )}
                  available={!!workspace.data?.available}
                  onRefresh={refresh}
                />
              );
            })()}
          {tab === "health" && (
            <section className="rounded border p-4">
              <h2 className="font-bold">Latest page check</h2>
              {health.error ? (
                <p role="alert">Health data could not be loaded.</p>
              ) : !healthRows(selected).length ? (
                <p>No completed crawl has checked this page.</p>
              ) : (
                healthRows(selected).map((result) => (
                  <div key={result.id} className="mt-4 space-y-2">
                    <p>
                      {result.viewport} · HTTP {result.http_status ?? "unknown"}{" "}
                      · {result.load_ms ?? "unknown"} ms
                    </p>
                    <p>Title: {result.title || "Missing"}</p>
                    <p>Canonical: {result.canonical || "Missing"}</p>
                    {result.issues.map((issue, i) => (
                      <p key={i} className="text-sm">
                        {issue.severity}: {issue.message}
                      </p>
                    ))}
                  </div>
                ))
              )}
              <Link className="mt-4 block underline" to="/admin/monitoring">
                Open Site Health
              </Link>
            </section>
          )}
        </>
      ) : (
        <p>This path is not a canonical page in the current inventory.</p>
      )}
      <ConfirmDialog
        open={!!confirm}
        onOpenChange={(open) => {
          if (!open) setConfirm(null);
        }}
        title={
          confirm === "off"
            ? "Restore code defaults everywhere?"
            : confirm === "public"
              ? "Show published edits to visitors?"
              : "Change override preview mode?"
        }
        description={
          confirm === "off"
            ? "Published edits and history are retained. All pages return to their code defaults."
            : confirm === "public"
              ? "This activates published content on the public website. Review your admin previews first."
              : "Only authenticated administrators will see published overrides."
        }
        confirmText="Apply setting"
        onConfirm={() => {
          const action = confirm;
          setBusy(true);
          void (async () => {
            try {
              if (action === "off") {
                await setContentFlag("content_overrides", false);
                disableContentOverrides();
              } else if (action === "on") {
                await setContentFlag("content_overrides_admin_only", true);
                await setContentFlag("content_overrides", true);
              } else
                await setContentFlag(
                  "content_overrides_admin_only",
                  action !== "public",
                );
              refresh();
              toast({ title: "Override setting updated" });
            } catch {
              toast({
                title: "Setting was not changed",
                variant: "destructive",
              });
            } finally {
              setBusy(false);
            }
          })();
        }}
      />
    </AdminPageLayout>
  );
}
