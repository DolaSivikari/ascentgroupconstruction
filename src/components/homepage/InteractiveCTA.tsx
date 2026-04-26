import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { Textarea } from "@/ui/Textarea";
import { Phone, Mail, ArrowRight, CheckCircle2, Clock, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useCompanySettings } from "@/hooks/useCompanySettings";
import { formatPhoneDisplay, formatPhoneTel } from "@/utils/formatPhone";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(100),
  email: z.string().trim().email("Please enter a valid email address").max(255),
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .max(20)
    .refine((val) => val.replace(/\D/g, "").length >= 10, {
      message: "Phone must include at least 10 digits",
    }),
  message: z.string().trim().max(1000).optional(),
});

type FieldErrors = Partial<Record<"name" | "email" | "phone" | "message", string>>;

const stories = [
  {
    stat: "15+",
    label: "Years Team Experience",
    detail:
      "Our crew brings hands-on experience from envelope, restoration, and interior trades projects across the GTA.",
    icon: CheckCircle2,
  },
  {
    stat: "85%",
    label: "Self-Performed Work",
    detail: "New company. Experienced team. Building trust project by project.",
    icon: Clock,
  },
  {
    stat: "$2M",
    label: "CGL Coverage",
    detail: "Fully insured with comprehensive liability coverage on every project.",
    icon: Shield,
  },
];

