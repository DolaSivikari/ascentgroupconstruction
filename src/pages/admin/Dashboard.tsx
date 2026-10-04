import { useEffect, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AdminPageLayout } from "@/components/admin/AdminPageLayout";
import ActivityFeed from "@/components/admin/ActivityFeed";
import { Button } from "@/ui/Button";
import { INBOX_SOURCES, STATUS_LABELS } from "@/lib/inbox/model";
import { LEAD_SOURCES } from "@/lib/leads/model";
import {
  dashboardLeadDestination,
  loadDashboardContent,
  loadLegacyLeadSummary,
  type DashboardContentKey,
} from "@/lib/inbox/dashboard-v2";

function Tile({
  title,
  value,
  detail,
  to,
}: {
  title: string;
  value: number | string;
  detail?: ReactNode;
  to?: string;
}) {
  const content = (
    <>
      <h3 className="text-sm font-semibold text-muted-foreground">{title}</h3>
      <div
        className={`my-2 break-words font-bold tabular-nums ${typeof value === "number" ? "text-3xl" : "text-xl"}`}
      >
        {value}
      </div>
      {detail && <p className="text-xs text-muted-foreground">{detail}</p>}
    </>
  );
  const className = "business-glass-card min-w-0 p-5";
  return to ? (
    <Link
      to={to}
      className={`${className} block transition-colors hover:bg-muted/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary`}
      aria-label={`${title}: ${value}`}
    >
      {content}
    </Link>
  ) : (
    <div className={className} role="group" aria-label={title}>
      {content}
    </div>
  );
}

const contentTiles: Array<{
  title: string;
  key: DashboardContentKey;
  to: string;
  draft?: DashboardContentKey;
}> = [
  {
    title: "Published projects",
    key: "projectsPublished",
    draft: "projectsDraft",
    to: "/admin/projects",
  },
  {
    title: "Published blog posts",
    key: "blogPublished",
    draft: "blogDraft",
    to: "/admin/blog",
  },
  { title: "Services", key: "services", to: "/admin/services-manager" },
  {
    title: "Active hero slides",
    key: "heroSlides",
    to: "/admin/homepage-builder?tab=hero",
  },
  {
    title: "Active Why Choose Us items",
    key: "whyChooseUs",
    to: "/admin/homepage-builder?tab=why-choose",
  },
  {
    title: "Active value pillars",
    key: "valuePillars",
    to: "/admin/homepage-builder",
  },
];
const quickLinks = [
  ["Homepage Builder", "/admin/homepage-builder"],
  ["Page Headers", "/admin/page-headers"],
  ["Users & Roles", "/admin/users"],
  ["Site Settings", "/admin/settings"],
  ["SEO Dashboard", "/admin/seo-dashboard"],
];

