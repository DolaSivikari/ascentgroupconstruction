import { useIntakeEnabled } from "@/hooks/useIntakeEnabled";
import { useInquirySubmit } from "@/hooks/useInquirySubmit";
import { rfpAttachmentPath } from "@/lib/inbox/model";
import { usePageContent } from "@/hooks/usePageContent";
import contentModule from "@/content/pages/submit-rfp";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/ui/Button";
import { Card, CardContent } from "@/design-system/components/Card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Send,
  Home,
  Phone,
  Copy,
  Check,
  Shield,
} from "lucide-react";
import {
  rfpSubmissionSchema,
  type RFPSubmission,
} from "@/schemas/rfp-validation";
import { RFPStep1Company } from "@/components/rfp/RFPStep1Company";
import { RFPStep2Project } from "@/components/rfp/RFPStep2Project";
import { RFPStep3Timeline } from "@/components/rfp/RFPStep3Timeline";
import { trackSavedFormSubmit } from "@/lib/analytics";
import { trackABTestConversion } from "@/hooks/useABTest";
import { RFPStep4Scope } from "@/components/rfp/RFPStep4Scope";
import { PageHero } from "@/components/shared/PageHero";
import { resourceHeroes } from "@/data/hero-images";
import { PhoneLink } from "@/components/shared/PhoneLink";
import { AscentEmailLink } from "@/components/EmailLink";
import { uploadRfpAttachments } from "@/lib/rfpAttachments";
import { useAdminRoleCheck } from "@/hooks/useAdminRoleCheck";

const stepFields: Record<number, (keyof RFPSubmission)[]> = {
  1: ["company_name", "contact_name", "email", "phone"],
  2: [
    "project_name",
    "project_type",
    "project_location",
    "estimated_value_range",
  ],
  3: ["estimated_timeline", "delivery_method"],
  4: ["scope_of_work", "consent"],
};

const validateCurrentStep = (data: RFPSubmission, currentStep: number) => {
  const result = rfpSubmissionSchema
    .pick(
      Object.fromEntries(
        stepFields[currentStep].map((field) => [field, true]),
      ) as Record<keyof RFPSubmission, true>,
    )
    .safeParse(data);

  return result.success ? [] : result.error.issues;
};

