import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/ui/Button";
import { toast } from "sonner";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [unsubscribed, setUnsubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  const token = searchParams.get("token");

  useEffect(() => {
    const handleUnsubscribe = async () => {
      if (!token) {
        setError("Invalid unsubscribe link. No token provided.");
        setLoading(false);
        return;
      }

      try {
        // Find subscriber by token
        const { data: subscriber, error: fetchError } = await supabase
          .from("newsletter_subscribers")
          .select("email, unsubscribed_at")
          .eq("unsubscribe_token", token)
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (!subscriber) {
          setError("Invalid or expired unsubscribe link.");
          setLoading(false);
          return;
        }

        // Check if already unsubscribed
        if (subscriber.unsubscribed_at) {
          setEmail(subscriber.email);
          setUnsubscribed(true);
          setError("You have already unsubscribed from our newsletter.");
          setLoading(false);
          return;
        }

        // Update unsubscribe status
        const { error: updateError } = await supabase
          .from("newsletter_subscribers")
          .update({ unsubscribed_at: new Date().toISOString() })
          .eq("unsubscribe_token", token);

        if (updateError) throw updateError;

        setEmail(subscriber.email);
        setUnsubscribed(true);
        setLoading(false);
        toast.success("Successfully unsubscribed from newsletter");
      } catch (err) {
        console.error("Unsubscribe error:", err);
        setError("An error occurred while processing your request. Please try again later.");
        setLoading(false);
      }
    };

    handleUnsubscribe();
  }, [token]);

  return (
    <>
      <Helmet>
        <title>Unsubscribe from Newsletter | Ascent Group Construction</title>
        <meta name="description" content="Unsubscribe from Ascent Group Construction newsletter" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">Newsletter Unsubscribe</h1>
            <p className="text-muted-foreground">Manage your email preferences</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
            {loading ? (
              <div className="text-center py-8">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Processing your request...</p>
              </div>
            ) : unsubscribed && !error ? (
              <div className="text-center space-y-4">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                <h2 className="text-2xl font-semibold text-foreground">Successfully Unsubscribed</h2>
                {email && (
                  <p className="text-muted-foreground">
                    <strong>{email}</strong> has been removed from our newsletter list.
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  You will no longer receive our construction industry insights and updates.
                </p>
                <div className="pt-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    Changed your mind? You can re-subscribe anytime at the bottom of our website.
                  </p>
                  <Button
                    onClick={() => window.location.href = "/"}
                    variant="default"
                  >
                    Return to Homepage
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <XCircle className="h-16 w-16 text-destructive mx-auto" />
                <h2 className="text-2xl font-semibold text-foreground">
                  {error?.includes("already unsubscribed") ? "Already Unsubscribed" : "Error"}
                </h2>
                <p className="text-muted-foreground">{error}</p>
                
                {error?.includes("already unsubscribed") && email && (
                  <div className="pt-2">
                    <p className="text-sm text-muted-foreground mb-4">
                      <strong>{email}</strong> is not currently subscribed to our newsletter.
                    </p>
                  </div>
                )}

                <div className="pt-4 space-y-3">
                  {error?.includes("Invalid") && (
                    <p className="text-sm text-muted-foreground">
                      If you're having trouble unsubscribing, please contact us at{" "}
                      <a href="mailto:info@ascentgroupconstruction.com" className="text-primary hover:underline">
                        info@ascentgroupconstruction.com
                      </a>
                    </p>
                  )}
                  <Button
                    onClick={() => window.location.href = "/"}
                    variant="outline"
                  >
                    Return to Homepage
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>
              Questions? Contact our <Link to="/privacy" className="text-primary hover:underline">Privacy Team</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Unsubscribe;