export default function Dashboard() {
  const queryClient = useQueryClient();
  const leads = useQuery({
    queryKey: ["dashboard-leads"],
    queryFn: ({ signal }) => loadLegacyLeadSummary(signal),
    staleTime: 0,
    retry: false,
  });
  const content = useQuery({
    queryKey: ["dashboard-content"],
    queryFn: ({ signal }) => loadDashboardContent(signal),
    staleTime: 300_000,
    retry: false,
  });
  useEffect(() => {
    const channel = supabase.channel("dashboard-leads");
    for (const source of LEAD_SOURCES)
      channel.on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: INBOX_SOURCES[source].table,
        },
        () => {
          void queryClient.invalidateQueries({ queryKey: ["dashboard-leads"] });
        },
      );
    channel.subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [queryClient]);
  const summary = leads.error ? undefined : leads.data;
  const leadValue = (value: number | null | undefined): number | string =>
    leads.isPending ? "—" : (value ?? "Unavailable");
  const contentValue = (key: DashboardContentKey): number | string =>
    content.isPending
      ? "—"
      : content.error
        ? "Unavailable"
        : (content.data?.[key] ?? "Unavailable");
  const failed = summary?.failed || (leads.error ? ["all lead sources"] : []);
  const newLink = dashboardLeadDestination("new");
  const refresh = () => {
    void leads.refetch();
    void content.refetch();
  };
  const contentFailed =
    !!content.error ||
    (!!content.data &&
      Object.values(content.data).some((value) => value === null));
  const byStatus = summary?.byStatus;
  const statuses = [
    ...new Set([...Object.keys(STATUS_LABELS), ...Object.keys(byStatus || {})]),
  ];

  return (
    <AdminPageLayout
      title="Dashboard"
      description="Review new requests, follow up with clients and check your website content"
      actions={
        <Button
          variant="outline"
          disabled={leads.isFetching || content.isFetching}
          onClick={refresh}
        >
          {leads.isFetching || content.isFetching
            ? "Refreshing…"
            : "Refresh dashboard"}
        </Button>
      }
    >
      <div className="min-w-0 space-y-8">
        {failed.length > 0 && (
          <div
            role="alert"
            className="space-y-3 rounded-lg border border-destructive/50 p-4 text-sm"
          >
            <p>
              Some request data is unavailable: {failed.join(", ")}. Affected
              totals show Unavailable.
            </p>
            <Button
              variant="outline"
              size="sm"
              disabled={leads.isFetching}
              onClick={() => void leads.refetch()}
            >
              Retry request data
            </Button>
          </div>
        )}
        <section aria-label="Today" className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="business-section-title">Today</h2>
            <Link
              to="/admin/inbox"
              className="text-sm font-semibold text-primary underline underline-offset-4"
            >
              Open Leads
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            Unopened and Needs action count requests with New status, including
            estimates and quotes filed under Contacts. Opening a request does
            not change its status.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <Tile
              title="Unopened"
              value={leadValue(summary?.newTotal)}
              detail="New requests"
              to={newLink}
            />
            <Tile
              title="Needs action"
              value={leadValue(summary?.newTotal)}
              detail="New requests awaiting follow-up"
              to={newLink}
            />
            <Tile
              title="Due in 7 days"
              value="Unavailable"
              detail="Bid closing times are not recorded yet."
            />
            <Tile
              title="Overdue"
              value="Unavailable"
              detail="Project start dates and requested deadlines are not bid closing times."
            />
            <Tile
              title="Alerts needing attention"
              value="Unavailable"
              detail="Lead-linked delivery tracking is not available yet."
            />
            <Tile
              title="Unassigned"
              value="Unavailable"
              detail="Staff assignments are not recorded yet."
            />
          </div>
          <div
            className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
            aria-label="New requests by source"
          >
            {LEAD_SOURCES.map((source) => (
              <Tile
                key={source}
                title={`${INBOX_SOURCES[source].label} requests`}
                value={leadValue(summary?.newBySource[source])}
                detail="New status"
                to={dashboardLeadDestination("new", source)}
              />
            ))}
          </div>
        </section>
        <section
          aria-label="Bids due soon"
          className="business-glass-card space-y-3 p-6"
        >
          <h2 className="business-section-title">Bids due soon</h2>
          <p className="text-sm text-muted-foreground">
            Unavailable until bid closing dates and times are captured. Existing
            requests remain available in Leads.
          </p>
          <Link
            to="/admin/inbox"
            className="text-sm font-semibold text-primary underline underline-offset-4"
          >
            Review requests
          </Link>
        </section>
        <section aria-label="Pipeline" className="space-y-4">
          <h2 className="business-section-title">Pipeline</h2>
          <p className="text-sm text-muted-foreground">
            Current status across all received lead requests. Total:{" "}
            <strong>{leadValue(summary?.total)}</strong>.
          </p>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {statuses.map((status) => (
              <Tile
                key={status}
                title={
                  Object.prototype.hasOwnProperty.call(STATUS_LABELS, status)
                    ? STATUS_LABELS[status]
                    : status || "Unknown status"
                }
                value={leadValue(byStatus ? byStatus[status] || 0 : null)}
                to={
                  Object.prototype.hasOwnProperty.call(STATUS_LABELS, status)
                    ? dashboardLeadDestination(status)
                    : undefined
                }
              />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Tile
              title="Closed bids in the last 90 days"
              value="Unavailable"
              detail="Closing dates and No bid decisions are not recorded for existing requests. Win rate is unavailable."
            />
            <Tile
              title="Submitted value still open"
              value="Unavailable"
              detail="Submitted bid amounts are not recorded for existing requests."
            />
          </div>
        </section>
        <section aria-label="Recent requests">
          <ActivityFeed
            submissions={summary?.activity.items || []}
            newCount={summary?.newTotal ?? 0}
            loading={leads.isPending}
            failed={
              summary?.activity.failed ||
              (leads.error ? ["all lead sources"] : [])
            }
            onRetry={() => void leads.refetch()}
            limit={10}
          />
          <p className="mt-3 text-xs text-muted-foreground">
            Received times use Toronto time. Request change history and staff
            attribution will appear when activity tracking is available.
          </p>
        </section>
        <section aria-label="Content status" className="space-y-4">
          <h2 className="business-section-title">Content status</h2>
          {contentFailed && (
            <div
              role="alert"
              className="space-y-2 rounded-lg border border-destructive/50 p-4 text-sm"
            >
              <p>
                Some content counts are unavailable. Other content tiles remain
                visible.
              </p>
              <Button
                variant="outline"
                size="sm"
                disabled={content.isFetching}
                onClick={() => void content.refetch()}
              >
                Retry content status
              </Button>
            </div>
          )}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {contentTiles.map((tile) => (
              <Tile
                key={tile.key}
                title={tile.title}
                value={contentValue(tile.key)}
                to={tile.to}
                detail={
                  tile.draft
                    ? `${contentValue(tile.draft)} drafts`
                    : "Active website content"
                }
              />
            ))}
          </div>
          {content.data &&
            (content.data.heroSlides === 0 ||
              content.data.whyChooseUs === 0) && (
              <p className="rounded-lg border border-warning/30 bg-warning/10 p-4 text-sm">
                Some homepage sections use fallback content. Add active records
                in Homepage Builder to replace it.
              </p>
            )}
        </section>
        <section
          aria-label="Quick access"
          className="business-glass-card space-y-4 p-6"
        >
          <h2 className="business-section-title">Quick access</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {quickLinks.map(([label, to]) => (
              <Link
                key={to}
                to={to}
                className="rounded-lg border p-4 text-sm font-semibold transition-colors hover:bg-muted/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
              >
                {label}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </AdminPageLayout>
  );
}
