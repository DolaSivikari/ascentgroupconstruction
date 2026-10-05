import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { visitorSupabase } from "@/lib/publicSettings";
export function NewsletterForm({ source }: { source: "footer" | "blog" }) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const NewsletterInput = source === "footer" ? "input" : Input;
  const sending = useRef(false);
  const started = useRef(Date.now());
  const [honeypot, setHoneypot] = useState("");
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (sending.current) return;
    sending.current = true;
    setBusy(true);
    setMessage("");
    try {
      const address = z
        .string()
        .trim()
        .email()
        .max(255)
        .parse(email)
        .toLowerCase();
      if (!consent)
        throw new Error("Please consent to receive newsletter emails.");
      if (import.meta.env.VITE_NEWSLETTER_SERVER_ENABLED === "true") {
        const result = await visitorSupabase.functions.invoke("submit-form", {
          body: {
            formType: "newsletter",
            data: { email: address, source, consent: true },
            honeypot,
            startedAt: started.current,
          },
        });
        if (result.error || result.data?.success !== true)
          throw new Error(
            "We could not confirm your subscription. Please retry.",
          );
      } else {
        const values = {
          email: address,
          source: source === "blog" ? "blog_newsletter" : "footer",
          subscribed_at: new Date().toISOString(),
          consent_timestamp: new Date().toISOString(),
          consent_method: source,
        };
        const { error } = await (source === "blog"
          ? visitorSupabase
              .from("newsletter_subscribers")
              .upsert(
                { ...values, is_active: true, unsubscribed_at: null },
                { onConflict: "email" },
              )
          : visitorSupabase.from("newsletter_subscribers").insert(values));
        if (error && error.code !== "23505") throw error;
      }
      setMessage("Your subscription request has been received.");
      setEmail("");
      setConsent(false);
    } catch (e) {
      setMessage(
        e instanceof Error
          ? e.message
          : "Subscription could not be saved. Please retry.",
      );
    } finally {
      setBusy(false);
      sending.current = false;
    }
  }
  return (
    <form
      onSubmit={submit}
      className={
        source === "footer" ? "space-y-3 max-w-md mx-auto" : "space-y-3"
      }
    >
      <div
        className={
          source === "footer" ? "flex gap-2" : "flex flex-col gap-3 sm:flex-row"
        }
      >
        <NewsletterInput
          aria-label="Newsletter email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          placeholder="Enter your email"
          disabled={busy}
          className={
            source === "footer"
              ? "footer-newsletter-input flex-1"
              : "flex-1 bg-white text-primary"
          }
        />
        <Button
          type="submit"
          disabled={busy || !consent}
          variant="secondary"
          className={
            source === "footer"
              ? "whitespace-nowrap"
              : "bg-secondary hover:bg-secondary/90 text-primary font-bold"
          }
        >
          {busy ? "Subscribing…" : "Subscribe"}
        </Button>
      </div>
      <div className="flex items-start gap-2 text-left">
        <input
          id={`newsletter-consent-${source}`}
          type="checkbox"
          required
          aria-required="true"
          checked={consent}
          disabled={busy}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1"
        />
        <label
          htmlFor={`newsletter-consent-${source}`}
          className={
            source === "footer"
              ? "text-xs text-primary-foreground/70"
              : "text-xs"
          }
        >
          I consent to receive email communications from Ascent Group
          Construction about construction industry insights, project updates,
          and company news. I understand I can{" "}
          <span className="underline">unsubscribe at any time</span>.{" "}
          <Link to="/privacy" className="underline">
            Privacy Policy
          </Link>
        </label>
      </div>
      <div className="hidden" aria-hidden="true">
        <input
          aria-label="Website"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>
      {message && (
        <p role="status" className="text-sm">
          {message}
        </p>
      )}
    </form>
  );
}
