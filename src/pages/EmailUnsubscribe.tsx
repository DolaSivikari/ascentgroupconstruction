import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/ui/Button";
import { Card, CardContent } from "@/design-system/components/Card";
import { CheckCircle2, AlertCircle, Loader2, Home } from "lucide-react";

type Status = "loading" | "valid" | "already" | "invalid" | "confirming" | "done" | "error";

export default function EmailUnsubscribe() {
  const [status, setStatus] = useState<Status>("loading");
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    // Email preferences are now handled directly from the unsubscribe link at
    // the bottom of each email, so this page only points people back there.
    setStatus("invalid");
    setErrorMsg(
      "Email preferences are managed from the unsubscribe link at the bottom of any email we send you. Open your most recent email and use that link, or contact us and we'll take care of it.",
    );
  }, []);

  const handleConfirm = () => {
    setStatus("invalid");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="Email Preferences | Ascent Group Construction"
        description="Manage your email preferences for Ascent Group Construction notifications."
      />
      <Navigation />
      <main className="flex-1 flex items-center py-16">
        <div className="container mx-auto px-4 max-w-xl">
          <Card>
            <CardContent className="p-8 text-center">
              {status === "loading" && (
                <>
                  <Loader2 className="w-12 h-12 mx-auto mb-4 text-primary animate-spin" />
                  <h1 className="text-2xl font-bold text-primary mb-2">Verifying your link…</h1>
                  <p className="text-muted-foreground">One moment please.</p>
                </>
              )}

              {status === "valid" && (
                <>
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-primary" />
                  </div>
                  <h1 className="text-2xl font-bold text-primary mb-3">Unsubscribe from emails?</h1>
                  <p className="text-muted-foreground mb-6">
                    You'll stop receiving notification emails from Ascent Group Construction. You can still contact us
                    anytime if you want to opt back in.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button onClick={handleConfirm}>Confirm Unsubscribe</Button>
                    <Button asChild variant="secondary">
                      <Link to="/">Cancel</Link>
                    </Button>
                  </div>
                </>
              )}

              {status === "confirming" && (
                <>
                  <Loader2 className="w-12 h-12 mx-auto mb-4 text-primary animate-spin" />
                  <h1 className="text-2xl font-bold text-primary mb-2">Processing…</h1>
                </>
              )}

              {status === "done" && (
                <>
                  <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-secondary" />
                  </div>
                  <h1 className="text-2xl font-bold text-primary mb-3">You've been unsubscribed</h1>
                  <p className="text-muted-foreground mb-6">
                    You won't receive notification emails from us going forward.
                  </p>
                  <Button asChild>
                    <Link to="/"><Home className="w-4 h-4 mr-2" />Return Home</Link>
                  </Button>
                </>
              )}

              {status === "already" && (
                <>
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h1 className="text-2xl font-bold text-primary mb-3">Already unsubscribed</h1>
                  <p className="text-muted-foreground mb-6">This email address is already on our suppression list.</p>
                  <Button asChild><Link to="/">Return Home</Link></Button>
                </>
              )}

              {(status === "invalid" || status === "error") && (
                <>
                  <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-destructive" />
                  </div>
                  <h1 className="text-2xl font-bold text-primary mb-3">Something went wrong</h1>
                  <p className="text-muted-foreground mb-6">{errorMsg}</p>
                  <Button asChild><Link to="/">Return Home</Link></Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
