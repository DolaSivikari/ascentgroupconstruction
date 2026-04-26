import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/ui/Button";
import { Card, CardContent } from "@/design-system/components/Card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowRight, ArrowLeft, CheckCircle2, Send, Home, Phone, Copy, Check, Shield } from "lucide-react";
import { rfpSubmissionSchema, type RFPSubmission } from "@/schemas/rfp-validation";
import { RFPStep1Company } from "@/components/rfp/RFPStep1Company";
import { RFPStep2Project } from "@/components/rfp/RFPStep2Project";
import { RFPStep3Timeline } from "@/components/rfp/RFPStep3Timeline";
import { trackConversion } from "@/lib/analytics";
import { trackABTestConversion } from "@/hooks/useABTest";
import { RFPStep4Scope } from "@/components/rfp/RFPStep4Scope";
import { PageHero } from "@/components/shared/PageHero";
import { resourceHeroes } from "@/data/hero-images";
import { PhoneLink } from "@/components/shared/PhoneLink";
import { AscentEmailLink } from "@/components/EmailLink";
import { useAdminRoleCheck } from "@/hooks/useAdminRoleCheck";

const ESTIMATING_EMAIL = "estimating@ascentgroupconstruction.com";

export default function SubmitRFPNew() {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [submissionRef, setSubmissionRef] = useState<string>("");
  const [submittedAt, setSubmittedAt] = useState<Date | null>(null);
  const [refCopied, setRefCopied] = useState(false);
  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([]);
  const [honeypot, setHoneypot] = useState("");
  const formStartedAtRef = useRef<number>(Date.now());
  const { isAdmin } = useAdminRoleCheck();

  const form = useForm<RFPSubmission>({
    resolver: zodResolver(rfpSubmissionSchema),
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
    { number: 1, title: "Company Info", component: RFPStep1Company },
    { number: 2, title: "Project Details", component: RFPStep2Project },
    { number: 3, title: "Timeline", component: RFPStep3Timeline },
    { number: 4, title: "Scope of Work", component: RFPStep4Scope },
  ];

  const handleNext = async () => {
    let fieldsToValidate: (keyof RFPSubmission)[] = [];

    switch (currentStep) {
      case 1:
        fieldsToValidate = ["company_name", "contact_name", "email", "phone"];
        break;
      case 2:
        fieldsToValidate = ["project_name", "project_type", "project_location", "estimated_value_range"];
        break;
      case 3:
        fieldsToValidate = ["estimated_timeline", "delivery_method"];
        break;
      case 4:
        fieldsToValidate = ["scope_of_work", "consent"];
        break;
    }

    const isValid = await form.trigger(fieldsToValidate);

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      toast.error("Please fill in all required fields correctly");
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const uploadAttachments = async (): Promise<string[]> => {
    if (attachmentFiles.length === 0) return [];

    const uploadedUrls: string[] = [];

    for (const file of attachmentFiles) {
      const timestamp = Date.now();
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const filePath = `${timestamp}-${safeName}`;

      const { error } = await supabase.storage
        .from("rfp-attachments")
        .upload(filePath, file);

      if (error) {
        console.error("File upload error:", error);
        continue;
      }

      uploadedUrls.push(filePath);
    }

    return uploadedUrls;
  };

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

      const { data: invokeResponse, error: insertError } = await supabase.functions.invoke(
        "submit-form",
        {
          body: {
            formType: "rfp",
            honeypot,
            startedAt: formStartedAtRef.current,
            data: submissionData,
          },
        },
      );

      if (insertError) throw insertError;
      if (invokeResponse && (invokeResponse as any).success === false) {
        throw new Error((invokeResponse as any).message || "Submission failed");
      }

      const newId = ((invokeResponse as any)?.id as string) || "";
      const createdAtRaw = (invokeResponse as any)?.created_at as string | undefined;
      const createdAt = createdAtRaw ? new Date(createdAtRaw) : new Date();
      const refId = `RFP-${(newId || "").slice(0, 8).toUpperCase()}`;

      setSubmissionId(newId);
      setSubmissionRef(refId);
      setSubmittedAt(createdAt);

      // Send notifications: PRIMARY = built-in transactional email, FALLBACK = legacy Resend function
      const sendViaBuiltIn = async () => {
        const customerPayload = {
          templateName: "rfp-customer-confirmation",
          recipientEmail: data.email,
          idempotencyKey: `rfp-customer-${newId}`,
          templateData: {
            contactName: data.contact_name,
            projectName: data.project_name,
            projectType: data.project_type,
            estimatedValueRange: data.estimated_value_range,
            companyName: data.company_name,
            referenceId: refId,
          },
        };
        const internalPayload = {
          templateName: "rfp-internal-notification",
          recipientEmail: ESTIMATING_EMAIL,
          idempotencyKey: `rfp-internal-${newId}`,
          templateData: {
            referenceId: refId,
            rfpId: newId,
            companyName: data.company_name,
            contactName: data.contact_name,
            email: data.email,
            phone: data.phone,
            projectName: data.project_name,
            projectType: data.project_type,
            projectLocation: data.project_location,
            estimatedValueRange: data.estimated_value_range,
            estimatedTimeline: data.estimated_timeline,
            deliveryMethod: data.delivery_method,
            scopeOfWork: data.scope_of_work,
            attachmentsCount: attachmentFiles.length,
            submittedAt: createdAt.toLocaleString(),
          },
        };
        const [c, i] = await Promise.all([
          supabase.functions.invoke("send-transactional-email", { body: customerPayload }),
          supabase.functions.invoke("send-transactional-email", { body: internalPayload }),
        ]);
        if (c.error) throw c.error;
        if (i.error) throw i.error;
      };

      let notificationWarning = false;
      try {
        await sendViaBuiltIn();
      } catch (primaryError) {
        console.warn("Built-in email failed, falling back to Resend:", primaryError);
        try {
          await supabase.functions.invoke("send-rfp-notification", {
            body: {
              company_name: data.company_name,
              contact_name: data.contact_name,
              email: data.email,
              phone: data.phone,
              project_name: data.project_name,
              project_type: data.project_type,
              estimated_value_range: data.estimated_value_range,
              reference_id: refId,
              rfp_id: newId,
            },
          });
        } catch (fallbackError) {
          notificationWarning = true;
          console.error("Both email senders failed:", fallbackError);
        }
      }

      toast.success("RFP Submitted Successfully", {
        description: notificationWarning
          ? `Saved as ${refId}. Our team has been alerted internally and will follow up within 2 business days.`
          : `Saved as ${refId}. We'll review and respond within 2 business days.`,
      });

      // Phase 3: Track A/B test conversion
      await trackABTestConversion('homepage-hero-2024', 5);

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error("Submission Failed", {
        description: error.message || "Please try again or contact us directly.",
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
        title="Submit RFP - Request for Proposal | Ascent Group Construction"
        description="Submit your building envelope or restoration RFP to Ascent Group Construction. Multi-step form for commercial, multi-family, and institutional projects across Ontario."
        keywords="building envelope RFP, facade remediation bid, construction proposal, specialty contractor quote, envelope restoration RFP, GTA construction"
      />
      <Navigation />

      <PageHero
        title="Submit Your RFP"
        description="Complete our 4-step form to receive a detailed construction proposal"
        image={resourceHeroes["submit-rfp"]}
        imageAlt="Submit your construction RFP"
        height="small"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Submit RFP" }
        ]}
      />

      {submitted ? (
        /* Success State — in-place, no redirect */
        <main className="flex-1 py-16">
          <div className="container mx-auto px-4 max-w-2xl animate-fade-in-up">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-secondary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-3 text-primary">RFP Received</h2>
              <p className="text-lg text-muted-foreground mb-6 max-w-lg mx-auto">
                Thank you for your proposal. Our estimating team will review and respond within 2 business days.
              </p>
            </div>

            {/* Reference ID card */}
            {submissionRef && (
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Reference ID</p>
                      <p className="text-2xl font-mono font-bold text-primary tracking-wider">{submissionRef}</p>
                      {submittedAt && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Submitted {submittedAt.toLocaleString()}
                        </p>
                      )}
                    </div>
                    <Button variant="secondary" onClick={copyRef} className="shrink-0">
                      {refCopied ? (<><Check className="w-4 h-4 mr-2" />Copied</>) : (<><Copy className="w-4 h-4 mr-2" />Copy ID</>)}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">
                    Please reference this ID in any follow-up correspondence with our team.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Timeline card */}
            <Card className="mb-6 border-secondary/20 bg-secondary/5">
              <CardContent className="p-6">
                <h3 className="font-bold text-primary mb-4 uppercase text-xs tracking-wider">What happens next</h3>
                <ol className="space-y-3">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">1</span>
                    <div>
                      <p className="font-semibold text-sm">Review (24–48 hours)</p>
                      <p className="text-sm text-muted-foreground">Our estimating team reviews your project requirements.</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">2</span>
                    <div>
                      <p className="font-semibold text-sm">Initial contact (within 2 business days)</p>
                      <p className="text-sm text-muted-foreground">We reach out to discuss details and clarify questions.</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">3</span>
                    <div>
                      <p className="font-semibold text-sm">Proposal & presentation</p>
                      <p className="text-sm text-muted-foreground">We prepare and walk you through a tailored proposal.</p>
                    </div>
                  </li>
                </ol>
              </CardContent>
            </Card>

            {attachmentFiles.length > 0 && (
              <p className="text-sm text-muted-foreground text-center mb-2">
                {attachmentFiles.length} file{attachmentFiles.length > 1 ? "s" : ""} uploaded successfully.
              </p>
            )}
            <p className="text-sm text-muted-foreground text-center mb-8">
              A confirmation has been sent to your email address.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link to="/"><Home className="w-4 h-4 mr-2" />Return Home</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link to="/contact"><Phone className="w-4 h-4 mr-2" />Contact Us</Link>
              </Button>
              {isAdmin && submissionId && (
                <Button asChild variant="secondary">
                  <Link to={`/admin/inbox?tab=rfp&highlight=${submissionId}`}>
                    <Shield className="w-4 h-4 mr-2" />View in Admin Inbox
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
          <div className="flex justify-center gap-4 mb-8">
            {steps.map((step) => (
              <div key={step.number} className={`flex flex-col items-center transition-all ${step.number === currentStep ? "scale-110" : step.number < currentStep ? "opacity-70" : "opacity-40"}`}>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${step.number === currentStep ? "bg-secondary text-secondary-foreground shadow-lg" : step.number < currentStep ? "bg-secondary/70 text-secondary-foreground" : "bg-primary-foreground/20"}`}>
                  {step.number < currentStep ? <CheckCircle2 className="w-8 h-8" /> : step.number}
                </div>
                <span className="text-sm font-medium">{step.title}</span>
              </div>
            ))}
          </div>
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex justify-between text-sm mb-2"><span>Step {currentStep} of {totalSteps}</span><span>{Math.round(progress)}% Complete</span></div>
            <Progress value={progress} className="h-3 bg-primary-foreground/20" />
          </div>
        </div>
      </section>

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Form */}
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 animate-fade-in-up" noValidate>
            {/* Honeypot — hidden from users, attractive to bots */}
            <div
              aria-hidden="true"
              style={{ position: "absolute", left: "-10000px", width: "1px", height: "1px", overflow: "hidden" }}
            >
              <label htmlFor="rfp-company-website">Company website (leave blank)</label>
              <input
                id="rfp-company-website"
                name="company_website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>
            {currentStep === 4 ? (
              <RFPStep4Scope form={form} onFilesChange={setAttachmentFiles} />
            ) : (
              <CurrentStepComponent form={form} />
            )}

            {/* Navigation Buttons */}
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  {currentStep > 1 ? (
                    <Button type="button" variant="secondary" onClick={handleBack}>
                      <ArrowLeft className="w-4 h-4 mr-2" />Back
                    </Button>
                  ) : (
                    <div />
                  )}

                  {currentStep < totalSteps ? (
                    <Button type="button" onClick={handleNext}>Next<ArrowRight className="ml-2 w-4 h-4" /></Button>
                  ) : (
                    <Button type="submit" disabled={submitting}>
                      {submitting ? "Submitting..." : (<>Submit RFP<ArrowRight className="ml-2 w-4 h-4" /></>)}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </form>

          {/* Help Section */}
          <Card className="mt-8 border-secondary/20 bg-secondary/5 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-3">Need Help?</h3>
              <p className="text-muted-foreground mb-4">Have questions about the RFP process or need assistance with your submission?</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><p className="font-semibold mb-1">📞 Call Us</p><p className="text-muted-foreground"><PhoneLink showIcon={false} /></p></div>
                <div><p className="font-semibold mb-1">📧 Email</p><p className="text-muted-foreground"><AscentEmailLink showIcon={false} /></p></div>
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
