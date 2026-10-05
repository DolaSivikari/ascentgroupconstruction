import { useIntakeEnabled } from "@/hooks/useIntakeEnabled";
import { InquiryForm } from "@/components/inquiry/InquiryForm";
import { usePageContent } from "@/hooks/usePageContent";
import contentModule from "@/content/pages/contact";
import { PUBLIC_CONTACT_PAGE_SETTINGS_COLUMNS } from "@/constants/siteSettingsColumns";
import { useState, useRef } from "react";
import { z } from "zod";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { PageHero } from "@/components/shared/PageHero";
import { Card } from "@/design-system/components/Card";
import { Section } from "@/components/sections/Section";
import {
  TrustRibbon,
  FAQAccordion,
  SectionHeader,
} from "@/design-system/components";
import { useSharedFaqs } from "@/hooks/useSharedContent";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { COMPANY_PHONE, SITE_URL } from "@/constants/company";
import { trackSavedFormSubmit } from "@/lib/analytics";
import { trackABTestConversion } from "@/hooks/useABTest";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { Textarea } from "@/ui/Textarea";
import { Label } from "@/components/ui/label";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Loader2,
  ArrowRight,
  FileText,
  Calculator,
  CheckCircle,
  Zap,
  Gift,
  ShieldCheck,
} from "lucide-react";
import { useSettingsData } from "@/hooks/useSettingsData";
import { RippleEffect } from "@/components/shared/RippleEffect";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { TrustedPartners } from "@/components/partners/TrustedPartners";

import { Link } from "react-router-dom";
import { CTA_TEXT } from "@/design-system/constants";
import { mainPageHeroes } from "@/data/hero-images";

// Input validation schema
const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[\p{L}\p{M}\s.'-]+$/u, "Name contains invalid characters"),
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters"),
  phone: z
    .string()
    .trim()
    .max(20, "Phone must be less than 20 characters")
    .regex(/^[0-9\s()+-]*$/, "Phone contains invalid characters")
    .optional()
    .or(z.literal("")),
  company: z
    .string()
    .trim()
    .max(100, "Company name must be less than 100 characters")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be less than 2000 characters"),
  consent: z.boolean().refine((val) => val === true, {
    message: "You must consent to be contacted",
  }),
  newsletterConsent: z.boolean().optional(),
});

