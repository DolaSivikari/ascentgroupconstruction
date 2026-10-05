import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminPageLayout } from "@/components/admin/AdminPageLayout";
import { ActivityTabs } from "@/components/admin/ActivityTabs";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  maskRecipient,
  maskEmailAddresses,
  emailLeadHref,
  emailDateRange,
} from "@/lib/admin/emailDelivery";
import { adminErrorMessage } from "@/lib/admin/editorValues";
const PAGE_SIZE = 25;
export default function EmailDelivery() {
  const [tab, setTab] = useState<"delivery" | "suppressed">("delivery");
  const [page, setPage] = useState(0);
  const [status, setStatus] = useState("");
  const [template, setTemplate] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [reveal, setReveal] = useState(false);
  const range = emailDateRange(from, to);
  const delivery = useQuery({
    queryKey: ["email-delivery", page, status, template, from, to],
    enabled: tab === "delivery",
    retry: false,
    queryFn: async () => {
      let query = supabase
        .from("email_send_log")
        .select(
          "id,created_at,status,template_name,recipient_email,error_message,metadata",
          { count: "exact" },
        )
        .order("created_at", { ascending: false })
        .order("id");
      if (status) query = query.eq("status", status);
      if (template) query = query.eq("template_name", template);
      if (range.start) query = query.gte("created_at", range.start);
      if (range.end) query = query.lt("created_at", range.end);
      const result = await query.range(
        page * PAGE_SIZE,
        (page + 1) * PAGE_SIZE - 1,
      );
      if (result.error) throw result.error;
      if (result.count == null)
        throw new Error("The email record count is unavailable.");
      return { rows: result.data || [], count: result.count };
    },
  });
  const suppressed = useQuery({
    queryKey: ["email-suppressed", page, from, to],
    enabled: tab === "suppressed",
    retry: false,
    queryFn: async () => {
      let query = supabase
        .from("suppressed_emails")
        .select("id,email,reason,created_at", { count: "exact" })
        .order("created_at", { ascending: false })
        .order("id");
      if (range.start) query = query.gte("created_at", range.start);
      if (range.end) query = query.lt("created_at", range.end);
      const result = await query.range(
        page * PAGE_SIZE,
        (page + 1) * PAGE_SIZE - 1,
      );
      if (result.error) throw result.error;
      if (result.count == null)
        throw new Error("The suppressed-email count is unavailable.");
      return { rows: result.data || [], count: result.count };
    },
  });
  const active = tab === "delivery" ? delivery : suppressed;
  return (
    <AdminPageLayout
      title="Email Delivery"
      description="Read-only delivery records; this screen sends no messages"
    >
      <ActivityTabs />
      <div className="flex flex-wrap gap-2">
        <Button
          variant={tab === "delivery" ? "default" : "outline"}
          onClick={() => {
            setTab("delivery");
            setPage(0);
          }}
        >
          Delivery log
        </Button>
        <Button
          variant={tab === "suppressed" ? "default" : "outline"}
          onClick={() => {
            setTab("suppressed");
            setPage(0);
          }}
        >
          Suppressed recipients
        </Button>
        <Button variant="outline" onClick={() => setReveal(!reveal)}>
          {reveal ? "Mask recipients" : "Reveal recipients"}
        </Button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {tab === "delivery" && (
          <>
            <div className="space-y-1">
              <Label htmlFor="email-status">Status (exact)</Label>
              <Input
                id="email-status"
                value={status}
                placeholder="All statuses"
                onChange={(event) => {
                  setStatus(event.target.value);
                  setPage(0);
                }}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email-template">Template (exact)</Label>
              <Input
                id="email-template"
                value={template}
                placeholder="All templates"
                onChange={(event) => {
                  setTemplate(event.target.value);
                  setPage(0);
                }}
              />
            </div>
          </>
        )}
        <div className="space-y-1">
          <Label htmlFor="email-from">From date (UTC)</Label>
          <Input
            id="email-from"
            type="date"
            value={from}
            onChange={(event) => {
              setFrom(event.target.value);
              setPage(0);
            }}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="email-to">Through date (UTC)</Label>
          <Input
            id="email-to"
            type="date"
            value={to}
            min={from}
            onChange={(event) => {
              setTo(event.target.value);
              setPage(0);
            }}
          />
        </div>
      </div>
      {active.isLoading ? (
        <p role="status">Loading email records…</p>
      ) : active.error ? (
        <div role="alert" className="rounded-lg border p-4 space-y-3">
          <p>
            Email records are unavailable: {adminErrorMessage(active.error)}
          </p>
          <p className="text-sm">
            Verify the email tables and admin read policies. An empty log does
            not establish that alerts were sent.
          </p>
          <Button variant="outline" onClick={() => void active.refetch()}>
            Retry
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {tab === "delivery"
            ? delivery.data?.rows.map((row) => (
                <article
                  key={row.id}
                  className="rounded-lg border bg-card p-4 space-y-2"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge
                      variant={
                        /fail|error|bounce/i.test(row.status)
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {row.status}
                    </Badge>
                    <span className="text-sm">
                      {new Date(row.created_at).toLocaleString()}
                    </span>
                    <span className="text-sm break-all">
                      {reveal
                        ? row.recipient_email
                        : maskRecipient(row.recipient_email)}
                    </span>
                  </div>
                  <p className="font-medium">{row.template_name}</p>
                  {row.error_message && (
                    <p className="text-sm text-destructive break-words">
                      {reveal
                        ? row.error_message
                        : maskEmailAddresses(row.error_message)}
                    </p>
                  )}
                  {emailLeadHref(row.metadata) && (
                    <Link
                      className="text-sm text-primary underline"
                      to={emailLeadHref(row.metadata)!}
                    >
                      View lead
                    </Link>
                  )}
                </article>
              ))
            : suppressed.data?.rows.map((row) => (
                <article
                  key={row.id}
                  className="rounded-lg border bg-card p-4 space-y-2"
                >
                  <p className="break-all">
                    {reveal ? row.email : maskRecipient(row.email)}
                  </p>
                  <p>{row.reason}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(row.created_at).toLocaleString()}
                  </p>
                </article>
              ))}
          {!active.data?.rows.length && (
            <p>
              No recorded{" "}
              {tab === "delivery" ? "deliveries" : "suppressed recipients"}{" "}
              match these filters.
            </p>
          )}
        </div>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="outline"
          disabled={page === 0 || active.isFetching}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </Button>
        <span>
          Page {page + 1}
          {active.data ? ` · ${active.data.count} records` : ""}
        </span>
        <Button
          variant="outline"
          disabled={
            !active.data ||
            (page + 1) * PAGE_SIZE >= active.data.count ||
            active.isFetching
          }
          onClick={() => setPage(page + 1)}
        >
          Next
        </Button>
      </div>
    </AdminPageLayout>
  );
}
