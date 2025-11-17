import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { Textarea } from "@/ui/Textarea";
import { Phone, Mail, MapPin, ArrowRight, CheckCircle2, Clock, Shield } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useCompanySettings } from "@/hooks/useCompanySettings";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().min(1, "Phone is required").max(20),
  message: z.string().trim().max(1000).optional(),
});

const stories = [
  {
    stat: "500+",
    label: "Projects Completed",
    detail: "From small renovations to major restorations",
    icon: CheckCircle2,
  },
  {
    stat: "15+",
    label: "Years Experience",
    detail: "Trusted by Ontario property owners since 2009",
    icon: Clock,
  },
  {
    stat: "98%",
    label: "Client Satisfaction",
    detail: "Based on verified reviews and repeat business",
    icon: Shield,
  },
];

const InteractiveCTA = () => {
  const navigate = useNavigate();
  const { settings } = useCompanySettings();
  const [currentStory, setCurrentStory] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const { toast } = useToast();
  
  const displayPhone = settings?.phone ? settings.phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3') : '(647) 528-6804';
  const telLink = settings?.phone ? `tel:${settings.phone}` : 'tel:6475286804';

  // Rotate stories every 4 seconds (fixed memory leak)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStory((prev) => (prev + 1) % stories.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleQuickContact = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent duplicate submissions with synchronous check
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsSubmitting(true);

    // Cancel any pending requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      // Validate form data
      const validatedData = contactSchema.parse(formData);

      // Insert into database with timeout
      const dbPromise = supabase
        .from("contact_submissions")
        .insert({
          name: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone,
          message: validatedData.message || "Quick estimate request",
          submission_type: "quote",
        });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Database request timeout")), 10000)
      );

      const { error: dbError } = await Promise.race([dbPromise, timeoutPromise]) as any;
      if (dbError) throw dbError;

      // Send notification email with timeout
      const emailPromise = supabase.functions.invoke("send-contact-notification", {
        body: {
          name: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone,
          message: validatedData.message || "Quick estimate request",
        },
      });

      await Promise.race([
        emailPromise,
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Email notification timeout")), 10000)
        ),
      ]);

      toast({
        title: "Request Sent!",
        description: "We'll contact you within 24 hours.",
      });

      // Reset form
      setFormData({ name: "", email: "", phone: "", message: "" });
      
      // Use navigate instead of window.location for proper routing
      setTimeout(() => {
        navigate("/estimate");
      }, 1500);
    } catch (error) {
      if (error instanceof Error && error.message.includes("timeout")) {
        toast({
          title: "Request Timeout",
          description: "The request is taking longer than expected. We'll still process it.",
          variant: "destructive",
        });
      } else {
        console.error("Form submission error:", error);
        toast({
          title: "Error",
          description: "Failed to submit request. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
      isSubmittingRef.current = false;
      abortControllerRef.current = null;
    }
  };

  return (
    <section className="relative py-20 bg-gradient-to-br from-primary to-primary/90 overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Rotating Visual Story */}
          <div className="text-[hsl(var(--bg))] space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                Your Construction Partner For Success
              </h2>
              <p className="text-xl text-[hsl(var(--bg))]/90 leading-relaxed">
                From concept to completion, we deliver exceptional results with transparent communication and expert craftsmanship.
              </p>
            </div>

            {/* Animated Story Cards */}
            {(() => {
              const CurrentIcon = stories[currentStory].icon;
              return (
                <div key={currentStory} className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 animate-fade-in">
                  <div className="flex items-start gap-4">
                    <div className="bg-secondary/20 rounded-full p-3 flex-shrink-0">
                      {CurrentIcon && <CurrentIcon className="h-8 w-8 text-secondary" />}
                    </div>
                    <div>
                      <div className="text-5xl font-bold mb-2 text-secondary">
                        {stories[currentStory].stat}
                      </div>
                      <div className="text-xl font-semibold mb-1">
                        {stories[currentStory].label}
                      </div>
                      <p className="text-[hsl(var(--bg))]/80 text-sm">
                        {stories[currentStory].detail}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Story Navigation Dots */}
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

            {/* Trust Indicators */}
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
                <div className="text-xs text-[hsl(var(--bg))]/80">24/7 Support</div>
              </div>
            </div>
          </div>

          {/* Right Column - Quick Contact Form */}
          <div className="bg-background rounded-2xl shadow-2xl p-8 lg:p-10">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Get Your Free Estimate
              </h3>
              <p className="text-muted-foreground">
                Detailed quote within 24-48 hours. No obligation.
              </p>
            </div>

            <form onSubmit={handleQuickContact} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Your Name"
                  required
                  className="h-12"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Email Address"
                  required
                  className="h-12"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <Input
                  type="tel"
                  placeholder="Phone Number"
                  required
                  className="h-12"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <Textarea
                  placeholder="Tell us about your project..."
                  rows={4}
                  className="resize-none"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>
              
              <Button
                type="submit"
                size="lg"
                className="w-full h-12 text-base"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    Request Free Estimate
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveCTA;
