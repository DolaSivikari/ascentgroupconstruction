import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  loadRecipients,
  saveRecipient,
  toggleRecipient,
  testInquiryAlert,
  maskedEmail,
} from "@/lib/inquiry/api";
import { INQUIRY_TYPES } from "@/lib/inquiry/schema";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { useToast } from "@/hooks/use-toast";
export function NotificationsSettingsTab() {
  const query = useQuery({
    queryKey: ["notification-recipients"],
    queryFn: loadRecipients,
    retry: false,
  });
  const [email, setEmail] = useState("");
  const [type, setType] = useState("all");
  const [reveal, setReveal] = useState(false);
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();
  const act = async (fn: () => Promise<void>, title: string) => {
    setBusy(true);
    try {
      await fn();
      void query.refetch();
      toast({ title });
    } catch (e) {
      toast({
        title: "Notification setting was not completed",
        description: e instanceof Error ? e.message : "Please retry.",
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold">Inquiry alerts</h2>
      <p className="text-sm text-muted-foreground">
        Alerts are sent by the server after a lead is saved. Adding recipients
        does not send an email. Use Send test alert to check delivery.
      </p>
      {query.error && (
        <p role="alert">
          Recipients could not be loaded.{" "}
          <Button onClick={() => void query.refetch()}>Retry</Button>
        </p>
      )}
      {query.data && !query.data.available && (
        <p>Notification settings await inquiry database setup.</p>
      )}
      {query.data?.available && (
        <>
          <div className="flex flex-wrap gap-3">
            <Input
              aria-label="Alert recipient email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Recipient email"
              className="sm:max-w-sm"
            />
            <select
              aria-label="Alert type"
              className="rounded border bg-background p-2"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              {["all", ...INQUIRY_TYPES].map((t) => (
                <option key={t} value={t}>
                  {t.replace(/_/g, " ")}
                </option>
              ))}
            </select>
            <Button
              disabled={busy || !email}
              onClick={() =>
                void act(async () => {
                  await saveRecipient(email, type);
                  setEmail("");
                }, "Recipient saved")
              }
            >
              Add recipient
            </Button>
            <Button
              variant="outline"
              disabled={busy || !email}
              onClick={() =>
                void act(
                  () => testInquiryAlert(email),
                  "Test alert accepted by the provider",
                )
              }
            >
              Send test alert
            </Button>
          </div>
          <Button variant="outline" onClick={() => setReveal(!reveal)}>
            {reveal ? "Mask" : "Reveal"} recipients
          </Button>
          {query.data.rows.filter((r) => r.is_active).length < 2 && (
            <p role="status" className="text-sm">
              Use at least two active recipients, including a person. If a type
              has no recipient, the server falls back to
              estimating@ascentgroupconstruction.com.
            </p>
          )}
          {query.data.rows.map((row) => (
            <div
              key={row.id}
              className="flex flex-wrap items-center gap-3 rounded border p-3"
            >
              <span className="flex-1 text-sm">
                {reveal ? row.email : maskedEmail(row.email)} ·{" "}
                {row.inquiry_type.replace(/_/g, " ")}
              </span>
              <Button
                variant="outline"
                disabled={busy}
                onClick={() =>
                  void act(
                    () => toggleRecipient(row.id, !row.is_active),
                    "Recipient updated",
                  )
                }
              >
                {row.is_active ? "Pause" : "Enable"}
              </Button>
            </div>
          ))}
        </>
      )}
    </section>
  );
}