export default function SubmitRFPNew() {
  const intakeV2 = useIntakeEnabled();
  const submitInquiry = useInquirySubmit();
  const c = usePageContent(contentModule);

  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [submissionRef, setSubmissionRef] = useState<string>("");
  const [submittedAt, setSubmittedAt] = useState<Date | null>(null);
  const [refCopied, setRefCopied] = useState(false);
  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([]);
  const [honeypot, setHoneypot] = useState("");
  const uploadedAttachmentsRef = useRef(new Map<File, string>());
  const formStartedAtRef = useRef<number>(Date.now());
  const { isAdmin } = useAdminRoleCheck();

  const form = useForm<RFPSubmission>({
    defaultValues: {
      company_name: "",
      contact_name: "",
      email: "",
      phone: "",
      title: "",
      project_name: "",
      project_type: undefined,
      project_location: "",
      estimated_value_range: undefined,
      estimated_timeline: "",
      project_start_date: "",
      delivery_method: undefined,
      bonding_required: false,
      prequalification_complete: false,
      scope_of_work: "",
      additional_requirements: "",
      plans_available: false,
      site_visit_required: false,
      consent: false,
    },
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const steps = [
    { number: 1, title: c.f001, component: RFPStep1Company },
    { number: 2, title: c.f002, component: RFPStep2Project },
    { number: 3, title: c.f003, component: RFPStep3Timeline },
    { number: 4, title: c.f004, component: RFPStep4Scope },
  ];

  const handleNext = () => {
    const fieldsToValidate = stepFields[currentStep];
    const issues = validateCurrentStep(form.getValues(), currentStep);

    form.clearErrors(fieldsToValidate);

    if (issues.length === 0) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      issues.forEach((issue) => {
        const field = issue.path[0] as keyof RFPSubmission | undefined;
        if (field && fieldsToValidate.includes(field)) {
          form.setError(field, { type: "manual", message: issue.message });
        }
      });
      const firstField = issues[0]?.path[0] as keyof RFPSubmission | undefined;
      if (firstField) form.setFocus(firstField);
      toast.error("Please fill in all required fields correctly");
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const uploadAttachments = () =>
    uploadRfpAttachments(
      attachmentFiles,
      uploadedAttachmentsRef.current,
      async (path, file) =>
        supabase.storage.from("rfp-attachments").upload(path, file),
    );

  const handleSubmit = async (data: RFPSubmission) => {
    setSubmitting(true);

    try {
      // Upload attachments first
      const attachmentUrls = await uploadAttachments();

      // Submit through spam-filtered edge function (honeypot + time-gate + link/dup checks)
      const submissionData = {
        company_name: data.company_name,
        contact_name: data.contact_name,
        email: data.email,
        phone: data.phone,
        title: data.title || undefined,
        project_name: data.project_name,
        project_type: data.project_type,
        project_location: data.project_location,
        estimated_value_range: data.estimated_value_range,
        estimated_timeline: data.estimated_timeline,
        project_start_date: data.project_start_date || undefined,
        scope_of_work: data.scope_of_work,
        delivery_method: data.delivery_method,
        bonding_required: data.bonding_required,
        prequalification_complete: data.prequalification_complete,
        additional_requirements: data.additional_requirements || undefined,
        plans_available: data.plans_available,
        site_visit_required: data.site_visit_required,
        attachment_urls: attachmentUrls.length > 0 ? attachmentUrls : undefined,
      };

      const { data: invokeResponse, error: insertError } = intakeV2
        ? {
            data: await submitInquiry(
              {
                inquiry_type: "rfp",
                contact_name: data.contact_name,
                email: data.email,
                phone: data.phone,
                company: data.company_name,
                project_name: data.project_name,
                project_location: data.project_location,
                message: data.scope_of_work,
                consent_given: data.consent,
                attachment_paths: attachmentUrls.map((path) =>
                  rfpAttachmentPath(path, import.meta.env.VITE_SUPABASE_URL),
                ),
                details: { ...submissionData, attachment_urls: undefined },
              },
              honeypot,
              formStartedAtRef.current,
            ),
            error: null,
          }
        : await supabase.functions.invoke("submit-form", {
            body: {
              formType: "rfp",
              honeypot,
              startedAt: formStartedAtRef.current,
              data: submissionData,
            },
          });

      if (insertError) throw insertError;
      if (invokeResponse && (invokeResponse as any).success === false) {
        throw new Error((invokeResponse as any).message || "Submission failed");
      }

      const newId = ((invokeResponse as any)?.id as string) || "";
      const createdAtRaw = (invokeResponse as any)?.created_at as
        | string
        | undefined;
      const createdAt = createdAtRaw ? new Date(createdAtRaw) : new Date();
      const refId = intakeV2
        ? String((invokeResponse as { reference_code: string }).reference_code)
        : `RFP-${(newId || "").slice(0, 8).toUpperCase()}`;

      setSubmissionId(newId);
      setSubmissionRef(refId);
      setSubmittedAt(createdAt);

      trackSavedFormSubmit("rfp_form", invokeResponse);

      // Notifications are derived from the stored RFP by the Edge Function.
      // A saved submission remains successful even if the notification is queued/failed.
      const sendStoredRecordNotifications = async () => {
        const { error } = await supabase.functions.invoke("send-rfp-emails", {
          body: { rfpId: newId },
        });
        if (error) throw error;
      };

      let notificationWarning = false;
      try {
        if (!intakeV2) await sendStoredRecordNotifications();
      } catch (emailError) {
        notificationWarning = true;
        console.error(
          "Stored-record RFP email notification failed:",
          emailError,
        );
      }

      toast.success("RFP Submitted Successfully", {
        description: notificationWarning
          ? `Saved as ${refId}. We received your submission; confirmation email delivery is pending.`
          : `Saved as ${refId}. We'll review and respond within 2 business days.`,
      });

      // Phase 3: Track A/B test conversion
      await trackABTestConversion("homepage-hero-2024", 5);

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error("Submission Failed", {
        description:
          error.message || "Please try again or contact us directly.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const copyRef = async () => {
    if (!submissionRef) return;
    try {
      await navigator.clipboard.writeText(submissionRef);
      setRefCopied(true);
      setTimeout(() => setRefCopied(false), 2000);
    } catch {
      toast.error("Could not copy reference ID");
    }
  };

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <SEO
        title={c.f005}
        description={c.f006}
        keywords="building envelope RFP, facade remediation bid, construction proposal, specialty contractor quote, envelope restoration RFP, GTA construction"
      />
      <Navigation />

      <PageHero
        title={c.f007}
        description={c.f008}
        image={resourceHeroes["submit-rfp"]}
        imageAlt={c.f009}
        height="small"
        breadcrumbs={[{ label: c.f010, href: "/" }, { label: c.f011 }]}
      />

      {submitted ? (
        /* Success State — in-place, no redirect */
        <main className="flex-1 py-16">
          <div className="container mx-auto px-4 max-w-2xl animate-fade-in-up">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-secondary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-3 text-primary">
                {c.f012}
              </h2>
              <p className="text-lg text-muted-foreground mb-6 max-w-lg mx-auto">
                {c.f013}
              </p>
            </div>

            {/* Reference ID card */}
            {submissionRef && (
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                        {c.f014}
                      </p>
                      <p className="text-2xl font-mono font-bold text-primary tracking-wider">
                        {submissionRef}
                      </p>
                      {submittedAt && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {c.f015}
                          {submittedAt.toLocaleString()}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="secondary"
                      onClick={copyRef}
                      className="shrink-0"
                    >
                      {refCopied ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          {c.f016}
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          {c.f017}
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">{c.f018}</p>
                </CardContent>
              </Card>
            )}

            {/* Timeline card */}
            <Card className="mb-6 border-secondary/20 bg-secondary/5">
              <CardContent className="p-6">
                <h3 className="font-bold text-primary mb-4 uppercase text-xs tracking-wider">
                  {c.f019}
                </h3>
                <ol className="space-y-3">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                      1
                    </span>
                    <div>
                      <p className="font-semibold text-sm">{c.f020}</p>
                      <p className="text-sm text-muted-foreground">{c.f021}</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                      2
                    </span>
                    <div>
                      <p className="font-semibold text-sm">{c.f022}</p>
                      <p className="text-sm text-muted-foreground">{c.f023}</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                      3
                    </span>
                    <div>
                      <p className="font-semibold text-sm">{c.f024}</p>
                      <p className="text-sm text-muted-foreground">{c.f025}</p>
                    </div>
                  </li>
                </ol>
              </CardContent>
            </Card>

            {attachmentFiles.length > 0 && (
              <p className="text-sm text-muted-foreground text-center mb-2">
                {attachmentFiles.length} {c.f026}
                {attachmentFiles.length > 1 ? "s" : ""} {c.f027}
              </p>
            )}
            <p className="text-sm text-muted-foreground text-center mb-8">
              {c.f028}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link to="/">
                  <Home className="w-4 h-4 mr-2" />
                  {c.f029}
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link to="/contact">
                  <Phone className="w-4 h-4 mr-2" />
                  {c.f030}
                </Link>
              </Button>
              {isAdmin && submissionId && (
                <Button asChild variant="secondary">
                  <Link to={`/admin/inbox?tab=rfp&highlight=${submissionId}`}>
                    <Shield className="w-4 h-4 mr-2" />
                    {c.f031}
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </main>
      ) : (
        <>
          {/* Enhanced Progress */}
          <section className="py-8 bg-background">
            <div className="container mx-auto px-4 max-w-4xl">
              <div className="flex justify-center gap-2 sm:gap-4 mb-8">
                {steps.map((step) => (
                  <div
                    key={step.number}
                    aria-current={step.number === currentStep ? "step" : undefined}
                    className={`flex min-w-0 flex-1 flex-col items-center text-center transition-all ${step.number === currentStep ? "scale-110" : "text-muted-foreground"}`}
                  >
                    <div
                      className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-2 ${step.number === currentStep ? "bg-secondary text-secondary-foreground shadow-lg" : step.number < currentStep ? "bg-secondary text-secondary-foreground" : "bg-muted text-foreground"}`}
                    >
                      {step.number < currentStep ? (
                        <CheckCircle2 className="w-8 h-8" />
                      ) : (
                        step.number
                      )}
                    </div>
                    <span className="text-xs sm:text-sm font-medium">{step.title}</span>
                  </div>
                ))}
              </div>
              <div className="max-w-2xl mx-auto mb-8">
                <div className="flex justify-between text-sm mb-2">
                  <span>
                    {c.f032}
                    {currentStep} {c.f033}
                    {totalSteps}
                  </span>
                  <span>
                    {Math.round(progress)}
                    {c.f034}
                  </span>
                </div>
                <Progress
                  aria-label="RFP submission progress"
                  value={progress}
                  className="h-3 bg-primary-foreground/20"
                />
              </div>
            </div>
          </section>

          <main className="flex-1 py-12">
            <div className="container mx-auto px-4 max-w-4xl">
              {/* Form */}
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6 animate-fade-in-up"
                noValidate
              >
                {/* Honeypot — hidden from users, attractive to bots */}
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
                  <label htmlFor="rfp-company-website">{c.f035}</label>
                  <input
                    id="rfp-company-website"
                    name={"company_website"}
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>
                {currentStep === 4 ? (
                  <RFPStep4Scope
                    form={form}
                    onFilesChange={setAttachmentFiles}
                  />
                ) : (
                  <CurrentStepComponent form={form} />
                )}

                {/* Navigation Buttons */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      {currentStep > 1 ? (
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={handleBack}
                        >
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          {c.f037}
                        </Button>
                      ) : (
                        <div />
                      )}

                      {currentStep < totalSteps ? (
                        <Button
                          type="button"
                          onClick={handleNext}
                          disabled={submitting}
                        >
                          {c.f038}
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      ) : (
                        <Button type="submit" disabled={submitting}>
                          {submitting ? (
                            "Submitting..."
                          ) : (
                            <>
                              {c.f039}
                              <ArrowRight className="ml-2 w-4 h-4" />
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </form>

              {/* Help Section */}
              <Card
                className="mt-8 border-secondary/20 bg-secondary/5 animate-fade-in-up"
                style={{ animationDelay: "0.2s" }}
              >
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-3">{c.f040}</h3>
                  <p className="text-muted-foreground mb-4">{c.f041}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-semibold mb-1">{c.f042}</p>
                      <p className="text-muted-foreground">
                        <PhoneLink showIcon={false} />
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">{c.f043}</p>
                      <p className="text-muted-foreground">
                        <AscentEmailLink showIcon={false} />
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </>
      )}

      <Footer />
    </div>
  );
}