const Contact = () => {
  const contactFaqs = useSharedFaqs("contactFaqs");
  const c = usePageContent(contentModule);
  const intakeV2 = useIntakeEnabled();

  const { toast } = useToast();
  const { data: contactSettings, loading } = useSettingsData(
    "contact_page_settings",
    PUBLIC_CONTACT_PAGE_SETTINGS_COLUMNS,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
    honeypot: "",
    consent: false,
    newsletterConsent: false,
  });
  const [lastSubmitTime, setLastSubmitTime] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRef.current) return;
    const now = Date.now();
    if (now - lastSubmitTime < 10000) {
      toast({ title: c.f001, description: c.f002, variant: "destructive" });
      return;
    }
    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      const validatedData = contactSchema.parse(formData);

      const { data, error } = await supabase.functions.invoke("submit-form", {
        body: {
          formType: "contact",
          data: {
            name: validatedData.name,
            email: validatedData.email,
            phone: validatedData.phone,
            company: validatedData.company,
            message: validatedData.message,
            submission_type: "contact",
            consent_timestamp: new Date().toISOString(),
            newsletter_consent: validatedData.newsletterConsent || false,
          },
          honeypot: formData.honeypot,
        },
      });

      if (error) {
        if (error.message?.includes("Rate limit exceeded")) {
          toast({ title: c.f003, description: c.f004, variant: "destructive" });
          return;
        }
        throw error;
      }
      if (data && (data as { success?: boolean }).success === false) {
        throw new Error("The submission was not accepted. Please try again.");
      }

      trackSavedFormSubmit("contact_form", data, {
        has_phone: !!validatedData.phone,
        has_company: !!validatedData.company,
        newsletter_opt_in: validatedData.newsletterConsent,
      });

      let notificationWarning = false;
      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("Email notification timeout")),
            10000,
          ),
        );
        await Promise.race([
          supabase.functions.invoke("send-contact-notification", {
            body: {
              name: validatedData.name,
              email: validatedData.email,
              phone: validatedData.phone,
              company: validatedData.company,
              message: validatedData.message,
              submissionType: "Contact Form",
            },
          }),
          timeoutPromise,
        ]);

        // Review requests are sent by staff from the admin area, not triggered
        // by anonymous form submissions.
      } catch (emailError) {
        notificationWarning = true;
        console.error("Email notification failed:", emailError);
      }

      await trackABTestConversion("homepage-hero-2024", 1);

      toast({
        title: c.f005,
        description: notificationWarning
          ? "Your request was saved, but email notifications are delayed. Our team will still follow up."
          : "We'll get back to you within 24 hours. Check your email for confirmation.",
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        message: "",
        honeypot: "",
        consent: false,
        newsletterConsent: false,
      });
      setLastSubmitTime(now);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.issues[0];
        toast({
          title: c.f006,
          description: firstError.message,
          variant: "destructive",
        });
      } else {
        toast({ title: c.f007, description: c.f008, variant: "destructive" });
      }
    } finally {
      setIsSubmitting(false);
      isSubmittingRef.current = false;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const target = e.target as HTMLInputElement;
    const value = target.type === "checkbox" ? target.checked : target.value;
    setFormData({ ...formData, [target.name]: value });
  };

  // Fallback values
  const officeAddress =
    contactSettings?.office_address ||
    "2 Jody Ave\nNorth York, ON M3N 1H1\nCanada";
  const mainPhone = contactSettings?.main_phone || COMPANY_PHONE;
  const generalEmail =
    contactSettings?.general_email || "info@ascentgroupconstruction.com";
  const projectsEmail =
    contactSettings?.projects_email || "projects@ascentgroupconstruction.com";
  const weekdayHours =
    contactSettings?.weekday_hours || "Monday - Friday: 8:00 AM - 6:00 PM";
  const saturdayHours =
    contactSettings?.saturday_hours || "Saturday: 9:00 AM - 2:00 PM";
  const sundayHours = contactSettings?.sunday_hours || "Sunday: Closed";
  const mapEmbedUrl =
    contactSettings?.map_embed_url ||
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d184551.90977289474!2d-79.51814069999999!3d43.7184038!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d4cb90d7c63ba5%3A0x323555502ab4c477!2sToronto%2C%20ON!5e0!3m2!1sen!2sca!4v1234567890123!5m2!1sen!2sca";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title={c.f009}
        description={c.f010}
        canonical={`${SITE_URL}/contact`}
      />
      <Navigation />

      <PageHero
        title={c.f011}
        description={c.f012}
        image={mainPageHeroes.contact}
        imageAlt={c.f013}
        height="medium"
        primaryCta={{ text: CTA_TEXT.project, href: "/estimate" }}
        breadcrumbs={[{ label: c.f014, href: "/" }, { label: c.f015 }]}
        badges={[
          { icon: Zap, text: c.f016 },
          { icon: Gift, text: c.f017 },
          { icon: ShieldCheck, text: c.f018 },
        ]}
      />

      <TrustRibbon />

      {/* Contact Pathway Guidance */}
      <Section size="tight" disableAnimation>
        <div className="max-w-4xl mx-auto">
          <p className="text-sm text-muted-foreground text-center mb-6">
            {c.f019}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card
              variant="interactive"
              size="sm"
              className="text-center border-primary/30 bg-primary/5"
            >
              <Link to="/contact" className="block">
                <Mail className="w-5 h-5 text-primary mx-auto mb-2" />
                <p className="text-sm font-bold text-primary mb-1">{c.f020}</p>
                <p className="text-xs text-muted-foreground">{c.f021}</p>
              </Link>
            </Card>
            <Card variant="interactive" size="sm" className="text-center">
              <Link to="/estimate" className="block">
                <Calculator className="w-5 h-5 text-foreground mx-auto mb-2" />
                <p className="text-sm font-bold mb-1">{c.f022}</p>
                <p className="text-xs text-muted-foreground">{c.f023}</p>
              </Link>
            </Card>
            <Card variant="interactive" size="sm" className="text-center">
              <Link to="/submit-rfp" className="block">
                <FileText className="w-5 h-5 text-foreground mx-auto mb-2" />
                <p className="text-sm font-bold mb-1">{c.f024}</p>
                <p className="text-xs text-muted-foreground">{c.f025}</p>
              </Link>
            </Card>
          </div>
        </div>
      </Section>

      {/* Contact Form + Info Sidebar */}
      <Section size="major" disableAnimation>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form — 2 columns */}
            <div className="lg:col-span-2">
              <Card variant="elevated" size="lg">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">{c.f026}</h2>
                  <p className="text-muted-foreground">{c.f027}</p>
                </div>
                {intakeV2 ? (
                  <InquiryForm />
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-base">
                          {c.f028}
                        </Label>
                        <Input
                          id="name"
                          name={"name"}
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="John Smith"
                          className="h-12 text-base"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-base">
                          {c.f030}
                        </Label>
                        <Input
                          id="email"
                          name={"email"}
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="john@example.com"
                          className="h-12 text-base"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-base">
                          {c.f032}
                        </Label>
                        <Input
                          id="phone"
                          name={"phone"}
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="(647) 123-4567"
                          className="h-12 text-base"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company" className="text-base">
                          {c.f034}
                        </Label>
                        <Input
                          id="company"
                          name={"company"}
                          value={formData.company}
                          onChange={handleChange}
                          placeholder="Your Company"
                          className="h-12 text-base"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="message"
                        className="text-base font-semibold"
                      >
                        {c.f036}
                      </Label>
                      <Textarea
                        id="message"
                        name={"message"}
                        value={formData.message}
                        onChange={handleChange}
                        required
                        placeholder="Tell us about your project requirements, timeline, and budget..."
                        className="min-h-[160px] text-base"
                      />
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          id="consent"
                          name={"consent"}
                          checked={formData.consent}
                          onChange={handleChange}
                          required
                          className="mt-1"
                        />
                        <Label
                          htmlFor="consent"
                          className="text-sm leading-relaxed cursor-pointer"
                        >
                          {c.f039}
                        </Label>
                      </div>
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          id="newsletterConsent"
                          name={"newsletterConsent"}
                          checked={formData.newsletterConsent}
                          onChange={handleChange}
                          className="mt-1"
                        />
                        <Label
                          htmlFor="newsletterConsent"
                          className="text-sm leading-relaxed cursor-pointer"
                        >
                          {c.f041}
                          <Link
                            to="/privacy"
                            className="text-primary underline hover:no-underline"
                          >
                            {c.f042}
                          </Link>
                        </Label>
                      </div>
                    </div>

                    {/* Honeypot */}
                    <div
                      style={{ position: "absolute", left: "-9999px" }}
                      aria-hidden="true"
                    >
                      <Label htmlFor="website">{c.f043}</Label>
                      <Input
                        id="website"
                        name={"honeypot"}
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={formData.honeypot}
                        onChange={handleChange}
                      />
                    </div>

                    <MagneticButton className="w-full">
                      <RippleEffect className="w-full">
                        <Button
                          type="submit"
                          size="lg"
                          className="w-full h-14 text-lg gap-3"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              {c.f045}
                            </>
                          ) : (
                            <>
                              {c.f046}
                              <ArrowRight className="w-5 h-5" />
                            </>
                          )}
                        </Button>
                      </RippleEffect>
                    </MagneticButton>

                    {/* Trust Badge */}
                    <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-2">
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-primary" />
                        {c.f047}
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-primary" />
                        {c.f048}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground text-center">
                      {c.f049}
                    </p>
                  </form>
                )}
              </Card>
            </div>

            {/* Contact Info Sidebar */}
            <div className="space-y-6">
              <Card variant="default" size="md">
                <h3 className="text-lg font-bold mb-4">{c.f050}</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">{c.f051}</p>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {officeAddress}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">{c.f052}</p>
                      <a
                        href={`tel:${mainPhone.replace(/\s/g, "")}`}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {mainPhone}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">{c.f053}</p>
                      <a
                        href={`mailto:${generalEmail}`}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {generalEmail}
                      </a>
                      {projectsEmail && projectsEmail !== generalEmail && (
                        <a
                          href={`mailto:${projectsEmail}`}
                          className="text-sm text-muted-foreground hover:text-primary transition-colors block mt-1"
                        >
                          {projectsEmail}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              <Card variant="default" size="md">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  {c.f054}
                </h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>{weekdayHours}</p>
                  <p>{saturdayHours}</p>
                  <p>{sundayHours}</p>
                </div>
              </Card>

              {/* What to Expect */}
              <Card
                variant="default"
                size="md"
                className="bg-primary/5 border-primary/20"
              >
                <h3 className="text-lg font-bold mb-3">{c.f055}</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    {c.f056}
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    {c.f057}
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    {c.f058}
                  </li>
                </ul>
              </Card>

              <Card variant="default" size="md" className="bg-muted/30">
                <p className="text-sm font-medium mb-2">{c.f059}</p>
                <p className="text-xs text-muted-foreground mb-3">{c.f060}</p>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link to="/submit-rfp">{c.f061}</Link>
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </Section>

      {/* Map Section */}
      <section className="py-20 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{c.f062}</h2>
            <p className="text-lg text-muted-foreground">{c.f063}</p>
          </div>
          <div className="relative aspect-video bg-card rounded-[var(--radius-lg)] overflow-hidden shadow-[var(--shadow-lg)] border border-border">
            <iframe
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={c.f064}
            />
          </div>
        </div>
      </section>

      {/* People Also Ask */}
      <Section size="major" className="bg-muted/30">
        <SectionHeader
          title={c.f065}
          description={c.f066}
          badge="FAQ"
          maxWidth="md"
        />
        <div className="max-w-3xl mx-auto">
          <FAQAccordion faqs={contactFaqs} />
        </div>
      </Section>

      <TrustedPartners variant="simple" />

      <Footer />
    </div>
  );
};

export default Contact;
