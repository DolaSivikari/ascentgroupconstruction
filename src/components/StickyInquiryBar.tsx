import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/ui/Button";
import { Phone, ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCompanySettings } from "@/hooks/useCompanySettings";
import { formatPhoneDisplay, formatPhoneTel } from "@/utils/formatPhone";

const StickyInquiryBar = () => {
  const [visible, setVisible] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  const { settings } = useCompanySettings();

  const displayPhone = formatPhoneDisplay(settings?.phone);
  const telLink = formatPhoneTel(settings?.phone);

  // Hide on admin routes, estimate, contact, and submit-rfp pages
  const hiddenRoutes = ["/admin", "/estimate", "/contact", "/submit-rfp", "/login", "/auth"];
  const shouldHide = hiddenRoutes.some((r) => location.pathname.startsWith(r));

  useEffect(() => {
    if (shouldHide) {
      setVisible(false);
      return;
    }

    const handleScroll = () => {
      setVisible(window.scrollY > 600);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [shouldHide]);

  if (!visible || shouldHide) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur-sm shadow-[0_-2px_10px_hsl(var(--foreground)/0.06)]">
      <div className="container mx-auto px-4 py-2.5">
        {isMobile ? (
          <div className="flex items-center gap-2">
            <Button size="sm" variant="secondary" className="flex-1" asChild>
              <a href={telLink}>
                <Phone className="h-4 w-4 mr-1.5" />
                {displayPhone}
              </a>
            </Button>
            <Button size="sm" className="flex-1" asChild>
              <Link to="/submit-rfp">
                Submit Scope
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Looking for a trade partner?{" "}
              <span className="text-foreground font-medium">
                Request unit pricing or submit a scope.
              </span>
            </p>
            <div className="flex items-center gap-3">
              <Button size="sm" variant="ghost" asChild>
                <a href={telLink}>
                  <Phone className="h-4 w-4 mr-1.5" />
                  {displayPhone}
                </a>
              </Button>
              <Button size="sm" asChild>
                <Link to="/submit-rfp">
                  Submit RFP
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StickyInquiryBar;
