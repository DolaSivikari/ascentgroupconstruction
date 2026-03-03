import { useState } from "react";
import { z } from "zod";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    const parsedEmail = z.string().trim().email().safeParse(email);
    if (!parsedEmail.success) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const normalizedEmail = parsedEmail.data.toLowerCase();

      const { error } = await supabase
        .from("newsletter_subscribers")
        .upsert({
          email: normalizedEmail,
          source: "blog_newsletter",
          is_active: true,
          subscribed_at: new Date().toISOString(),
          consent_timestamp: new Date().toISOString(),
          consent_method: "website_form",
          unsubscribed_at: null,
        }, { onConflict: "email" });

      if (error) throw error;

      toast({
        title: "Subscription confirmed",
        description: "You're now subscribed to updates and insights.",
      });
      setEmail("");
    } catch (error) {
      console.error("Newsletter subscription failed:", error);
      toast({
        title: "Subscription failed",
        description: "We couldn't save your subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-primary text-primary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Stay Updated
          </h2>
          <p className="text-lg opacity-90 mb-6">
            Get expert tips, industry insights, and project inspiration delivered to your inbox.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 bg-white text-primary"
            />
            <Button type="submit" disabled={isSubmitting} className="bg-secondary hover:bg-secondary/90 text-primary font-bold">
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
