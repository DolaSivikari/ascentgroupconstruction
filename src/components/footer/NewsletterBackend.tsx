import { useState, useRef } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { Link } from "react-router-dom";

const emailSchema = z.object({
  email: z.string().trim().email("Invalid email address").max(255),
  consent: z.boolean().refine((val) => val === true, {
    message: "You must consent to receive newsletter emails",
  }),
});

const NewsletterBackend = () => {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent duplicate submissions
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      // Validate email and consent
      const validatedData = emailSchema.parse({ email, consent });

      // Insert into newsletter_subscribers table
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert({
          email: validatedData.email.toLowerCase(),
          source: "footer",
          subscribed_at: new Date().toISOString(),
          consent_timestamp: new Date().toISOString(),
          consent_method: "footer",
        });

      if (error) {
        // Check for duplicate email
        if (error.code === "23505") {
          toast.info("You're already subscribed to our newsletter!");
        } else {
          throw error;
        }
      } else {
        toast.success("Successfully subscribed to our newsletter!");
      }

      setEmail("");
      setConsent(false);
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Failed to subscribe. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
      isSubmittingRef.current = false;
    }
  };

  return (
    <div className="footer-glass-card p-6 mb-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Mail className="h-5 w-5 text-secondary" />
          <h3 className="text-lg font-semibold text-primary-foreground">Stay Updated</h3>
        </div>
        <p className="text-primary-foreground/70 text-sm mb-4">
          Get the latest construction industry insights, project updates, and expert tips delivered to your inbox.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3 max-w-md mx-auto">
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="footer-newsletter-input flex-1"
              required
              aria-label="Email address for newsletter"
            />
            <Button 
              type="submit" 
              variant="secondary"
              disabled={isSubmitting || !consent}
              className="whitespace-nowrap"
            >
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </Button>
          </div>
          <div className="flex items-start gap-2 text-left">
            <input
              type="checkbox"
              id="newsletter-consent"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1"
              required
              aria-required="true"
            />
            <label htmlFor="newsletter-consent" className="text-xs text-primary-foreground/70">
              I consent to receive email communications from Ascent Group Construction about construction industry insights, project updates, and company news. I understand I can{" "}
              <span className="underline">unsubscribe at any time</span>.{" "}
              <Link to="/privacy" className="text-primary-foreground underline hover:text-primary-foreground/90">
                Privacy Policy
              </Link>
            </label>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewsletterBackend;
