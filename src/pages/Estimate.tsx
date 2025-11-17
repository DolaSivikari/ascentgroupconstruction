import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/ui/Button";
import { UnifiedCard } from "@/components/shared/UnifiedCard";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import EstimatorStep0 from "@/components/estimator/EstimatorStep0";
import EstimatorStep1 from "@/components/estimator/EstimatorStep1";
import EstimatorStep2Enhanced from "@/components/estimator/EstimatorStep2Enhanced";
import { QuoteRequestDialog } from "@/components/estimator/QuoteRequestDialog";
import { requiresQuote, getServiceMessage, isEstimatable } from "@/utils/estimator";
import EstimatorStep3 from "@/components/estimator/EstimatorStep3";
import EstimatorStep4 from "@/components/estimator/EstimatorStep4";
import EstimatorStep5 from "@/components/estimator/EstimatorStep5";
import { calculateEstimate, EstimateInput } from "@/utils/estimator";
import PaintCalculator from "@/components/PaintCalculator";
import { trackConversion } from "@/lib/analytics";
import { trackABTestConversion } from "@/hooks/useABTest";

// Validation schema for estimate form
const estimateSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().min(1, "Phone is required").max(20),
  address: z.string().trim().max(255).optional(),
  preferredContact: z.string().trim().max(50).optional(),
  notes: z.string().trim().max(2000).optional(),
  consent: z.boolean().refine((val) => val === true, { message: "You must consent to be contacted" }),
});

