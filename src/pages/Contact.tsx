import { useState, useRef, useEffect } from "react";
import { z } from "zod";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import PageHeader from "@/components/PageHeader";
import { UnifiedCard } from "@/components/shared/UnifiedCard";
import { Section } from "@/components/sections/Section";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { trackFormSubmit, trackConversion } from "@/lib/analytics";
import { trackABTestConversion } from "@/hooks/useABTest";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { Textarea } from "@/ui/Textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Phone, Mail, Clock, Loader2, ArrowRight } from "lucide-react";
import { useSettingsData } from "@/hooks/useSettingsData";
import { MultiStepForm } from "@/components/forms/MultiStepForm";
import { FileUploadZone } from "@/components/forms/FileUploadZone";
import { BudgetSlider } from "@/components/forms/BudgetSlider";
import { TimelineSelector } from "@/components/forms/TimelineSelector";
import { ProjectTypeSelector } from "@/components/forms/ProjectTypeSelector";
import { TestimonialRatings } from "@/components/shared/TestimonialRatings";
import { RippleEffect } from "@/components/shared/RippleEffect";
import { TrustedPartners } from "@/components/partners/TrustedPartners";
import { PartnerCaseStudies } from "@/components/partners/PartnerCaseStudies";
import { Link } from "react-router-dom";
import { CTA_TEXT } from "@/design-system/constants";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import heroImage from "@/assets/heroes/hero-about-company.jpg";

// Input validation schema
const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters").regex(/^[a-zA-Z\s'-]+$/, "Name contains invalid characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().trim().max(20, "Phone must be less than 20 characters").regex(/^[0-9\s\-\(\)\+]*$/, "Phone contains invalid characters").optional().or(z.literal("")),
  company: z.string().trim().max(100, "Company name must be less than 100 characters").optional().or(z.literal("")),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000, "Message must be less than 2000 characters"),
  consent: z.boolean().refine((val) => val === true, { message: "You must consent to be contacted" }),
  newsletterConsent: z.boolean().optional(),
});

