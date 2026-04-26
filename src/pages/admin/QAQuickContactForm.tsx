import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, AlertTriangle, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/design-system/components/Card";
import { Button } from "@/ui/Button";
import { useAdminRoleCheck } from "@/hooks/useAdminRoleCheck";

const STORAGE_KEY = "qa-quick-contact-form-checklist";

type FieldRow = {
  field: string;
  id: string;
  name: string;
  autoComplete: string;
  ariaLabel: string;
};

const FIELDS: FieldRow[] = [
  { field: "Name", id: "quick-contact-name", name: "name", autoComplete: "name", ariaLabel: "Your full name" },
  { field: "Email", id: "quick-contact-email", name: "email", autoComplete: "email", ariaLabel: "Email address" },
  { field: "Phone", id: "quick-contact-phone", name: "phone", autoComplete: "tel", ariaLabel: "Phone number" },
  { field: "Message", id: "quick-contact-message", name: "message", autoComplete: "off", ariaLabel: "Project description" },
  { field: "Honeypot (hidden)", id: "quick-contact-company-website", name: "company_website", autoComplete: "off", ariaLabel: "n/a" },
];

const CHECKS: { id: string; label: string; detail?: string }[] = [
  { id: "tab-order", label: "Tab order: Name → Email → Phone → Message → Submit", detail: "Honeypot is skipped (tabIndex={-1})." },
  { id: "empty-submit", label: "Empty submit shows inline errors under Name, Email, Phone" },
  { id: "invalid-email", label: "Invalid email shows 'Please enter a valid email address' only on email field" },
  { id: "short-phone", label: "Phone with < 10 digits shows 'Phone must include at least 10 digits'" },
  { id: "success-panel", label: "Successful submit swaps the form for the green 'Request Received' panel" },
  { id: "no-redirect", label: "No auto-redirect — user controls next step (Submit another / View work)" },
  { id: "honeypot", label: "Honeypot filled → server returns silent success, no row in contact_submissions" },
  { id: "too-fast", label: "Submission < 2 s after first keystroke → silently dropped on server" },
  { id: "link-spam", label: "Message with 3+ URLs → silently dropped on server" },
  { id: "duplicate", label: "Identical message + email within 10 min → silently dropped (rate-limit)" },
  { id: "voiceover", label: "VoiceOver / NVDA announces each field name and 'required'" },
  { id: "chrome-autofill", label: "Chrome autofill profile populates Name + Email + Phone in one click" },
  { id: "safari-contact", label: "iOS Safari shows Contact Card autofill prompt above keyboard" },
  { id: "lighthouse", label: "Lighthouse Accessibility ≥ 95 on the homepage" },
];

