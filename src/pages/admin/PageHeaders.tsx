import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Image as ImageIcon, ExternalLink, RefreshCw } from "lucide-react";
import { AdminPageLayout } from "@/components/admin/AdminPageLayout";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  buildPageHeaders,
  sharedImagePaths,
  type PageHeaderRow,
} from "@/data/page-headers";
import { loadHeaderMetadata } from "@/lib/admin/pageHeaders";

const EMPTY_METADATA = {
  services: [],
  projects: [],
  articles: [],
  slides: [],
  failed: [],
};
export default function PageHeaders() {
  const query = useQuery({
    queryKey: ["page-header-inventory"],
    queryFn: loadHeaderMetadata,
    staleTime: 30_000,
    refetchOnMount: "always",
  });
  const [search, setSearch] = useState("");
  const [group, setGroup] = useState("all");
  const [coverage, setCoverage] = useState("all");
  const [preview, setPreview] = useState<PageHeaderRow | null>(null);
  const rows = useMemo(
    () => buildPageHeaders(query.data || EMPTY_METADATA),
    [query.data],
  );
  const shared = useMemo(() => sharedImagePaths(rows), [rows]);
  const filtered = rows.filter(
    (row) =>
      (group === "all" || row.group === group) &&
      (coverage !== "shared" ||
        (row.image && shared.get(row.image)!.length > 1)) &&
      (coverage !== "attention" || row.warning) &&
      `${row.path} ${row.title} ${row.source}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  const incomplete =
    query.isPending || !!query.error || !!query.data?.failed.length;
  return (
    <AdminPageLayout
      title="Page Headers"
      description="Review public page images, shared imagery, and where each image is managed."
      icon={<ImageIcon className="h-5 w-5" />}
      actions={
        <Button
          variant="outline"
          onClick={() => void query.refetch()}
          disabled={query.isFetching}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      }
    >
      {(query.error || !!query.data?.failed.length) && (
        <div
          role="alert"
          className="rounded-lg border border-destructive/40 p-4 text-sm"
        >
          {query.error
            ? "Could not load published image metadata."
            : `Could not load: ${query.data!.failed.join(", ")}.`}{" "}
          Counts and image sources are incomplete.{" "}
          <Button variant="outline" onClick={() => void query.refetch()}>
            Retry
          </Button>
        </div>
      )}
      <p className="text-sm text-muted-foreground">
        {incomplete ? "Partial inventory" : "Canonical page inventory"}:{" "}
        {rows.length} pages. Legal pages intentionally use text headers; project
        detail images sit below the title. Shared imagery is listed for review.
      </p>
      <div className="flex flex-wrap gap-3">
        <Input
          aria-label="Search page headers"
          placeholder="Search page or image source…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full sm:max-w-xs"
        />
        <select
          aria-label="Page group"
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          value={group}
          onChange={(event) => setGroup(event.target.value)}
        >
          <option value="all">All page groups</option>
          {[...new Set(rows.map((row) => row.group))].map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
        <select
          aria-label="Image coverage"
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          value={coverage}
          onChange={(event) => setCoverage(event.target.value)}
        >
          <option value="all">All images</option>
          <option value="shared">Shared imagery</option>
          <option value="attention">Needs attention</option>
        </select>
      </div>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Public page header inventory</caption>
          <thead className="bg-muted/50">
            <tr>
              {["Page", "Presentation", "Image source", "Image", "Manage"].map(
                (label) => (
                  <th scope="col" key={label} className="p-3 font-medium">
                    {label}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.path} className="border-t border-border align-top">
                <td className="p-3">
                  <a
                    href={row.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:text-primary inline-flex items-start gap-1"
                  >
                    {row.title}
                    <ExternalLink className="mt-0.5 h-3 w-3 shrink-0" />
                  </a>
                  <div className="mt-1 text-xs text-muted-foreground break-all">
                    {row.path}
                  </div>
                </td>
                <td className="p-3">
                  {row.presentation}
                  <div className="text-xs text-muted-foreground">
                    {row.group}
                  </div>
                </td>
                <td className="p-3">
                  {row.source}
                  {row.warning && (
                    <p className="mt-1 text-xs text-warning">{row.warning}</p>
                  )}
                </td>
                <td className="p-3">
                  {row.image ? (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setPreview(row)}
                      >
                        Preview
                      </Button>
                      {shared.get(row.image)!.length > 1 && (
                        <div className="mt-1 text-xs text-muted-foreground">
                          Shared by {shared.get(row.image)!.length} pages
                        </div>
                      )}
                    </>
                  ) : row.presentation === "Plain header" ? (
                    "Text only"
                  ) : row.presentation === "Project carousel" ? (
                    "Varies by project"
                  ) : (
                    "Branded fallback"
                  )}
                </td>
                <td className="p-3">
                  {row.editPath ? (
                    <Button asChild size="sm" variant="outline">
                      <Link to={row.editPath}>Open editor</Link>
                    </Button>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      Managed in code
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!filtered.length && (
          <p className="p-6 text-sm text-muted-foreground">
            No pages match these filters.
          </p>
        )}
      </div>
      <Dialog
        open={!!preview}
        onOpenChange={(open) => {
          if (!open) setPreview(null);
        }}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{preview?.title}</DialogTitle>
            <DialogDescription>
              {preview?.source} · {preview?.path}
            </DialogDescription>
          </DialogHeader>
          {preview?.image && (
            <>
              <img
                src={preview.image}
                alt={`Image preview for ${preview.title}`}
                className="max-h-[55vh] w-full rounded-md object-contain"
              />
              <p className="break-all text-xs text-muted-foreground">
                {preview.image}
              </p>
              {(shared.get(preview.image)?.length || 0) > 1 && (
                <p className="text-xs text-muted-foreground">
                  Also used on:{" "}
                  {shared
                    .get(preview.image)!
                    .filter((path) => path !== preview.path)
                    .join(", ")}
                </p>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </AdminPageLayout>
  );
}