const Contact = () => {
  const { toast } = useToast();
  const { data: contactSettings, loading } = useSettingsData('contact_page_settings');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", company: "", message: "", honeypot: "", consent: false, newsletterConsent: false,
  });
  const [lastSubmitTime, setLastSubmitTime] = useState<number>(0);
  const [useMultiStep, setUseMultiStep] = useState(false);
  const [budget, setBudget] = useState(100000);
  const [projectType, setProjectType] = useState("commercial");
  const [startDate, setStartDate] = useState<Date>();
  const [targetDate, setTargetDate] = useState<Date>();
  const [files, setFiles] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRef.current) return;
    const now = Date.now();
    if (now - lastSubmitTime < 10000) {
      toast({ title: "Slow down!", description: "Please wait a moment before submitting again.", variant: "destructive" });
      return;
    }
    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      const validatedData = contactSchema.parse(formData);
      
      // Track form submission attempt in GA4
      trackFormSubmit('contact_form', {
        has_phone: !!validatedData.phone,
        has_company: !!validatedData.company,
        newsletter_opt_in: validatedData.newsletterConsent
      });
      
      const { data, error } = await supabase.functions.invoke('submit-form', {
        body: {
          formType: 'contact',
          data: {
            name: validatedData.name, 
            email: validatedData.email, 
            phone: validatedData.phone, 
            company: validatedData.company, 
            message: validatedData.message, 
            submission_type: 'contact',
            consent_timestamp: new Date().toISOString(),
            newsletter_consent: validatedData.newsletterConsent || false
          },
          honeypot: formData.honeypot
        }
      });

      if (error) {
        if (error.message?.includes('Rate limit exceeded')) {
          toast({ title: "Too many submissions", description: "Please try again in a few minutes.", variant: "destructive" });
          return;
        }
        throw error;
      }

      // Tracking already done above

      try {
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Email notification timeout')), 10000));
        await Promise.race([
          supabase.functions.invoke('send-contact-notification', {
            body: { name: validatedData.name, email: validatedData.email, phone: validatedData.phone, company: validatedData.company, message: validatedData.message, submissionType: "Contact Form" }
          }),
          timeoutPromise
        ]);

        // Phase 2: Send review request
        await supabase.functions.invoke("send-review-request", {
          body: {
            email: validatedData.email,
            clientName: validatedData.name,
            templateName: 'default-review-request',
          },
        });
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
      }

      // Phase 3: Track A/B test conversion
      await trackABTestConversion('homepage-hero-2024', 1);

      toast({ title: "Message sent!", description: "We'll get back to you within 24 hours. Check your email for confirmation." });
      setFormData({ name: "", email: "", phone: "", company: "", message: "", honeypot: "", consent: false, newsletterConsent: false });
      setLastSubmitTime(now);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast({ title: "Validation Error", description: firstError.message, variant: "destructive" });
      } else {
        toast({ title: "Error", description: "Failed to send message. Please try again.", variant: "destructive" });
      }
    } finally {
      setIsSubmitting(false);
      isSubmittingRef.current = false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    setFormData({ ...formData, [target.name]: value });
  };

  // Fallback values
  const officeAddress = contactSettings?.office_address || '2 Jody Ave\nNorth York, ON M3N 1H1\nCanada';
  const mainPhone = contactSettings?.main_phone || '647-528-6804';
  const tollFreePhone = contactSettings?.toll_free_phone || '647-528-6804';
  const generalEmail = contactSettings?.general_email || 'info@ascentgroupconstruction.com';
  const projectsEmail = contactSettings?.projects_email || 'projects@ascentgroupconstruction.com';
  const careersEmail = contactSettings?.careers_email || 'careers@ascentgroupconstruction.com';
  const weekdayHours = contactSettings?.weekday_hours || 'Monday - Friday: 8:00 AM - 6:00 PM';
  const saturdayHours = contactSettings?.saturday_hours || 'Saturday: 9:00 AM - 2:00 PM';
  const sundayHours = contactSettings?.sunday_hours || 'Sunday: Closed';
  const mapEmbedUrl = contactSettings?.map_embed_url || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d184551.90977289474!2d-79.51814069999999!3d43.7184038!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d4cb90d7c63ba5%3A0x323555502ab4c477!2sToronto%2C%20ON!5e0!3m2!1sen!2sca!4v1234567890123!5m2!1sen!2sca';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO title="Contact Us - Request Proposal | Ascent Group" description="Ascent Group Construction — Ontario's prime specialty contractor for building envelope & restoration. Self-performed façade remediation, parking garage restoration, EIFS, masonry repair, and waterproofing. Serving commercial, multi-family, and institutional projects across the GTA." canonical="https://ascentgroupconstruction.com/contact" />
      <Navigation />

      <PageHeader
        title="Contact Us"
        description="Get expert building envelope and restoration services across Ontario. Our specialized crews are ready to discuss your project."
        backgroundImage={heroImage}
        cta={{ label: CTA_TEXT.project, href: "/estimate" }}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Contact" }
        ]}
      />

      {/* Premium Contact Form Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center gap-4 mb-8">
              <Button
                variant={!useMultiStep ? "default" : "outline"}
                onClick={() => setUseMultiStep(false)}
              >
                Quick Contact
              </Button>
              <Button
                variant={useMultiStep ? "default" : "outline"}
                onClick={() => setUseMultiStep(true)}
              >
                Detailed Request
              </Button>
            </div>

            <UnifiedCard variant="elevated" className="border-2 hover:border-primary/20 transition-all shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 border-b">
                <h2 className="text-3xl font-bold mb-2">Request a Consultation</h2>
                <p className="text-muted-foreground text-lg">
                  {useMultiStep 
                    ? "Complete our detailed form for a comprehensive project assessment" 
                    : "Fill out the form below and our team will get back to you within 2 hours during business hours"}
                </p>
              </div>
              <div className="p-8">
                {useMultiStep ? (
                  <MultiStepForm
                    steps={[
                      {
                        title: "Contact Information",
                        description: "Tell us about yourself",
                        content: (
                          <div className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                              <div className="space-y-2"><Label htmlFor="name">Full Name *</Label><Input id="name" name="name" value={formData.name} onChange={handleChange} required /></div>
                              <div className="space-y-2"><Label htmlFor="email">Email *</Label><Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required /></div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                              <div className="space-y-2"><Label htmlFor="phone">Phone</Label><Input id="phone" name="phone" value={formData.phone} onChange={handleChange} /></div>
                              <div className="space-y-2"><Label htmlFor="company">Company</Label><Input id="company" name="company" value={formData.company} onChange={handleChange} /></div>
                            </div>
                          </div>
                        )
                      },
                      {
                        title: "Project Type",
                        description: "What type of project are you planning?",
                        content: <ProjectTypeSelector selected={projectType} onChange={setProjectType} />
                      },
                      {
                        title: "Budget & Timeline",
                        description: "Help us understand your project scope",
                        content: (
                          <div className="space-y-8">
                            <BudgetSlider value={budget} onChange={setBudget} />
                            <TimelineSelector
                              startDate={startDate}
                              onStartDateChange={setStartDate}
                              targetDate={targetDate}
                              onTargetDateChange={setTargetDate}
                            />
                          </div>
                        )
                      },
                      {
                        title: "Project Details",
                        description: "Tell us more about your project",
                        content: (
                          <div className="space-y-6">
                            <div className="space-y-2">
                              <Label htmlFor="message">Project Description *</Label>
                              <Textarea id="message" name="message" value={formData.message} onChange={handleChange} required className="min-h-[150px]" />
                            </div>
                            <FileUploadZone onFilesChange={setFiles} maxFiles={3} />
                          </div>
                        )
                      },
                      {
                        title: "Consent & Privacy",
                        description: "Please review and accept our terms to proceed",
                        content: (
                          <div className="space-y-6">
                            {/* Required Consent Checkbox */}
                            <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg border-2">
                              <input
                                type="checkbox"
                                id="consent-multi"
                                name="consent"
                                checked={formData.consent}
                                onChange={handleChange}
                                required
                                className="mt-1 h-5 w-5 rounded border-input accent-primary cursor-pointer"
                              />
                              <Label htmlFor="consent-multi" className="text-sm leading-relaxed cursor-pointer">
                                I consent to Ascent Group Construction contacting me about my inquiry via email or phone. *
                              </Label>
                            </div>
                            
                            {/* Optional Newsletter Checkbox */}
                            <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                              <input
                                type="checkbox"
                                id="newsletterConsent-multi"
                                name="newsletterConsent"
                                checked={formData.newsletterConsent}
                                onChange={handleChange}
                                className="mt-1 h-5 w-5 rounded border-input accent-primary cursor-pointer"
                              />
                              <Label htmlFor="newsletterConsent-multi" className="text-sm leading-relaxed cursor-pointer">
                                I'd also like to receive construction industry insights and project updates.{' '}
                                <Link to="/privacy" className="text-primary underline hover:no-underline">
                                  Privacy Policy
                                </Link>
                              </Label>
                            </div>
                            
                            {/* Privacy Notice */}
                            <div className="bg-gradient-to-br from-muted/50 to-muted/30 border-2 border-border rounded-xl p-6 mt-6">
                              <p className="text-sm text-muted-foreground leading-relaxed text-center">
                                <strong className="text-foreground text-base">Privacy Notice:</strong> Your information is secure and will only be used to respond to your inquiry. We never share your data with third parties.
                              </p>
                            </div>
                            
                            {/* Honeypot field (hidden) */}
                            <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
                              <Label htmlFor="website-multi">Website</Label>
                              <Input 
                                id="website-multi" 
                                name="honeypot" 
                                type="text" 
                                tabIndex={-1} 
                                autoComplete="off" 
                                value={formData.honeypot} 
                                onChange={handleChange} 
                              />
                            </div>
                          </div>
                        ),
                        validate: () => {
                          // Validate that consent is checked before proceeding
                          if (!formData.consent) {
                            toast({
                              title: "Consent Required",
                              description: "Please consent to be contacted to submit your request.",
                              variant: "destructive"
                            });
                            return false;
                          }
                          return true;
                        }
                      }
                    ]}
                    onComplete={async () => {
                      const syntheticEvent = { preventDefault: () => {} } as React.FormEvent;
                      await handleSubmit(syntheticEvent);
                    }}
                  />
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2"><Label htmlFor="name" className="text-base">Full Name *</Label><Input id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="John Smith" className="h-14 text-base" /></div>
                    <div className="space-y-2"><Label htmlFor="email" className="text-base">Email *</Label><Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" className="h-14 text-base" /></div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2"><Label htmlFor="phone" className="text-base">Phone</Label><Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="(647) 123-4567" className="h-14 text-base" /></div>
                    <div className="space-y-2"><Label htmlFor="company" className="text-base">Company</Label><Input id="company" name="company" value={formData.company} onChange={handleChange} placeholder="Your Company" className="h-14 text-base" /></div>
                  </div>
                  <div className="space-y-2"><Label htmlFor="message" className="text-base font-semibold">Project Details *</Label><Textarea id="message" name="message" value={formData.message} onChange={handleChange} required placeholder="Tell us about your project requirements, timeline, and budget..." className="min-h-[200px] text-base" /></div>
                  
                  <div className="space-y-3 pt-2">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="consent"
                        name="consent"
                        checked={formData.consent}
                        onChange={handleChange}
                        required
                        className="mt-1"
                      />
                      <Label htmlFor="consent" className="text-sm leading-relaxed cursor-pointer">
                        I consent to Ascent Group Construction contacting me about my inquiry via email or phone. *
                      </Label>
                    </div>
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="newsletterConsent"
                        name="newsletterConsent"
                        checked={formData.newsletterConsent}
                        onChange={handleChange}
                        className="mt-1"
                      />
                      <Label htmlFor="newsletterConsent" className="text-sm leading-relaxed cursor-pointer">
                        I'd also like to receive construction industry insights and project updates. <Link to="/privacy" className="text-primary underline hover:no-underline">Privacy Policy</Link>
                      </Label>
                    </div>
                  </div>
                  
                  <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true"><Label htmlFor="website">Website</Label><Input id="website" name="honeypot" type="text" tabIndex={-1} autoComplete="off" value={formData.honeypot} onChange={handleChange} /></div>
                  <RippleEffect>
                    <Button type="submit" size="lg" className="w-full h-16 text-lg gap-3 hover:scale-[1.02] transition-all shadow-lg hover:shadow-xl" disabled={isSubmitting}>
                      {isSubmitting ? (<><Loader2 className="w-6 h-6 animate-spin" />Sending...</>) : (<>Submit Request<ArrowRight className="w-6 h-6" /></>)}
                    </Button>
                  </RippleEffect>
                  <div className="bg-gradient-to-br from-muted/50 to-muted/30 border-2 border-border rounded-xl p-6 text-center"><p className="text-sm text-muted-foreground leading-relaxed"><strong className="text-foreground text-base">Privacy Notice:</strong> Your information is secure and will only be used to respond to your inquiry. We never share your data with third parties.</p></div>
                  </form>
                )}
              </div>
            </UnifiedCard>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Removed pending verified testimonial collection */}

      {/* Trusted Partners */}
      <TrustedPartners variant="simple" background="muted" showDescription={false} />

      {/* Partner Case Studies */}
      <PartnerCaseStudies background="default" />

      {/* Enhanced Map Section */}
      <section className="py-20 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in-up"><h2 className="text-4xl font-bold mb-4">Visit Our Office</h2><p className="text-lg text-muted-foreground">Located in Mississauga, proudly serving the Greater Toronto Area</p></div>
          <div className="relative aspect-video bg-card rounded-2xl overflow-hidden shadow-2xl border-2 border-border hover:border-primary/30 transition-all"><iframe src={mapEmbedUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Ascent Group Construction Service Area - Greater Toronto Area" /></div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;