export default function QAQuickContactForm() {
  const { isAdmin, isLoading } = useAdminRoleCheck();
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setChecked(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const reset = () => {
    setChecked({});
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  };

  const total = CHECKS.length;
  const done = CHECKS.filter((c) => checked[c.id]).length;

  if (loading) {
    return <div className="p-8 text-muted-foreground">Loading…</div>;
  }

  if (!isAdmin) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="p-6 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">Admin only</p>
              <p className="text-sm text-muted-foreground">
                This QA checklist is restricted to admin users.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
      <header>
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Internal QA</p>
        <h1 className="text-3xl font-bold text-foreground">Quick Contact Form — QA Checklist</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Reference for the homepage Quick Contact form (
          <code className="text-xs bg-muted px-1.5 py-0.5 rounded">InteractiveCTA.tsx</code>). Use this
          before each release to verify autofill, validation, accessibility, and spam filters.
        </p>
        <div className="mt-4">
          <Button asChild variant="secondary" size="sm">
            <Link to="/" target="_blank" rel="noopener noreferrer">
              Open homepage <ExternalLink className="ml-2 w-3 h-3" />
            </Link>
          </Button>
        </div>
      </header>

      {/* Field reference */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Field reference</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                  <th className="py-2 pr-4">Field</th>
                  <th className="py-2 pr-4">id</th>
                  <th className="py-2 pr-4">name</th>
                  <th className="py-2 pr-4">autoComplete</th>
                  <th className="py-2">aria-label</th>
                </tr>
              </thead>
              <tbody>
                {FIELDS.map((f) => (
                  <tr key={f.id} className="border-b border-border/50">
                    <td className="py-2 pr-4 font-medium">{f.field}</td>
                    <td className="py-2 pr-4 font-mono text-xs">{f.id}</td>
                    <td className="py-2 pr-4 font-mono text-xs">{f.name}</td>
                    <td className="py-2 pr-4 font-mono text-xs">{f.autoComplete}</td>
                    <td className="py-2 font-mono text-xs">{f.ariaLabel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Expected autofill behaviour */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Expected autofill behaviour</h2>
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="font-semibold text-foreground">Chrome (desktop & Android)</dt>
              <dd className="text-muted-foreground mt-1">
                Triggering autofill on the Name field populates Name, Email, and Phone in one click via
                the user&apos;s saved Address profile. Yellow autofill background should appear on each
                filled input.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">Safari — iOS</dt>
              <dd className="text-muted-foreground mt-1">
                Tapping any of Name / Email / Phone surfaces the Contact Card autofill prompt above the
                keyboard. Tapping it fills all three from the user&apos;s &quot;My Card&quot;.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">Safari — macOS</dt>
              <dd className="text-muted-foreground mt-1">
                iCloud Keychain offers Email and Phone from the user&apos;s My Card. Name field offers
                contacts via the AutoFill menu.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">Firefox</dt>
              <dd className="text-muted-foreground mt-1">
                Falls back to per-field history; no Contact Card. Suggestions appear on dropdown focus
                if the user has previously submitted similar values.
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">Password managers (1Password, Bitwarden)</dt>
              <dd className="text-muted-foreground mt-1">
                Detect via <code className="bg-muted px-1 rounded">name</code> attributes and offer
                Identity items. Honeypot field is excluded via{" "}
                <code className="bg-muted px-1 rounded">aria-hidden</code> +{" "}
                <code className="bg-muted px-1 rounded">tabIndex={"{-1}"}</code>.
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Manual test checklist */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">Manual test checklist</h2>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {done} / {total} complete
              </span>
              <Button onClick={reset} variant="secondary" size="sm">
                Reset
              </Button>
            </div>
          </div>

          <ul className="space-y-2">
            {CHECKS.map((c) => {
              const isDone = !!checked[c.id];
              return (
                <li key={c.id}>
                  <label
                    className={`flex items-start gap-3 p-3 rounded-md border cursor-pointer transition-colors ${
                      isDone
                        ? "border-success/40 bg-success/5"
                        : "border-border hover:bg-muted/50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isDone}
                      onChange={() => toggle(c.id)}
                      className="mt-0.5 h-4 w-4 rounded border-input accent-primary"
                      aria-label={c.label}
                    />
                    <div className="flex-1">
                      <p className={`text-sm ${isDone ? "text-foreground line-through opacity-70" : "text-foreground"}`}>
                        {c.label}
                      </p>
                      {c.detail && (
                        <p className="text-xs text-muted-foreground mt-0.5">{c.detail}</p>
                      )}
                    </div>
                    {isDone && <CheckCircle2 className="w-4 h-4 text-success shrink-0" />}
                  </label>
                </li>
              );
            })}
          </ul>

          <p className="text-xs text-muted-foreground mt-4">
            Progress is saved to <code className="bg-muted px-1 rounded">localStorage</code> on this
            device only.
          </p>
        </CardContent>
      </Card>

      {/* Spam filter reference */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-bold text-foreground mb-3">Server-side spam filters</h2>
          <p className="text-sm text-muted-foreground mb-3">
            All filters are enforced in the{" "}
            <code className="bg-muted px-1 rounded">submit-form</code> edge function and return a
            silent success so bots can&apos;t learn the filter exists. Triggers are logged with prefix{" "}
            <code className="bg-muted px-1 rounded">[spam_blocked]</code>.
          </p>
          <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
            <li>Honeypot field (<code className="bg-muted px-1 rounded">company_website</code>) non-empty</li>
            <li>Submission &lt; 2 s after first form interaction</li>
            <li>Message contains 3+ URLs</li>
            <li>Identical email + message hash within 10 minutes (rate-limited)</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
