import { useState, useEffect } from "react";
import { Button } from "@/ui/Button";
import { X } from "lucide-react";
import { Link } from "react-router-dom";

import { readAnalyticsConsent, setAnalyticsConsent } from "@/lib/analyticsConsent";

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = readAnalyticsConsent();
    if (cookieConsent !== "accepted" && cookieConsent !== "rejected") {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => { setAnalyticsConsent("accepted"); setIsVisible(false); };
  const handleReject = () => { setAnalyticsConsent("rejected"); setIsVisible(false); };

  const handleClose = () => {
    // Treat close as rejection
    handleReject();
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-card border-t border-border shadow-lg animate-slide-up"
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-description"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <h2 
                id="cookie-banner-title" 
                className="text-lg font-semibold text-foreground"
              >
                Cookie Preferences
              </h2>
              <button
                onClick={handleClose}
                className="ml-auto text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close cookie banner"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <p 
              id="cookie-banner-description" 
              className="text-sm text-muted-foreground max-w-4xl"
            >
              We use optional analytics to understand website visits. You can accept or reject analytics; essential website features work either way.
            </p>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-2">
              <div className="flex gap-3">
                <Button 
                  onClick={handleAccept}
                  size="sm"
                  className="whitespace-nowrap"
                >
                  Accept Analytics
                </Button>
                <Button 
                  onClick={handleReject}
                  variant="outline"
                  size="sm"
                  className="whitespace-nowrap"
                >
                  Reject Analytics
                </Button>
              </div>
              
              <Link 
                to="/privacy#cookies" 
                className="text-sm text-primary hover:underline"
              >
                Learn more about cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
