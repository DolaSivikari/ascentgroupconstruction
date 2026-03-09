import { useState, useRef } from "react";
import { z } from "zod";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { PageHero } from "@/components/shared/PageHero";
import { Card } from "@/design-system/components/Card";
import { Section } from "@/components/sections/Section";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { trackFormSubmit } from "@/lib/analytics";
import { trackABTestConversion } from "@/hooks/useABTest";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { Textarea } from "@/ui/Textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, Clock, Loader2, ArrowRight, FileText, Calculator } from "lucide-react";
import { useSettingsData } from "@/hooks/useSettingsData";
import { RippleEffect } from "@/components/shared/RippleEffect";

import { Link } from "react-router-dom";
import { CTA_TEXT } from "@/design-system/constants";
import { mainPageHeroes } from "@/data/hero-images";

// Input validation schema
const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters").regex(/^[a-zA-Z\s'-]+$/, "Name contains invalid characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().trim().max(20, "Phone must be less than 20 characters").regex(/^[0-9\s()+-]*$/, "Phone contains invalid characters").optional().or(z.literal("")),
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

      let notificationWarning = false;
      try {
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Email notification timeout')), 10000));
        await Promise.race([
          supabase.functions.invoke('send-contact-notification', {
            body: { name: validatedData.name, email: validatedData.email, phone: validatedData.phone, company: validatedData.company, message: validatedData.message, submissionType: "Contact Form" }
          }),
          timeoutPromise
        ]);

        await supabase.functions.invoke("send-review-request", {
          body: {
            email: validatedData.email,
            clientName: validatedData.name,
            templateName: 'review_request_day_0',
          },
        });
      } catch (emailError) {
        notificationWarning = true;
        console.error('Email notification failed:', emailError);
      }

      await trackABTestConversion('homepage-hero-2024', 1);

      toast({
        title: "Message sent!",
        description: notificationWarning
          ? "Your request was saved, but email notifications are delayed. Our team will still follow up."
          : "We'll get back to you within 24 hours. Check your email for confirmation.",
      });
      setFormData({ name: "", email: "", phone: "", company: "", message: "", honeypot: "", consent: false, newsletterConsent: false });
      setLastSubmitTime(now);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.issues[0];
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
  const generalEmail = contactSettings?.general_email || 'info@ascentgroupconstruction.com';
  const projectsEmail = contactSettings?.projects_email || 'projects@ascentgroupconstruction.com';
  const weekdayHours = contactSettings?.weekday_hours || 'Monday - Friday: 8:00 AM - 6:00 PM';
  const saturdayHours = contactSettings?.saturday_hours || 'Saturday: 9:00 AM - 2:00 PM';
  const sundayHours = contactSettings?.sunday_hours || 'Sunday: Closed';
  const mapEmbedUrl = contactSettings?.map_embed_url || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d184551.90977289474!2d-79.51814069999999!3d43.7184038!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d4cb90d7c63ba5%3A0x323555502ab4c477!2sToronto%2C%20ON!5e0!3m2!1sen!2sca!4v1234567890123!5m2!1sen!2sca';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO title="Contact Us | Ascent Group Construction" description="Contact Ascent Group Construction for building envelope, restoration, and specialty trade services across Ontario. Request a consultation or get a project quote." canonical="https://ascentgroupconstruction.com/contact" />
      <Navigation />

      <PageHero
        title="Contact Us"
        description="Get expert building envelope and restoration services across Ontario. Our specialized crews are ready to discuss your project."
        image={mainPageHeroes.contact}
        imageAlt="Contact Ascent Group Construction"
        height="medium"
        primaryCta={{ text: CTA_TEXT.project, href: "/estimate" }}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Contact" }
        ]}
      />

      {/* Contact Pathway Guidance */}
      <Section size="tight" disableAnimation>
        <div className="max-w-4xl mx-auto">
          <p className="text-sm text-muted-foreground text-center mb-6">Not sure which form to use? Choose the best path for your needs:</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card variant="interactive" size="sm" className="text-center border-primary/30 bg-primary/5">
              <Link to="/contact" className="block">
                <Mail className="w-5 h-5 text-primary mx-auto mb-2" />
                <p className="text-sm font-bold text-primary mb-1">General Inquiry</p>
                <p className="text-xs text-muted-foreground">Questions, site visits, consultations</p>
              </Link>
            </Card>
            <Card variant="interactive" size="sm" className="text-center">
              <Link to="/estimate" className="block">
                <Calculator className="w-5 h-5 text-foreground mx-auto mb-2" />
                <p className="text-sm font-bold mb-1">Project Estimate</p>
                <p className="text-xs text-muted-foreground">Get preliminary pricing for defined scopes</p>
              </Link>
            </Card>
            <Card variant="interactive" size="sm" className="text-center">
              <Link to="/submit-rfp" className="block">
                <FileText className="w-5 h-5 text-foreground mx-auto mb-2" />
                <p className="text-sm font-bold mb-1">Submit RFP</p>
                <p className="text-xs text-muted-foreground">Formal proposals with drawings & specs</p>
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
                  <h2 className="text-2xl font-bold mb-2">Send Us a Message</h2>
                  <p className="text-muted-foreground">
                    Fill out the form below and our team will get back to you within one business day.
                  </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-base">Full Name *</Label>
                      <Input id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="John Smith" className="h-12 text-base" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-base">Email *</Label>
                      <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" className="h-12 text-base" />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-base">Phone</Label>
                      <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="(647) 123-4567" className="h-12 text-base" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-base">Company</Label>
                      <Input id="company" name="company" value={formData.company} onChange={handleChange} placeholder="Your Company" className="h-12 text-base" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-base font-semibold">Project Details *</Label>
                    <Textarea id="message" name="message" value={formData.message} onChange={handleChange} required placeholder="Tell us about your project requirements, timeline, and budget..." className="min-h-[160px] text-base" />
                  </div>
                  
                  <div className="space-y-3 pt-2">
                    <div className="flex items-start gap-3">
                      <input type="checkbox" id="consent" name="consent" checked={formData.consent} onChange={handleChange} required className="mt-1" />
                      <Label htmlFor="consent" className="text-sm leading-relaxed cursor-pointer">
                        I consent to Ascent Group Construction contacting me about my inquiry via email or phone. *
                      </Label>
                    </div>
                    <div className="flex items-start gap-3">
                      <input type="checkbox" id="newsletterConsent" name="newsletterConsent" checked={formData.newsletterConsent} onChange={handleChange} className="mt-1" />
                      <Label htmlFor="newsletterConsent" className="text-sm leading-relaxed cursor-pointer">
                        I'd also like to receive construction industry insights and project updates. <Link to="/privacy" className="text-primary underline hover:no-underline">Privacy Policy</Link>
                      </Label>
                    </div>
                  </div>
                  
                  {/* Honeypot */}
                  <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" name="honeypot" type="text" tabIndex={-1} autoComplete="off" value={formData.honeypot} onChange={handleChange} />
                  </div>

                  <RippleEffect>
                    <Button type="submit" size="lg" className="w-full h-14 text-lg gap-3" disabled={isSubmitting}>
                      {isSubmitting ? (<><Loader2 className="w-5 h-5 animate-spin" />Sending...</>) : (<>Submit Request<ArrowRight className="w-5 h-5" /></>)}
                    </Button>
                  </RippleEffect>

                  {/* Trust Badge */}
                  <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-2">
                    <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-primary" />$2M Insured</span>
                    <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5 text-primary" />WSIB Compliant</span>
                  </div>

                  <p className="text-xs text-muted-foreground text-center">
                    Your information is secure and will only be used to respond to your inquiry.
                  </p>
                </form>
              </Card>
            </div>

            {/* Contact Info Sidebar */}
            <div className="space-y-6">
              <Card variant="default" size="md">
                <h3 className="text-lg font-bold mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Office</p>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">{officeAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <a href={`tel:${mainPhone.replace(/\s/g, '')}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        {mainPhone}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <a href={`mailto:${generalEmail}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        {generalEmail}
                      </a>
                      {projectsEmail && projectsEmail !== generalEmail && (
                        <a href={`mailto:${projectsEmail}`} className="text-sm text-muted-foreground hover:text-primary transition-colors block mt-1">
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
                  Business Hours
                </h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>{weekdayHours}</p>
                  <p>{saturdayHours}</p>
                  <p>{sundayHours}</p>
                </div>
              </Card>

              <Card variant="default" size="md" className="bg-muted/30">
                <p className="text-sm font-medium mb-2">Need a formal proposal?</p>
                <p className="text-xs text-muted-foreground mb-3">
                  For projects with drawings, specs, or detailed scope requirements, use our RFP submission form.
                </p>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link to="/submit-rfp">Submit RFP</Link>
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
            <h2 className="text-3xl font-bold mb-4">Our Service Area</h2>
            <p className="text-lg text-muted-foreground">Proudly serving the Greater Toronto Area and Ontario</p>
          </div>
          <div className="relative aspect-video bg-card rounded-[var(--radius-lg)] overflow-hidden shadow-[var(--shadow-lg)] border border-border">
            <iframe src={mapEmbedUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Ascent Group Construction Service Area - Greater Toronto Area" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
