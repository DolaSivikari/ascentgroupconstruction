import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  visitorSupabase,
  PUBLIC_SETTINGS_PROJECTIONS,
} from "@/lib/publicSettings";
import { Button } from "@/ui/Button";
import { Badge } from "@/components/ui/badge";
interface Check {
  name: string;
  view: string;
  status: "success" | "warning" | "error";
  message: string;
}
export const HealthCheckTab = () => {
  const [checks, setChecks] = useState<Check[]>([]);
  const [busy, setBusy] = useState(false);
  const run = async () => {
    setBusy(true);
    const results = await Promise.all(
      Object.entries(PUBLIC_SETTINGS_PROJECTIONS).flatMap(([table, columns]) =>
        ["Admin", "Visitor"].map(async (view) => {
          try {
            const client = view === "Visitor" ? visitorSupabase : supabase;
            const { data, error } = await client
              .from(table as "site_settings")
              .select(view === "Visitor" ? columns : "id,is_active")
              .eq("is_active", true)
              .limit(2);
            return {
              name: table,
              view,
              status: error
                ? "error"
                : !data?.length || data.length > 1
                  ? "warning"
                  : "success",
              message: error
                ? error.message
                : !data?.length
                  ? "No active record; public defaults apply"
                  : data.length > 1
                    ? "Multiple active records; resolve before editing"
                    : "Readable",
            } as Check;
          } catch (error) {
            return {
              name: table,
              view,
              status: "error",
              message: error instanceof Error ? error.message : "Read failed",
            } as Check;
          }
        }),
      ),
    );
    setChecks(results);
    setBusy(false);
  };
  useEffect(() => {
    void run();
  }, []);
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Settings access</h2>
      <p className="text-muted-foreground">
        Visitor view uses a separate anonymous client with no admin session. It
        checks only the columns rendered on public pages.
      </p>
      <Button onClick={() => void run()} disabled={busy}>
        {busy ? "Checking…" : "Run checks"}
      </Button>
      {checks.map((check) => (
        <div
          key={check.view + check.name}
          className="flex flex-wrap items-center gap-3 rounded-lg border p-4"
        >
          <Badge
            variant={check.status === "error" ? "destructive" : "secondary"}
          >
            {check.view} view
          </Badge>
          <strong>{check.name}</strong>
          <span
            className={
              check.status === "error"
                ? "text-destructive"
                : "text-muted-foreground"
            }
          >
            {check.message}
          </span>
        </div>
      ))}
    </div>
  );
};
