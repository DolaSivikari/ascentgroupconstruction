import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminPageLayout } from "@/components/admin/AdminPageLayout";
import { ActivityTabs } from "@/components/admin/ActivityTabs";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { Badge } from "@/components/ui/badge";
import { adminErrorMessage } from "@/lib/admin/editorValues";
const PAGE_SIZE = 25;
export default function AuditDashboard() {
  const [page, setPage] = useState(0);
  const [action, setAction] = useState("");
  const [search, setSearch] = useState("");
  const query = useQuery({
    queryKey: ["audit-logs", page, action],
    queryFn: async () => {
      let request = supabase
        .from("audit_log")
        .select(
          "id,object_type,object_id,action,user_id,created_at,before_state,after_state",
          { count: "exact" },
        )
        .order("created_at", { ascending: false })
        .order("id");
      if (action) request = request.eq("action", action);
      const result = await request.range(
        page * PAGE_SIZE,
        (page + 1) * PAGE_SIZE - 1,
      );
      if (result.error) throw result.error;
      if (result.count == null)
        throw new Error("Could not verify the audit count.");
      const ids = [
        ...new Set(
          (result.data || [])
            .map((row) => row.user_id)
            .filter((id): id is string => !!id),
        ),
      ];
      const actors = ids.length
        ? await supabase.from("profiles").select("id,full_name").in("id", ids)
        : { data: [], error: null };
      if (actors.error) throw actors.error;
      const names = new Map<string, string | null>(
        (actors.data || []).map(
          (actor) => [actor.id, actor.full_name] as const,
        ),
      );
      return {
        rows: (result.data || []).map((row) => ({
          ...row,
          actor: row.user_id
            ? names.get(row.user_id) || "Unknown staff member"
            : "System",
        })),
        count: result.count,
      };
    },
    retry: false,
  });
  const rows =
    query.data?.rows.filter((row) =>
      `${row.object_type} ${row.object_id} ${row.action} ${row.actor}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    ) || [];
  return (
    <AdminPageLayout
      title="Activity"
      description="Recorded changes with the staff member responsible"
    >
      <ActivityTabs />
      <div className="flex flex-wrap gap-3">
        <Input
          className="max-w-sm"
          aria-label="Search loaded activity"
          placeholder="Search this page by actor or content"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <select
          aria-label="Filter action"
          className="border rounded-md bg-background px-3 py-2"
          value={action}
          onChange={(event) => {
            setAction(event.target.value);
            setPage(0);
          }}
        >
          <option value="">All actions</option>
          {["INSERT", "UPDATE", "DELETE"].map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
        <Button variant="outline" onClick={() => void query.refetch()}>
          Refresh
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Services, blog, settings and hero change recording requires the reviewed
        audit-trigger SQL. IP and browser columns are omitted because these
        content events do not record them.
      </p>
      {query.isLoading ? (
        <p role="status">Loading activity…</p>
      ) : query.error ? (
        <p role="alert" className="text-destructive">
          Activity unavailable: {adminErrorMessage(query.error)}
        </p>
      ) : !rows.length ? (
        <p>No recorded events match this page and filter.</p>
      ) : (
        rows.map((row) => (
          <article key={row.id} className="rounded-lg border p-4 space-y-2">
            <div className="flex flex-wrap gap-3 items-center">
              <Badge variant="secondary">{row.action}</Badge>
              <strong>{row.actor}</strong>
              <span className="text-sm text-muted-foreground">
                {row.created_at
                  ? new Date(row.created_at).toLocaleString()
                  : "Date not recorded"}
              </span>
            </div>
            <p className="text-sm break-all">
              {row.object_type} · {row.object_id || "No record ID"}
            </p>
            <details>
              <summary className="cursor-pointer text-sm">
                Recorded changes
              </summary>
              <div className="grid md:grid-cols-2 gap-3 mt-3">
                <div>
                  <h3 className="text-sm font-medium">Before</h3>
                  <pre className="overflow-auto max-h-72 rounded border p-3 text-xs">
                    {JSON.stringify(row.before_state, null, 2)}
                  </pre>
                </div>
                <div>
                  <h3 className="text-sm font-medium">After</h3>
                  <pre className="overflow-auto max-h-72 rounded border p-3 text-xs">
                    {JSON.stringify(row.after_state, null, 2)}
                  </pre>
                </div>
              </div>
            </details>
          </article>
        ))
      )}
      <div className="flex flex-wrap gap-3 items-center">
        <Button
          variant="outline"
          disabled={page === 0 || query.isFetching}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </Button>
        <span>
          Page {page + 1}
          {query.data ? ` · ${query.data.count} events` : ""}
        </span>
        <Button
          variant="outline"
          disabled={
            !query.data ||
            (page + 1) * PAGE_SIZE >= query.data.count ||
            query.isFetching
          }
          onClick={() => setPage(page + 1)}
        >
          Next
        </Button>
      </div>
    </AdminPageLayout>
  );
}
