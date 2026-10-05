import { useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { visitorSupabase } from "@/lib/publicSettings";
import {
  inquirySchema,
  torontoDateTime,
  CONSENT_TEXT,
  CONSENT_TEXT_VERSION,
  type InquirySubmission,
} from "@/lib/inquiry/schema";
import { trackSavedFormSubmit } from "@/lib/analytics";
const labels = {
  general: "General question",
  estimate: "Request an estimate",
  bid_invitation: "Invite us to bid",
};
type Kind = keyof typeof labels;
export function InquiryForm() {
  const [params] = useSearchParams();
  const requested = params.get("request");
  const [kind, setKind] = useState<Kind>(
    requested && Object.prototype.hasOwnProperty.call(labels, requested)
      ? (requested as Kind)
      : "general",
  );
  const [fields, setFields] = useState({
    contact_name: "",
    email: "",
    phone: "",
    company: "",
    project_name: "",
    project_location: "",
    message: "",
    drawings_url: "",
    requester_role: "other",
    due: "",
    consent: false,
    honeypot: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState<string | null>(null);
  const key = useRef(crypto.randomUUID());
  const started = useRef(Date.now());
  const sending = useRef(false);
  const previousPayload = useRef<string | null>(null);
  const change = (name: keyof typeof fields, value: string | boolean) =>
    setFields((old) => ({ ...old, [name]: value }));
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (sending.current) return;
    sending.current = true;
    setBusy(true);
    setError("");
    try {
      const search = new URLSearchParams(location.search);
      const payload = {
        inquiry_type: kind,
        submission_key: key.current,
        contact_name: fields.contact_name,
        email: fields.email,
        phone: fields.phone || null,
        company: fields.company || null,
        project_name: fields.project_name || null,
        project_location: fields.project_location || null,
        message: fields.message,
        drawings_url: fields.drawings_url || null,
        bid_due_at:
          kind === "bid_invitation" ? torontoDateTime(fields.due) : null,
        requester_role: fields.requester_role,
        source_path: location.pathname,
        consent_given: fields.consent,
        consent_text_version: CONSENT_TEXT_VERSION,
        utm: {
          source: search.get("utm_source")?.slice(0, 200) || undefined,
          medium: search.get("utm_medium")?.slice(0, 200) || undefined,
          campaign: search.get("utm_campaign")?.slice(0, 200) || undefined,
        },
      };
      const fingerprint = JSON.stringify({ ...payload, submission_key: null });
      if (previousPayload.current && previousPayload.current !== fingerprint)
        key.current = crypto.randomUUID();
      payload.submission_key = key.current;
      const parsed: InquirySubmission = inquirySchema.parse(payload);
      previousPayload.current = fingerprint;
      const result = await visitorSupabase.functions.invoke("submit-form", {
        body: {
          formType: "inquiry",
          data: parsed,
          honeypot: fields.honeypot,
          startedAt: started.current,
        },
      });
      if (
        result.error ||
        result.data?.success !== true ||
        typeof result.data?.reference_code !== "string"
      )
        throw new Error(
          "Your request could not be confirmed. Please retry; an identical retry will not create a duplicate.",
        );
      setSaved(result.data.reference_code);
      trackSavedFormSubmit("inquiry_form", result.data, { inquiry_type: kind });
      key.current = crypto.randomUUID();
      previousPayload.current = null;
    } catch (e) {
      setError(
        e && typeof e === "object" && "issues" in e
          ? "Please check the required fields, consent, drawings link and Toronto bid deadline."
          : e instanceof Error
            ? e.message
            : "Please try again.",
      );
    } finally {
      sending.current = false;
      setBusy(false);
    }
  }
  if (saved)
    return (
      <div role="status" className="space-y-4 rounded-lg border p-5">
        <h3 className="text-xl font-bold">Your request has been saved</h3>
        <p>
          Reference: <strong>{saved}</strong>
        </p>
        <p className="text-sm">
          Keep this reference for follow-up. Email delivery may take a moment.
        </p>
        <Button
          variant="outline"
          onClick={() => {
            setSaved(null);
            setFields({
              contact_name: "",
              email: "",
              phone: "",
              company: "",
              project_name: "",
              project_location: "",
              message: "",
              drawings_url: "",
              requester_role: "other",
              due: "",
              consent: false,
              honeypot: "",
            });
            started.current = Date.now();
          }}
        >
          Send another request
        </Button>
      </div>
    );
  return (
    <form className="space-y-5" onSubmit={submit}>
      <fieldset className="flex flex-wrap gap-3" disabled={busy}>
        <legend className="mb-2 font-semibold">How can we help?</legend>
        {Object.entries(labels).map(([value, label]) => (
          <label
            key={value}
            className="flex items-center gap-2 rounded-lg border p-3"
          >
            <input
              type="radio"
              name="inquiry_type"
              checked={kind === value}
              onChange={() => setKind(value as Kind)}
            />
            {label}
          </label>
        ))}
      </fieldset>
      <fieldset className="grid gap-4 sm:grid-cols-2" disabled={busy}>
        <label className="space-y-1 text-sm">
          Name *
          <Input
            required
            maxLength={200}
            value={fields.contact_name}
            autoComplete="name"
            onChange={(e) => change("contact_name", e.target.value)}
          />
        </label>
        <label className="space-y-1 text-sm">
          Email *
          <Input
            type="email"
            required
            maxLength={320}
            value={fields.email}
            autoComplete="email"
            onChange={(e) => change("email", e.target.value)}
          />
        </label>
        <label className="space-y-1 text-sm">
          Phone
          <Input
            type="tel"
            maxLength={40}
            value={fields.phone}
            autoComplete="tel"
            onChange={(e) => change("phone", e.target.value)}
          />
        </label>
        <label className="space-y-1 text-sm">
          Company {kind === "bid_invitation" && "*"}
          <Input
            required={kind === "bid_invitation"}
            maxLength={200}
            value={fields.company}
            autoComplete="organization"
            onChange={(e) => change("company", e.target.value)}
          />
        </label>
        <label className="space-y-1 text-sm">
          Your role
          <select
            className="block w-full rounded border bg-background p-3"
            value={fields.requester_role}
            onChange={(e) => change("requester_role", e.target.value)}
          >
            {[
              "owner",
              "property_manager",
              "condo_board",
              "developer",
              "gc",
              "cm",
              "consultant",
              "architect",
              "homeowner",
              "other",
            ].map((role) => (
              <option key={role} value={role}>
                {role.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </label>
        {kind !== "general" && (
          <>
            <label className="space-y-1 text-sm">
              Project name {kind === "bid_invitation" && "*"}
              <Input
                required={kind === "bid_invitation"}
                maxLength={300}
                value={fields.project_name}
                onChange={(e) => change("project_name", e.target.value)}
              />
            </label>
            <label className="space-y-1 text-sm sm:col-span-2">
              Project location {kind === "estimate" && "*"}
              <Input
                required={kind === "estimate"}
                maxLength={500}
                value={fields.project_location}
                onChange={(e) => change("project_location", e.target.value)}
              />
            </label>
          </>
        )}
        {kind === "bid_invitation" && (
          <>
            <label className="space-y-1 text-sm sm:col-span-2">
              Bid due date and time (Toronto) *
              <Input
                required
                type="datetime-local"
                value={fields.due}
                onChange={(e) => change("due", e.target.value)}
              />
              <span className="text-xs text-muted-foreground">
                Entered in America/Toronto. Repeated fall-back hours use the
                earlier occurrence.
              </span>
            </label>
            <label className="space-y-1 text-sm sm:col-span-2">
              Drawings or plan-room link
              <Input
                type="url"
                maxLength={2000}
                value={fields.drawings_url}
                placeholder="https://…"
                onChange={(e) => change("drawings_url", e.target.value)}
              />
            </label>
          </>
        )}
        <label className="space-y-1 text-sm sm:col-span-2">
          Message or scope *
          <Textarea
            required
            minLength={10}
            maxLength={5000}
            rows={5}
            value={fields.message}
            onChange={(e) => change("message", e.target.value)}
          />
        </label>
      </fieldset>
      <label className="flex items-start gap-2 text-sm">
        <input
          type="checkbox"
          required
          disabled={busy}
          checked={fields.consent}
          onChange={(e) => change("consent", e.target.checked)}
        />
        {CONSENT_TEXT}
      </label>
      <div aria-hidden="true" className="hidden">
        <label>
          Website
          <Input
            tabIndex={-1}
            autoComplete="off"
            value={fields.honeypot}
            onChange={(e) => change("honeypot", e.target.value)}
          />
        </label>
      </div>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <Button type="submit" disabled={busy}>
        {busy ? "Saving request…" : labels[kind]}
      </Button>
    </form>
  );
}
