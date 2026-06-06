import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Shield, 
  FileText, 
  Download, 
  Clock, 
  CheckCircle2, 
  Wrench, 
  Building2, 
  Users, 
  HardHat,
  Layers,
  Car,
  Droplets,
  ArrowRight,
  FileDown,
  Loader2,
  Briefcase
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/ui/Card";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/hero-building-envelope.jpg";
import { useDocument, useTrackDownload, downloadDocument } from "@/hooks/useDocuments";
import { TrustRibbon } from "@/design-system/components/TrustRibbon";
import { FAQAccordion } from "@/design-system/components/FAQAccordion";
import { RelatedLinksGrid } from "@/design-system/components/RelatedLinksGrid";
import { contractorPortalFaqs } from "@/data/page-faqs";

const ContractorPortal = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    tradeScope: "",
    message: "",
    honeypot: ""
  });

  // Fetch vendor packet from documents library
  const { data: vendorPacket, isLoading: vendorLoading } = useDocument('vendor');
  const trackDownload = useTrackDownload();

  const whyPartnerCards = [
    {
      icon: Wrench,
      title: "Self-Performed Envelope Work",
      description: "85% of our building envelope scope is executed in-house with our own crews. Direct control means quality and schedule certainty."
    },
    {
      icon: Clock,
      title: "48-Hour Estimate Turnaround",
      description: "Receive detailed unit rates and lump sum pricing within 2 business days of scope review. Fast response for tight bid deadlines."
    },
    {
      icon: Shield,
      title: "WSIB Compliant, $2M CGL",
      description: "Fully compliant with all Ontario workplace safety requirements. $2M commercial general liability coverage per occurrence."
    },
    {
      icon: Users,
      title: "Scalable Crews for Multi-Phase",
      description: "Flexible workforce deployment for concurrent or phased projects. We can scale from single crews to multiple teams across sites."
    }
  ];

  const capabilities = [
    { icon: Layers, name: "EIFS & Stucco Systems", description: "New installation, repairs, and complete system replacement" },
    { icon: Building2, name: "Façade Remediation", description: "Assessment, repair, and restoration of building exteriors" },
    { icon: Car, name: "Parking Garage Restoration", description: "Concrete repair, membrane systems, and traffic coatings" },
    { icon: Shield, name: "Sealant Replacement Programs", description: "Building-wide joint sealant maintenance and replacement" },
    { icon: Droplets, name: "Waterproofing Systems", description: "Below-grade, plaza deck, and foundation waterproofing" },
    { icon: HardHat, name: "Masonry Restoration", description: "Brick repair, tuckpointing, and stone restoration" }
  ];

  const handleUnitRateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.honeypot) return;
    
    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke('submit-form', {
        body: {
          formType: 'rfp',
          data: {
            companyName: formData.companyName,
            contactName: formData.contactName,
            email: formData.email,
            phone: formData.phone,
            projectName: "Unit Rate Request",
            projectType: "subcontractor_partnership",
            scopeOfWork: `Trade Scope: ${formData.tradeScope}\n\n${formData.message}`
          },
          honeypot: formData.honeypot
        }
      });

      if (error) throw error;

      toast({
        title: "Request Submitted",
        description: "We'll send unit rates within 48 hours.",
      });

      setFormData({
        companyName: "",
        contactName: "",
        email: "",
        phone: "",
        tradeScope: "",
        message: "",
        honeypot: ""
      });
    } catch (error) {
      console.error("Error submitting:", error);
      toast({
        title: "Submission failed",
        description: "Please try again or call us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO 
        title="Partner With Ascent | Contractor Portal | Ascent Group Construction"
        description="Trade partner for building envelope & restoration packages. Access our vendor packet, request unit rates, and partner with Ontario's envelope specialists."
        keywords="contractor portal, trade partner, subcontractor, building envelope, restoration, vendor packet, unit rates"
      />
      <div className="min-h-screen bg-background">
        <Navigation />
        
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src={heroImage} 
              alt="Building envelope restoration work" 
              loading="eager"
              decoding="async"
              width={1920}
              height={1080}
              {...({ fetchpriority: "high" } as Record<string, string>)}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/50" />
          </div>
          
          <div className="relative z-10 container mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 backdrop-blur-sm rounded-full border border-primary/30 mb-6">
              <Building2 className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">For General Contractors & Property Managers</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Partner With Ascent
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
              Trade partner for building envelope & restoration packages
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gap-2" asChild>
                <a href="#download-section">
                  <Download className="w-5 h-5" />
                  Download Vendor Packet
                </a>
              </Button>
              <Button size="lg" variant="outline" className="gap-2 bg-white/10 border-white/30 text-white hover:bg-white/20" asChild>
                <a href="#unit-rate-form">
                  <FileText className="w-5 h-5" />
                  Request Unit Rates
                </a>
              </Button>
            </div>
          </div>
        </section>

        <TrustRibbon />

        <main id="main-content" className="container mx-auto px-4 py-16 space-y-20">
          
          {/* Why Partner With Us */}
          <section>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Why Partner With Us
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Reliable envelope trade partner with in-house capabilities and financial stability
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {whyPartnerCards.map((card, index) => (
                <Card 
                  key={index} 
                  className="group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 ease-out border-2 hover:border-primary/30 animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-200 ease-out">
                      <card.icon className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{card.title}</h3>
                    <p className="text-muted-foreground text-sm">{card.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Our Capabilities */}
          <section className="bg-muted/30 rounded-2xl p-8 md:p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Our Capabilities
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Specialized trade scopes available for subcontract or joint venture
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {capabilities.map((cap, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-4 p-4 bg-background rounded-xl border border-border hover:border-primary/30 transition-all duration-200 ease-out animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <cap.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{cap.name}</h3>
                    <p className="text-sm text-muted-foreground">{cap.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Downloadable Resources */}
          <section id="download-section">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Downloadable Resources
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Access our complete vendor package for bid submissions
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileDown className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Vendor Packet</CardTitle>
                  <CardDescription>
                    Complete prequalification package with company profile, insurance, and capabilities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full gap-2" 
                    onClick={() => vendorPacket && downloadDocument(vendorPacket, (id) => trackDownload.mutate(id))}
                    disabled={vendorLoading || !vendorPacket}
                  >
                    {vendorLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    Download PDF
                  </Button>
                  {!vendorLoading && !vendorPacket && (
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      Document not available
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Insurance Certificates</CardTitle>
                  <CardDescription>
                    Current COI, WSIB clearance, and bonding capacity letter
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full gap-2" asChild>
                    <Link to="/company/certifications-insurance">
                      View Credentials
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Request Unit Rates</CardTitle>
                  <CardDescription>
                    Get detailed pricing for your specific trade scope requirements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full gap-2" asChild>
                    <a href="#unit-rate-form">
                      Request Quote
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Unit Rate Request Form */}
          <section id="unit-rate-form" className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 rounded-2xl p-8 md:p-12 border border-border">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Request Unit Rates
                </h2>
                <p className="text-lg text-muted-foreground">
                  Tell us about your project scope and we'll provide detailed unit pricing within 48 hours
                </p>
              </div>

              <form onSubmit={handleUnitRateSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="Your company"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactName">Contact Name *</Label>
                    <Input
                      id="contactName"
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                      placeholder="Your name"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@company.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(416) 555-0100"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="tradeScope">Trade Scope Required *</Label>
                  <Input
                    id="tradeScope"
                    value={formData.tradeScope}
                    onChange={(e) => setFormData({ ...formData, tradeScope: e.target.value })}
                    placeholder="e.g., EIFS repair, sealant replacement, parking membrane"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="message">Project Details</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe the project, quantities, timeline, and any specific requirements..."
                    rows={5}
                  />
                </div>

                {/* Honeypot */}
                <div className="sr-only" aria-hidden="true">
                  <Input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.honeypot}
                    onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                  />
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Unit Rate Request"}
                </Button>

                <p className="text-sm text-muted-foreground text-center">
                  We typically respond within 48 hours with detailed unit pricing
                </p>
              </form>
            </div>
          </section>

          {/* Bottom CTAs */}
          <section className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Partner?
            </h2>
            <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto mb-8">
              Download our vendor packet or request unit rates for your next project
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="gap-2" asChild>
                <a href="/documents/vendor-packet.pdf" download>
                  <Download className="w-5 h-5" />
                  Download Vendor Packet
                </a>
              </Button>
              <Button size="lg" variant="outline" className="gap-2 bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                <a href="#unit-rate-form">
                  <FileText className="w-5 h-5" />
                  Request Unit Rates
                </a>
              </Button>
            </div>
          </section>

          {/* Full RFP Link */}
          <section className="text-center py-8 border-t border-border">
            <p className="text-muted-foreground mb-4">
              Have a larger project scope? Submit a complete Request for Proposal.
            </p>
            <Button variant="outline" size="lg" className="gap-2" asChild>
              <Link to="/submit-rfp">
                Submit Full RFP
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </section>

          {/* FAQ */}
          <section className="pt-4">
            <h2 className="text-3xl font-bold text-center mb-4">Trade Partner FAQ</h2>
            <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
              Common questions from GCs, construction managers, and estimators.
            </p>
            <div className="max-w-3xl mx-auto">
              <FAQAccordion faqs={contractorPortalFaqs} />
            </div>
          </section>

          {/* Related Resources */}
          <RelatedLinksGrid
            title="Related Partner Resources"
            description="Documentation and capability deep-dives for procurement."
            links={[
              { title: "Certifications & Insurance", description: "$2M CGL, WSIB clearance, manufacturer listings.", href: "/company/certifications-insurance", icon: Shield },
              { title: "Capabilities", description: "What we self-perform and how we deliver.", href: "/capabilities", icon: Wrench },
              { title: "For General Contractors", description: "Trade-package pricing, RFI turnaround, dailies.", href: "/for-general-contractors", icon: Briefcase },
            ]}
            background="default"
          />

        </main>

        <Footer />
      </div>
    </>
  );
};

export default ContractorPortal;