const InteractiveCTA = () => {
  const { settings } = useCompanySettings();
  const [currentStory, setCurrentStory] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const isSubmittingRef = useRef(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  // Spam mitigation
  const [honeypot, setHoneypot] = useState("");
  const formStartedAtRef = useRef<number | null>(null);

  const { toast } = useToast();

  const displayPhone = formatPhoneDisplay(settings?.phone);
  const telLink = formatPhoneTel(settings?.phone);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStory((prev) => (prev + 1) % stories.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const updateField = (field: keyof typeof formData, value: string) => {
    if (formStartedAtRef.current === null) {
      formStartedAtRef.current = Date.now();
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", phone: "", message: "" });
    setFieldErrors({});
    setHoneypot("");
    formStartedAtRef.current = null;
    setSubmitted(false);
    setSubmittedEmail("");
  };

  const handleQuickContact = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmittingRef.current) return;

    // Client-side validation with field-level messages
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const flat = result.error.flatten().fieldErrors;
      setFieldErrors({
        name: flat.name?.[0],
        email: flat.email?.[0],
        phone: flat.phone?.[0],
        message: flat.message?.[0],
      });
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setFieldErrors({});

    try {
      const validatedData = result.data;

      const { data: response, error: invokeError } = await supabase.functions.invoke(
        "submit-form",
        {
          body: {
            formType: "contact",
            honeypot,
            startedAt: formStartedAtRef.current ?? Date.now(),
            data: {
              name: validatedData.name,
              email: validatedData.email,
              phone: validatedData.phone,
              message: validatedData.message || "Quick estimate request",
              submission_type: "quote",
            },
          },
        },
      );

      if (invokeError) throw invokeError;
      if (response && (response as any).success === false) {
        throw new Error((response as any).message || "Submission failed");
      }

      // Fire-and-forget notification email (server already stored the row)
      supabase.functions
        .invoke("send-contact-notification", {
          body: {
            name: validatedData.name,
            email: validatedData.email,
            phone: validatedData.phone,
            message: validatedData.message || "Quick estimate request",
          },
        })
        .catch((err) => console.warn("Notification email failed (non-blocking):", err));

      setSubmittedEmail(validatedData.email);
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
      setHoneypot("");
      formStartedAtRef.current = null;
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Something went wrong",
        description: "We couldn't send your request. Please try again or call us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      isSubmittingRef.current = false;
    }
  };

  return (
    <section className="relative py-20 md:py-28 lg:py-32 bg-gradient-to-br from-primary to-primary/90 overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Rotating Visual Story */}
          <div className="text-[hsl(var(--bg))] space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                Your Envelope, Restoration & Trades Partner
              </h2>
              <p className="text-xl text-[hsl(var(--bg))]/90 leading-relaxed">
                From concept to completion, we deliver exceptional results with transparent communication
                and expert craftsmanship.
              </p>
            </div>

            {(() => {
              const CurrentIcon = stories[currentStory].icon;
              return (
                <div
                  key={currentStory}
                  className="bg-white/10 backdrop-blur-sm rounded-[var(--radius-lg)] p-8 border border-white/20 animate-fade-in"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-secondary/20 rounded-full p-3 flex-shrink-0">
                      {CurrentIcon && <CurrentIcon className="h-8 w-8 text-secondary" />}
                    </div>
                    <div>
                      <div className="text-5xl font-bold mb-2 text-secondary">
                        {stories[currentStory].stat}
                      </div>
                      <div className="text-xl font-semibold mb-1">{stories[currentStory].label}</div>
                      <p className="text-[hsl(var(--bg))]/80 text-sm">
                        {stories[currentStory].detail}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}

            <div className="flex gap-2">
              {stories.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStory(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentStory
                      ? "w-8 bg-secondary"
                      : "w-2 bg-[hsl(var(--bg))]/30 hover:bg-[hsl(var(--bg))]/50"
                  }`}
                  aria-label={`View story ${index + 1}`}
                />
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[hsl(var(--bg))]/20">
              <div className="text-center">
                <Shield className="h-6 w-6 mx-auto mb-2 text-secondary" />
                <div className="text-xs text-[hsl(var(--bg))]/80">Fully Licensed</div>
              </div>
              <div className="text-center">
                <CheckCircle2 className="h-6 w-6 mx-auto mb-2 text-secondary" />
                <div className="text-xs text-[hsl(var(--bg))]/80">WSIB Compliant</div>
              </div>
              <div className="text-center">
                <Clock className="h-6 w-6 mx-auto mb-2 text-secondary" />
                <div className="text-xs text-[hsl(var(--bg))]/80">Responsive Support</div>
              </div>
            </div>
          </div>

          {/* Right Column - Quick Contact Form / Success Panel */}
          <div className="bg-background rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] p-8 lg:p-10">
            {submitted ? (
              <div
                role="status"
                aria-live="polite"
                className="text-center py-6 animate-fade-in"
              >
                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-success" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Request Received</h3>
                <p className="text-muted-foreground mb-6">
                  Thanks — we&apos;ll reach out within 24 hours
                  {submittedEmail ? (
                    <>
                      {" "}at <span className="font-semibold text-foreground">{submittedEmail}</span>
                    </>
                  ) : null}
                  .
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={resetForm} variant="secondary">
                    Submit another inquiry
                  </Button>
                  <Button asChild>
                    <Link to="/projects">View our work</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    Start a Project Conversation
                  </h3>
                  <p className="text-muted-foreground">
                    Scope review and pricing within 48 hours. No obligation.
                  </p>
                </div>

                <form
                  onSubmit={handleQuickContact}
                  className="space-y-4"
                  aria-label="Quick contact form"
                  noValidate
                >
                  {/* Honeypot field — hidden from real users, attractive to bots */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      left: "-10000px",
                      width: "1px",
                      height: "1px",
                      overflow: "hidden",
                    }}
                  >
                    <label htmlFor="quick-contact-company-website">
                      Company website (leave blank)
                    </label>
                    <input
                      id="quick-contact-company-website"
                      name="company_website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                    />
                  </div>

                  {/* Name */}
                  <div>
                    <label htmlFor="quick-contact-name" className="sr-only">
                      Your full name
                    </label>
                    <Input
                      id="quick-contact-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Your Name"
                      aria-label="Your full name"
                      aria-required="true"
                      aria-invalid={!!fieldErrors.name}
                      aria-describedby={fieldErrors.name ? "quick-contact-name-error" : undefined}
                      required
                      className={cn("h-12", fieldErrors.name && "border-destructive focus:ring-destructive/30")}
                      value={formData.name}
                      onChange={(e) => updateField("name", e.target.value)}
                    />
                    {fieldErrors.name && (
                      <p
                        id="quick-contact-name-error"
                        role="alert"
                        className="text-sm text-destructive mt-1"
                      >
                        {fieldErrors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="quick-contact-email" className="sr-only">
                      Email address
                    </label>
                    <Input
                      id="quick-contact-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="Email Address"
                      aria-label="Email address"
                      aria-required="true"
                      aria-invalid={!!fieldErrors.email}
                      aria-describedby={fieldErrors.email ? "quick-contact-email-error" : undefined}
                      required
                      className={cn("h-12", fieldErrors.email && "border-destructive focus:ring-destructive/30")}
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                    />
                    {fieldErrors.email && (
                      <p
                        id="quick-contact-email-error"
                        role="alert"
                        className="text-sm text-destructive mt-1"
                      >
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="quick-contact-phone" className="sr-only">
                      Phone number
                    </label>
                    <Input
                      id="quick-contact-phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="Phone Number"
                      aria-label="Phone number"
                      aria-required="true"
                      aria-invalid={!!fieldErrors.phone}
                      aria-describedby={fieldErrors.phone ? "quick-contact-phone-error" : undefined}
                      required
                      className={cn("h-12", fieldErrors.phone && "border-destructive focus:ring-destructive/30")}
                      value={formData.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                    />
                    {fieldErrors.phone && (
                      <p
                        id="quick-contact-phone-error"
                        role="alert"
                        className="text-sm text-destructive mt-1"
                      >
                        {fieldErrors.phone}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="quick-contact-message" className="sr-only">
                      Project description
                    </label>
                    <Textarea
                      id="quick-contact-message"
                      name="message"
                      autoComplete="off"
                      placeholder="Tell us about your project..."
                      aria-label="Project description"
                      aria-invalid={!!fieldErrors.message}
                      aria-describedby={fieldErrors.message ? "quick-contact-message-error" : undefined}
                      rows={4}
                      className={cn("resize-none", fieldErrors.message && "border-destructive focus:ring-destructive/30")}
                      value={formData.message}
                      onChange={(e) => updateField("message", e.target.value)}
                    />
                    {fieldErrors.message && (
                      <p
                        id="quick-contact-message-error"
                        role="alert"
                        className="text-sm text-destructive mt-1"
                      >
                        {fieldErrors.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-12 text-base"
                    disabled={isSubmitting}
                    aria-busy={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        Submit Inquiry
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-3 text-center">
                    Prefer to talk directly?
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="secondary" asChild>
                      <a href={telLink}>
                        <Phone className="h-4 w-4" />
                        {displayPhone}
                      </a>
                    </Button>
                    <Button variant="secondary" asChild>
                      <Link to="/contact">
                        <Mail className="h-4 w-4" />
                        Email Us
                      </Link>
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveCTA;
