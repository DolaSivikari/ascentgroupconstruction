import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, MapPin, Shield, ArrowRight, Phone } from "lucide-react";
import { useCompanySettings } from "@/hooks/useCompanySettings";

interface DirectAnswerProps {
  children?: React.ReactNode;
  className?: string;
}

/**
 * DirectAnswer component for AEO/GEO optimization
 * Presents content in a format that AI engines can easily extract and cite
 */
const DirectAnswer = ({ children, className = "" }: DirectAnswerProps) => {
  const { settings } = useCompanySettings();
  const displayPhone = settings?.phone ? settings.phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3') : '(647) 528-6804';
  const telLink = settings?.phone ? `tel:${settings.phone}` : 'tel:6475286804';
  
  return (
    <section className={`py-12 sm:py-16 bg-background border-y border-border/40 ${className}`}>
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-[1fr_auto] gap-8 lg:gap-12 items-start">
          {/* Main Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 border border-primary/10 rounded-full">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Ontario's Trusted Construction Partner</span>
            </div>
            
            <div className="prose prose-lg max-w-none text-foreground">
              {children || (
                <div className="space-y-4">
                  <p className="text-lg leading-relaxed">
                    <strong className="text-foreground">Ascent Group Construction is Ontario's complete construction partner</strong>, 
                    specializing in commercial construction, multi-family construction, institutional projects, and exterior building systems 
                    across the Greater Toronto Area. Our comprehensive services include stucco installation and repair, EIFS systems, 
                    masonry restoration, metal cladding, parking garage restoration, waterproofing, and specialty construction services.
                  </p>
                  
                  <p className="text-base leading-relaxed text-muted-foreground">
                    With over 15 years of hands-on experience, we serve property managers, commercial building owners, developers, 
                    and property owners throughout Toronto, Mississauga, Brampton, Vaughan, Markham, and surrounding GTA municipalities. 
                    Our team delivers turnkey solutions from initial consultation through project completion, backed by comprehensive 
                    warranties and ongoing support.
                  </p>
                </div>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">Fully Licensed & WSIB-Compliant</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">Serving Greater Toronto Area</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">15+ Years Experience</span>
              </div>
            </div>
          </div>

          {/* CTA Card */}
          <div className="lg:sticky lg:top-24 w-full lg:w-80 bg-muted/30 border border-border rounded-xl p-6 space-y-4">
            <h3 className="text-xl font-bold text-foreground">Ready to Start Your Project?</h3>
            <p className="text-sm text-muted-foreground">
              Get a detailed estimate tailored to your construction needs. Free consultation included.
            </p>
            
            <div className="space-y-3 pt-2">
              <Button size="lg" className="w-full group" asChild>
                <Link to="/estimate">
                  Request Site Assessment
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              
              <Button size="lg" variant="outline" className="w-full" asChild>
                <Link to="/contact">
                  Contact Us
                </Link>
              </Button>

              <div className="pt-3 border-t border-border">
                <a 
                  href={telLink}
                  className="flex items-center justify-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  Call: {displayPhone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DirectAnswer;
