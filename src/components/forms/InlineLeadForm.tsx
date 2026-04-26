import { useState, useRef } from "react";
import { z } from "zod";
import { Loader2, ArrowRight, CheckCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { Textarea } from "@/ui/Textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/design-system/components/Card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { trackFormSubmit } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const leadSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  email: z.string().trim().email("Valid email is required").max(255),
  phone: z
    .string()
    .trim()
    .max(20)
    .regex(/^[0-9\s()+-]*$/u, "Invalid phone")
    .optional()
    .or(z.literal("")),
  scope: z.string().trim().min(10, "Tell us a little about the scope (10+ chars)").max(2000),
});

export interface InlineLeadFormProps {
  /** Heading shown above the form */
  title?: string;
  /** Subhead shown below the title */
  description?: string;
  /** Audience tag stored with the submission for routing/segmentation */
  audience?:
    | "general"
    | "property-manager"
    | "commercial"
    | "homeowner"
    | "general-contractor"
    | "architect"
    | "developer"
    | "emergency";
  /** Force a compact 1-row layout (no card chrome) */
  compact?: boolean;
  className?: string;
}

/**
 * InlineLeadForm — Lightweight 4-field form for embedding mid-page on
 * audience and service pages instead of always pushing users to /contact.
 */
export const InlineLeadForm = ({
  title = "Talk to us about your project",
  description = "Quick scope review and a call back within one business day.",
  audience = "general",
  compact = false,
  className,
}: InlineLeadFormProps) => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const submittingRef = useRef(false);
  const [data, setData] = useState({ name: "", email: "", phone: "", scope: "", honeypot: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);

    try {
      const validated = leadSchema.parse(data);

      trackFormSubmit("inline_lead_form", { audience });

      const { error } = await supabase.functions.invoke("submit-form", {
        body: {
          formType: "contact",
          data: {
            name: validated.name,
            email: validated.email,
            phone: validated.phone,
            message: validated.scope,
            submission_type: `inline:${audience}`,
            consent_timestamp: new Date().toISOString(),
          },
          honeypot: data.honeypot,
        },
      });

      if (error) throw error;

      setSubmitted(true);
      toast({
        title: "Got it — we'll be in touch.",
        description: "Expect a call or email within one business day.",
      });
      setData({ name: "", email: "", phone: "", scope: "", honeypot: "" });
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast({
          title: "Please check the form",
          description: err.issues[0]?.message ?? "Invalid input",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Something went wrong",
          description: "Please try again or call us directly.",
          variant: "destructive",
        });
      }
    } finally {
      setSubmitting(false);
      submittingRef.current = false;
    }
  };

  const Wrapper = compact
    ? ({ children }: { children: React.ReactNode }) => (
        <div className={cn("w-full", className)}>{children}</div>
      )
    : ({ children }: { children: React.ReactNode }) => (
        <Card variant="elevated" size="lg" className={cn("max-w-3xl mx-auto", className)}>
          {children}
        </Card>
      );

  if (submitted) {
    return (
      <Wrapper>
        <div className="text-center py-8">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Thanks — we received your scope.</h3>
          <p className="text-muted-foreground text-sm">
            A member of our team will review and respond within one business day.
          </p>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      {!compact && (
        <div className="mb-5">
          <h3 className="text-xl font-semibold mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor={`il-name-${audience}`} className="text-sm">
              Name *
            </Label>
            <Input
              id={`il-name-${audience}`}
              name="name"
              value={data.name}
              onChange={handleChange}
              required
              placeholder="Full name"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`il-email-${audience}`} className="text-sm">
              Email *
            </Label>
            <Input
              id={`il-email-${audience}`}
              name="email"
              type="email"
              value={data.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`il-phone-${audience}`} className="text-sm">
            Phone (optional)
          </Label>
          <Input
            id={`il-phone-${audience}`}
            name="phone"
            type="tel"
            value={data.phone}
            onChange={handleChange}
            placeholder="(647) 555-0100"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`il-scope-${audience}`} className="text-sm">
            Scope *
          </Label>
          <Textarea
            id={`il-scope-${audience}`}
            name="scope"
            value={data.scope}
            onChange={handleChange}
            required
            placeholder="Project type, location, approximate timeline."
            className="min-h-[110px]"
          />
        </div>

        {/* Honeypot */}
        <div style={{ position: "absolute", left: "-9999px" }} aria-hidden="true">
          <Label htmlFor={`il-website-${audience}`}>Website</Label>
          <Input
            id={`il-website-${audience}`}
            name="honeypot"
            tabIndex={-1}
            autoComplete="off"
            value={data.honeypot}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
          <p className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            We respect your privacy. No spam, ever.
          </p>
          <Button type="submit" disabled={submitting} className="sm:w-auto">
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending…
              </>
            ) : (
              <>
                Send <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </form>
    </Wrapper>
  );
};

export default InlineLeadForm;