const Estimate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);
  const totalSteps = 6;

  const [formData, setFormData] = useState({
    // Step 0
    quoteType: "",
    company: "",
    role: "",
    nteBudget: "",
    scopeCategories: [] as string[],
    // Step 1
    service: "",
    sqft: "",
    stories: "",
    // Step 2
    prepComplexity: "",
    finishQuality: "",
    region: "",
    // Service-specific fields
    buildingType: "",
    accessibility: "",
    businessHoursConstraint: "",
    unitCount: "",
    includeCommonAreas: false,
    materialType: "",
    // Step 3
    scaffolding: "",
    colorConsultation: false,
    rushScheduling: false,
    warrantyExtension: false,
    siteCleanup: false,
    // Step 5
    name: "",
    email: "",
    phone: "",
    address: "",
    preferredContact: "",
    notes: "",
    consent: false,
    // Tracking
    source: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const utmSource = {
      utm_source: params.get('utm_source') || '',
      utm_medium: params.get('utm_medium') || '',
      utm_campaign: params.get('utm_campaign') || '',
      utm_term: params.get('utm_term') || '',
      utm_content: params.get('utm_content') || ''
    };
    setFormData(prev => ({ ...prev, source: JSON.stringify(utmSource) }));
  }, []);

  // Pre-select quote type from URL parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const typeParam = params.get('type');
    
    if (typeParam && ['specialty_prime', 'trade_package', 'emergency', 'general'].includes(typeParam)) {
      setFormData(prev => ({ ...prev, quoteType: typeParam }));
    }
  }, []);

  const [showQuoteDialog, setShowQuoteDialog] = useState(false);
  const [selectedServiceInfo, setSelectedServiceInfo] = useState<{
    name: string;
    message: ReturnType<typeof getServiceMessage>;
  } | null>(null);

  const handleInputChange = (field: string, value: any) => {
    // Special handling for service selection
    if (field === "service" && value) {
      // Check if this service requires a quote instead of estimate
      if (requiresQuote(value)) {
        const serviceMessage = getServiceMessage(value);
        const serviceName = value
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        
        setSelectedServiceInfo({
          name: serviceName,
          message: serviceMessage,
        });
        setShowQuoteDialog(true);
        
        // Don't update form data - keep service empty so user must pick estimatable service
        return;
      }
    }
    
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateCurrentEstimate = () => {
    if (!formData.service || !isEstimatable(formData.service) || !formData.sqft) {
      return {
        min: 0,
        max: 0,
        currency: "CAD",
        breakdown: {
          baseMin: 0,
          baseMax: 0,
          prepMultiplier: 1,
          finishMultiplier: 1,
          storiesMultiplier: 1,
          regionalMultiplier: 1,
          addOnsMin: 0,
          addOnsMax: 0,
        },
        explanation: "",
      };
    }

    const estimateInput: EstimateInput = {
      service: formData.service as any,
      sqft: parseInt(formData.sqft) || 0,
      stories: formData.stories as "1" | "2" | "3_plus",
      prepComplexity: formData.prepComplexity as any,
      finishQuality: formData.finishQuality as any,
      region: formData.region as any,
      // Service-specific fields
      buildingType: formData.buildingType as any,
      accessibility: formData.accessibility as any,
      businessHoursConstraint: formData.businessHoursConstraint as any,
      unitCount: formData.unitCount as any,
      includeCommonAreas: formData.includeCommonAreas,
      materialType: formData.materialType as any,
      addOns: {
        scaffolding: formData.scaffolding as any,
        colorConsultation: formData.colorConsultation,
        rushScheduling: formData.rushScheduling,
        warrantyExtension: formData.warrantyExtension,
        siteCleanup: formData.siteCleanup,
      },
    };

    return calculateEstimate(estimateInput);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return formData.quoteType !== "";
      case 1:
        return (
          formData.service &&
          isEstimatable(formData.service) &&
          formData.sqft &&
          formData.stories
        );
      case 2:
        // Base fields required for all services
        const baseValid = formData.prepComplexity && formData.finishQuality && formData.region;
        
        // Service-specific required fields
        if (formData.service === "commercial_painting") {
          return Boolean(baseValid && formData.buildingType && formData.accessibility && formData.businessHoursConstraint);
        }
        if (formData.service === "condo_multi_unit_painting") {
          return Boolean(baseValid && formData.unitCount);
        }
        if (formData.service === "exterior_siding_cladding") {
          return Boolean(baseValid && formData.materialType);
        }
        
        // All other estimatable services just need base fields
        return Boolean(baseValid);
      case 3:
        return true; // Optional step
      case 4:
        return true; // Review step
      case 5:
        return true; // Add-ons
      case 6:
        return formData.name && formData.email && formData.phone;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceed() && currentStep < totalSteps) {
      if (currentStep === 0) {
        trackConversion('quote_form_started', { quote_type: formData.quoteType });
      }
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    if (!canProceed()) return;

    // Prevent duplicate submissions
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsSubmitting(true);

    const estimate = calculateCurrentEstimate();

    try {
      // Validate contact data
      const validatedData = estimateSchema.parse({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        preferredContact: formData.preferredContact,
        notes: formData.notes,
        consent: formData.consent,
      });

      // Sanitize and build message with validated data
      const sanitizedMessage = `
Estimate Request:
- Service: ${formData.service.replace(/[<>]/g, '')}
- Square Footage: ${formData.sqft.replace(/[<>]/g, '')}
- Stories: ${formData.stories.replace(/[<>]/g, '')}
- Prep Complexity: ${formData.prepComplexity.replace(/[<>]/g, '')}
- Finish Quality: ${formData.finishQuality.replace(/[<>]/g, '')}
- Region: ${formData.region.replace(/[<>]/g, '')}
- Estimated Range: $${estimate.min.toLocaleString()} - $${estimate.max.toLocaleString()} CAD
- Preferred Contact: ${validatedData.preferredContact || 'Not specified'}
- Additional Notes: ${validatedData.notes || 'None'}

Add-ons:
- Scaffolding: ${formData.scaffolding || "None"}
- Color Consultation: ${formData.colorConsultation ? "Yes" : "No"}
- Rush Scheduling: ${formData.rushScheduling ? "Yes" : "No"}
- Warranty Extension: ${formData.warrantyExtension ? "Yes" : "No"}
- Premium Site Cleanup: ${formData.siteCleanup ? "Yes" : "No"}
      `.trim();

      // Insert with timeout
      const insertPromise = supabase.from("contact_submissions").insert({
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        company: validatedData.address,
        message: sanitizedMessage,
        submission_type: "estimate",
        consent_timestamp: new Date().toISOString(),
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Database request timeout")), 10000)
      );

      const { error } = await Promise.race([insertPromise, timeoutPromise]) as any;
      if (error) throw error;

      // Also insert into quote_requests table
      if (formData.quoteType) {
        const { data: quoteData, error: quoteError } = await supabase
          .from("quote_requests")
          .insert({
            quote_type: formData.quoteType,
            name: validatedData.name,
            email: validatedData.email,
            phone: validatedData.phone,
            company: formData.company || null,
            role: formData.role || null,
            nte_budget: formData.nteBudget ? parseFloat(formData.nteBudget.replace(/[^0-9.]/g, '')) || null : null,
            scope_categories: formData.scopeCategories.length > 0 ? formData.scopeCategories : null,
            additional_notes: sanitizedMessage,
            consent_given: validatedData.consent,
            consent_timestamp: new Date().toISOString(),
            source: formData.source,
          })
          .select('lead_score, priority')
          .single();

        if (!quoteError && quoteData) {
          trackConversion('quote_form_submitted', {
            quote_type: formData.quoteType,
            lead_score: quoteData.lead_score,
            priority: quoteData.priority
          });
        }
      }

      toast({
        title: "Estimate Request Submitted!",
        description: "We'll contact you within 24 hours to schedule a site visit.",
      });

      // Phase 2: Send review request
      try {
        await supabase.functions.invoke("send-review-request", {
          body: {
            email: validatedData.email,
            clientName: validatedData.name,
            templateName: 'default-review-request',
          },
        });
      } catch (reviewError) {
        console.error("Review request failed:", reviewError);
      }

      // Phase 3: Track A/B test conversion
      await trackABTestConversion('homepage-hero-2024', 3);

      // Redirect to thank you or home page
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      console.error("Error submitting estimate:", error);
      
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else if (error instanceof Error && error.message.includes("timeout")) {
        toast({
          title: "Request Timeout",
          description: "The request is taking longer than expected. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Submission Error",
          description: "There was an error submitting your request. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
      isSubmittingRef.current = false;
    }
  };

  const estimate = calculateCurrentEstimate();

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Get a Free Estimate | Ascen Group Construction"
        description="Get an instant estimate for your painting or stucco project. Fast, accurate pricing with no obligation. Licensed and insured contractors serving the GTA."
        keywords="construction estimate, painting quote, stucco quote, free estimate, GTA contractors"
      />
      <Navigation />

      <main className="flex-1 pt-24 pb-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Enhanced Header */}
            <div className="text-center mb-8 animate-fade-in-up">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">Get Your Free Estimate</h1>
              <p className="text-lg text-muted-foreground">Answer a few quick questions to receive an instant estimate</p>
            </div>

            {/* Paint Calculator Tool */}
            <div className="mb-12">
              <PaintCalculator />
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Step {currentStep} of {totalSteps}
                </span>
                <span className="text-sm font-medium text-primary">
                  {Math.round((currentStep / totalSteps) * 100)}% Complete
                </span>
              </div>
              <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
            </div>

            {/* Enhanced Step Content */}
            <UnifiedCard variant="elevated" className="mb-6 animate-fade-in-up">
              {currentStep === 0 && (<EstimatorStep0 data={{ quoteType: formData.quoteType, company: formData.company, role: formData.role, nteBudget: formData.nteBudget, scopeCategories: formData.scopeCategories }} onChange={handleInputChange} />)}
              {currentStep === 1 && (<EstimatorStep1 data={{ service: formData.service, sqft: formData.sqft, stories: formData.stories }} onChange={handleInputChange} />)}
              {currentStep === 2 && (<EstimatorStep2Enhanced service={formData.service} data={{ prepComplexity: formData.prepComplexity, finishQuality: formData.finishQuality, region: formData.region, buildingType: formData.buildingType, accessibility: formData.accessibility, businessHoursConstraint: formData.businessHoursConstraint, unitCount: formData.unitCount, includeCommonAreas: formData.includeCommonAreas, materialType: formData.materialType }} onChange={handleInputChange} />)}
              {currentStep === 3 && (<EstimatorStep3 data={{ scaffolding: formData.scaffolding, colorConsultation: formData.colorConsultation, rushScheduling: formData.rushScheduling, warrantyExtension: formData.warrantyExtension, siteCleanup: formData.siteCleanup }} sqft={parseInt(formData.sqft) || 0} onChange={handleInputChange} />)}
              {currentStep === 4 && (<EstimatorStep4 estimate={estimate} formData={formData} />)}
              {currentStep === 5 && (<EstimatorStep3 data={{ scaffolding: formData.scaffolding, colorConsultation: formData.colorConsultation, rushScheduling: formData.rushScheduling, warrantyExtension: formData.warrantyExtension, siteCleanup: formData.siteCleanup }} sqft={parseInt(formData.sqft) || 0} onChange={handleInputChange} />)}
              {currentStep === 6 && (<EstimatorStep5 data={{ name: formData.name, email: formData.email, phone: formData.phone, address: formData.address, preferredContact: formData.preferredContact, notes: formData.notes, consent: formData.consent }} onChange={handleInputChange} />)}
            </UnifiedCard>

            {/* Navigation Buttons */}
            <div className="flex justify-between gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={handleBack}
                disabled={currentStep === 0}
                className="min-w-[120px]"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  size="lg"
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="min-w-[120px] bg-secondary hover:bg-secondary/90"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={handleSubmit}
                  disabled={!canProceed() || isSubmitting}
                  className="min-w-[120px] bg-secondary hover:bg-secondary/90"
                >
                  {isSubmitting ? (
                    "Submitting..."
                  ) : (
                    <>
                      Submit Request
                      <CheckCircle className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Quote Request Dialog for Complex Services */}
      {showQuoteDialog && selectedServiceInfo && (
        <QuoteRequestDialog
          open={showQuoteDialog}
          onOpenChange={setShowQuoteDialog}
          serviceName={selectedServiceInfo.name}
          serviceMessage={selectedServiceInfo.message}
        />
      )}

      <Footer />
    </div>
  );
};

export default Estimate;
